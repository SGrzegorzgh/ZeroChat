const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const PORT = process.env.PORT || 3000;
/* No HOST means every interface (0.0.0.0), so the app is reachable from other
   devices on the network. Set HOST=127.0.0.1 to keep it on this machine only.
   The app has no auth and stores API keys, so a public interface needs a
   trusted network in front of it. */
const HOST = (process.env.HOST || '').trim();
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function send(res, code, body, type = 'application/json') {
  const data = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(data);
}

function readBody(req, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('Payload too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function truncTitle(s, n = 40) {
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/* ---- Terminal logs ----------------------------------------------------------
   Timestamped, component-prefixed lines so live agent sessions can be debugged
   right from the terminal that runs `node server.js`.
   Component tags: [http] [agent] [ai] [pose/jev]                                */
function tlog(tag, ...parts) {
  const t = new Date().toISOString().slice(11, 23);
  console.log(`[${t}] [${tag}]`, ...parts);
}
const truncArg = (v, n = 160) => truncTitle(JSON.stringify(v), n);

async function fetchJson(url, opts, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let r;
    try {
      r = await fetch(url, { ...opts, signal: ctrl.signal });
    } catch (e) {
      throw new Error(e.name === 'AbortError' ? 'Provider timed out' : `Provider unreachable (${e.message})`);
    }
    const text = await r.text();
    let body = null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try { body = JSON.parse(text.slice(start, end + 1)); } catch { body = { raw: text.slice(0, 400) }; }
    }
    if (!body) body = { raw: text.slice(0, 400) };
    if (!r.ok) {
      const msg = body?.error?.message || body?.message || body?.raw || r.statusText;
      throw new Error(`Provider ${r.status}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
    return body;
  } finally {
    clearTimeout(t);
  }
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* Split a data URL ("data:image/png;base64,....") into mime + raw bytes.
   Returns null when the string does not look like an image data URL. */
function parseImageDataUrl(dataUrl) {
  const m = String(dataUrl || '').match(/^data:(image\/(?:png|jpe?g|webp|gif|avif));base64,([A-Za-z0-9+/=]+)$/i);
  if (!m) return null;
  const rawMime = m[1].toLowerCase();
  const mime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
  try { return { mime, buffer: Buffer.from(m[2], 'base64') }; } catch { return null; }
}

/* Minimal multipart/form-data builder (no external deps) so /images/edits
   can receive the source image file alongside text fields. */
function multipartBody({ fields, file }) {
  const boundary = '----ZeroChatForm' + crypto.randomBytes(12).toString('hex');
  const parts = [];
  for (const [name, value] of Object.entries(fields || {})) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${String(value)}\r\n`,
    ));
  }
  if (file) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${file.name}"; filename="${file.filename}"\r\nContent-Type: ${file.mime}\r\n\r\n`,
    ));
    parts.push(file.buffer);
    parts.push(Buffer.from('\r\n'));
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` };
}

function resolveAiConfig(settings) {
  const preset = settings.activePresetId ? db.getPreset(settings.activePresetId) : null;
  const pick = (key, dflt) => {
    const pv = preset ? preset[key] : undefined;
    if (pv !== undefined && pv !== null && pv !== '' && pv !== 'default') return pv;
    const sv = settings[key];
    if (sv !== undefined && sv !== null && sv !== '' && sv !== 'default') return sv;
    return dflt;
  };
  return {
    provider: pick('provider', 'openrouter'),
    baseUrl: pick('baseUrl', ''),
    apiKey: pick('apiKey', ''),
    model: pick('model', ''),
    temperature: pick('temperature', 0.8),
    maxTokens: pick('maxTokens', 0),
    reasoning: pick('reasoning', 'default'),
    systemPrompt: pick('systemPrompt', ''),
    presetName: preset ? preset.name : null,
  };
}

/* The Agent can run on a separate connection: if the "own model & provider"
   override is on, its own settings win with sensible fallbacks to the main one. */
function resolveAgentConfig(settings) {
  const base = resolveAiConfig(settings);
  if (!settings.agentOverride) return base;
  const pickAgent = (key, fb) => {
    const av = settings['agent' + key.charAt(0).toUpperCase() + key.slice(1)];
    if (av !== undefined && av !== null && av !== '' && av !== 'default') return av;
    return fb;
  };
  return {
    ...base,
    provider: pickAgent('provider', base.provider),
    baseUrl: pickAgent('baseUrl', base.baseUrl),
    apiKey: pickAgent('apiKey', base.apiKey),
    model: pickAgent('model', base.model),
    reasoning: pickAgent('reasoning', base.reasoning || 'default'),
  };
}

function resolveImageConfig(settings) {
  const agentCfg = resolveAgentConfig(settings);
  const rawBase = (settings.agentImageBaseUrl && settings.agentImageBaseUrl.trim())
    ? settings.agentImageBaseUrl.trim()
    : agentCfg.baseUrl;
  const apiKey = (settings.agentImageApiKey && settings.agentImageApiKey.trim())
    ? settings.agentImageApiKey.trim()
    : agentCfg.apiKey;
  const model = (settings.agentImageModel && settings.agentImageModel.trim())
    ? settings.agentImageModel.trim()
    : 'dall-e-3';
  const editModel = (settings.agentImageEditModel && settings.agentImageEditModel.trim())
    ? settings.agentImageEditModel.trim()
    : 'gpt-image-1';
  return {
    baseUrl: agentNormBase(rawBase),
    apiKey,
    model,
    editModel,
  };
}

function poseCfg(settings) {
  const provider = settings.poseProvider || 'openrouter';
  const defaultModel = provider === 'openrouter' ? 'typesafe/jev-1.13' : 'jev';
  let model = (settings.poseModel || '').trim();
  if (!model || model === 'gpt-5.6-luna-load-balanced') {
    model = defaultModel;
  }
  const baseUrl = (settings.poseBaseUrl || (provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : settings.baseUrl) || '').replace(/\/+$/, '');
  return {
    enabled: !!settings.poseAgent,
    provider,
    baseUrl,
    apiKey: (settings.poseApiKey || settings.apiKey || '').trim(),
    model,
    likelihood: clamp(typeof settings.poseLikelihood === 'number' ? settings.poseLikelihood : 0.6, 0, 1, 0.6),
    recheck: settings.poseRecheck !== false,
    contextCount: clamp(typeof settings.poseContextCount === 'number' ? settings.poseContextCount : 3, 0, 20, 3),
  };
}

/* Template tags usable in anything the user writes for the model. Expanded when
   the prompt is built, never stored expanded, so renaming the character or the
   persona updates every field at once. Unrecognised tags are left as typed. */
function expandPromptMacros(s, char, persona, chatOrScenario = null, isSignature = false) {
  if (s == null) return '';
  const userName = persona ? persona.name : 'the user';
  const charName = (char && char.name) || 'the character';
  const charId = (char && char.id) || (chatOrScenario && (chatOrScenario.characterId || chatOrScenario.character_id));

  let scenarioId = null;
  let scenarioObj = null;

  if (typeof chatOrScenario === 'string') {
    scenarioId = chatOrScenario;
  } else if (chatOrScenario && typeof chatOrScenario === 'object') {
    if (chatOrScenario.characterVariables || chatOrScenario.character_variables) {
      scenarioObj = chatOrScenario;
    } else if (chatOrScenario.scenarioId || chatOrScenario.scenario_id) {
      scenarioId = chatOrScenario.scenarioId || chatOrScenario.scenario_id;
    }
  }

  if (!scenarioObj && scenarioId && scenarioId !== 'signature') {
    try {
      scenarioObj = db.getScenario(scenarioId);
    } catch {}
  }

  const signatureContent = isSignature || (scenarioId === 'signature' && s === (char && char.scenario));

  let vars = {};
  if (scenarioObj && charId) {
    const rawCv = scenarioObj.characterVariables || scenarioObj.character_variables;
    const cvars = typeof rawCv === 'string' ? JSON.parse(rawCv) : rawCv;
    if (cvars && typeof cvars === 'object' && cvars[charId]) {
      vars = cvars[charId];
    }
  }

  // Fallback to char.variables if scenario doesn't provide them
  if ((!vars || Object.keys(vars).length === 0) && char && char.variables && typeof char.variables === 'object') {
    vars = char.variables;
  }

  const varMap = new Map();
  for (const [k, v] of Object.entries(vars || {})) {
    if (k) varMap.set(k.trim().toLowerCase(), String(v == null ? '' : v));
  }

  return String(s).replace(/\{\{\s*([\w.-]+)\s*\}\}/gi, (match, key) => {
    const lower = key.toLowerCase();
    if (lower === 'char' || lower === 'character' || lower === 'bot' || lower === 'char_name' || lower === 'character_name') {
      return charName;
    }
    if (lower === 'user' || lower === 'user_name' || lower === 'persona') {
      return userName;
    }
    if (!signatureContent && varMap.has(lower)) {
      return varMap.get(lower);
    }
    return match;
  });
}

function buildTurns(pathNodes, char, persona, chatOrScenario = null, asUser = false) {
  const turns = [];
  let hasInjection = false;
  for (const n of pathNodes) {
    if (n.role === 'scenario' || n.role === 'root') continue;
    let content = expandPromptMacros(n.content, char, persona, chatOrScenario);
    if (n.role === 'summary') {
      content = `((Summary of previous conversation up to this point: ${content}))`;
    } else if (n.role === 'injection') {
      hasInjection = true;
      content = `((OOC directive: ${content}))`;
    }
    let role;
    if (asUser) {
      role = n.role === 'user' ? 'assistant' : 'user';
    } else {
      if (n.role === 'char') {
        const spokeByThisChar = !n.characterId || n.characterId === char.id;
        if (spokeByThisChar) {
          role = 'assistant';
        } else {
          const otherChar = db.getCharacter(n.characterId);
          const name = otherChar ? otherChar.name : 'Character';
          content = `[${name}]: ${content}`;
          role = 'user';
        }
      } else if (n.role === 'summary') {
        role = 'assistant';
      } else {
        role = 'user';
      }
    }
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += '\n\n' + content;
    else turns.push({ role, content });
  }
  return { turns, hasInjection };
}

const styleLine = (char, userName) => `Do not make the character dialog lines too long — focus more on what the character is doing. Write actions and scene beats in *asterisks* and wrap all spoken dialogue in "double quotes". NARRATION PERSON: narrate from outside the character — ${char.name} is "she"/"he"/their name and ${userName} is always "you" between asterisks (e.g. *${char.name} steps closer to you, studying you with a curious smile*), never "*I step closer to you*". In spoken dialogue ${char.name} talks normally as "I", and addresses ${userName} by name or naturally. Stay fully in character: never break the fourth wall, never mention being an AI, and never write ${userName}'s lines or actions for them.`;
const OOC_LINE = '((OOC directive: ...)) blocks are out-of-character steering from the user. Treat them as authoritative instructions for what happens next in the scene and weave them into your reply naturally.';
const DEFAULT_PRESET_PROMPT = 'Write "{{char}}\'s" next reply in a fictional roleplay chat between "{{user}}" and "{{char}}".';

const GENERIC_RESPONSE_SET = new Set([
  '*They tilt their head, considering your words carefully before answering.* That is an interesting thing to say. Tell me more — I am listening.',
  '*A slow smile crosses their face.* You always find the most unexpected angles, you know that? Alright, I am in. What is the plan?',
  '*They nod slowly, the light catching in their eyes.* Very well. Let us see where this road leads us.',
]);

const SIMULATED_FALLBACKS = [
  '*They listen carefully, their eyes reflecting the light.* Go on — I am curious where this leads.',
  '*A thoughtful pause settles between you before they speak.* I hear you. What do you think our next step should be?',
  '*They lean back slightly, considering what you said.* That gives me plenty to think about. Tell me what else is on your mind.',
  '*A subtle smile touches their lips.* You always bring an interesting perspective to the table. Let us explore that further.',
  '*They nod slowly, taking in your words.* Understood. Where should we take things from here?',
];

/* A preset's system prompt replaces the opening instruction only. Everything that
   defines who is in the scene — the character's persona, the user's persona, and the
   scenario — is appended either way, so a custom prompt
   can steer the format without stripping the model of who it is writing about. */
function buildSystemText(char, persona, hasInjection, cfg, scenarioText, chatOrScenario = null, asUser = false, guidance = '') {
  const userName = persona ? persona.name : 'the user';
  const ex = (s, isSig = false) => expandPromptMacros(s, char, persona, chatOrScenario, isSig);
  const custom = cfg.systemPrompt.trim();
  const parts = [];

  if (asUser) {
    parts.push(`Write "${userName}'s" next reply in a fictional roleplay chat between "${userName}" and "${char.name}". You ARE "${userName}" — roleplay exclusively in first person ("I", "me", "my"), so the message reads as if ${userName} typed it personally. Never narrate "${userName}" from the outside (third person like "*${userName} smiles*") and never in second person.`);
    parts.push(persona
      ? `"${userName}'s" Persona (You):\n${ex(persona.description) || 'An ordinary person.'}`
      : `"The user's" Persona (You):\nAn ordinary person.`);
    parts.push(`"${char.name}'s" Persona (Partner):\n${ex(char.description) || 'A mysterious stranger.'}`);
  } else {
    parts.push(custom ? ex(custom) : `Write "${char.name}'s" next reply in a fictional roleplay chat between "${userName}" and "${char.name}".`);
    parts.push(`"${char.name}'s" Persona:\n${ex(char.description) || 'A mysterious stranger.'}`);
    parts.push(persona
      ? `"${userName}'s" Persona:\n${ex(persona.description) || 'An ordinary person.'}`
      : `"The user's" Persona:\nAn ordinary person — the user plays themselves.`);
  }

  const sc = scenarioText !== undefined ? scenarioText : (char.scenario || '');
  const isSig = (chatOrScenario && (chatOrScenario.scenarioId === 'signature' || chatOrScenario.scenario_id === 'signature'));
  if (sc) parts.push(`The scenario of the conversation:\n${ex(sc, isSig)}`);

  // Special scenario notes (newline separated important details)
  const scObj = (chatOrScenario && chatOrScenario.scenarioId)
    ? db.getScenario(chatOrScenario.scenarioId)
    : (chatOrScenario && chatOrScenario.specialNotes ? chatOrScenario : null);
  const rawNotes = (scObj && scObj.specialNotes) || '';
  if (rawNotes.trim()) {
    const lines = rawNotes.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length) {
      parts.push(`Important scenario details for this scene:\n${lines.map((l) => '- ' + ex(l)).join('\n')}`);
    }
  }

  if (chatOrScenario && Array.isArray(chatOrScenario.characterIds) && chatOrScenario.characterIds.length > 1) {
    const otherChars = chatOrScenario.characterIds
      .filter((id) => id !== char.id)
      .map((id) => db.getCharacter(id))
      .filter(Boolean);
    if (otherChars.length) {
      parts.push(`Other characters present in this shared scene:\n` +
        otherChars.map((oc) => `- "${oc.name}": ${ex(oc.description) || 'Present in scene.'}`).join('\n') +
        `\nONE SPEAKER PER REPLY — you write ONLY "${char.name}". Every word of this reply is ${char.name} speaking or acting (narration: ${char.name} as "she"/"he"/name and "${userName}" as "you"; dialogue: ${char.name} as "I").
- NEVER write dialogue for anyone else: no "Rex: ..." lines, no quoted speech invented for "${userName}" or another character, nothing like *Rex says "..."*. If a quoted line appears in your reply, it is ${char.name} speaking, and no one else.
- NEVER narrate another character's deliberate actions or reactions as if you controlled them, and never imitate their voice.
- You MAY notice them from ${char.name}'s own point of view (*${char.name} glances over, waiting to see what ${otherChars[0].name} does*) — but leave their answer unwritten. The scene will hand them the reply; your job is only your own beat.`);
      parts.push(`MULTI-CHARACTER RESPONSE LENGTH & PACING RULE:
This is a shared group roleplay with multiple active characters and "${userName}".
Keep your response concise, reactive, and roughly a third shorter than a typical 1-on-1 roleplay response (about two-thirds the usual length — even if the active preset or general instructions request long or multi-paragraph responses).
Write a single focused beat: one or two short sentences of action/expression and 1-2 lines of dialogue. Never write monologues or monopolize the conversation. Yield the scene naturally so the other characters and "${userName}" have room to speak.`);
    }
  }

  if (asUser) {
    if (guidance && guidance.trim()) {
      parts.push(`User directive / guidance for how you should reply:\n${guidance.trim()}`);
    }
    parts.push(`Write actions and scene beats in *asterisks* and wrap all spoken dialogue in "double quotes". Everything — actions and speech — is first person ("I", "me", "my"): "*I lean on the wall*" and "Fine by me," I say — never "*${userName} leans on the wall*" and never "you ${userName}". Stay fully in character as ${userName}: never break the fourth wall, never mention being an AI, and never write the other character's lines or actions for them.`);
    if (hasInjection) parts.push(OOC_LINE);
    parts.push(`Now write "${userName}'s" next response:`);
  } else {
    parts.push(styleLine(char, userName));
    if (hasInjection) parts.push(OOC_LINE);
    const isGroup = chatOrScenario && Array.isArray(chatOrScenario.characterIds) && chatOrScenario.characterIds.length > 1;
    if (isGroup) {
      parts.push(`Now write ${char.name}'s next reply — and only ${char.name}'s: your own actions (*...*) and your own spoken lines ("..."). Then stop and yield the scene.`);
    } else {
      parts.push(`Then the roleplay chat between "${char.name}" and "${userName}" begins.`);
    }
  }

  return parts.join('\n\n');
}

async function readStreamEvents(response, handle) {
  const reader = response.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let idle = null;
  const arm = () => {
    if (idle) clearTimeout(idle);
    idle = setTimeout(() => { try { reader.cancel(); } catch {} }, 90000);
  };
  arm();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      arm();
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) !== -1) {
        const line = buf.slice(0, i).replace(/\r$/, '');
        buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let j;
        try { j = JSON.parse(payload); } catch { continue; }
        handle(j);
      }
    }
  } finally {
    if (idle) clearTimeout(idle);
  }
}

async function streamOpenAI(url, body, apiKey, onDelta, ctrl) {
  let r;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Provider timed out' : `Provider unreachable (${e.message})`);
  }
  const ct = r.headers.get('content-type') || '';
  if (!ct.includes('event-stream')) {
    const text = await r.text();
    let parsed = null;
    const s = text.indexOf('{');
    const t = text.lastIndexOf('}');
    if (s !== -1 && t > s) { try { parsed = JSON.parse(text.slice(s, t + 1)); } catch {} }
    if (!r.ok) {
      const msg = parsed?.error?.message || parsed?.message || r.statusText;
      throw new Error(`Provider ${r.status}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
    const full = parsed?.choices?.[0]?.message?.content;
    if (!full) throw new Error('Unexpected response from provider');
    onDelta(full);
    return full;
  }
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Provider ${r.status}: ${text.slice(0, 300)}`);
  }
  let full = '';
  try {
    await readStreamEvents(r, (j) => {
      if (j.error) throw new Error(`Provider stream error: ${j.error.message || 'unknown'}`);
      const c0 = j.choices && j.choices[0];
      const d = c0 && (c0.delta?.content ?? c0.message?.content);
      if (d) { full += d; onDelta(d); }
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Provider timed out');
    if (full.trim().length >= 80) { const err = new Error(`${e.message} — partial reply kept`); err.partial = full; throw err; }
    throw e;
  }
  if (!full.trim()) throw new Error('Provider returned an empty stream');
  return full;
}

async function streamAnthropic(base, body, apiKey, onDelta, ctrl) {
  let r;
  try {
    r = await fetch(base + '/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Provider timed out' : `Provider unreachable (${e.message})`);
  }
  const ct = r.headers.get('content-type') || '';
  if (!ct.includes('event-stream')) {
    const text = await r.text();
    let parsed = null;
    const s = text.indexOf('{');
    const t = text.lastIndexOf('}');
    if (s !== -1 && t > s) { try { parsed = JSON.parse(text.slice(s, t + 1)); } catch {} }
    if (!r.ok) {
      const msg = parsed?.error?.message || r.statusText;
      throw new Error(`Provider ${r.status}: ${msg}`);
    }
    const full = parsed?.content?.find((b) => b.type === 'text')?.text;
    if (!full) throw new Error('Unexpected Anthropic response');
    onDelta(full);
    return full;
  }
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Provider ${r.status}: ${text.slice(0, 300)}`);
  }
  let full = '';
  try {
    await readStreamEvents(r, (j) => {
      if (j.type === 'content_block_delta' && j.delta && j.delta.type === 'text_delta') {
        full += j.delta.text;
        onDelta(j.delta.text);
      } else if (j.type === 'error') {
        throw new Error(j.error?.message || 'Provider error');
      }
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Provider timed out');
    if (full.trim().length >= 80) { const err = new Error(`${e.message} — partial reply kept`); err.partial = full; throw err; }
    throw e;
  }
  if (!full.trim()) throw new Error('Provider returned an empty stream');
  return full;
}

function estimatePromptTokens(text) {
  return Math.ceil(String(text || '').length / 3.8);
}

/* Manages long chats when context window approaches token limits.
   Supports 3 strategies:
   - 'nothing': do nothing (exceeding limit results in provider error)
   - 'delete': prune oldest messages while always preserving the opening scenario node
   - 'compact': summarize earlier conversation with the Agent AI and keep selected % of recent messages */
async function manageChatContextWindow(chat, tipNodeId, settings) {
  const strategy = settings.longChatStrategy || 'nothing';
  if (strategy === 'nothing') return false;

  const maxTokens = Number(settings.maxContextTokens) || 8192;
  const thresholdPct = Number.isFinite(+settings.compactThreshold) ? +settings.compactThreshold : 80;
  const keepPct = Number.isFinite(+settings.compactKeepRatio) ? +settings.compactKeepRatio : 25;
  const thresholdTokens = Math.floor(maxTokens * (thresholdPct / 100));

  const path = db.pathNodes(chat.tree, tipNodeId);
  const scenarioNode = path.find((n) => n.role === 'scenario');
  if (!scenarioNode) return false;

  const messageNodes = path.filter((n) => n.role !== 'root' && n.role !== 'scenario');
  if (messageNodes.length < 2) return false;

  let totalChars = 0;
  for (const n of path) totalChars += String(n.content || '').length + 25;
  const currentTokens = estimatePromptTokens(totalChars);
  if (currentTokens < thresholdTokens) return false;

  const keepCount = Math.max(1, Math.floor(messageNodes.length * (keepPct / 100)));
  const toProcessNodes = messageNodes.slice(0, messageNodes.length - keepCount);
  const keepNodes = messageNodes.slice(messageNodes.length - keepCount);
  if (!toProcessNodes.length) return false;

  db.snapshotBeforeDestructive();
  const tree = db.getTree(chat.id);
  const firstKeptId = keepNodes[0].id;

  if (strategy === 'delete') {
    if (tree.nodes[firstKeptId]) tree.nodes[firstKeptId].parent = scenarioNode.id;
    if (tree.nodes[scenarioNode.id]) {
      tree.nodes[scenarioNode.id].children = [firstKeptId];
      tree.nodes[scenarioNode.id].active = 0;
    }
    for (const p of toProcessNodes) {
      delete tree.nodes[p.id];
    }
    db.saveTree(chat.id, tree);
    tlog('ai', `[context-trim] Pruned ${toProcessNodes.length} oldest messages from chat ${chat.id}`);
    return true;
  }

  if (strategy === 'compact') {
    const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
    const userName = persona ? persona.name : 'the user';
    const char = db.getCharacter(chat.characterId);
    const charName = char ? char.name : 'Character';
    const cfg = resolveAgentConfig(settings);

    const transcript = toProcessNodes.map((n) => {
      let sender = n.role === 'user' ? userName : charName;
      if (n.role === 'char' && n.characterId) {
        const c = db.getCharacter(n.characterId);
        if (c) sender = c.name;
      }
      return `${sender}: ${n.content}`;
    }).join('\n\n');

    const sysPrompt = [
      'You are a narrative archivist and roleplay context summarizer.',
      'Your task is to write a concise, plot-focused narrative summary of the following roleplay conversation segment.',
      'Requirements:',
      `- Synthesize the key events, revelations, choices, location changes, and relationship dynamics between the participants.`,
      `- Write in a neutral, past-tense narrative prose (under 250 words).`,
      `- Return ONLY the summary text, with no headers, bullet points, or meta commentary.`,
    ].join('\n');

    let summaryText = '';
    try {
      if (!cfg.apiKey && cfg.provider !== 'ollama') {
        summaryText = `*Earlier in the conversation, ${userName} and ${charName} met and discussed their journey and circumstances, establishing their connection and current focus.*`;
      } else if (cfg.provider === 'anthropic') {
        const resp = await agentCallAnthropicPlain(cfg, sysPrompt, [{ role: 'user', content: transcript }], [], null);
        summaryText = resp.text.trim();
      } else {
        const resp = await agentCallOpenAIPlain(cfg, sysPrompt, [{ role: 'user', content: transcript }], [], null);
        summaryText = resp.text.trim();
      }
    } catch (e) {
      console.error('[context-compact] summary call failed:', e.message);
      summaryText = `*Earlier events and conversations took place between the participants leading up to this point.*`;
    }

    const sumId = 'sum-' + uid();
    const summaryNode = {
      id: sumId,
      role: 'summary',
      content: summaryText,
      parent: scenarioNode.id,
      children: [firstKeptId],
      active: 0,
      createdAt: Date.now(),
    };
    tree.nodes[sumId] = summaryNode;
    if (tree.nodes[scenarioNode.id]) {
      tree.nodes[scenarioNode.id].children = [sumId];
      tree.nodes[scenarioNode.id].active = 0;
    }
    if (tree.nodes[firstKeptId]) {
      tree.nodes[firstKeptId].parent = sumId;
    }
    for (const p of toProcessNodes) {
      delete tree.nodes[p.id];
    }
    db.saveTree(chat.id, tree);
    tlog('ai', `[context-compact] Compacted ${toProcessNodes.length} messages into summary node ${sumId} for chat ${chat.id}`);
    return true;
  }

  return false;
}

/* Auto chat title generator (must not exceed 40 characters) */
async function generateChatTitle(chatId) {
  const chat = db.getChat(chatId);
  if (!chat) return null;
  const path = db.pathNodes(chat.tree, db.treeTip(chat.tree));
  const msgs = path.filter((n) => n.role === 'user' || n.role === 'char').slice(-12);
  if (msgs.length < 2) return null;

  const settings = db.getSettings();
  const cfg = resolveAgentConfig(settings);
  const char = db.getCharacter(chat.characterId);
  const charName = char ? char.name : 'Character';
  const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
  const userName = persona ? persona.name : 'User';

  const snippet = msgs.map((n) => {
    const sender = n.role === 'user' ? userName : (n.characterId ? (db.getCharacter(n.characterId)?.name || charName) : charName);
    return `${sender}: ${n.content.slice(0, 160)}`;
  }).join('\n');

  const sysPrompt = 'You are a creative title generator for roleplay chats. Generate a short, evocative 2-5 word title for the given conversation. The title MUST be under 40 characters. Return ONLY the title text, with no quotes, punctuation, or explanations.';
  const userPrompt = `Conversation excerpt:\n${snippet}\n\nTitle (max 40 chars):`;

  let title = '';
  try {
    if (!cfg.apiKey && cfg.provider !== 'ollama') {
      const words = ['Encounter with', 'Secrets of', 'Echoes of', 'A Tale of', 'Conversations with'];
      title = `${words[Math.floor(Math.random() * words.length)]} ${charName}`.slice(0, 40);
    } else if (cfg.provider === 'anthropic') {
      const resp = await agentCallAnthropicPlain(cfg, sysPrompt, [{ role: 'user', content: userPrompt }], [], null);
      title = resp.text.trim();
    } else {
      const resp = await agentCallOpenAIPlain(cfg, sysPrompt, [{ role: 'user', content: userPrompt }], [], null);
      title = resp.text.trim();
    }
    title = title.replace(/^["'`\s]+|["'`\s.]+$/g, '').trim().slice(0, 40);
    if (!title) return null;
    db.renameChat(chatId, title, true);
    return title;
  } catch (e) {
    console.error('[title-gen] failed:', e.message);
    return null;
  }
}

/* Single-request group turns: one model call writes the whole character
   talk after a user message — a sequence of tagged beats, each spoken by
   one character ([Name] narration "dialogue"). Beats are split back into
   individual tree nodes as they arrive, so every reply stays editable or
   re-branchable on its own while the scene plays out live. */

const normName = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function buildGroupTurnSystem({ char, persona, chat, cfg, maxBeats }) {
  const userName = persona ? persona.name : 'the user';
  const ex = (s, c = char) => expandPromptMacros(s, c, persona, chat);
  const custom = cfg.systemPrompt.trim();
  const parts = [];
  parts.push(custom ? ex(custom) : `Write "${char.name}'s" next reply in a fictional roleplay chat between "${userName}" and "${char.name}".`);
  parts.push(`"${char.name}'s" Persona:\n${ex(char.description) || 'A mysterious stranger.'}`);
  parts.push(persona
    ? `"${userName}'s" Persona:\n${ex(persona.description) || 'An ordinary person.'}`
    : `"${userName}'s" Persona:\nAn ordinary person — the user plays themselves.`);
  const sc = chat.scenarioContent || char.scenario || '';
  if (sc) parts.push(`The scenario of the conversation:\n${ex(sc)}`);
  const roster = (chat.characterIds || []).map((id) => db.getCharacter(id)).filter(Boolean);
  if (roster.length) {
    parts.push(`Characters in this shared scene:\n` + roster.map((c) => `- "${c.name}": ${ex(c.description, c) || 'Present in scene.'}`).join('\n'));
  }
  const otherChars = roster.filter((c) => c.id !== char.id);
  const secondExample = otherChars[0] ? otherChars[0].name : 'Second Character';

  parts.push(styleLine(char, userName));
  parts.push(`MULTI-CHARACTER LENGTH & PACING RULE: each beat stays concise — one or two short sentences of action/expression and 1-2 lines of dialogue — roughly two-thirds of a typical 1-on-1 response, even if the preset asks for long texts.`);
  parts.push(`WHOLE-TURN OUTPUT FORMAT — write the next whole character talk in ONE response:
- Output only character turns, separating each character's reply with their name in brackets:
  [${char.name}] *She steps closer to you, studying you.* "Where were you, ${userName}?"
  [${secondExample}] *He glances between you two, leaning back.* "Give them a moment."
- The FIRST response is "${char.name}". Follow with the other characters as the drama needs — a character may speak twice in a row — up to ${maxBeats} beats in total for this turn.
- Each character responds ONLY as themselves: their own *narration* (written from outside — that character is "she"/"he"/their name and "${userName}" is "you") and their own spoken lines ("...") — NEVER write dialogue or actions for another character or for "${userName}", and never imitate another character's voice.
- Stop the turn at the natural pause where "${userName}" would act next. No numbering, no headers, no commentary, nothing out of character — only the bracketed character replies.`);
  return parts.join('\n\n');
}

/* Splits a streamed whole-turn answer into per-character beats on the fly.
   A beat starts at a line whose head names the speaker: "[Name] ...",
   "**Name:** ...", "Name: ...", etc. Everything before the first recognized
   header belongs to the opening speaker. */
function createGroupTurnParser({ roster, initialCharId, initialCharName, onBeatStart, onText, onBeatEnd }) {
  const rosterTokens = roster.map((r) => {
    const full = normName(r.name);
    const parts = r.name.split(/[\s"'\-_.]+/).map(normName).filter((p) => p.length >= 2);
    const tokens = Array.from(new Set([full, ...parts]));
    return { ...r, full, tokens };
  });

  const matchName = (raw) => {
    const h = normName(raw);
    if (h.length < 2) return null;
    let best = null;
    for (const r of rosterTokens) {
      for (const t of r.tokens) {
        const hit = t === h
          || (t.startsWith(h) && h.length >= 3)
          || (h.startsWith(t) && t.length >= 3)
          || (h.length >= 3 && t.includes(h))
          || (t.length >= 3 && h.includes(t));
        if (hit && (!best || t.length > (best.matchedLen || 0))) {
          best = { who: r, matchedLen: t.length };
        }
      }
    }
    return best ? best.who : null;
  };

  const headerOf = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const withoutHash = trimmed.replace(/^#{1,6}\s+/, '');

    // 1. Bracketed / wrapped: [Name], **[Name]**, <Name>, (Name), with optional trailing : or -
    const mBracket = withoutHash.match(/^[*_]*[[<(\]]\s*([^\]>)]+?)\s*[\]>)][*_]*\s*(?:[:\-—–]\s*)?(.*)$/);
    if (mBracket) {
      const who = matchName(mBracket[1]);
      if (who) return { who, rest: mBracket[2] };
    }

    // 2. Bold/italic: **Name:**, **Name**:, **Name -**, or **Name**
    const mBold = withoutHash.match(/^([*_]{1,3})\s*([^*_\n]+?)\s*\1\s*(.*)$/);
    if (mBold) {
      let namePart = mBold[2].trim();
      let afterPart = mBold[3].trim();
      if (/[:\-—–]$/.test(namePart)) namePart = namePart.replace(/[:\-—–]+$/, '').trim();
      if (/^[:\-—–]/.test(afterPart)) afterPart = afterPart.replace(/^[:\-—–]+\s*/, '').trim();

      const who = matchName(namePart);
      if (who) {
        const hadSep = /[:\-—–]/.test(mBold[2]) || /[:\-—–]/.test(mBold[3]);
        if (!afterPart || hadSep || afterPart.startsWith('*') || afterPart.startsWith('"') || afterPart.startsWith('“')) {
          return { who, rest: afterPart };
        }
      }
    }

    // 3. Plain Name with colon or dash: Name: rest, Name - rest, or Name: on its own line
    const mPlain = withoutHash.match(/^([A-Za-z][A-Za-z' .\-"]{1,49}?)\s*(?:[:\-—–])\s*(.*)$/);
    if (mPlain) {
      const who = matchName(mPlain[1]);
      if (who) return { who, rest: mPlain[2] };
    }

    // 4. Standalone name on its own line (e.g. "### Luna", or "Luna" as a header line)
    if (!/^[*_]/.test(withoutHash)) {
      const whoAlone = matchName(withoutHash);
      if (whoAlone && withoutHash.length <= whoAlone.name.length + 8 && !/[.,?!]/.test(withoutHash)) {
        return { who: whoAlone, rest: '' };
      }
    }

    return null;
  };

  const couldStartName = (frag) => {
    const k = normName(frag);
    if (!k) return true;
    for (const r of rosterTokens) {
      for (const t of r.tokens) {
        if (t.startsWith(k) || k.startsWith(t)) return true;
      }
    }
    return false;
  };

  const tryHeader = (s) => {
    if (/^[*#_]*[[<(\]]/.test(s)) {
      if (!/[\]>)]/.test(s)) return { act: 'hold' };
    }
    const mStars = s.match(/^([*_]{1,3})/);
    if (mStars) {
      const stars = mStars[1];
      if (!s.slice(stars.length).includes(stars)) {
        const inner = s.slice(stars.length);
        if (couldStartName(inner)) return { act: 'hold' };
        return { act: 'flush' };
      }
    }
    if (/^#{1,6}/.test(s)) {
      return { act: 'hold' };
    }

    const h = headerOf(s);
    if (h) return { act: 'start', who: h.who, rest: h.rest };

    if (/^[A-Z]/.test(s)) {
      if (couldStartName(s)) return { act: 'hold' };
    }

    return { act: 'flush' };
  };

  let pending = '';
  let cur = { charId: initialCharId, charName: initialCharName, text: '' };
  let open = false;
  let lineStarted = false;

  const flushText = (t) => { if (t) { cur.text += t; onText(cur, t); } };

  const newBeat = (head) => {
    if (cur.text.trim()) {
      onBeatEnd(cur, open);
    }
    cur = { charId: head.who.id, charName: head.who.name, text: '' };
    open = true;
    onBeatStart(cur);
    if (head.rest) {
      flushText(head.rest);
      lineStarted = true;
    } else {
      lineStarted = false;
    }
  };

  const feed = (chunk) => { pending += chunk; drain(false); };

  const drain = (final) => {
    while (true) {
      const nk = pending.indexOf('\n');
      if (nk === -1) {
        if (final) {
          if (!lineStarted && pending.trim()) {
            const head = headerOf(pending);
            if (head) newBeat(head);
            else flushText(pending);
          } else {
            flushText(pending);
          }
          pending = '';
          return;
        }

        // Only check for header if we are at the start of a line!
        if (!lineStarted) {
          const s = pending.replace(/^\s+/, '');
          const t = tryHeader(s);
          if (t.act === 'hold') return;
          if (t.act === 'start') {
            pending = '';
            newBeat({ who: t.who, rest: t.rest.replace(/^\s+/, '') });
            return;
          }
        }

        flushText(pending);
        if (pending.length > 0) lineStarted = true;
        pending = '';
        return;
      }

      const line = pending.slice(0, nk);
      pending = pending.slice(nk + 1);

      if (!lineStarted && line.trim()) {
        const head = headerOf(line);
        if (head) {
          newBeat(head);
          lineStarted = false;
          continue;
        }
      }

      flushText(line + '\n');
      lineStarted = false;
    }
  };

  const end = () => { drain(true); onBeatEnd(cur, open); };
  return { feed, end };
}

/* Runs one whole multi-character turn with a single streaming request and
   persists each beat as its own chat-tree node (pose stamping for the first
   beat like a normal reply). Returns the fresh chat and the last node. */
async function runGroupTurn({ chat, anchorId, primary, persona, settings, poses, posesEnabled, signal, emit, genRecord }) {
  const fresh = db.getChat(chat.id);
  const rosterIds = (fresh && fresh.characterIds) || [];
  const maxBeats = Math.max(1, Math.min(rosterIds.length, Number(settings.multiCharMaxRounds) || 2));
  const roster = rosterIds.map((id) => { const c = db.getCharacter(id); return c ? { id: c.id, name: c.name } : null; }).filter(Boolean);

  let lastId = anchorId;
  let lastNode = null;
  let sawBeat = false;
  let beatCount = 0;
  let startedBeats = 0;

  async function beatDone(beat) {
    beatCount++;
    const text = String(beat.text || '').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) return;
    const speaker = db.getCharacter(beat.charId) || primary;
    let poseId = null;
    if (!sawBeat && posesEnabled) {
      sawBeat = true;
      try {
        const posePromise = runPoseAgent({ char: speaker, persona, chat: fresh, poses, currentPoseId: fresh.poseId, replyText: text, settings, signal });
        const pose = await Promise.race([posePromise, new Promise((r) => setTimeout(() => r(null), 6000))]);
        if (pose && pose.changed) {
          try { db.setChatPose(chat.id, pose.poseId); } catch {}
          try { emit({ type: 'pose', poseId: pose.poseId, poseName: pose.poseName, confidence: pose.confidence }); } catch {}
          poseId = pose.poseId;
        }
      } catch (e) { console.error('[pose/jev] director failed:', e.message); }
    }
    const reply = db.addReply(chat.id, lastId, text, { characterId: beat.charId, poseId });
    lastId = reply.id;
    lastNode = reply;
    emit({ type: 'reply_saved', chat: db.getChat(chat.id), node: reply });
  }

  // Saves run strictly in beat order, even when the pose agent stalls the
  // first one — the client rebuilds its view from each reply_saved event.
  let beatQueue = Promise.resolve();

  const parser = createGroupTurnParser({
    roster,
    initialCharId: primary.id,
    initialCharName: primary.name,
    onBeatStart: (beat) => {
      // The stream starts on the primary character; every later beat switch
      // (back and forth) is announced so the client re-labels the bubble.
      startedBeats++;
      if (startedBeats > 1 || beat.charId !== primary.id) {
        emit({ type: 'next_char', characterId: beat.charId, charName: beat.charName });
      }
    },
    onText: (beat, t) => { emit({ type: 'delta', text: t, characterId: beat.charId }); },
    onBeatEnd: (beat) => { beatQueue = beatQueue.then(() => beatDone(beat)).catch((e) => console.error('[ai] beat save failed:', e.message)); },
  });

  const nodes = db.pathNodes(db.getChat(chat.id).tree, anchorId);
  const built = buildTurns(nodes, primary, persona, fresh, false);
  const builtHistory = (settings.longChatStrategy === 'nothing') ? built.turns : built.turns.slice(-100);
  const cfg = resolveAiConfig(settings);
  const scenarioNode = nodes.find((n) => n.role === 'scenario');
  const systemText = buildGroupTurnSystem({
    char: primary,
    persona,
    chat: { ...fresh, scenarioContent: scenarioNode ? scenarioNode.content : (primary.scenario || '') },
    cfg,
    maxBeats,
  });
  if (genRecord) genRecord.text = '';

  tlog('ai', `▶ group turn — chat ${chat.id} (${primary.name} + ${roster.filter((r) => r.id !== primary.id).map((r) => r.name).join(', ')}) up to ${maxBeats} beats`);
  const rT0 = Date.now();

  function feed(str) {
    parser.feed(str);
    if (genRecord) genRecord.text += str;
  }

  const run = async () => {
    if (!cfg.apiKey && cfg.provider !== 'ollama') {
      // Simulated whole turn (no API key): short tagged beats in roster order.
      const userName = persona ? persona.name : 'the user';
      const beats = roster.filter((r) => r.id === primary.id).concat(roster.filter((r) => r.id !== primary.id)).slice(0, maxBeats);
      const raw = beats.map((c) => `[${c.name}] *${c.id === primary.id ? primary.name : c.name.replace(/\s.*$/, '')} turns to you, noticing your words.* "I hear you, ${userName}. But you will hear my answer first."`).join('\n\n');
      for (const chunk of raw.match(/[\s\S]{1,8}/g) || [raw]) {
        if (signal && signal.aborted) throw new Error('Aborted');
        feed(chunk);
        await wait(12 + Math.random() * 22);
      }
      return;
    }
    const call = (emitDelta) => {
      if (cfg.provider === 'anthropic') {
        const base = cfg.baseUrl.replace(/\/+$/, '');
        const body = { model: cfg.model, system: systemText, messages: builtHistory, stream: true };
        body.max_tokens = Math.max(1024, cfg.maxTokens || 0);
        if (cfg.reasoning === 'off') body.thinking = { type: 'disabled' };
        else if (cfg.reasoning !== 'default') {
          const budgets = { low: 2048, medium: 8192, high: 16384 };
          const budget = budgets[cfg.reasoning] || 2048;
          body.thinking = { type: 'enabled', budget_tokens: budget };
          body.max_tokens = Math.max(body.max_tokens, budget + 2048);
          body.temperature = 1;
        } else if (typeof cfg.temperature === 'number') body.temperature = cfg.temperature;
        return streamAnthropic(base, body, cfg.apiKey, emitDelta, signal);
      }
      const base = cfg.baseUrl.replace(/\/+$/, '');
      const out = { model: cfg.model, messages: [{ role: 'system', content: systemText }, ...builtHistory], stream: true };
      if (typeof cfg.temperature === 'number') out.temperature = cfg.temperature;
      if (cfg.reasoning === 'off') {
        if (cfg.provider === 'openrouter') out.reasoning = { enabled: false };
        else out.reasoning_effort = 'none';
      } else if (cfg.reasoning !== 'default') {
        if (cfg.provider === 'openrouter') out.reasoning = { effort: cfg.reasoning };
        else out.reasoning_effort = cfg.reasoning;
      }
      out.max_tokens = cfg.maxTokens ? Math.max(cfg.maxTokens, 900) : 1100;
      return streamOpenAI(base + '/chat/completions', out, cfg.apiKey, emitDelta, signal);
    };
    await retryOnce(call, feed, signal);
  };

  try {
    await run();
  } finally {
    parser.end();
  }
  await beatQueue;
  tlog('ai', `✓ group turn streamed in ${Date.now() - rT0}ms`);
  return { chat: db.getChat(chat.id), node: lastNode };
}

async function maybeGenerateChatTitle(chatId) {
  const settings = db.getSettings();
  if (settings.autoTitleEnabled === false) return null;
  const chat = db.getChat(chatId);
  if (!chat) return null;

  const path = db.pathNodes(chat.tree, db.treeTip(chat.tree));
  const msgs = path.filter((n) => n.role === 'user' || n.role === 'char');
  if (msgs.length < 2) return null;

  const interval = Math.max(2, Number(settings.autoTitleInterval) || 6);
  const isDefaultTitle = chat.title === 'New chat' || !chat.title;
  const atInterval = (msgs.length % interval === 0);

  if (!isDefaultTitle && !atInterval) return null;
  return generateChatTitle(chatId);
}

async function checkIdleChatTitles() {
  try {
    const settings = db.getSettings();
    if (settings.autoTitleEnabled === false) return;
    const idleMins = Math.max(5, Number(settings.autoTitleIdleMinutes) || 60);
    const idleCutoff = Date.now() - idleMins * 60 * 1000;
    const chars = db.getCharacters();
    for (const c of chars) {
      for (const ch of (c.chats || [])) {
        if ((ch.title === 'New chat' || !ch.title) && !ch.autoTitled && ch.updatedAt < idleCutoff) {
          const path = db.pathNodes(ch.tree, db.treeTip(ch.tree));
          const msgs = path.filter((n) => n.role === 'user' || n.role === 'char');
          if (msgs.length >= 2) {
            generateChatTitle(ch.id).catch(() => {});
          }
        }
      }
    }
  } catch {}
}

async function generateReplyStream(char, nodes, persona, settings, onDelta, signal, chatOrScenario = null, asUser = false, guidance = '') {
  const built = buildTurns(nodes, char, persona, chatOrScenario, asUser);
  const history = (settings.longChatStrategy === 'nothing')
    ? built.turns
    : built.turns.slice(-100);
  const cfg = resolveAiConfig(settings);
  const scenarioNode = (nodes || []).find((n) => n.role === 'scenario');
  const scenarioText = scenarioNode ? scenarioNode.content : (char.scenario || '');
  const systemText = buildSystemText(char, persona, built.hasInjection, cfg, scenarioText, chatOrScenario, asUser, guidance);

  const isMulti = chatOrScenario && Array.isArray(chatOrScenario.characterIds) && chatOrScenario.characterIds.length > 1;

  if (!cfg.apiKey && cfg.provider !== 'ollama') {
    let text;
    if (asUser) {
      text = `*I take a breath, meeting ${char.name}'s gaze.* "I hear you," I say. "Let's see where this road leads, then."`;
    } else if (isMulti) {
      text = `*${char.name} nods briefly toward the group.* "I hear you. Let's see what the others think."`;
    } else {
      const candidates = SIMULATED_FALLBACKS;
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      text = expandPromptMacros(picked, char, persona, chatOrScenario) || '*They listen carefully, then nod.* Go on — I am curious where this goes.';
    }
    for (const chunk of text.match(/[\s\S]{1,8}/g) || [text]) {
      if (signal && signal.aborted) throw new Error('Aborted');
      onDelta(chunk);
      await wait(14 + Math.random() * 26);
    }
    return text;
  }

  if (cfg.provider === 'anthropic') {
    const base = cfg.baseUrl.replace(/\/+$/, '');
    const call = (emit) => {
      const body = { model: cfg.model, system: systemText, messages: history, stream: true };
      let maxTokens = cfg.maxTokens || 1024;
      if (isMulti) maxTokens = Math.max(160, Math.round(maxTokens / 1.5));
      if (cfg.reasoning === 'off') {
        body.thinking = { type: 'disabled' };
      } else if (cfg.reasoning !== 'default') {
        const budgets = { low: 2048, medium: 8192, high: 16384 };
        const budget = budgets[cfg.reasoning] || 2048;
        body.thinking = { type: 'enabled', budget_tokens: budget };
        maxTokens = Math.max(maxTokens, budget + 2048);
        body.temperature = 1;
      } else if (typeof cfg.temperature === 'number') {
        body.temperature = cfg.temperature;
      }
      body.max_tokens = maxTokens;
      return streamAnthropic(base, body, cfg.apiKey, emit, signal);
    };
    return retryOnce(call, onDelta, signal);
  }

  const base = cfg.baseUrl.replace(/\/+$/, '');
  const call = (emit) => {
    const out = { model: cfg.model, messages: [{ role: 'system', content: systemText }, ...history], stream: true };
    if (typeof cfg.temperature === 'number') out.temperature = cfg.temperature;
    if (cfg.maxTokens) {
      out.max_tokens = isMulti ? Math.max(160, Math.round(cfg.maxTokens / 1.5)) : cfg.maxTokens;
    } else if (isMulti) {
      out.max_tokens = 340;
    }
    if (cfg.reasoning === 'off') {
      if (cfg.provider === 'openrouter') out.reasoning = { enabled: false };
      else out.reasoning_effort = 'none';
    } else if (cfg.reasoning !== 'default') {
      if (cfg.provider === 'openrouter') out.reasoning = { effort: cfg.reasoning };
      else out.reasoning_effort = cfg.reasoning;
    }
    return streamOpenAI(base + '/chat/completions', out, cfg.apiKey, emit, signal);
  };
  return retryOnce(call, onDelta, signal);
}

// Providers behind load balancers can fail before any content arrives;
// retry a couple of times transparently so the user doesn't see a spurious error.
async function retryOnce(call, onDelta, signal) {
  for (let attempt = 1; ; attempt++) {
    let got = false;
    try {
      return await call((d) => { got = true; onDelta(d); });
    } catch (e) {
      if (got || (signal && signal.aborted) || attempt >= 3) throw e;
      console.error(`[ai] provider failed before any content (attempt ${attempt}), retrying:`, e.message);
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

// Resolves the Decisions API endpoint URL for Jev.
// Supports OpenRouter (/api/alpha/decisions) and custom OpenAI-compatible providers (/v1/decisions).
function resolveDecisionsUrl(cfg) {
  if (cfg.provider === 'openrouter' && (!cfg.baseUrl || /openrouter\.ai/i.test(cfg.baseUrl))) {
    return 'https://openrouter.ai/api/alpha/decisions';
  }
  const base = (cfg.baseUrl || '').replace(/\/+$/, '');
  if (!base) return 'https://openrouter.ai/api/alpha/decisions';
  if (base.endsWith('/decisions') || base.endsWith('/systemone')) {
    return base;
  }
  if (base.endsWith('/v1')) {
    return `${base}/decisions`;
  }
  return `${base}/v1/decisions`;
}

// fetchJson buries the HTTP status inside the error message, which is useless
// when we need to branch on 400/422 to retry with a compatible body. POST
// directly and keep the status + raw text addressable.
async function postAgentJson(url, headers, body, signal, timeoutMs = 30000) {
  if (signal && signal.aborted) return { status: 0, json: null, text: '', aborted: true };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const onAbort = () => ctrl.abort();
  if (signal) signal.addEventListener('abort', onAbort, { once: true });
  try {
    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
    } catch (e) {
      if (signal && signal.aborted) return { status: 0, json: null, text: '', aborted: true };
      throw new Error(e.name === 'AbortError' ? 'Provider timed out' : `Provider unreachable (${e.message})`);
    }
    const text = await r.text();
    if (!r.ok) return { status: r.status, json: null, text: text.slice(0, 400) };
    let json = null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try { json = JSON.parse(text.slice(start, end + 1)); } catch { json = null; }
    }
    if (!json) json = { raw: text.slice(0, 400) };
    return { status: r.status, json, text };
  } finally {
    clearTimeout(t);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

/* SSE POST for streaming LLM answers (chat/completions and /v1/messages).
   Calls onEvent(dataString) for every `data:` line of the server-sent stream.
   Returns the same {status, sse, aborted} envelope as postAgentJson, with
   `sse: true` when the body really was an event stream. */
async function postAgentSSE(url, headers, body, signal, timeoutMs = 180000, onEvent) {
  if (signal && signal.aborted) return { status: 0, json: null, text: '', sse: false, aborted: true };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const onAbort = () => ctrl.abort();
  if (signal) signal.addEventListener('abort', onAbort, { once: true });
  try {
    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { ...headers, ...(body.stream ? { accept: 'text/event-stream' } : {}) },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
    } catch (e) {
      if (signal && signal.aborted) return { status: 0, json: null, text: '', sse: false, aborted: true };
      throw new Error(e.name === 'AbortError' ? 'Provider timed out' : `Provider unreachable (${e.message})`);
    }
    const ct = r.headers.get('content-type') || '';
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return { status: r.status, json: null, text: text.slice(0, 400), sse: false };
    }
    if (!ct.includes('text/event-stream')) {
      /* Provider ignored `stream: true` and answered with a JSON body. */
      const text = await r.text().catch(() => '');
      let json = null;
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try { json = JSON.parse(text.slice(start, end + 1)); } catch { json = null; }
      }
      return { status: r.status, json, text, sse: false };
    }
    const dec = new TextDecoder();
    let buf = '';
    let chunks = 0;
    try {
      for await (const chunk of r.body) {
        chunks++;
        buf += dec.decode(chunk, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line || line.startsWith(':')) continue;
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          let parsed = null;
          try { parsed = JSON.parse(data); } catch { parsed = data; }
          onEvent(parsed);
        }
      }
    } catch (e) {
      if (signal && signal.aborted) return { status: r.status, json: null, text: '', sse: true, aborted: true, chunks };
      throw new Error(`Provider stream failed (${e.message})`);
    }
    return { status: r.status, json: null, text: '', sse: true, chunks };
  } finally {
    clearTimeout(t);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

// Fast Jev decision model chooses the best character pose based on reply text.
// Instead of a full-blown tool-calling LLM, Jev evaluates typed choices with calibrated probabilities.
async function runPoseAgent({ char, persona, chat, poses, currentPoseId, replyText, settings, signal }) {
  try {
    const cfg = poseCfg(settings || {});
    if (!cfg.enabled) return null;
    if (char && char.posesEnabled === false) return null;
    const candidates = (poses || []).filter((p) => p.hasImage || p.image);
    if (candidates.length === 0) return null;
    if (!cfg.recheck && currentPoseId) return null;
    if (!cfg.apiKey && cfg.provider !== 'ollama' && cfg.provider !== 'custom') return null;
    if (signal && signal.aborted) return null;

    const defaultPose = candidates.find((p) => p.isDefault) || candidates[0];
    const currentPose = (currentPoseId ? candidates.find((p) => p.id === currentPoseId) : null) || defaultPose;

    // Criteria: provide an option to stay on the current pose/scene, plus each candidate pose
    const criteria = {};
    criteria['keep_current'] = `Keep current pose ("${currentPose.name}"). Character is still actively performing this action or posture, or no other candidate pose fits the new situation.`;

    for (const p of candidates) {
      const desc = (p.description || '').trim();
      criteria[p.id] = desc ? `${p.name} — ${desc}` : `Character in ${p.name} pose`;
    }

    const state = {
      character: char.name,
      current_pose: currentPose.description
        ? `${currentPose.name} (${currentPose.description})`
        : currentPose.name,
      latest_reply: String(replyText || '').trim(),
    };

    const contextCount = typeof cfg.contextCount === 'number' ? cfg.contextCount : 3;
    if (chat && chat.tree && contextCount > 0) {
      const tip = db.treeTip(chat.tree);
      if (tip) {
        const { turns } = buildTurns(db.pathNodes(chat.tree, tip), char, persona, chat);
        const recent = turns.slice(-contextCount);
        if (recent.length) {
          state.recent_dialogue = recent
            .map((t) => {
              const speaker = t.role === 'assistant' ? char.name : (persona ? persona.name : 'User');
              return `${speaker}: ${String(t.content || '').trim()}`;
            })
            .join('\n\n');
        }
      }
    }

    const instructions = `Analyze ${char.name}'s current physical actions, posture, location, and situation at the end of the latest reply. If ${char.name} has stopped what they were doing or changed posture from "${currentPose.name}", select the candidate pose that best matches their new posture or situation. If they are still actively performing the action depicted by "${currentPose.name}", or if no other candidate pose fits, select keep_current.`;

    const model = cfg.model || (cfg.provider === 'openrouter' ? 'typesafe/jev-1.13' : 'jev');
    const url = resolveDecisionsUrl(cfg);

    const headers = { 'content-type': 'application/json' };
    if (cfg.apiKey) {
      headers['authorization'] = `Bearer ${cfg.apiKey}`;
    }
    if (cfg.provider === 'openrouter' || /openrouter\.ai/i.test(url)) {
      headers['http-referer'] = 'http://localhost:3000';
      headers['x-title'] = 'aichat';
    }

    const body = {
      model,
      state,
      questions: {
        pose: {
          type: 'choice',
          instructions,
          criteria,
        },
      },
    };

    let res = await postAgentJson(url, headers, body, signal);

    // If custom OpenAI-compatible provider 404s/405s on /decisions, fall back to /chat/completions with structured output
    if ((res.status === 404 || res.status === 405) && cfg.provider !== 'openrouter' && !res.aborted) {
      const chatBase = (cfg.baseUrl || '').replace(/\/+$/, '').replace(/\/decisions$/, '');
      const chatUrl = chatBase.endsWith('/v1') ? `${chatBase}/chat/completions` : `${chatBase}/v1/chat/completions`;
      console.log(`[pose/jev] /decisions returned ${res.status}, falling back to chat completions at ${chatUrl}`);
      const fallbackBody = {
        model,
        stream: false,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content: 'You are a decision model (Jev). Select the single best option key based on the state. Return JSON: {"choice": "<key>", "confidence": <0.0 to 1.0>}',
          },
          {
            role: 'user',
            content: `Question: ${instructions}\n\nState: ${JSON.stringify(state, null, 2)}\n\nOptions:\n${Object.entries(criteria).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`,
          },
        ],
        response_format: { type: 'json_object' },
      };
      res = await postAgentJson(chatUrl, headers, fallbackBody, signal);
    }

    if (res.aborted) return null;
    if (!res.json) {
      const detail = String(res.text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      console.error(`[pose/jev] request failed (status ${res.status}): ${detail || 'empty response'}`);
      return null;
    }

    let chosenKey = null;
    let confidence = null;

    const j = res.json;
    const ans =
      j.answers?.pose ||
      j.data?.result?.answers?.pose ||
      j.result?.answers?.pose ||
      (j.answers ? Object.values(j.answers)[0] : null);

    if (ans && typeof ans === 'object') {
      chosenKey = ans.choice ?? ans.value ?? ans.selected ?? null;
      if (typeof ans.confidence === 'number') confidence = ans.confidence;
      else if (ans.probabilities && chosenKey && typeof ans.probabilities[chosenKey] === 'number') {
        confidence = ans.probabilities[chosenKey];
      }
    } else if (j.choices?.[0]?.message?.content) {
      try {
        const parsed = JSON.parse(j.choices[0].message.content);
        chosenKey = parsed.choice || parsed.poseId || parsed.selected || null;
        if (typeof parsed.confidence === 'number') confidence = parsed.confidence;
      } catch {}
    }

    if (!chosenKey) {
      console.error('[pose/jev] could not extract choice from response:', JSON.stringify(j).slice(0, 200));
      return null;
    }

    return decidePose({ poseId: chosenKey, confidence }, candidates, currentPose, cfg);
  } catch (e) {
    console.error('[pose/jev] director failed:', e.message);
    return null;
  }
}

function decidePose(arg, candidates, currentPose, cfg) {
  const confidence = Number(arg.confidence);
  const conf = Number.isFinite(confidence) ? clamp(confidence, 0, 1, 1) : 1;
  const reason = String(arg.reason || 'jev decision').slice(0, 120);

  if (arg.poseId === 'keep_current' || arg.poseId === 'none') {
    console.log(`[pose/jev] held current shot (${arg.poseId}, conf ${conf.toFixed(2)})`);
    return { poseId: currentPose.id, poseName: currentPose.name, confidence: conf, reason: 'keep_current', changed: false };
  }

  let pose = candidates.find((p) => p.id === arg.poseId);
  if (!pose) {
    pose = candidates.find((p) => p.name.toLowerCase() === String(arg.poseId).toLowerCase());
  }
  if (!pose) {
    console.log(`[pose/jev] unrecognized choice: ${arg.poseId}`);
    return null;
  }

  if (pose.id === currentPose.id) {
    console.log(`[pose/jev] held ${pose.name} (unchanged, conf ${conf.toFixed(2)})`);
    return { poseId: pose.id, poseName: pose.name, confidence: conf, reason: 'unchanged', changed: false };
  }

  if (conf < cfg.likelihood) {
    console.log(`[pose/jev] skipped ${pose.name} (conf ${conf.toFixed(2)} below threshold ${cfg.likelihood})`);
    return { poseId: pose.id, poseName: pose.name, confidence: conf, reason: 'below threshold', changed: false };
  }

  console.log(`[pose/jev] pose: ${currentPose.name} → ${pose.name} (conf ${conf.toFixed(2)})`);
  return { poseId: pose.id, poseName: pose.name, confidence: conf, reason, changed: true };
}

function startEventStream(res, fn, tag = 'stream') {
  const t0 = Date.now();
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  tlog('http', 'SSE ▶', tag);
  const ctrl = new AbortController();
  let closed = false;
  let ended = false;
  res.on('close', () => {
    closed = true;
    if (!ended) tlog('http', `SSE ⚡ ${tag} — client disconnected after ${Date.now() - t0}ms (generation continues on server)`);
  });
  const emit = (obj) => {
    if (closed) return;
    try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch {}
  };
  fn(emit, ctrl)
    .then(() => { tlog('http', `SSE ■ ${tag} complete (${Date.now() - t0}ms)`); })
    .catch((e) => {
      tlog('http', `SSE ✗ ${tag} FAILED after ${Date.now() - t0}ms — ${e.message}`);
      if (!closed) emit({ type: 'error', error: e.message });
    })
    .finally(() => {
      ended = true;
      try { res.end(); } catch {}
    });
}

/* In-flight and recently finished generation tracking.
   Allows mobile clients that disconnected or suspended mid-stream (e.g. app switch, screen lock)
   to recover the completed response from the server instead of failing with "Error in input stream". */
const activeChatGens = new Map(); // chatId -> { active, done, text, chat, node, error, startedAt }
let activeAgentGen = null; // { active, done, text, error, startedAt }

/* ==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-=== */
/* AI Agent — a built-in assistant that can inspect and edit the whole site.  */
/* Runs a tool-calling loop over streaming LLM calls (OpenAI `tools` /        */
/* Anthropic `tools`): text deltas stream live to the client, tool calls      */
/* execute server-side. Non-streaming fallback when a provider can't stream. */
/* ==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-=== */

const AGENT_MAX_ITERATIONS = 8;
const AGENT_HISTORY_LIMIT = 80;
const AGENT_TOOL_RESULT_CAP = 8000;

const AGENT_IDENTITY = `You are the Agent — ZeroChat's built-in AI assistant. You live inside a self-hosted roleplay app and the user talks to you in a side drawer.

You are NOT a roleplay character here. You are a competent, warm, no-nonsense product co-pilot who understands the app's data model deeply and can act on it with tools. Your most important job is the "full set" workflow: designing a character, then a scenario draft, then splitting it into a scaffold + variables — always with the user's approval at each step.`;

const AGENT_ENTITY_GUIDE = `## Data model cheat sheet
Everything below is reachable through your tools.

CHARACTERS (create_character / update_character / set_signature_scenario):
- description — the persona the roleplay model sees: who they are, background, personality, how they treat the user. Prose, no hashtags. May reference {{tags}}.
- note — a short private reminder shown under their name. The roleplay model never sees it (not for persona text).
- signature_scenario — the character's exclusive signature opening scenario (scene text). Specific to this character only, never appears in the scenarios tab, and only supports {{char}} and {{user}} (no custom variables).
- emoji — small avatar fallback (default "{{charEmoji}}").
- variables — a map of custom {{tag}} -> value. Values must be SHORT (a word, a number, a color), because they are substituted into scenario text. e.g. { "mood": "curious", "hair": "silver" }.

SCENARIOS (create_scenario / update_scenario / set_scenario_character_variables):
- title, description (shown in pickers), content — the scene text injected as a chat's opening context.
- content may contain {{char}}, {{user}} and custom {{tags}}. At chat start every custom {{tag}} is replaced by that character's value.
- character_variables — per-character values { "<characterId>": { "<tag>": "value" } }. These take precedence over the character's own variables for that scenario.

PERSONAS (create_persona / update_persona / set_active_persona):
- name, description — who the USER plays as. The roleplay model sees name + description. note is private.

IMAGES (generate_image / edit_image / apply_image):
- Characters have a portrait image; characters with posesEnabled can have multiple POSES, each with its own image, that the visual director swaps during chat.
- generate_image creates an image from a text prompt. Give it target="portrait" plus a character_id to set it as the portrait, or target="pose" to attach it to a pose (pose_id to update an existing pose, or pose_name/pose_description to create one). For a multi-pose character generate one pose at a time (e.g. Standing, Sitting, Close-up...) and confirm the look with the user first; poses need posesEnabled=true on the character and consistent framing/style across images.
- edit_image transforms an existing image: source_type "last" (the last image produced), "character" (its portrait, with character_id), "pose" (with pose_id) or "attachment" (an image the user attached, with attachment_id from the [attached image: ...] marker). Requires a provider with image-edit support (e.g. OpenAI gpt-image-1).
- apply_image places an EXISTING image, no provider call: source_type "attachment" or "last" plus character_id and target="portrait"/"pose". Use it to turn images the user attached into a portrait or poses.
- Never invent pose ids; read real ones from get_character's pose list.
- You do not need to include image data in your replies — every produced/applied image is shown to the user automatically as a tool card. If the user's provider does not support image tools at all, say so plainly and suggest attaching an image instead.

PRESETS (list_presets / get_preset):
- Presets configure how the AI roleplays in chat, but critically, their system prompts contain THE USER'S STYLE RULES: tone (e.g. literary, gritty, casual, poetic, slow-burn), dialogue conventions (e.g. actions in *asterisks*, speech in "quotes"), pacing, narrative perspective, and formatting rules.
- The active preset (and any other presets in the library) tell you how the user likes roleplay written. Always study the active preset when designing characters (description) and drafting scenarios (opening scene text), so your writing seamlessly mirrors their preferred roleplay style.
- The preset's system prompt is for your stylistic reference and guidance — NEVER roleplay as a character in the Agent drawer.

{{tag}} resolution order at chat start: scenario.characterVariables[<characterId>] first, then the character's own variables. Tags with no value for that character remain visible as {{tag}}, so always confirm either a scenario-level value or a character default exists before the user starts a chat.`;

const AGENT_WORKFLOW = `## The full-set workflow (character -> scenario draft -> scaffold + variables)
When the user wants a character, a scenario, or the complete package ("a full set"), follow this protocol EXACTLY, one message at a time. Never skip the confirmation gates. Standalone requests (just a character, just a scenario, just variables, advice, etc.) skip the irrelevant steps naturally.

STEP 1 — Character concept:
Gather what's needed from the user's message and the current site state (especially the active preset's style prompt so you know their writing preferences). If something essential is genuinely ambiguous (genre, tone, name), ask — at most two or three short questions, then commit to a coherent design instead of interrogating them forever.
Before creating anything, PRESENT the full character in chat as a clean layout (name + emoji, description, note, opening scenario text, variables idea) and ask for approval or changes. Only call create_character after the user approves that layout.

STEP 2 — Revise & image:
After creation, confirm it exists (report the real id) and ask if they want to change anything — shorten or lengthen specific parts, restructure, different emoji — or work on visuals: generate a portrait and/or poses with generate_image, edit existing images with edit_image, or apply images the user attached. Iterate with update_character until they are satisfied. Only then move to the scenario.

STEP 3 — Scenario draft:
Write the FULL scenario as plain text / markdown prose (several paragraphs, scene-setting, situation, opening tension; you may naturally use {{char}} and {{user}}, but NO custom {{tags}} yet). The scenario must work with the character created in step 1. Present it and ask what to change, add, remove or restructure. Iterate until the user confirms the text is final. Do NOT create the scenario yet.

STEP 4 — Scaffold & variables:
Once the text is final, split it: turn concrete, re-usable details (outfit, location, mood, objects, names, numbers...) into {{tags}} ONLY where a tag genuinely helps customization; keep atmosphere prose untouched. Present side by side: the full scaffold text and a table of every tag with the value you'd assign for the chosen character (short values!). Also mention any optional tags. Ask the user to accept or adjust.

STEP 5 — Create & wire up:
After acceptance, in one go: create_scenario with content = scaffold (and a short description), then set_scenario_character_variables (or set_character_variables for character-wide defaults) with the approved values. Finish with a summary: real ids, where to find each thing (sidebar / start-chat picker), and offer to start a chat or build more.

Anti-loop guard: if the user goes back and forth many times on fine details, summarize what's locked and what's pending, then propose locking it in.`;

const AGENT_RULES = `## Ground rules
- Never assume: draw facts from your tools (site_overview / list / get) and from what the user says. If a needed fact exists nowhere, ask.
- When you need permission, confirmation, approval to create/update/delete entities, or a decision from the user, ask the question in plain text and END your message there. The user types their answer as the next chat message — wait for it before acting.
- Only call create / update / delete tools for a specific action the user has approved. Reading tools is always fine.
- Always use real ids returned by tools. Never invent an id.
- Learn the user's writing style from their Presets: Presets hold the user's preferred writing style, dialogue conventions, formatting rules, and roleplay tone. Always respect and incorporate these instructions when writing character descriptions, example dialogue lines, and scenario prose. Use list_presets and get_preset to inspect presets whenever helpful.
- When the user attaches an image, look at it directly — you have full vision capabilities and can see the image pixels. Inspect it to answer questions, describe it, or base characters/scenarios on it. The text marker [attached image: att-xxx — name] indicates its attachment id so you can pass it to apply_image or edit_image via source_type="attachment" and source_id="att-xxx".
- After any successful action, tell the user exactly what changed and what the next sensible step is.
- Prefer showing content INSIDE the conversation (formatted with markdown) over making the user open editors. Editors are for fine-tuning; you are for creation.
- Be honest about limits: when something is not possible with your tools, say so instead of pretending.
- Keep replies tight. One decision at a time so the user is never overwhelmed.`;

function agentTrim(s, n = 300) {
  const t = String(s == null ? '' : s);
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

function agentRequiredVars(content) {
  const found = new Set();
  const re = /\{\{\s*([\w.-]+)\s*\}\}/g;
  let mm;
  while ((mm = re.exec(String(content || ''))) !== null) {
    const k = mm[1].toLowerCase();
    if (k !== 'char' && k !== 'user') found.add(mm[1]);
  }
  return Array.from(found);
}

function agentNormBase(b) {
  let base = String(b || '').trim().replace(/\/+$/, '');
  if (!base) base = 'https://openrouter.ai/api/v1';
  if (!/\/v\d+$/.test(base)) base += '/v1';
  return base;
}

function agentCharBrief(c) {
  return {
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    description: agentTrim(c.description, 300),
    signature_scenario: c.scenario ? agentTrim(c.scenario, 150) : null,
    variable_keys: Object.keys(c.variables || {}),
    poses: (c.poses || []).length,
    open_chats: (c.chats || []).length,
  };
}

function agentScenarioBrief(s) {
  const req = agentRequiredVars(s.content);
  const configured = s.characterVariables || {};
  return {
    id: s.id,
    title: s.title,
    description: agentTrim(s.description, 160),
    required_vars: req,
    special_notes: s.specialNotes || '',
    characters_configured: Object.keys(configured),
  };
}

/* Read one chat for the agent. mode "linear" = the conversation exactly as the
   user sees it (active branch only, as a transcript); mode "tree" = every node
   including all alternative versions/branches, with the active child marked.
   Both modes are PAGED: the tool result must stay under AGENT_TOOL_RESULT_CAP
   (8000 chars) or it gets degraded to a stub, so each call returns a window
   plus next_start / a note telling the agent how to keep reading. Content
   length per message scales with the requested page size. */
const AGENT_READ_BUDGET = 6800;
function agentReadChat(chatId, mode, opts = {}) {
  const chat = db.getChat(chatId);
  if (!chat) return null;
  const char = db.getCharacter(chat.characterId);
  const tree = chat.tree;
  const trim = (s, n) => {
    const t = String(s || '');
    return t.length > n ? t.slice(0, n) + '…' : t;
  };
  const meta = {
    chat_id: chat.id,
    title: chat.title,
    character: char ? char.name : '(deleted character)',
    character_id: chat.characterId,
    scenario: chat.scenarioTitle || null,
    total_nodes: Object.keys(tree.nodes).length,
  };
  const hasStart = opts.start !== undefined && opts.start !== null && String(opts.start).trim() !== '';

  if (mode === 'tree') {
    // Deterministic DFS render first, then page by line index.
    const all = [];
    const walk = (id, depth) => {
      const node = tree.nodes[id];
      if (!node) return;
      const hasKids = node.children && node.children.length;
      const star = hasKids ? '*' : '';
      const extra = node.role === 'injection' && node.state ? ` [${node.state}]` : '';
      all.push(`${'  '.repeat(Math.min(depth, 24))}[${node.role}${star}] ${node.id}${extra} ${JSON.stringify(trim(node.content, 140))}`);
      for (const c of hasKids ? node.children : []) walk(c, depth + 1);
    };
    walk('root', 0);
    const total = all.length;
    const reqLimit = Math.max(10, Math.min(Number(opts.limit) || 100, 400));
    let start = hasStart ? Math.max(0, Math.min(Math.floor(Number(opts.start)), Math.max(0, total - 1))) : 0;
    const lines = [];
    let used = 0;
    let i = start;
    while (i < total && lines.length < reqLimit) {
      const w = all[i].length + 1;
      if (used + w > AGENT_READ_BUDGET && lines.length > 0) break;
      lines.push(all[i]);
      used += w;
      i++;
    }
    const end = i - 1;
    const nextStart = i < total ? i : null;
    let note;
    if (nextStart != null) {
      note = `Tree lines ${start}–${end} of ${total}. MORE LINES EXIST — call read_chat again (same chat_id + mode) with start=${nextStart} to continue.`;
    } else if (start > 0) {
      note = `Tree lines ${start}–${end} of ${total} — end of tree reached.`;
    } else {
      note = `Whole tree, ${total} lines. A * after a role marks the ACTIVE child of its parent (the version on screen); unmarked siblings are alternative versions. Children are the messages that follow a node.`;
    }
    return { ...meta, mode: 'tree', total_lines: total, start, end, next_start: nextStart, tree: lines.join('\n'), note };
  }

  const tip = db.treeTip(tree);
  const path = db.pathNodes(tree, tip).filter((n) => n.role !== 'root');
  const total = path.length;
  const reqLimit = Math.max(1, Math.min(Number(opts.limit) || 20, 60));
  // Scale per-message content length to the page size so the whole page fits
  // the tool-result cap: big pages → terse previews, small pages → rich text.
  const contentCap = Math.max(160, Math.min(700, Math.floor(6400 / (reqLimit + 2))));
  const start = hasStart
    ? Math.max(0, Math.min(Math.floor(Number(opts.start)), Math.max(0, total - 1)))
    : Math.max(0, total - reqLimit); // default: the most recent page
  const messages = [];
  let used = 0;
  let i = start;
  while (i < total && messages.length < reqLimit) {
    const m = { id: path[i].id, role: path[i].role, content: trim(path[i].content, contentCap) };
    const w = JSON.stringify(m).length + 1;
    if (used + w > AGENT_READ_BUDGET && messages.length > 0) break;
    messages.push(m);
    used += w;
    i++;
  }
  const end = i - 1;
  const nextStart = i < total ? i : null;
  const hints = [];
  if (nextStart != null) hints.push(`NEWER messages continue — call read_chat again (same chat_id + mode) with start=${nextStart}`);
  if (start > 0) hints.push(`OLDER messages exist — lower start to page back (start=0 is the beginning)`);
  return {
    ...meta,
    mode: 'linear',
    total_turns: total,
    start,
    end,
    next_start: nextStart,
    messages,
    note: hints.length
      ? `Messages ${start}–${end} of ${total}. ${hints.join('; ')}.`
      : `Messages ${start}–${end} of ${total} — the whole active branch has been read. Call with mode="tree" for alternative versions and branches.`,
  };
}

function agentToolDefs(cfg, settings = null) {
  const defs = [
    { name: 'site_overview', description: 'Snapshot of the site: counts, ids of every entity, who the user plays as, which AI preset is active and whether image generation is available. Call this first whenever you are unsure about ids or the current state.', props: {} },
    { name: 'list_characters', description: 'List every character with id, name, a trimmed persona, signature scenario status, and variable keys. Full details need get_character.', props: {} },
    { name: 'get_character', description: 'Full record of one character: description (persona), note, signature scenario text, variables with values, and pose list.', props: { id: { type: 'string', description: 'Character id' } }, req: ['id'] },
    {
      name: 'create_character', description: `Create a character and its first open chat. REQUIRED: name, description (the persona the roleplay model sees). OPTIONAL: note (private reminder, model never sees it), signature_scenario (character's exclusive signature opening scenario; only {{char}} and {{user}} supported), emoji, variables ({{tag}} -> short value map), posesEnabled.`,
      props: {
        name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' },
        signature_scenario: { type: 'string', description: "Exclusive signature opening scenario for this character only. Supports {{char}} and {{user}} only (no custom variables)." },
        scenario: { type: 'string', description: 'Alias for signature_scenario' }, emoji: { type: 'string' },
        variables: { type: 'object', description: 'Map of {{tag}} -> short value' },
        posesEnabled: { type: 'boolean' },
      }, req: ['name', 'description'],
    },
    { name: 'update_character', description: 'Update one or more fields of an existing character. Only send the fields you want to change.', props: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' }, signature_scenario: { type: 'string' }, scenario: { type: 'string' }, emoji: { type: 'string' } }, req: ['id'] },
    {
      name: 'set_signature_scenario',
      description: "Set or update a character's exclusive signature scenario. Signature scenarios are specific to one character, do not appear in the scenarios tab, and only support {{char}} and {{user}} (no custom variables).",
      props: {
        character_id: { type: 'string', description: 'Character id' },
        scenario: { type: 'string', description: 'Opening scene content for the signature scenario' },
      },
      req: ['character_id', 'scenario'],
    },
    { name: 'set_character_variables', description: `Set the character's {{tag}} values. By default MERGES the given map into the existing variables; set replace=true to wipe and replace. Values must be short (a word or number).`, props: { id: { type: 'string' }, variables: { type: 'object' }, replace: { type: 'boolean' } }, req: ['id', 'variables'] },
    { name: 'delete_character', description: 'Permanently delete a character, its chats and its poses. Only after the user explicitly asked for exactly this.', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'list_scenarios', description: 'List every scenario with id, title, required {{tags}} and which characters have values configured.', props: {} },
    { name: 'get_scenario', description: 'Full scenario record: title, description, full content, special notes, and the per-character variable values.', props: { id: { type: 'string' } }, req: ['id'] },
    {
      name: 'read_chat',
      description: 'Read a chat conversation. Without chat_id, reads the chat the user currently has open (its id is listed in your context). mode="linear" (default) returns the active branch as a transcript; mode="tree" returns every node with ALL its alternative versions/branches, marking which version is active (*). Long chats are PAGED: each result reports the range shown and next_start — call again with start=<next_start> to keep reading; lower start values reach older content (start=0 is the beginning). limit caps messages (linear) or tree lines (tree) per call (default 20; larger limits give terser previews).',
      props: {
        chat_id: { type: 'string', description: 'Chat id to read. Omit to read the currently open chat.' },
        mode: { type: 'string', description: '"linear" (active branch transcript) or "tree" (all versions and branches). Default "linear".' },
        start: { type: 'integer', description: 'Page position: message index (linear) or tree-line index (tree). Omit for the most recent messages (linear) / the top of the tree (tree).' },
        limit: { type: 'integer', description: 'Max messages (linear) or tree lines (tree) to return per call. Default 20, max 60 (linear) / 400 (tree).' },
      },
    },
    { name: 'create_scenario', description: `Create a scenario. content is the scene text injected at chat start; special_notes provides newline-separated important details for this scenario only; character_variables optionally seeds per-character values { "<characterId>": { "<tag>": "value" } }.`, props: { title: { type: 'string' }, description: { type: 'string' }, content: { type: 'string' }, special_notes: { type: 'string', description: 'Newline-separated details for this scenario only' }, character_variables: { type: 'object' } }, req: ['title', 'content'] },
    { name: 'update_scenario', description: `Update title/description/content/special_notes; character_variables REPLACES the whole per-character map (use set_scenario_character_variables to merge instead).`, props: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, content: { type: 'string' }, special_notes: { type: 'string' }, character_variables: { type: 'object' } }, req: ['id'] },
    { name: 'set_scenario_character_variables', description: `Set per-character {{tag}} values on one scenario. MERGES given map for that character; replace=true replaces that character's map only.`, props: { scenario_id: { type: 'string' }, character_id: { type: 'string' }, variables: { type: 'object' }, replace: { type: 'boolean' } }, req: ['scenario_id', 'character_id', 'variables'] },
    { name: 'delete_scenario', description: 'Permanently delete a scenario (chats keep running without it).', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'list_personas', description: 'List the user personas ("who you play as"), with the active one marked.', props: {} },
    { name: 'create_persona', description: 'Create a user persona: name + description (what the roleplay model knows about the user). Does not auto-activate.', props: { name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' } }, req: ['name', 'description'] },
    { name: 'update_persona', description: 'Update a persona. description is what the roleplay model sees; note is private.', props: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' } }, req: ['id'] },
    { name: 'set_active_persona', description: 'Switch who the user currently plays as.', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'list_presets', description: `List all roleplay AI presets in the user's library, including their names, providers, models, active status, and writing style / system prompts. Use this to understand how the user wants characters to write and how descriptions and scenes should be formed.`, props: {} },
    { name: 'get_preset', description: `Get full details of a specific AI preset by id, including its full writing instructions / system prompt, provider, model, temperature, and reasoning settings.`, props: { id: { type: 'string', description: 'Preset id' } }, req: ['id'] },
    { name: 'generate_image', description: `Generate an AI image from a text prompt. Without a target it just returns the image; with a character_id and target it applies it: target="portrait" sets the character portrait, target="pose" attaches it to a pose (pose_id updates an existing pose; pose_name/pose_description create a new one). Prompts that describe art style, framing and mood work best.`, props: { prompt: { type: 'string' }, character_id: { type: 'string' }, target: { type: 'string', description: '"portrait", "pose" or "none"' }, pose_id: { type: 'string', description: 'Update this existing pose instead of creating one', }, pose_name: { type: 'string', description: 'Name for a new pose (created when target="pose" and no pose_id given)' }, pose_description: { type: 'string', description: 'When to use this pose — guidance for the visual director' }, apply: { type: 'boolean', description: 'Legacy alias for target="portrait"' }, size: { type: 'string', description: 'e.g. 1024x1024' } }, req: ['prompt'] },
    { name: 'edit_image', description: `Edit an existing image with an instruction (e.g. "make it evening", "change the jacket to red") using the provider's image-edit model. Pick the source: source_type "last" (the last image this session produced), "character" (portrait, needs character_id), "pose" (needs pose_id) or "attachment" (an image the user attached, needs attachment_id). Then optionally apply it to a character portrait or pose like generate_image. Requires an image-edit capable provider.`, props: { prompt: { type: 'string' }, source_type: { type: 'string', description: '"last", "character", "pose" or "attachment"' }, source_id: { type: 'string', description: 'character_id, pose_id or attachment_id (required unless source_type="last")' }, character_id: { type: 'string' }, target: { type: 'string', description: '"portrait", "pose" or "none"' }, pose_id: { type: 'string' }, pose_name: { type: 'string' }, pose_description: { type: 'string' }, size: { type: 'string' } }, req: ['prompt'] },
    { name: 'apply_image', description: `Apply an existing image to a character — no AI provider needed. Source: source_type "attachment" (an image the user attached; attachment_id from the [attached image: ...] marker) or "last" (the last image produced this session). Target: character_id + target "portrait" or "pose" (pose_id to replace an existing pose's image, or pose_name/pose_description to create a new one). Use this to put user-uploaded artwork on a character or turn it into poses.`, props: { source_type: { type: 'string', description: '"attachment" or "last"' }, source_id: { type: 'string', description: 'attachment_id (required for source_type="attachment")' }, character_id: { type: 'string' }, target: { type: 'string', description: '"portrait" or "pose"' }, pose_id: { type: 'string' }, pose_name: { type: 'string' }, pose_description: { type: 'string' }, is_default: { type: 'boolean', description: 'Also mark this new/pose as the character\'s default pose' } }, req: ['character_id', 'target'] },
  ];
  const hasImage = Boolean(settings?.agentImageBaseUrl || (cfg.provider !== 'anthropic'));
  const tools = defs.filter((d) => !['generate_image', 'edit_image'].includes(d.name) || hasImage);
  return tools.map((d) => ({
    type: 'function',
    function: { name: d.name, description: d.description, parameters: { type: 'object', properties: d.props, required: d.req || [] } },
  }));
}

function agentNeed(args, req, toolName) {
  for (const k of req) {
    const v = args[k];
    if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) {
      throw new Error(`${toolName}: missing required argument "${k}" — ask the user instead of guessing`);
    }
  }
}

function agentSiteOverview(settings, cfg) {
  const chars = db.getCharacters();
  const scenes = db.getScenarios();
  const personas = db.getPersonalities();
  const presets = db.getPresets();
  return {
    counts: { characters: chars.length, scenarios: scenes.length, personas: personas.length, presets: presets.length },
    characters: chars.map((c) => ({ id: c.id, name: c.name })),
    scenarios: scenes.map((s) => ({ id: s.id, title: s.title })),
    personas: personas.map((pp) => ({ id: pp.id, name: pp.name, active: pp.id === settings.activePersonalityId })),
    presets: presets.map((p) => ({ id: p.id, name: p.name, active: p.id === settings.activePresetId, provider: p.provider, model: p.model })),
    active_preset_id: settings.activePresetId,
    image_generation: (cfg.provider !== 'anthropic' || settings?.agentImageBaseUrl) ? 'available (generates, edits and applies images)' : 'unavailable for anthropic presets — image applying still works',
  };
}

function sanitizeForModel(value) {
  if (typeof value === 'string') {
    if (value.startsWith('data:image') && value.length > 256) return '[image data url, hidden from the model]';
    if (value.length > 4000) return agentTrim(value, 2000);
    return value;
  }
  if (Array.isArray(value)) return value.map(sanitizeForModel);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeForModel(v);
    return out;
  }
  return value;
}

/* Tool results are persisted as JSON the model re-reads on the next turn.
   A detail record can exceed the per-result cap, and slicing the JSON string
   mid-way used to corrupt it: safeParse then produced null and the model saw
   an empty tool result ("detail lookups came back empty"). Degrade instead:
   1) try the sanitized payload as-is;
   2) shave every string down and retry;
   3) fall back to a preview stub with an explanatory note — always valid JSON. */
const AGENT_TOOL_STR_CAP = 600;
function shaveStrings(value, cap) {
  if (typeof value === 'string') return agentTrim(value, cap);
  if (Array.isArray(value)) return value.map((v) => shaveStrings(v, cap));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = shaveStrings(v, cap);
    return out;
  }
  return value;
}
function capToolResultJson(result, cap) {
  let s = JSON.stringify(result);
  if (s.length <= cap) return s;
  s = JSON.stringify(shaveStrings(result, AGENT_TOOL_STR_CAP));
  if (s.length <= cap) return s;
  const preview = JSON.stringify(shaveStrings(result, 1400));
  const clamped = Math.max(300, cap - 200);
  return JSON.stringify({
    truncated: true,
    preview: preview.length > clamped ? preview.slice(0, clamped) + '…' : preview,
    note: 'Full result was too large and is truncated. Long text fields were shortened — use the list tools or ask me to re-query specific parts.',
  });
}

/* Rebuild the text the model sees for a stored tool row: parsed object when
   the JSON survived, the raw stored string when parsing failed (historical/
   truncated rows) — never an empty string without cause. */
function agentToolResultText(r) {
  if (typeof r.toolResult === 'string') return r.toolResult;
  if (r.toolResult !== null && r.toolResult !== undefined) {
    try { return JSON.stringify(r.toolResult); } catch { /* fall through */ }
  }
  return r.toolResultRaw || '';
}

/* ---- Agent image tooling --------------------------------------------------- */

/* The most recent image produced by generate_image / edit_image this session
   (data URL), so edit_image(source_type="last") and apply_image(source_type="last")
   can chain image steps without the model ever holding image bytes. */
let agentLastImage = null;

function extractProviderImage(r, what) {
  const item = r && r.data && r.data[0];
  return item && (item.b64_json ? 'data:image/png;base64,' + item.b64_json : item.url) || null;
}

/* Resolve an image for edit_image / apply_image. Returns the data URL (or http
   url for un-downloaded provider results) of the requested source. */
function agentResolveImage(sourceType, sourceId) {
  const type = String(sourceType || 'last').toLowerCase();
  if (type === 'last') {
    if (!agentLastImage) throw new Error('No image has been produced yet in this session — generate or attach one first.');
    return agentLastImage;
  }
  if (type === 'attachment') {
    if (!sourceId) throw new Error('source_id (the attachment id from the [attached image: ...] marker) is required for source_type="attachment"');
    const a = db.getAgentAttachment(sourceId);
    if (!a) throw new Error('No attached image found with id: ' + sourceId);
    return a.dataUrl;
  }
  if (type === 'character') {
    if (!sourceId) throw new Error('source_id (the character id) is required for source_type="character"');
    const c = db.getCharacter(sourceId);
    if (!c) throw new Error('Character not found: ' + sourceId);
    if (!c.image) throw new Error('That character has no portrait image yet — generate one first.');
    return c.image;
  }
  if (type === 'pose') {
    if (!sourceId) throw new Error('source_id (the pose id) is required for source_type="pose"');
    const pp = db.getPose(sourceId);
    if (!pp) throw new Error('Pose not found: ' + sourceId);
    if (!pp.image) throw new Error('That pose has no image yet — generate one first.');
    return pp.image;
  }
  throw new Error('Unknown source_type: ' + sourceType);
}

/* Remote provider results may be http URLs; image editing needs the bytes.
   Download and embed as a data URL (also caches into agentLastImage). */
async function agentImageToDataUrl(src) {
  if (typeof src !== 'string' || !src) return null;
  if (src.startsWith('data:')) return src;
  if (!/^https?:\/\//.test(src)) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);
  try {
    const r = await fetch(src, { signal: ctrl.signal });
    const mime = (r.headers.get('content-type') || 'image/png').split(';')[0].trim();
    if (!mime.startsWith('image/')) throw new Error('Source URL is not an image');
    const buf = Buffer.from(await r.arrayBuffer());
    return `data:${mime};base64,${buf.toString('base64')}`;
  } finally { clearTimeout(t); }
}

/* Generated images must outlive the live tool_result event: the stored tool
   JSON has data URLs sanitized away (multi-MB base64 must never enter the
   model history), which used to make every image vanish from the drawer as
   soon as the turn was reloaded. Each produced image is now saved as an agent
   attachment tagged with the current turn's user message id and referenced by
   id (`imageId`/`imageUrl`) — the drawer renders it from /api/agent/:id/file
   forever after. `seen` dedupes within one turn, so apply_image on an image
   this turn already produced reuses that attachment instead of storing a
   second copy. */
async function agentPersistResultImages(result, toolName, turnUserId, seen) {
  if (!result || typeof result !== 'object' || typeof result.image !== 'string') return result;
  const img = result.image;
  let dataUrl = null;
  if (img.startsWith('data:image')) dataUrl = img;
  else if (/^https?:\/\//.test(img)) dataUrl = await agentImageToDataUrl(img);
  if (!dataUrl) return result;
  try {
    let id = seen.get(img);
    if (!id) {
      const label = toolName === 'edit_image' ? 'Edited image' : toolName === 'apply_image' ? 'Applied image' : 'Generated image';
      const att = db.addAgentAttachment({ name: label, dataUrl, messageId: turnUserId });
      id = att.id;
      seen.set(img, id);
    }
    return { ...result, imageId: id, imageUrl: `/api/agent/${id}/file` };
  } catch (e) {
    tlog('agent', `image persist failed (image stays live-only): ${e.message}`);
    return result;
  }
}

/* Apply an image (data URL or http url) to a character portrait or pose per the
   shared args shape: character_id, target ("portrait"/"pose"), pose_id,
   pose_name, pose_description, is_default. `apply` (legacy bool) means portrait.
   Returns a small descriptor of what was set, or null when target is "none". */
function agentApplyImage(image, args) {
  const target = String(args.target || (args.apply ? 'portrait' : 'none')).toLowerCase();
  if (target === 'none' || (!args.character_id && !args.apply)) return null;
  agentNeed(args, ['character_id'], 'image target');
  const c = db.getCharacter(args.character_id);
  if (!c) throw new Error('Character not found: ' + args.character_id);
  if (target === 'portrait') {
    db.updateCharacter(args.character_id, { image });
    db.addAgentChange({ action: `Set portrait for character "${c.name}"`, entityType: 'character', entityId: c.id });
    return { character_id: args.character_id, target: 'portrait' };
  }
  if (target === 'pose') {
    let pose = null;
    if (args.pose_id) {
      pose = db.getPose(args.pose_id);
      if (!pose || pose.characterId !== args.character_id) throw new Error('Pose not found for this character: ' + args.pose_id);
      const update = { image };
      if (args.pose_name) update.name = String(args.pose_name);
      if (args.pose_description) update.description = String(args.pose_description);
      if (args.is_default) update.isDefault = true;
      pose = db.updatePose(pose.id, update);
    } else {
      // Re-use an existing pose with the same name (characters are seeded with
      // a default pose set) instead of stacking duplicates.
      const wanted = String(args.pose_name || '').trim().toLowerCase();
      pose = wanted ? (db.getPoses(args.character_id).find((p) => (p.name || '').trim().toLowerCase() === wanted) || null) : null;
      if (pose) {
        const update = { image };
        if (args.pose_description) update.description = String(args.pose_description);
        if (args.is_default) update.isDefault = true;
        pose = db.updatePose(pose.id, update);
      } else {
        const name = String(args.pose_name || '').trim() || 'Generated pose';
        pose = db.createPose(args.character_id, {
          name,
          description: String(args.pose_description || ''),
          image,
          isDefault: !!args.is_default,
        });
      }
    }
    if (!c.posesEnabled) db.updateCharacter(args.character_id, { posesEnabled: true });
    if (args.is_default && pose) db.setDefaultPose(args.character_id, pose.id);
    db.addAgentChange({ action: `Set pose "${pose ? pose.name : 'pose'}" on character "${c.name}"`, entityType: 'character', entityId: c.id });
    return { character_id: args.character_id, target: 'pose', pose_id: pose.id, pose_name: pose.name };
  }
  throw new Error('Unknown target: ' + target);
}

async function runAgentTool(name, args, settings, cfg) {
  /* Snapshot BEFORE any tool can mutate. Handlers track changes after they
     run (the created entity's id/name only exists once created), so a lazy
     checkpoint at track time would capture post-mutation state and make the
     Revert button restore the character it was meant to remove. Idempotent:
     the first tracked change of a session pins the snapshot. */
  db.ensureAgentSessionCheckpoint();
  switch (name) {
    case 'site_overview':
      return agentSiteOverview(settings, cfg);

    case 'list_characters':
      return { characters: db.getCharacters().map(agentCharBrief) };

    case 'get_character': {
      agentNeed(args, ['id'], name);
      const c = db.getCharacter(args.id);
      if (!c) throw new Error('Character not found: ' + args.id);
      return {
        ...c,
        signature_scenario: c.scenario || '',
        avatar: undefined, image: undefined,
        /* open_chats below already summarizes them — raw chats would drag
           full conversation trees into the payload for no benefit. */
        chats: undefined,
        responses: (c.responses || []).slice(0, 8),
        poses: (c.poses || []).map((pp) => ({ id: pp.id, name: pp.name, description: agentTrim(pp.description, 100), is_default: !!pp.isDefault })),
        open_chats: (c.chats || []).map((ch) => ({ id: ch.id, title: ch.title, scenario: ch.scenarioTitle })),
      };
    }

    case 'create_character': {
      agentNeed(args, ['name', 'description'], name);
      const sigScen = args.signature_scenario !== undefined ? args.signature_scenario : (args.scenario || '');
      const c = db.createCharacter({
        name: args.name,
        description: args.description,
        note: args.note || '',
        scenario: sigScen || '',
        emoji: args.emoji || undefined,
        variables: args.variables || {},
        posesEnabled: !!args.posesEnabled,
      });
      db.addAgentChange({ action: `Created character "${c.name}"`, entityType: 'character', entityId: c.id });
      return { created: agentCharBrief(c), note: 'a first chat was opened for this character automatically' };
    }

    case 'update_character': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['name', 'description', 'note', 'scenario', 'emoji']) {
        if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      }
      if (args.signature_scenario !== undefined && args.signature_scenario !== null) {
        fields.scenario = String(args.signature_scenario);
      }
      const c = db.updateCharacter(args.id, fields);
      if (!c) throw new Error('Character not found: ' + args.id);
      db.addAgentChange({ action: `Updated character "${c.name}"`, entityType: 'character', entityId: c.id });
      return { updated: agentCharBrief(c), changed: Object.keys(fields) };
    }

    case 'set_signature_scenario': {
      agentNeed(args, ['character_id', 'scenario'], name);
      const c = db.getCharacter(args.character_id);
      if (!c) throw new Error('Character not found: ' + args.character_id);
      const updated = db.updateCharacter(args.character_id, { scenario: String(args.scenario || '').trim() });
      db.addAgentChange({ action: `Updated signature scenario for "${c.name}"`, entityType: 'character', entityId: c.id });
      return { character_id: c.id, name: c.name, signature_scenario: updated.scenario };
    }

    case 'set_character_variables': {
      agentNeed(args, ['id', 'variables'], name);
      if (typeof args.variables !== 'object' || !args.variables) throw new Error('variables must be an object of tag -> short value');
      const c = db.getCharacter(args.id);
      if (!c) throw new Error('Character not found: ' + args.id);
      const merged = args.replace ? { ...args.variables } : { ...(c.variables || {}), ...args.variables };
      db.updateCharacter(args.id, { variables: merged });
      db.addAgentChange({ action: `Updated variables for character "${c.name}"`, entityType: 'character', entityId: c.id });
      return { character_id: args.id, variables: merged };
    }

    case 'delete_character': {
      agentNeed(args, ['id'], name);
      const c = db.getCharacter(args.id);
      db.deleteCharacter(args.id);
      db.addAgentChange({ action: `Deleted character "${c ? c.name : args.id}"`, entityType: 'character', entityId: args.id });
      return { deleted: args.id };
    }

    case 'list_scenarios':
      return { scenarios: db.getScenarios().map(agentScenarioBrief) };

    case 'get_scenario': {
      agentNeed(args, ['id'], name);
      const s = db.getScenario(args.id);
      if (!s) throw new Error('Scenario not found: ' + args.id);
      return { ...s, charactersConfigured: Object.keys(s.characterVariables || {}) };
    }

    case 'read_chat': {
      const chatId = args.chat_id || cfg.activeChatId;
      if (!chatId) throw new Error('No chat_id given and the user has no chat open right now.');
      const r = agentReadChat(chatId, args.mode === 'tree' ? 'tree' : 'linear', { start: args.start, limit: args.limit });
      if (!r) throw new Error('Chat not found: ' + chatId);
      return r;
    }

    case 'create_scenario': {
      agentNeed(args, ['title', 'content'], name);
      let cv = args.character_variables;
      if (cv && (typeof cv !== 'object' || Array.isArray(cv))) cv = undefined;
      const sNotes = String(args.special_notes || args.specialNotes || '');
      const s = db.createScenario({ title: args.title, description: args.description || '', content: args.content, specialNotes: sNotes, characterVariables: cv || undefined });
      db.addAgentChange({ action: `Created scenario "${s.title}"`, entityType: 'scenario', entityId: s.id });
      return { created: agentScenarioBrief(s) };
    }

    case 'update_scenario': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['title', 'description', 'content']) {
        if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      }
      if (args.special_notes !== undefined || args.specialNotes !== undefined) {
        fields.specialNotes = String(args.special_notes !== undefined ? args.special_notes : args.specialNotes);
      }
      if (args.character_variables && typeof args.character_variables === 'object') fields.characterVariables = args.character_variables;
      const s = db.updateScenario(args.id, fields);
      if (!s) throw new Error('Scenario not found: ' + args.id);
      db.addAgentChange({ action: `Updated scenario "${s.title}"`, entityType: 'scenario', entityId: s.id });
      return { updated: agentScenarioBrief(s) };
    }

    case 'set_scenario_character_variables': {
      agentNeed(args, ['scenario_id', 'character_id', 'variables'], name);
      const s = db.getScenario(args.scenario_id);
      if (!s) throw new Error('Scenario not found: ' + args.scenario_id);
      const cv = { ...(s.characterVariables || {}) };
      cv[args.character_id] = args.replace ? { ...args.variables } : { ...(cv[args.character_id] || {}), ...args.variables };
      db.updateScenario(args.scenario_id, { characterVariables: cv });
      db.addAgentChange({ action: `Updated scenario variables for character "${args.character_id}"`, entityType: 'scenario', entityId: args.scenario_id });
      return { scenario_id: args.scenario_id, character_id: args.character_id, variables: cv[args.character_id] };
    }

    case 'delete_scenario': {
      agentNeed(args, ['id'], name);
      const s = db.getScenario(args.id);
      db.deleteScenario(args.id);
      db.addAgentChange({ action: `Deleted scenario "${s ? s.title : args.id}"`, entityType: 'scenario', entityId: args.id });
      return { deleted: args.id };
    }

    case 'list_personas': {
      const personas = db.getPersonalities();
      return { personas: personas.map((pp) => ({ id: pp.id, name: pp.name, active: pp.id === settings.activePersonalityId, description: agentTrim(pp.description, 200) })) };
    }

    case 'create_persona': {
      agentNeed(args, ['name', 'description'], name);
      const pp = db.createPersona({ name: args.name, description: args.description, note: args.note || '' });
      db.addAgentChange({ action: `Created persona "${pp.name}"`, entityType: 'persona', entityId: pp.id });
      return { created: { id: pp.id, name: pp.name }, note: 'use set_active_persona to make it current' };
    }

    case 'update_persona': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['name', 'description', 'note']) if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      const pp = db.updatePersona(args.id, fields);
      if (!pp) throw new Error('Persona not found: ' + args.id);
      db.addAgentChange({ action: `Updated persona "${pp.name}"`, entityType: 'persona', entityId: pp.id });
      return { updated: { id: pp.id, name: pp.name }, changed: Object.keys(fields) };
    }

    case 'set_active_persona': {
      agentNeed(args, ['id'], name);
      const pp = db.getPersona(args.id);
      if (!pp) throw new Error('Persona not found: ' + args.id);
      db.updateSettings({ activePersonalityId: args.id });
      db.addAgentChange({ action: `Set active persona to "${pp.name}"`, entityType: 'persona', entityId: pp.id });
      return { active_persona: { id: pp.id, name: pp.name } };
    }

    case 'list_presets': {
      const presets = db.getPresets();
      return {
        active_preset_id: settings.activePresetId,
        presets: presets.map((p) => ({
          id: p.id,
          name: p.name,
          active: p.id === settings.activePresetId,
          provider: p.provider,
          model: p.model,
          temperature: p.temperature,
          system_prompt: p.systemPrompt || '',
        })),
      };
    }

    case 'get_preset': {
      agentNeed(args, ['id'], name);
      const p = db.getPreset(args.id);
      if (!p) throw new Error('Preset not found: ' + args.id);
      return {
        id: p.id,
        name: p.name,
        active: p.id === settings.activePresetId,
        provider: p.provider,
        model: p.model,
        temperature: p.temperature,
        max_tokens: p.maxTokens,
        reasoning: p.reasoning,
        system_prompt: p.systemPrompt || '',
      };
    }

    case 'generate_image': {
      agentNeed(args, ['prompt'], name);
      const imgCfg = resolveImageConfig(settings);
      if (cfg.provider === 'anthropic' && !settings.agentImageBaseUrl) throw new Error('Image generation is not wired for Anthropic presets — configure an image generation endpoint in Settings.');
      const base = imgCfg.baseUrl;
      const model = imgCfg.model;
      const r = await fetchJson(base + '/images/generations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(imgCfg.apiKey ? { authorization: 'Bearer ' + imgCfg.apiKey } : {}) },
        body: JSON.stringify({ model, prompt: String(args.prompt).slice(0, 4000), n: 1, size: args.size || '1024x1024' }),
      }, 120000);
      const image = extractProviderImage(r);
      if (!image) throw new Error('Provider returned no image');
      const embedded = await agentImageToDataUrl(image);
      if (embedded) agentLastImage = embedded;
      const applied = agentApplyImage(image, args);
      return { image, model, ...(applied ? { applied_to: applied } : {}) };
    }

    case 'edit_image': {
      agentNeed(args, ['prompt'], name);
      const imgCfg = resolveImageConfig(settings);
      if (cfg.provider === 'anthropic' && !settings.agentImageBaseUrl) throw new Error('Image editing is not wired for Anthropic presets — configure an image generation endpoint in Settings.');
      const srcRaw = agentResolveImage(args.source_type, args.source_id);
      const src = await agentImageToDataUrl(srcRaw);
      const decoded = parseImageDataUrl(src);
      if (!decoded) throw new Error('The source image could not be decoded — it may be a remote URL or an unsupported format.');
      const base = imgCfg.baseUrl;
      const model = imgCfg.editModel;
      const ext = decoded.mime === 'image/jpeg' ? 'jpeg' : decoded.mime === 'image/webp' ? 'webp' : 'png';
      const mp = multipartBody({
        fields: { prompt: String(args.prompt).slice(0, 4000), model, n: '1', ...(args.size ? { size: args.size } : {}) },
        file: { name: 'image', filename: `source.${ext}`, mime: decoded.mime, buffer: decoded.buffer },
      });
      const r = await fetchJson(base + '/images/edits', {
        method: 'POST',
        headers: { ...(imgCfg.apiKey ? { authorization: 'Bearer ' + imgCfg.apiKey } : {}), 'content-type': mp.contentType },
        body: mp.body,
      }, 180000);
      const image = extractProviderImage(r);
      if (!image) throw new Error('Provider returned no image');
      const embedded = await agentImageToDataUrl(image);
      if (embedded) agentLastImage = embedded;
      const applied = agentApplyImage(embedded || image, args);
      return { image: embedded || image, model, ...(applied ? { applied_to: applied } : {}) };
    }

    case 'apply_image': {
      agentNeed(args, ['character_id', 'target'], name);
      const srcRaw = agentResolveImage(args.source_type, args.source_id);
      const image = await agentImageToDataUrl(srcRaw) || srcRaw;
      const applied = agentApplyImage(image, args);
      return { image, applied_to: applied };
    }

    default:
      throw new Error('Unknown tool: ' + name);
  }
}

/* ---- Provider adapters (non-streaming, with tool support) ----------------- */

function agentParseArgs(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return { _raw: String(raw) }; }
}

/* Provider adapters for the Agent. Every adapter streams the final text live
   (deltas are forwarded to the client as {type:'delta'} SSE events) while
   still returning the complete structured result for the tool loop. When a
   provider cannot stream (or streams nothing usable), the plain non-streaming
   call — same prompts — runs instead, so behavior degrades gracefully. */

function agentReqLog(cfg, url, out) {
  let imgCount = 0;
  for (const m of out.messages || []) {
    if (Array.isArray(m.content)) {
      for (const p of m.content) {
        if (p.type === 'image_url' || p.type === 'image') imgCount++;
      }
    }
  }
  tlog('agent', `→ ${out.stream ? 'SSE ' : ''}${url}`, `model=${cfg.model || '(empty)'}`, `msgs=${(out.messages || []).length}`,
    imgCount ? `images=${imgCount}` : '',
    out.tools ? `tools=${out.tools.length}` : 'no-tools', `temp=${out.temperature ?? '—'}`,
    `sys=${(out.system !== undefined ? String(out.system) : out.messages?.[0]?.content || '').length}ch`);
}

function agentProviderError(status, body, providerLabel) {
  tlog('agent', `✗ ${providerLabel} HTTP ${status} — body: ${truncArg(body, 300)}`);
  const err = (typeof body === 'object' && body && body.error && (body.error.message || body.error)) || body;
  const msg = typeof err === 'string' ? err : JSON.stringify(err);
  return new Error(`${providerLabel}${status ? ' ' + status : ''}: ${msg || 'Provider error'}`);
}

async function agentCallOpenAI(cfg, system, messages, tools, signal, onDelta) {
  const base = agentNormBase(cfg.baseUrl);
  const headers = { 'content-type': 'application/json', ...(cfg.apiKey ? { authorization: 'Bearer ' + cfg.apiKey } : {}) };
  const out = { model: cfg.model, messages: [{ role: 'system', content: system }, ...messages], tools, tool_choice: 'auto', stream: true };
  if (typeof cfg.temperature === 'number') out.temperature = cfg.temperature;
  if (cfg.reasoning === 'off') {
    if (cfg.provider === 'openrouter') out.reasoning = { enabled: false };
    else out.reasoning_effort = 'none';
  } else if (cfg.reasoning && cfg.reasoning !== 'default') {
    if (cfg.provider === 'openrouter') out.reasoning = { effort: cfg.reasoning };
    else out.reasoning_effort = cfg.reasoning;
  }
  agentReqLog(cfg, base + '/chat/completions', out);

  let text = '';
  let fin = '';
  let sseError = null;
  const parts = new Map(); // tool_call index -> { id, name, argsText }
  const r = await postAgentSSE(base + '/chat/completions', headers, out, signal, 180000, (json) => {
    if (!json || typeof json !== 'object') return;
    if (json.error) { sseError = json.error; return; }
    const ch = json.choices && json.choices[0] || {};
    const d = ch.delta || {};
    if (typeof d.content === 'string' && d.content) {
      text += d.content;
      if (onDelta) onDelta(d.content);
    }
    for (const t of d.tool_calls || []) {
      const idx = t.index ?? 0;
      const p = parts.get(idx) || { id: '', name: '', argsText: '' };
      if (t.id) p.id = t.id;
      if (t.function && t.function.name) p.name += t.function.name;
      if (t.function && typeof t.function.arguments === 'string') p.argsText += t.function.arguments;
      parts.set(idx, p);
    }
    if (ch.finish_reason) fin = ch.finish_reason;
  });
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.sse) {
    /* Provider errored before streaming, or answered non-streamed JSON. */
    if (r.status === 200 && r.json && r.json.choices) return agentShapeOpenAIDone(r.json, cfg);
    throw agentProviderError(r.status, r.json || r.text, 'AI provider');
  }
  if (sseError) throw agentProviderError(200, { error: sseError }, 'AI provider');
  const calls = [...parts.values()].map((p, i) => ({
    id: p.id || ('call_' + Date.now().toString(36) + '_' + i),
    name: p.name,
    args: agentParseArgs(p.argsText),
  })).filter((c) => c.name);
  text = String(text || '').trim();
  if (!text && !calls.length) {
    /* Empty stream (reasoning-only models, silent providers): the plain call
       knows the array-content and reasoning-only response shapes. */
    tlog('agent', `↻ streamed nothing this turn (finish_reason: ${fin || '?'}) — retrying non-streaming`);
    return agentCallOpenAIPlain(cfg, system, messages, tools, signal);
  }
  tlog('agent', `← SSE turn — text ${text.length}ch${calls.length ? `, tool calls: ${calls.map((c) => c.name).join(', ')}` : `, finish ${fin || 'stop'}`}`);
  return { text, toolCalls: calls, finishReason: fin };
}

/* Parse a completed (non-streamed) OpenAI response, including the reasoning /
   array-content shapes. Throws a descriptive error on truly empty turns. */
function agentShapeOpenAIDone(json, cfg) {
  const m0 = (json.choices && json.choices[0] && json.choices[0].message) || {};
  const fin = (json.choices && json.choices[0] && json.choices[0].finish_reason) || '';
  const calls = (m0.tool_calls || []).map((tc, i) => ({
    id: tc.id || ('call_' + Date.now().toString(36) + '_' + i),
    name: tc.function && tc.function.name,
    args: agentParseArgs(tc.function && tc.function.arguments),
  })).filter((c) => c.name);
  let text = m0.content ?? '';
  /* Some providers return content as an array of typed blocks instead of a
     plain string (Gemini-style / OpenRouter routing quirks). */
  if (Array.isArray(text)) text = text.map((b) => typeof b === 'string' ? b : (b && (b.text || b.content)) || '').join('');
  text = String(text || '').trim();
  /* Reasoning models (DeepSeek-R1 style `reasoning_content`, OpenRouter
     `reasoning`) can spend a whole turn in reasoning and leave content empty
     on non-tool turns — that is still the model's answer, so use it. */
  if (!text && !calls.length) text = agentReasoningText(m0);
  if (!text && !calls.length) {
    throw new Error(`The model (${cfg.model || 'unknown'}) returned no text this turn` +
      (fin ? ` (finish_reason: ${fin})` : '') +
      '. It may be incompatible with tool calling for the Agent — pick another Agent model in Settings → AI Connection, or clear the Agent log.');
  }
  return { text, toolCalls: calls, finishReason: fin };
}

async function agentCallOpenAIPlain(cfg, system, messages, tools, signal) {
  const base = agentNormBase(cfg.baseUrl);
  const headers = { 'content-type': 'application/json', ...(cfg.apiKey ? { authorization: 'Bearer ' + cfg.apiKey } : {}) };
  const out = { model: cfg.model, messages: [{ role: 'system', content: system }, ...messages], tools, tool_choice: 'auto' };
  if (typeof cfg.temperature === 'number') out.temperature = cfg.temperature;
  if (cfg.reasoning === 'off') {
    if (cfg.provider === 'openrouter') out.reasoning = { enabled: false };
    else out.reasoning_effort = 'none';
  } else if (cfg.reasoning && cfg.reasoning !== 'default') {
    if (cfg.provider === 'openrouter') out.reasoning = { effort: cfg.reasoning };
    else out.reasoning_effort = cfg.reasoning;
  }
  agentReqLog(cfg, base + '/chat/completions', out);
  const r = await postAgentJson(base + '/chat/completions', headers, out, signal, 180000);
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.json) throw agentProviderError(r.status, r.json || r.text, 'AI provider');
  return agentShapeOpenAIDone(r.json, cfg);
}

/* Collect reasoning-only output across the field names providers actually use. */
function agentReasoningText(m0) {
  const parts = [];
  const push = (v) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(push);
    else if (typeof v === 'string') parts.push(v);
    else if (typeof v === 'object') parts.push(typeof v.text === 'string' ? v.text : (typeof v.content === 'string' ? v.content : ''));
  };
  push(m0.reasoning_content);
  push(m0.reasoning);
  return parts.map((s) => s.trim()).filter(Boolean).join('\n').trim();
}

async function agentCallAnthropic(cfg, system, messages, tools, signal, onDelta) {
  const base = cfg.baseUrl.replace(/\/+$/, '');
  const headers = { 'content-type': 'application/json', 'x-api-key': cfg.apiKey || '', 'anthropic-version': '2023-06-01' };
  const body = {
    model: cfg.model,
    system,
    messages,
    tools: tools.map((t) => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters })),
    max_tokens: 4096,
    stream: true,
  };
  if (cfg.reasoning === 'off') {
    body.thinking = { type: 'disabled' };
  } else if (cfg.reasoning && cfg.reasoning !== 'default') {
    const budgets = { low: 2048, medium: 8192, high: 16384 };
    const budget = budgets[cfg.reasoning] || 2048;
    body.thinking = { type: 'enabled', budget_tokens: budget };
    body.max_tokens = Math.max(body.max_tokens || 4096, budget + 2048);
    body.temperature = 1;
  }
  agentReqLog(cfg, base + '/messages', { ...body, system, messages });

  let fin = '';
  let sseError = null;
  const blocks = new Map(); // index -> { type, id, name, text, argsText, thinking }
  const r = await postAgentSSE(base + '/messages', headers, body, signal, 180000, (json) => {
    if (!json || typeof json.type !== 'string') return;
    if (json.type === 'error') { sseError = json.error; return; }
    if (json.type === 'content_block_start') {
      const cb = json.content_block || {};
      blocks.set(json.index, { type: cb.type, id: cb.id || '', name: cb.name || '', text: '', argsText: '', thinking: '' });
    } else if (json.type === 'content_block_delta') {
      const b = blocks.get(json.index);
      if (!b) return;
      const d = json.delta || {};
      if (d.type === 'text_delta' && d.text) {
        b.text += d.text;
        if (onDelta) onDelta(d.text);
      } else if (d.type === 'input_json_delta' && typeof d.partial_json === 'string') b.argsText += d.partial_json;
      else if (d.type === 'thinking_delta' && typeof d.thinking === 'string') b.thinking += d.thinking;
    } else if (json.type === 'message_delta' && json.delta && json.delta.stop_reason) fin = json.delta.stop_reason;
  });
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.sse) {
    if (r.status === 200 && r.json) return agentShapeAnthropicDone(r.json, cfg);
    throw agentProviderError(r.status, r.json || r.text, 'AI provider');
  }
  if (sseError) throw agentProviderError(200, sseError, 'AI provider');
  const list = [...blocks.values()];
  const calls = list.filter((b) => b.type === 'tool_use').map((b, i) => ({
    id: b.id || ('call_' + Date.now().toString(36) + '_' + i),
    name: b.name,
    args: agentParseArgs(b.argsText),
  }));
  let text = list.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  if (!text && !calls.length) text = list.filter((b) => b.type === 'thinking').map((b) => b.thinking).join('\n').trim();
  if (!text && !calls.length) {
    tlog('agent', `↻ streamed nothing this turn (stop_reason: ${fin || '?'}) — retrying non-streaming`);
    return agentCallAnthropicPlain(cfg, system, messages, tools, signal);
  }
  tlog('agent', `← SSE turn — text ${text.length}ch${calls.length ? `, tool calls: ${calls.map((c) => c.name).join(', ')}` : `, stop ${fin || 'end_turn'}`}`);
  return { text, toolCalls: calls, finishReason: fin };
}

/* Shape a completed (non-streamed) Anthropic response. */
function agentShapeAnthropicDone(json, cfg) {
  const blocks = json.content || [];
  const calls = blocks.filter((b) => b.type === 'tool_use').map((b) => ({ id: b.id, name: b.name, args: b.input || {} }));
  let text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  /* Extended-thinking turns can end with only thinking blocks and no text. */
  if (!text && !calls.length) text = blocks.filter((b) => b.type === 'thinking').map((b) => b.thinking || '').join('\n').trim();
  if (!text && !calls.length) {
    throw new Error(`The model (${cfg.model || 'unknown'}) returned no text this turn. It may be incompatible with tool calling for the Agent — pick another Agent model in Settings → AI Connection, or clear the Agent log.`);
  }
  return { text, toolCalls: calls, finishReason: '' };
}

async function agentCallAnthropicPlain(cfg, system, messages, tools, signal) {
  const base = cfg.baseUrl.replace(/\/+$/, '');
  const headers = { 'content-type': 'application/json', 'x-api-key': cfg.apiKey || '', 'anthropic-version': '2023-06-01' };
  const body = {
    model: cfg.model,
    system,
    messages,
    tools: tools.map((t) => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters })),
    max_tokens: 4096,
  };
  if (cfg.reasoning === 'off') {
    body.thinking = { type: 'disabled' };
  } else if (cfg.reasoning && cfg.reasoning !== 'default') {
    const budgets = { low: 2048, medium: 8192, high: 16384 };
    const budget = budgets[cfg.reasoning] || 2048;
    body.thinking = { type: 'enabled', budget_tokens: budget };
    body.max_tokens = Math.max(body.max_tokens || 4096, budget + 2048);
    body.temperature = 1;
  }
  agentReqLog(cfg, base + '/messages', { ...body, system, messages });
  const r = await postAgentJson(base + '/messages', headers, body, signal, 180000);
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.json) throw agentProviderError(r.status, r.json || r.text, 'AI provider');
  return agentShapeAnthropicDone(r.json, cfg);
}

/* ---- History mapping ------------------------------------------------------ */

function extractAttachments(text, allowedIds) {
  if (!text || typeof text !== 'string') return [];
  const matches = [...text.matchAll(/\[attached image:\s*(att-[\w-]+)/gi)];
  if (!matches.length) return [];
  const seen = new Set();
  const atts = [];
  for (const m of matches) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    if (allowedIds && !allowedIds.has(id)) continue;
    try {
      const a = db.getAgentAttachment(id);
      if (a && a.dataUrl) atts.push(a);
    } catch { /* DB read safety */ }
  }
  return atts;
}

function getRecentActiveAttachmentIds(rows, limit = 8) {
  const allAttIds = [];
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].role === 'user') {
      const matches = [...(rows[i].content || '').matchAll(/\[attached image:\s*(att-[\w-]+)/gi)];
      for (const m of matches) {
        if (!allAttIds.includes(m[1])) allAttIds.push(m[1]);
      }
    }
  }
  return new Set(allAttIds.slice(0, limit));
}

function mapAgentHistoryOpenAI(rows) {
  const activeAtts = getRecentActiveAttachmentIds(rows, 8);
  const out = [];
  for (const r of rows) {
    if (r.role === 'user') {
      const text = r.content || '';
      const atts = extractAttachments(text, activeAtts);
      if (atts.length) {
        const content = [{ type: 'text', text }];
        for (const a of atts) {
          content.push({
            type: 'image_url',
            image_url: { url: a.dataUrl },
          });
        }
        out.push({ role: 'user', content });
      } else {
        out.push({ role: 'user', content: text });
      }
    } else if (r.role === 'assistant') {
      if (r.toolCalls && r.toolCalls.length) {
        out.push({
          role: 'assistant',
          content: r.content || null,
          tool_calls: r.toolCalls.map((c) => ({
            id: c.id,
            type: 'function',
            function: { name: c.name, arguments: JSON.stringify(c.args || {}) },
          })),
        });
      } else if (r.content) {
        out.push({ role: 'assistant', content: r.content });
      }
    } else if (r.role === 'tool') {
      out.push({ role: 'tool', tool_call_id: r.callId || ('call_' + r.id), content: agentToolResultText(r) });
    }
  }
  return out;
}

function mapAgentHistoryAnthropic(rows) {
  const activeAtts = getRecentActiveAttachmentIds(rows, 8);
  const msgs = [];
  let pending = [];
  const flush = () => {
    if (pending.length) { msgs.push({ role: 'user', content: pending }); pending = []; }
  };
  for (const r of rows) {
    if (r.role === 'user') {
      flush();
      const text = r.content || '';
      const atts = extractAttachments(text, activeAtts);
      if (atts.length) {
        const content = [{ type: 'text', text }];
        for (const a of atts) {
          const m = a.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (m) {
            let media_type = m[1].toLowerCase();
            if (media_type === 'image/jpg') media_type = 'image/jpeg';
            if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(media_type)) {
              content.push({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type,
                  data: m[2],
                },
              });
            }
          }
        }
        msgs.push({ role: 'user', content });
      } else {
        msgs.push({ role: 'user', content: text });
      }
    } else if (r.role === 'assistant') {
      flush();
      const content = [];
      if (r.content) content.push({ type: 'text', text: r.content });
      if (r.toolCalls && r.toolCalls.length) {
        for (const c of r.toolCalls) content.push({ type: 'tool_use', id: c.id, name: c.name, input: c.args || {} });
      }
      if (content.length) msgs.push({ role: 'assistant', content });
    } else if (r.role === 'tool') {
      pending.push({ type: 'tool_result', tool_use_id: r.callId || ('call_' + r.id), content: agentToolResultText(r), is_error: !!r.toolError });
    }
  }
  flush();
  return msgs;
}

/* ---- System prompt --------------------------------------------------------- */

function buildAgentSystem(settings, activeChatId) {
  const cfg = resolveAiConfig(settings);
  const aCfg = resolveAgentConfig(settings);
  const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
  const presets = db.getPresets();
  const activePreset = settings.activePresetId ? presets.find((p) => p.id === settings.activePresetId) : null;
  const chars = db.getCharacters();
  const scenes = db.getScenarios();

  const ctx = ['## Current site state (live snapshot)'];
  ctx.push(`- The user plays as: ${persona ? `"${persona.name}" — ${agentTrim(persona.description, 300)}` : 'no persona set (they play an unnamed "user")'}`);
  if (activeChatId) {
    const ac = db.getChat(activeChatId);
    if (ac) {
      const acChar = db.getCharacter(ac.characterId);
      ctx.push(`- Chat the user currently has OPEN in the UI: "${ac.title}" (id: ${ac.id}) — character "${acChar ? acChar.name : '?'}"${ac.scenarioTitle ? `, scenario "${ac.scenarioTitle}"` : ', no scenario'}. read_chat with no chat_id reads this one.`);
    }
  } else {
    ctx.push('- No chat is currently open in the UI (welcome screen). read_chat needs an explicit chat_id.');
  }

  if (activePreset) {
    ctx.push(`- Active Roleplay Preset (CURRENT USER WRITING STYLE & FORMATTING RULES):`);
    ctx.push(`  Name: "${activePreset.name}" | Provider: ${cfg.provider} | Model: ${cfg.model || 'unset'} | Temperature: ${activePreset.temperature ?? 'default'}`);
    const activePrompt = (activePreset.systemPrompt || '').trim();
    if (activePrompt) {
      ctx.push(`  System Prompt / Writing Guidelines:\n  """\n  ${agentTrim(activePrompt, 3500)}\n  """`);
    } else {
      ctx.push(`  System Prompt: (Default: Write "{{char}}\'s" next reply in a fictional roleplay chat between "{{user}}" and "{{char}}".)`);
    }
  } else {
    ctx.push('- Active Roleplay Preset: None selected (roleplay uses default connection and prompt)');
  }

  const otherPresets = presets.filter((p) => !activePreset || p.id !== activePreset.id);
  if (otherPresets.length) {
    ctx.push(`- Other Roleplay Presets in Library (${otherPresets.length} available):`);
    for (const p of otherPresets) {
      const sp = (p.systemPrompt || '').trim();
      const promptPreview = sp ? ` | style prompt: "${agentTrim(sp, 350)}"` : '';
      ctx.push(`  - Preset "${p.name}" (id: ${p.id}) [${p.provider}/${p.model || 'unset'}]${promptPreview}`);
    }
  } else if (!activePreset) {
    ctx.push('- Presets Library: None created yet');
  }

  if (settings.agentOverride) {
    ctx.push(`- You (the Agent) run on a separate connection: ${aCfg.provider} / ${aCfg.model || 'unset'}`);
  }
  ctx.push(`- Characters (${chars.length}):`);
  for (const c of chars) {
    const brief = agentCharBrief(c);
    ctx.push(`  - ${brief.id} | ${brief.name} ${brief.emoji} | signature scenario: ${brief.signature_scenario ? 'yes' : 'none'} | vars: ${brief.variable_keys.join(', ') || '—'} | ${brief.open_chats} open chat(s)`);
  }
  ctx.push(`- Scenarios (${scenes.length}):`);
  for (const s of scenes) {
    const brief = agentScenarioBrief(s);
    const cvk = Object.keys(s.characterVariables || {});
    ctx.push(`  - ${brief.id} | ${brief.title} | vars required: ${brief.required_vars.join(', ') || '—'} | values configured for: ${cvk.join(', ') || '—'}`);
  }

  return [AGENT_IDENTITY, ctx.join('\n'), AGENT_ENTITY_GUIDE, AGENT_WORKFLOW, AGENT_RULES].join('\n\n');
}

/* ---- The agent loop -------------------------------------------------------- */

async function runAgentChat(body, emit, ctrl) {
  const turnT0 = Date.now();
  const settings = db.getSettings();
  const cfg = resolveAgentConfig(settings);
  /* The chat the user currently has open in the UI (client sends its id each
     turn). Lets read_chat default to it and lets the system prompt tell the
     agent which conversation the user is looking at right now. */
  const activeChatId = body && body.activeChatId && db.getChat(String(body.activeChatId)) ? String(body.activeChatId) : null;
  cfg.activeChatId = activeChatId;
  if (!cfg.apiKey && cfg.provider !== 'ollama') {
    throw new Error(settings.agentOverride
      ? 'No AI connection configured for the Agent. Open Settings → AI Connection → Agent connection and connect a provider first.'
      : 'No AI connection configured for the Agent. Open Settings → AI Connection (or pick an AI preset in the header) and connect a provider first.');
  }

  let userText = '';
  let userMsgId = 0;
  if (body && body.regenerateMessageId) {
    const prep = db.prepareRegenerateAgentTurn(body.regenerateMessageId);
    userText = prep.userMessage.content;
    userMsgId = prep.userMessage.id;
    db.setCurrentAgentTurnMsgId(userMsgId);
    tlog('agent', `▼ regenerate turn — user prompt ${userText.length}ch: "${truncTitle(userText, 90)}" | ${cfg.provider}/${cfg.model || 'unset'}`);
  } else {
    const attIds = Array.isArray(body.attachments) ? body.attachments.map(String).slice(0, 6) : [];
    let text = String((body && body.message) || '').trim();
    if (!text && !attIds.length) throw new Error('Message is empty');
    if (!text && attIds.length) text = 'Please take a look at the attached image(s).';

    // Images the user attached in the drawer arrive as attachment ids. They are
    // never put into the model context as bytes — just as markers the model can
    // reference in apply_image / edit_image via their ids.
    const markers = [];
    for (const id of attIds) {
      const a = db.getAgentAttachment(id);
      if (a) markers.push(`[attached image: ${a.id} — ${a.name}]`);
    }
    userText = text + (markers.length ? (text ? '\n\n' : '') + markers.join('\n') : '');

    tlog('agent', `▼ turn — user ${text.length}ch: "${truncTitle(userText, 90)}" | ${cfg.provider}/${cfg.model || 'unset'}` +
      ` | ${settings.agentOverride ? 'own agent connection' : 'follows active preset'} | ${attIds.length} image(s) attached`);

    const userRow = db.addAgentMessage({ role: 'user', content: userText });
    userMsgId = userRow.id;
    db.setCurrentAgentTurnMsgId(userMsgId);
    db.createAgentTurnCheckpoint(userMsgId);
  }

  activeAgentGen = {
    active: true,
    done: false,
    text: '',
    error: null,
    startedAt: Date.now(),
  };

  const rows = db.getAgentMessages().slice(-AGENT_HISTORY_LIMIT);
  while (rows.length && rows[0].role === 'tool') rows.shift(); // avoid orphan tool results after history trim
  tlog('agent', `history: ${rows.length} rows replayed (limit ${AGENT_HISTORY_LIMIT})`);

  const system = buildAgentSystem(settings, activeChatId);
  const tools = agentToolDefs(cfg);
  tlog('agent', `system prompt ${system.length}ch, ${tools.length} tools${tools.length ? ' (' + tools.map((t) => t.function.name).join(', ') + ')' : ''}`);

  /* Text deltas stream straight through to the drawer as they arrive. */
  const onDelta = (t) => {
    if (activeAgentGen) activeAgentGen.text += t;
    emit({ type: 'delta', text: t });
  };
  let toolRuns = 0;
  /* Data URL -> attachment id for images this turn already saved (dedupe). */
  const turnImageIds = new Map();

  try {
    for (let iter = 0; iter < AGENT_MAX_ITERATIONS; iter++) {
      emit({ type: 'status', status: 'thinking' });
      const llmT0 = Date.now();
      tlog('agent', `── LLM call #${iter + 1}/${AGENT_MAX_ITERATIONS}`);
      let resp;
      if (cfg.provider === 'anthropic') {
        resp = await agentCallAnthropic(cfg, system, mapAgentHistoryAnthropic(rows), tools, ctrl.signal, onDelta);
      } else {
        resp = await agentCallOpenAI(cfg, system, mapAgentHistoryOpenAI(rows), tools, ctrl.signal, onDelta);
      }
      tlog('agent', `── LLM call #${iter + 1} answered in ${Date.now() - llmT0}ms — ` +
        `${resp.text ? resp.text.length + 'ch of text' : 'no text'}${resp.finishReason ? `, finish=${resp.finishReason}` : ''}`);

      if (resp.toolCalls && resp.toolCalls.length) {
        const arow = db.addAgentMessage({ role: 'assistant', content: resp.text || '', toolCalls: resp.toolCalls });
        rows.push(arow);
        for (const call of resp.toolCalls) {
          emit({ type: 'tool_call', id: call.id, name: call.name, args: call.args || {} });
          const toolT0 = Date.now();
          tlog('agent', `🔧 tool ${toolRuns + 1}: ${call.name}(${truncArg(call.args)})`);
          let ok = true;
          let result = null;
          let error = null;
          try {
            result = await runAgentTool(call.name, call.args || {}, settings, cfg);
          } catch (e) {
            ok = false;
            error = String(e.message || e);
            result = { error };
          }
          toolRuns++;
          /* Save any produced image as a persistent attachment (id-referenced)
             before the sanitized copy is stored — see agentPersistResultImages. */
          result = await agentPersistResultImages(result, call.name, userMsgId, turnImageIds);
          tlog('agent', `🔧 tool ${call.name} ${ok ? '✓ ok' : '✗ FAILED'} in ${Date.now() - toolT0}ms` +
            (ok ? ` — result ${JSON.stringify(sanitizeForModel(result)).length}B` : ` — error: ${error}`));
          const trow = db.addAgentMessage({
            role: 'tool',
            callId: call.id,
            toolName: call.name,
            toolArgs: call.args || {},
            toolResult: capToolResultJson(sanitizeForModel(result), AGENT_TOOL_RESULT_CAP),
            toolError: !ok,
          });
          rows.push(trow);
          emit({ type: 'tool_result', id: call.id, name: call.name, ok, error, result });
        }
        continue;
      }

      /* agentCallOpenAI/agentCallAnthropic guarantee either tool calls or
         non-empty text (empty responses raise a descriptive error instead). */
      const finalText = resp.text;
      db.addAgentMessage({ role: 'assistant', content: finalText });
      if (activeAgentGen) {
        activeAgentGen.active = false;
        activeAgentGen.done = true;
        activeAgentGen.text = finalText;
        setTimeout(() => { if (activeAgentGen && activeAgentGen.text === finalText) activeAgentGen = null; }, 120000);
      }
      emit({ type: 'done', text: finalText });
      tlog('agent', `▲ turn complete in ${Date.now() - turnT0}ms — ${toolRuns} tool run(s), reply ${finalText.length}ch`);
      return;
    }

    const fallback = 'I ran several tool steps and paused to avoid looping. Tell me to continue if I should keep going.';
    db.addAgentMessage({ role: 'assistant', content: fallback });
    if (activeAgentGen) {
      activeAgentGen.active = false;
      activeAgentGen.done = true;
      activeAgentGen.text = fallback;
      setTimeout(() => { if (activeAgentGen && activeAgentGen.text === fallback) activeAgentGen = null; }, 120000);
    }
    emit({ type: 'done', text: fallback });
    tlog('agent', `⚠ turn exhausted ${AGENT_MAX_ITERATIONS} iterations in ${Date.now() - turnT0}ms — ${toolRuns} tool run(s); replied with a continue-note`);
  } catch (err) {
    if (activeAgentGen) {
      activeAgentGen.active = false;
      activeAgentGen.done = true;
      activeAgentGen.error = err.message;
      setTimeout(() => { if (activeAgentGen && activeAgentGen.error === err.message) activeAgentGen = null; }, 120000);
    }
    throw err;
  }
}

async function route(req, res, u) {
  const p = u.pathname;
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
  let m;

  if (req.method === 'GET' && p === '/api/agent/messages') return send(res, 200, { messages: db.getAgentMessages(), activeFirst: db.agentMessageCount() === 0 });
  if (req.method === 'GET' && p === '/api/agent/changes') return send(res, 200, { changes: db.getAgentChanges() });
  if (req.method === 'POST' && p === '/api/agent/revert') {
    try {
      const resu = db.revertAgentCheckpoint();
      return send(res, 200, resu);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if (req.method === 'POST' && p === '/api/agent/clear') return send(res, 200, db.clearAgentMessages());
  if (req.method === 'POST' && p === '/api/agent/attach') {
    try {
      const a = db.addAgentAttachment({ name: body.name, dataUrl: body.dataUrl ?? body.image });
      return send(res, 200, a);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/agent\/([\w-]+)\/file$/)) && req.method === 'GET') {
    const a = db.getAgentAttachment(m[1]);
    if (!a) return send(res, 404, { error: 'Attachment not found' });
    const dec = parseImageDataUrl(a.dataUrl);
    if (!dec) return send(res, 404, { error: 'Attachment unreadable' });
    res.writeHead(200, { 'Content-Type': dec.mime, 'Cache-Control': 'private, max-age=86400' });
    return res.end(dec.buffer);
  }
  if (req.method === 'GET' && p === '/api/agent/generation') {
    if (!activeAgentGen) return send(res, 200, { active: false, done: false, messages: db.getAgentMessages() });
    return send(res, 200, {
      active: activeAgentGen.active,
      done: activeAgentGen.done,
      text: activeAgentGen.text,
      error: activeAgentGen.error,
      messages: activeAgentGen.done ? db.getAgentMessages() : null,
    });
  }
  if ((m = p.match(/^\/api\/agent\/messages\/(\d+)$/)) && req.method === 'DELETE') {
    try {
      const resu = db.deleteAgentTurn(Number(m[1]));
      return send(res, 200, { ok: true, rolledBack: resu.rolledBack, changes: db.getAgentChanges(), messages: db.getAgentMessages() });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/agent\/messages\/(\d+)\/regenerate$/)) && req.method === 'POST') {
    body.regenerateMessageId = Number(m[1]);
    return startEventStream(res, (emit, ctrl) => runAgentChat(body, emit, ctrl), 'agent-regen');
  }
function parseOpeningGeneration(text, characters) {
  let scenario = '';
  const messages = [];

  // 1. Try JSON extraction first
  let json = null;
  try {
    let clean = (text || '').trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }
    const s = clean.indexOf('{');
    const e = clean.lastIndexOf('}');
    if (s !== -1 && e > s) {
      json = JSON.parse(clean.slice(s, e + 1));
    }
  } catch {}

  if (json && typeof json === 'object') {
    if (typeof json.scenario === 'string') scenario = json.scenario.trim();
    else if (typeof json.scene === 'string') scenario = json.scene.trim();

    const rawMsgs = Array.isArray(json.messages)
      ? json.messages
      : (Array.isArray(json.characters) ? json.characters : []);

    for (const item of rawMsgs) {
      if (!item) continue;
      const content = String(item.content || item.message || item.text || item.dialogue || '').trim();
      if (!content) continue;
      const name = String(item.name || item.character || item.characterName || '').trim();
      const matched = characters.find((c) =>
        c.id === item.characterId ||
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(c.name.toLowerCase())
      );
      messages.push({
        characterId: matched ? matched.id : characters[0].id,
        characterName: matched ? matched.name : (name || characters[0].name),
        content,
      });
    }
  }

  // 1b. Models often emit JSON whose string values contain unescaped quotes,
  // which JSON.parse rejects. Recover the fields from their structure instead.
  const looksJson = /"(?:scenario|messages)"\s*:/.test(text || '');
  if (!messages.length && looksJson) {
    const unescapeLoose = (s) => s.replace(/\\"/g, '"').replace(/\\n/g, '\n');
    if (!scenario) {
      const sm = (text || '').match(/"scenario"\s*:\s*"([\s\S]*?)"\s*(?=,\s*"(?:messages|characters)"|\s*\})/);
      if (sm) scenario = unescapeLoose(sm[1]).trim();
    }
    const itemRe = /\{\s*"(?:name|character|characterName)"\s*:\s*"([^"\n]+)"\s*,\s*"(?:content|message|text|dialogue)"\s*:\s*"([\s\S]*?)"\s*\}/g;
    for (const m of (text || '').matchAll(itemRe)) {
      const content = unescapeLoose(m[2]).trim();
      if (!content) continue;
      const name = m[1].trim();
      const matched = characters.find((c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(c.name.toLowerCase())
      );
      messages.push({
        characterId: matched ? matched.id : characters[0].id,
        characterName: matched ? matched.name : name,
        content,
      });
    }
  }

  // 2. Fallback: parse lines with character names if no messages found
  if (!messages.length && !looksJson) {
    const lines = (text || '').split('\n');
    const scenLines = [];
    let currentMsg = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let matchedChar = null;
      let dialogueRest = '';
      for (const c of characters) {
        const patterns = [
          new RegExp(`^<${c.name}>\\s*[:\\-]?\\s*(.*)$`, 'i'),
          new RegExp(`^\\*\\*${c.name}\\*\\*\\s*[:\\-]?\\s*(.*)$`, 'i'),
          new RegExp(`^\\*${c.name}\\*\\s*[:\\-]?\\s*(.*)$`, 'i'),
          new RegExp(`^${c.name}\\s*[:\\-]\\s*(.*)$`, 'i'),
        ];
        for (const pat of patterns) {
          const m = line.match(pat);
          if (m) {
            matchedChar = c;
            dialogueRest = m[1].trim();
            break;
          }
        }
        if (matchedChar) break;
      }

      if (matchedChar) {
        if (currentMsg) messages.push(currentMsg);
        currentMsg = {
          characterId: matchedChar.id,
          characterName: matchedChar.name,
          content: dialogueRest || line,
        };
      } else if (currentMsg) {
        currentMsg.content += '\n' + line;
      } else {
        scenLines.push(line);
      }
    }
    if (currentMsg) messages.push(currentMsg);
    if (!scenario) scenario = scenLines.join('\n\n').trim();
  }

  if (!scenario) {
    scenario = looksJson ? '' : (text || '').trim();
  }
  if (!scenario) {
    scenario = '*The air is charged with anticipation as the scene begins.*';
  }
  if (!/^\*[\s\S]*\*$/.test(scenario)) scenario = `*${scenario.replace(/^\*+|\*+$/g, '')}*`;

  return { scenario, messages };
}

  if (req.method === 'POST' && p === '/api/agent/generate-group-scenario') {
    const charIds = Array.isArray(body.characterIds) ? body.characterIds : [];
    if (charIds.length < 2) return send(res, 400, { error: 'At least 2 characters are required for a group scenario' });
    const chars = charIds.map((id) => db.getCharacter(id)).filter(Boolean);
    if (chars.length < 2) return send(res, 404, { error: 'Characters not found' });

    const settings = db.getSettings();
    const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
    const presets = db.getPresets();
    const activePreset = settings.activePresetId ? presets.find((pr) => pr.id === settings.activePresetId) : null;
    const cfg = resolveAgentConfig(settings);

    const userName = persona ? persona.name : 'the user';
    const charNames = chars.map((c) => c.name).join(' and ');

    const sysPrompt = [
      'You are a creative writer and scenario designer for an AI roleplay application.',
      'Your task is to write a compelling, atmospheric opening scene for a multi-character roleplay conversation.',
      'Requirements:',
      `- Feature ALL participating characters together in the scene with "${userName}": ${chars.map((c) => `"${c.name}"`).join(', ')}.`,
      `- Set the physical space, sensory atmosphere, and what brings everyone together.`,
      `- Provide individual opening responses for the characters present to naturally start the conversation.`,
      `- Write actions/beats in *asterisks* and spoken dialogue in "double quotes".`,
      `- NARRATION PERSON: descriptions address "${userName}" as "you" and each character as "she"/"he"/name (e.g. *She turns to face you*), never *I ...* outside quotes; in dialogue characters speak as "I" and may call "${userName}" by name.`,
      `- Do NOT generate lines or actions for "${userName}".`,
      'OUTPUT FORMAT:',
      'You MUST return a JSON object with this exact schema without markdown backticks or extra commentary:',
      '{',
      '  "scenario": "*A descriptive scene setup paragraph setting the room, location, and atmosphere without dialogue, wrapped in asterisks.*",',
      '  "messages": [',
      chars.map((c) => `    { "name": "${c.name}", "content": "*Brief action/expression* \\"Opening dialogue line\\"" }`).join(',\n'),
      '  ]',
      '}',
      'The output must pass JSON.parse: escape every double quote inside a string value as \\" (or use single quotes inside dialogue).',
    ].join('\n');

    const ex = (s, c = chars[0]) => expandPromptMacros(s, c, persona);
    const userPromptParts = [
      `Generate an immersive opening scene bringing these characters and the user together:`,
      `User Persona (${userName}): ${persona ? ex(persona.description) : 'A participant.'}`,
      `Characters present:`,
      ...chars.map((c) => `- ${c.name}: ${ex(c.description, c) || 'A character.'}`),
    ];
    if (activePreset && activePreset.systemPrompt) {
      userPromptParts.push(`\nActive Roleplay Preset / Style (${activePreset.name}):\n${ex(activePreset.systemPrompt.trim())}`);
    }

    const messages = [{ role: 'user', content: userPromptParts.join('\n\n') }];

    try {
      if (!cfg.apiKey && cfg.provider !== 'ollama') {
        const simScenario = `*The room is quiet as ${charNames} gather near the table, their gazes turning toward ${userName}. A tension lingers in the air, waiting for the first word to break the silence.*`;
        const simMsgs = [
          { characterId: chars[0].id, characterName: chars[0].name, content: `*${chars[0].name} leans forward, amber eyes focused and measured.* "We are all here now. Let us begin."` },
          { characterId: chars[1].id, characterName: chars[1].name, content: `*${chars[1].name} crosses her arms with a faint smirk, observing ${userName}.* "I'm curious to see how this plays out."` },
        ];
        if (chars.length > 2) {
          for (let i = 2; i < chars.length; i++) {
            simMsgs.push({ characterId: chars[i].id, characterName: chars[i].name, content: `*${chars[i].name} stands near the edge of the light, watchful.* "Let's hear what brought us here."` });
          }
        }
        return send(res, 200, { scenario: simScenario, messages: simMsgs });
      }

      let raw = '';
      if (cfg.provider === 'anthropic') {
        const resp = await agentCallAnthropicPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      } else {
        const resp = await agentCallOpenAIPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      }
      const parsed = parseOpeningGeneration(raw, chars);
      return send(res, 200, { scenario: parsed.scenario, messages: parsed.messages });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if (req.method === 'POST' && p === '/api/agent/generate-scenario') {
    const charId = body.characterId;
    if (!charId) return send(res, 400, { error: 'characterId is required' });
    const char = db.getCharacter(charId);
    if (!char) return send(res, 404, { error: 'Character not found' });

    const settings = db.getSettings();
    const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
    const presets = db.getPresets();
    const activePreset = settings.activePresetId ? presets.find((pr) => pr.id === settings.activePresetId) : null;
    const cfg = resolveAgentConfig(settings);

    const userName = persona ? persona.name : 'the user';

    const sysPrompt = [
      'You are a creative writer and scenario designer for an AI roleplay application.',
      'Your task is to write a compelling, atmospheric opening scene for a roleplay conversation.',
      'Requirements:',
      `- Feature "${char.name}" and "${userName}" in an engaging opening setup.`,
      `- Set the physical space, sensory atmosphere, and context of the encounter.`,
      `- Give "${char.name}" an opening action and line of dialogue to greet or confront "${userName}".`,
      `- Write actions/beats in *asterisks* and spoken dialogue in "double quotes".`,
      `- NARRATION PERSON: descriptions address "${userName}" as "you" and each character as "she"/"he"/name (e.g. *She turns to face you*), never *I ...* outside quotes; in dialogue characters speak as "I" and may call "${userName}" by name.`,
      `- Do NOT generate lines or actions for "${userName}".`,
      'OUTPUT FORMAT:',
      'You MUST return a JSON object with this exact schema without markdown backticks or extra commentary:',
      '{',
      '  "scenario": "*A descriptive scene setup paragraph setting the room, location, and atmosphere without dialogue, wrapped in asterisks.*",',
      '  "messages": [',
      `    { "name": "${char.name}", "content": "*Brief action/expression* \\"Opening dialogue line\\"" }`,
      '  ]',
      '}',
      'The output must pass JSON.parse: escape every double quote inside a string value as \\" (or use single quotes inside dialogue).',
    ].join('\n');

    const ex = (s, isSig = false) => expandPromptMacros(s, char, persona, null, isSig);
    const userPromptParts = [
      `Generate an immersive opening scene between "${char.name}" and "${userName}":`,
      `User Persona (${userName}): ${persona ? ex(persona.description) : 'A participant.'}`,
      `Character (${char.name}): ${ex(char.description) || 'A character.'}`,
    ];
    if (char.scenario) {
      userPromptParts.push(`Character background / default context:\n${ex(char.scenario, true)}`);
    }
    if (activePreset && activePreset.systemPrompt) {
      userPromptParts.push(`\nActive Roleplay Preset / Style (${activePreset.name}):\n${ex(activePreset.systemPrompt.trim())}`);
    }

    const messages = [{ role: 'user', content: userPromptParts.join('\n\n') }];

    try {
      if (!cfg.apiKey && cfg.provider !== 'ollama') {
        const simScenario = `*The light filters quietly through the blinds, casting long shadows across the room as ${char.name} looks up, taking in ${userName}'s arrival.*`;
        const simMsgs = [
          { characterId: char.id, characterName: char.name, content: `*${char.name} sets aside what they were holding, eyes meeting yours.* "I was wondering when you would find your way here. Sit down."` },
        ];
        return send(res, 200, { scenario: simScenario, messages: simMsgs });
      }

      let raw = '';
      if (cfg.provider === 'anthropic') {
        const resp = await agentCallAnthropicPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      } else {
        const resp = await agentCallOpenAIPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      }
      const parsed = parseOpeningGeneration(raw, [char]);
      return send(res, 200, { scenario: parsed.scenario, messages: parsed.messages });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if (req.method === 'POST' && p === '/api/agent/assist-scenario') {
    const charIds = Array.isArray(body.characterIds) && body.characterIds.length ? body.characterIds : (body.characterId ? [body.characterId] : []);
    if (!charIds.length) return send(res, 400, { error: 'characterIds or characterId is required' });
    const chars = charIds.map((id) => db.getCharacter(id)).filter(Boolean);
    if (!chars.length) return send(res, 404, { error: 'Characters not found' });

    const settings = db.getSettings();
    const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
    const presets = db.getPresets();
    const activePreset = settings.activePresetId ? presets.find((pr) => pr.id === settings.activePresetId) : null;
    const cfg = resolveAgentConfig(settings);

    const userName = persona ? persona.name : 'the user';
    const idea = typeof body.idea === 'string' ? body.idea.trim() : '';
    const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';
    const currentDraft = body.currentDraft && typeof body.currentDraft === 'object' ? body.currentDraft : null;

    const sysPrompt = [
      'You are a creative writer and scenario designer for an AI roleplay application.',
      'Your task is to collaborate with the user to draft and fine-tune an opening scene for a roleplay conversation.',
      'Format requirements:',
      'You MUST return a valid JSON object with this exact schema without markdown backticks or extra commentary:',
      '{',
      '  "scenario": "*A descriptive scene setup paragraph setting the room, location, and atmosphere without dialogue, wrapped in asterisks.*",',
      '  "messages": [',
      chars.map((c) => `    { "name": "${c.name}", "content": "*Brief action/expression* \\"Opening dialogue line\\"" }`).join(',\n'),
      '  ]',
      '}',
      'The output must pass JSON.parse: escape every double quote inside a string value as \\" (or use single quotes inside dialogue).',
      'Rules:',
      `- Feature ${chars.map((c) => `"${c.name}"`).join(', ')} together with "${userName}".`,
      `- Write actions/beats in *asterisks* and spoken dialogue in "double quotes".`,
      `- NARRATION PERSON: descriptions address "${userName}" as "you" and each character as "she"/"he"/name (e.g. *She turns to face you*), never *I ...* outside quotes; in dialogue characters speak as "I" and may call "${userName}" by name.`,
      `- Do NOT generate lines or actions for "${userName}".`,
    ].join('\n');

    const ex = (s, c = chars[0]) => expandPromptMacros(s, c, persona);
    const userPromptParts = [];
    userPromptParts.push(`User Persona (${userName}): ${persona ? ex(persona.description) : 'A participant.'}`);
    userPromptParts.push(`Characters present:\n` + chars.map((c) => `- ${c.name}: ${ex(c.description, c) || 'A character.'}`).join('\n'));
    if (activePreset && activePreset.systemPrompt) {
      userPromptParts.push(`Active Preset Style (${activePreset.name}):\n${ex(activePreset.systemPrompt.trim())}`);
    }

    if (currentDraft && feedback) {
      userPromptParts.push(`CURRENT OPENING DRAFT TO REFINE:`);
      userPromptParts.push(`Scene Setting (scenario):\n${currentDraft.scenario || ''}`);
      if (Array.isArray(currentDraft.messages) && currentDraft.messages.length) {
        userPromptParts.push(`Opening Messages:\n` + currentDraft.messages.map((m) => `${m.characterName || 'Character'}: ${m.content}`).join('\n'));
      }
      userPromptParts.push(`USER INSTRUCTIONS / CHANGES REQUESTED:\n"${feedback}"\nRewrite and refine the scenario and character opening messages to incorporate these changes.`);
    } else {
      if (idea) {
        userPromptParts.push(`USER'S SCENE IDEA / PREMISE:\n"${idea}"\nDraft an evocative opening scene based on this premise.`);
      } else {
        userPromptParts.push(`INVENT A NEW PREMISE:\nCreate an evocative, engaging, and original opening scene that fits the characters and atmosphere.`);
      }
    }

    const messages = [{ role: 'user', content: userPromptParts.join('\n\n') }];

    try {
      if (!cfg.apiKey && cfg.provider !== 'ollama') {
        let simScenario = '';
        let simMsgs = [];
        if (currentDraft && feedback) {
          simScenario = (currentDraft.scenario || '') + `\n\n*(Adjusted for: ${feedback})*`;
          simMsgs = chars.map((c, idx) => ({
            characterId: c.id,
            characterName: c.name,
            content: `*${c.name} shifts their stance, tone reflecting the new direction.* "Understood. Let's see how this unfolds."`,
          }));
        } else if (idea) {
          simScenario = `*The scene opens around your premise: "${idea}". The environment hums with ambient atmosphere as ${chars.map((c) => c.name).join(' and ')} take their places.*`;
          simMsgs = chars.map((c) => ({
            characterId: c.id,
            characterName: c.name,
            content: `*${c.name} turns toward ${userName}.* "Everything is in place. Are you ready?"`,
          }));
        } else {
          simScenario = `*An unexpected encounter brings ${chars.map((c) => c.name).join(' and ')} together with ${userName} in a dimly lit, atmospheric sanctuary as rain whispers against the glass.*`;
          simMsgs = chars.map((c) => ({
            characterId: c.id,
            characterName: c.name,
            content: `*${c.name} looks up with measured interest.* "You're finally here. We should talk."`,
          }));
        }
        return send(res, 200, { scenario: simScenario, messages: simMsgs });
      }

      let raw = '';
      if (cfg.provider === 'anthropic') {
        const resp = await agentCallAnthropicPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      } else {
        const resp = await agentCallOpenAIPlain(cfg, sysPrompt, messages, [], null);
        raw = resp.text.trim();
      }
      const parsed = parseOpeningGeneration(raw, chars);
      return send(res, 200, { scenario: parsed.scenario, messages: parsed.messages });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if (req.method === 'POST' && p === '/api/agent/chat') {
    return startEventStream(res, (emit, ctrl) => runAgentChat(body, emit, ctrl), 'agent');
  }

  if (req.method === 'GET' && p === '/api/bootstrap') return send(res, 200, db.bootstrap());
  if (req.method === 'GET' && p === '/api/default-prompt') return send(res, 200, { prompt: DEFAULT_PRESET_PROMPT });

  if (req.method === 'GET' && p === '/api/export') {
    const type = u.searchParams.get('type') || 'all';
    const id = u.searchParams.get('id') || null;
    try {
      const data = db.exportData({ type, id });
      return send(res, 200, data);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/characters\/([\w-]+)\/export$/)) && req.method === 'GET') {
    try {
      const data = db.exportData({ type: 'characters', id: m[1] });
      return send(res, 200, data);
    } catch (e) {
      return send(res, 404, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/scenarios\/([\w-]+)\/export$/)) && req.method === 'GET') {
    try {
      const data = db.exportData({ type: 'scenarios', id: m[1] });
      return send(res, 200, data);
    } catch (e) {
      return send(res, 404, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/personalities\/([\w-]+)\/export$/)) && req.method === 'GET') {
    try {
      const data = db.exportData({ type: 'personas', id: m[1] });
      return send(res, 200, data);
    } catch (e) {
      return send(res, 404, { error: e.message });
    }
  }
  if (req.method === 'POST' && p === '/api/import') {
    try {
      const result = db.importData(body);
      return send(res, 200, result);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if (req.method === 'GET' && p === '/api/scenarios') {
    const characterId = u.searchParams.get('characterId');
    return send(res, 200, db.getScenarios({ characterId }));
  }
  if ((m = p.match(/^\/api\/scenarios\/([\w-]+)$/)) && req.method === 'GET') {
    const sc = db.getScenario(m[1]);
    if (!sc) return send(res, 404, { error: 'Scenario not found' });
    return send(res, 200, sc);
  }
  if (req.method === 'POST' && p === '/api/scenarios') {
    const title = (body.title || '').trim();
    const content = (body.content || '').trim();
    if (!title) return send(res, 400, { error: 'Scenario title is required' });
    if (!content) return send(res, 400, { error: 'Scenario prompt/content is required' });
    try {
      const sc = db.createScenario({
        title,
        description: (body.description || '').trim(),
        content,
        specialNotes: body.specialNotes || body.special_notes || '',
        accessMode: 'all',
        characterIds: [],
        characterVariables: body.characterVariables || body.character_variables || {},
      });
      return send(res, 201, sc);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/scenarios\/([\w-]+)$/)) && req.method === 'PUT') {
    try {
      const sc = db.updateScenario(m[1], body);
      if (!sc) return send(res, 404, { error: 'Scenario not found' });
      return send(res, 200, sc);
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/scenarios\/([\w-]+)$/)) && req.method === 'DELETE') {
    return send(res, 200, db.deleteScenario(m[1]));
  }

  if ((m = p.match(/^\/api\/characters\/([\w-]+)$/))) {
    const id = m[1];
    if (req.method === 'GET') {
      const c = db.getCharacter(id);
      if (!c) return send(res, 404, { error: 'Character not found' });
      checkIdleChatTitles().catch(() => {});
      return send(res, 200, c);
    }
    if (req.method === 'PUT') {
      const c = db.updateCharacter(id, body);
      if (!c) return send(res, 404, { error: 'Character not found' });
      return send(res, 200, c);
    }
    if (req.method === 'DELETE') return send(res, 200, db.deleteCharacter(id));
  }
  if (req.method === 'POST' && p === '/api/characters') {
    if (!body.name || !String(body.name).trim()) return send(res, 400, { error: 'Name is required' });
    return send(res, 200, db.createCharacter(body));
  }

  if ((m = p.match(/^\/api\/characters\/([\w-]+)\/poses$/))) {
    const charId = m[1];
    if (req.method === 'GET') {
      if (!db.getCharacter(charId)) return send(res, 404, { error: 'Character not found' });
      return send(res, 200, { poses: db.getPoses(charId, { withImages: true }) });
    }
    if (req.method === 'POST') {
      if (!String(body.name || '').trim()) return send(res, 400, { error: 'Name is required' });
      if (!db.getCharacter(charId)) return send(res, 404, { error: 'Character not found' });
      return send(res, 201, { pose: db.createPose(charId, body) });
    }
  }

  if ((m = p.match(/^\/api\/characters\/([\w-]+)\/poses\/([\w-]+)\/default$/)) && req.method === 'POST') {
    const charId = m[1];
    const poseId = m[2];
    const pose = db.setDefaultPose(charId, poseId);
    if (!pose) return send(res, 404, { error: 'Pose not found' });
    return send(res, 200, { pose });
  }

  if ((m = p.match(/^\/api\/poses\/([\w-]+)$/))) {
    const id = m[1];
    if (req.method === 'PUT') {
      if ('name' in body && !String(body.name || '').trim()) return send(res, 400, { error: 'Pose name is required' });
      const pose = db.updatePose(id, body);
      if (!pose) return send(res, 404, { error: 'Pose not found' });
      return send(res, 200, { pose });
    }
    if (req.method === 'DELETE') {
      if (!db.deletePose(id)) return send(res, 404, { error: 'Pose not found' });
      return send(res, 200, { ok: true });
    }
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/pose$/)) && req.method === 'POST') {
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    if (body.poseId) {
      const pose = typeof body.poseId === 'string' ? db.getPose(body.poseId) : null;
      if (!pose) return send(res, 404, { error: 'Pose not found' });
      if (pose.characterId !== chat.characterId) return send(res, 400, { error: 'Pose belongs to a different character' });
    }
    return send(res, 200, { chat: db.setChatPose(chat.id, body.poseId || null) });
  }

  if (req.method === 'POST' && p === '/api/chats') {
    if (!body.characterId && (!body.characterIds || !body.characterIds.length)) return send(res, 400, { error: 'characterId or characterIds is required' });
    const primaryId = body.characterId || body.characterIds[0];
    try { return send(res, 200, db.createChat(primaryId, body.scenarioId || null, body.initialScenarioContent || null, body.characterIds || null, body.initialMessages || null)); }
    catch (e) { return send(res, 400, { error: e.message }); }
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/compact$/)) && req.method === 'POST') {
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    const settings = db.getSettings();
    const forced = { ...settings, longChatStrategy: 'compact', compactThreshold: 0 };
    try {
      await manageChatContextWindow(chat, db.treeTip(chat.tree), forced);
      return send(res, 200, { chat: db.getChat(chat.id) });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/generate-title$/)) && req.method === 'POST') {
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    try {
      const title = await generateChatTitle(chat.id);
      return send(res, 200, { chat: db.getChat(chat.id), title });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)$/)) && req.method === 'DELETE') {
    return send(res, 200, db.deleteChat(m[1]));
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/generation$/)) && req.method === 'GET') {
    const g = activeChatGens.get(m[1]);
    if (!g) return send(res, 200, { active: false, done: false, chat: db.getChat(m[1]) });
    return send(res, 200, {
      active: g.active,
      done: g.done,
      text: g.text,
      error: g.error,
      chat: g.chat || (g.done ? db.getChat(m[1]) : null),
      node: g.node,
    });
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/messages$/)) && req.method === 'POST') {
    const content = String(body.content || '').trim();
    const role = body.role === 'injection' ? 'injection' : 'user';
    if (!content) return send(res, 400, { error: 'Message is empty' });
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    const char = db.getCharacter(chat.characterId);
    if (!char) return send(res, 404, { error: 'Character not found' });
    let node;
    try { node = db.addNode(chat.id, role, content, body.parentId); }
    catch (e) { return send(res, 400, { error: e.message }); }
    let title = null;
    if (role === 'user' && chat.title === 'New chat') {
      title = truncTitle(content, 40);
      db.renameChat(chat.id, title);
    }
    if (role === 'injection') {
      return send(res, 200, { chat: db.getChat(chat.id), node, title });
    }
    const settings = db.getSettings();
    const persona = settings.activePersonalityId
      ? db.getPersona(settings.activePersonalityId)
      : null;
    const poses = db.getPoses(chat.characterId, { withImages: false });
    const pcfg = poseCfg(settings);
    const poseEnabled = pcfg.enabled && char.posesEnabled !== false;
    const aiCfg = resolveAiConfig(settings);
    const simulated = !aiCfg.apiKey && aiCfg.provider !== 'ollama';
    const fresh = db.getChat(chat.id);
    const genRecord = {
      chatId: chat.id,
      text: '',
      active: true,
      done: false,
      error: null,
      chat: null,
      node: null,
      startedAt: Date.now(),
    };
    activeChatGens.set(chat.id, genRecord);
    startEventStream(res, async (emit, ctrl) => {
      let posePromise = null;
      let streamed = '';
      tlog('ai', `▶ reply stream — chat ${chat.id} (${char.name}), persona ${persona ? persona.name : '—'}, node ${node.id}`);
      const rT0 = Date.now();
      try {
        await manageChatContextWindow(fresh, node.id, settings);
        let currentChat = db.getChat(chat.id);
        // Multi-character chats: one request writes the whole character talk,
        // split into per-character beat nodes as it streams.
        if (Array.isArray(currentChat.characterIds) && currentChat.characterIds.length > 1 && !ctrl.signal.aborted) {
          const turn = await runGroupTurn({
            chat, anchorId: node.id, primary: char, persona, settings,
            poses, posesEnabled: poseEnabled, signal: ctrl.signal, emit, genRecord,
          });
          let reply = turn.node;
          let freshChat = turn.chat;
          try {
            const newTitle = await maybeGenerateChatTitle(chat.id);
            if (newTitle) {
              title = newTitle;
              freshChat.title = newTitle;
            }
          } catch {}
          genRecord.active = false;
          genRecord.done = true;
          genRecord.chat = freshChat;
          genRecord.node = reply;
          setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
          emit({ type: 'done', chat: freshChat, node: reply, title });
          return;
        }
        const text = await generateReplyStream(char, db.pathNodes(currentChat.tree, node.id), persona, settings, (d) => {
          streamed += d;
          genRecord.text += d;
          emit({ type: 'delta', text: d });
        }, ctrl.signal, currentChat);
        tlog('ai', `✓ reply streamed ${streamed.length} chars in ${Date.now() - rT0}ms`);
        if (poseEnabled && text && text.trim().length > 0) {
          try {
            posePromise = runPoseAgent({ char, persona, chat: currentChat, poses, currentPoseId: currentChat.poseId, replyText: text, settings, signal: ctrl.signal });
          } catch (e) { console.error('[pose/jev] director failed:', e.message); }
        }
        let pose = null;
        if (posePromise) pose = await Promise.race([posePromise, new Promise((r) => setTimeout(() => r(null), 6000))]);
        const chosen = pose && pose.changed ? pose : null;
        if (chosen) { try { db.setChatPose(chat.id, chosen.poseId); } catch {} }
        let reply = db.addReply(chat.id, node.id, text, {
          poseId: chosen ? chosen.poseId : null,
          characterId: char.id,
        });
        if (chosen) emit({ type: 'pose', poseId: chosen.poseId, poseName: chosen.poseName, confidence: chosen.confidence });

        const freshChat = db.getChat(chat.id);

        try {
          const newTitle = await maybeGenerateChatTitle(chat.id);
          if (newTitle) {
            title = newTitle;
            freshChat.title = newTitle;
          }
        } catch {}

        genRecord.active = false;
        genRecord.done = true;
        genRecord.chat = freshChat;
        genRecord.node = reply;
        setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
        emit({ type: 'done', chat: freshChat, node: reply, title });
      } catch (e) {
        console.error('[ai] generation failed:', e.message);
        if (e.partial) {
          let p = null;
          try { p = await Promise.race([posePromise || Promise.resolve(null), new Promise((r) => setTimeout(() => r(null), 1500))]); } catch {}
          if (p && p.changed) {
            try { db.setChatPose(chat.id, p.poseId); } catch {}
            try { emit({ type: 'pose', poseId: p.poseId, poseName: p.poseName, confidence: p.confidence }); } catch {}
          }
          db.addReply(chat.id, node.id, e.partial, p && p.changed ? { poseId: p.poseId } : null);
        }
        const freshChat = db.getChat(chat.id);
        genRecord.active = false;
        genRecord.done = true;
        genRecord.error = e.message;
        genRecord.chat = freshChat;
        setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
        emit({ type: 'error', error: e.message, chat: freshChat });
      }
    });
    return;
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/generate$/)) && req.method === 'POST') {
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    const targetCharId = (body.characterId && db.getCharacter(body.characterId)) ? body.characterId : chat.characterId;
    let char = db.getCharacter(targetCharId);
    if (!char) return send(res, 404, { error: 'Character not found' });
    const asUser = Boolean(body.asUser);
    const guidance = typeof body.guidance === 'string' ? body.guidance : '';
    let parentId = body.parentId && chat.tree.nodes[body.parentId] ? body.parentId : db.treeTip(chat.tree);
    if (parentId === 'root' || !parentId) return send(res, 400, { error: 'Nothing to reply to yet' });
    const settings = db.getSettings();
    const persona = settings.activePersonalityId
      ? db.getPersona(settings.activePersonalityId)
      : null;
    // In group chats, regenerating a character message redoes the whole
    // character talk: rewind to the start of that turn (the node the last
    // user message / opening spawned) and write the turn in one request.
    // A manual "let X speak" (appending after the current tip) is untouched.
    const hasReplacedChild = !!db.activeChildId(chat.tree, parentId);
    const isGroupRegen = !asUser && Array.isArray(chat.characterIds) && chat.characterIds.length > 1 && hasReplacedChild;
    let groupAnchorId = parentId;
    if (isGroupRegen) {
      let cur = parentId;
      for (let i = 0; i < 200; i++) {
        const n = chat.tree.nodes[cur];
        if (!n || n.role !== 'char') break;
        cur = n.parent;
      }
      if (cur && cur !== 'root' && chat.tree.nodes[cur] && cur !== parentId) groupAnchorId = cur;
    }
    const path = db.pathNodes(chat.tree, parentId);
    const poses = db.getPoses(chat.characterId, { withImages: false });
    const pcfg = poseCfg(settings);
    const poseEnabled = !asUser && pcfg.enabled && char.posesEnabled !== false;
    const aiCfg = resolveAiConfig(settings);
    const simulated = !aiCfg.apiKey && aiCfg.provider !== 'ollama';
    // Re-generating from an earlier point throws away the reply that is on
    // screen, so fall the chat back to the shot that was showing before that
    // reply — otherwise its image lingers while the new one is written, and
    // the director would judge its swap against a pose that no longer exists.
    let resetPose = null;
    let didReset = false;
    const replaced = db.activeChildId(chat.tree, parentId);
    if (!asUser && replaced && parentId !== db.treeTip(chat.tree)) {
      try {
        resetPose = db.poseBefore(chat.id, replaced);
        db.setChatPose(chat.id, resetPose);
        chat.poseId = resetPose;
        didReset = true;
      } catch (e) { console.error('[pose] revert failed:', e.message); }
    }
    const genRecord = {
      chatId: chat.id,
      text: '',
      active: true,
      done: false,
      error: null,
      chat: null,
      node: null,
      startedAt: Date.now(),
    };
    activeChatGens.set(chat.id, genRecord);
    startEventStream(res, async (emit, ctrl) => {
      let posePromise = null;
      let streamed = '';
      const rT0 = Date.now();
      tlog('ai', `▶ ${asUser ? 'respond-as-user' : 'regenerate'} stream — chat ${chat.id} (${char.name}), parent ${parentId}`);
      try {
        if (didReset) {
          const p = resetPose ? poses.find((x) => x.id === resetPose) : null;
          emit({ type: 'pose', poseId: resetPose, poseName: p ? p.name : null, reset: true });
        }
        await manageChatContextWindow(chat, isGroupRegen ? groupAnchorId : parentId, settings);
        const latestChat = db.getChat(chat.id);
        // In a group, regenerating rewrites the character talk in one request
        // (anchored at the turn start); single chats and manual prompts below.
        if (isGroupRegen && !ctrl.signal.aborted) {
          const turn = await runGroupTurn({
            chat, anchorId: groupAnchorId, primary: char, persona, settings,
            poses, posesEnabled: poseEnabled, signal: ctrl.signal, emit, genRecord,
          });
          let reply = turn.node;
          let freshChat = turn.chat;
          try {
            const newTitle = await maybeGenerateChatTitle(chat.id);
            if (newTitle) freshChat.title = newTitle;
          } catch {}
          genRecord.active = false;
          genRecord.done = true;
          genRecord.chat = freshChat;
          genRecord.node = reply;
          setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
          emit({ type: 'done', chat: freshChat, node: reply, title: freshChat.title });
          return;
        }
        const text = await generateReplyStream(char, db.pathNodes(latestChat.tree, parentId), persona, settings, (d) => {
          streamed += d;
          genRecord.text += d;
          emit({ type: 'delta', text: d });
        }, ctrl.signal, latestChat, asUser, guidance);
        tlog('ai', `✓ ${asUser ? 'respond-as-user' : 'regenerate'} streamed ${streamed.length} chars in ${Date.now() - rT0}ms`);
        if (asUser) {
          const reply = db.addNode(chat.id, 'user', text, parentId);
          const freshChat = db.getChat(chat.id);
          genRecord.active = false;
          genRecord.done = true;
          genRecord.chat = freshChat;
          genRecord.node = reply;
          setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
          emit({ type: 'done', chat: freshChat, node: reply });
          return;
        }
        if (poseEnabled && text && text.trim().length > 0) {
          try {
            posePromise = runPoseAgent({ char, persona, chat, poses, currentPoseId: chat.poseId, replyText: text, settings, signal: ctrl.signal });
          } catch (e) { console.error('[pose/jev] director failed:', e.message); }
        }
        let pose = null;
        if (posePromise) pose = await Promise.race([posePromise, new Promise((r) => setTimeout(() => r(null), 6000))]);
        const chosen = pose && pose.changed ? pose : null;
        if (chosen) { try { db.setChatPose(chat.id, chosen.poseId); } catch {} }
        let reply = db.addReply(chat.id, parentId, text, {
          poseId: chosen ? chosen.poseId : null,
          characterId: char.id,
        });
        if (chosen) emit({ type: 'pose', poseId: chosen.poseId, poseName: chosen.poseName, confidence: chosen.confidence });
        const freshChat = db.getChat(chat.id);
        try {
          const newTitle = await maybeGenerateChatTitle(chat.id);
          if (newTitle) freshChat.title = newTitle;
        } catch {}
        genRecord.active = false;
        genRecord.done = true;
        genRecord.chat = freshChat;
        genRecord.node = reply;
        setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
        emit({ type: 'done', chat: freshChat, node: reply });
      } catch (e) {
        console.error('[ai] generation failed:', e.message);
        if (e.partial) {
          if (asUser) {
            const reply = db.addNode(chat.id, 'user', e.partial, parentId);
            const freshChat = db.getChat(chat.id);
            genRecord.active = false;
            genRecord.done = true;
            genRecord.chat = freshChat;
            genRecord.node = reply;
            setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
            emit({ type: 'done', chat: freshChat, node: reply });
            return;
          }
          let p = null;
          try { p = await Promise.race([posePromise || Promise.resolve(null), new Promise((r) => setTimeout(() => r(null), 1500))]); } catch {}
          if (p && p.changed) {
            try { db.setChatPose(chat.id, p.poseId); } catch {}
            try { emit({ type: 'pose', poseId: p.poseId, poseName: p.poseName, confidence: p.confidence }); } catch {}
          }
          db.addReply(chat.id, parentId, e.partial, p && p.changed ? { poseId: p.poseId } : null);
        }
        const freshChat = db.getChat(chat.id);
        genRecord.active = false;
        genRecord.done = true;
        genRecord.error = e.message;
        genRecord.chat = freshChat;
        setTimeout(() => { if (activeChatGens.get(chat.id) === genRecord) activeChatGens.delete(chat.id); }, 120000);
        emit({ type: 'error', error: e.message, chat: freshChat });
      }
    });
    return;
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/nodes\/([\w-]+)\/insert-ooc$/)) && req.method === 'POST') {
    const chatId = m[1];
    const nodeId = m[2];
    const chat = db.getChat(chatId);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    try {
      const node = db.insertOocNode(chatId, nodeId, body.content || '');
      return send(res, 200, { ok: true, node, chat: db.getChat(chatId) });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/nodes\/([\w-]+)\/ai-edit$/)) && req.method === 'POST') {
    const chatId = m[1];
    const nodeId = m[2];
    const chat = db.getChat(chatId);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    const origNode = chat.tree.nodes[nodeId];
    if (!origNode || origNode.role !== 'char') return send(res, 400, { error: 'Target message not found or is not a character response' });
    const instruction = String(body.instruction || '').trim();
    if (!instruction) return send(res, 400, { error: 'Please describe what you want to change' });

    const charId = origNode.characterId || chat.characterId;
    const character = db.getCharacter(charId);
    if (!character) return send(res, 404, { error: 'Character not found' });

    const settings = db.getSettings();
    const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
    const userName = persona ? persona.name : 'the user';
    const cfg = resolveAgentConfig(settings);

    const path = db.pathNodes(chat.tree, nodeId);
    const ex = (s, c = character) => expandPromptMacros(s, c, persona, chat);
    const preceding = path.slice(0, -1).slice(-5).map((n) => {
      let sender = 'User';
      if (n.role === 'scenario') sender = 'Scene setting';
      else if (n.role === 'char') {
        const cRow = n.characterId ? db.getCharacter(n.characterId) : character;
        sender = cRow ? cRow.name : character.name;
      } else if (n.role === 'injection') sender = 'Directive (OOC)';
      else if (persona) sender = persona.name;
      return `${sender}: ${ex(n.content, (n.role === 'char' && n.characterId ? db.getCharacter(n.characterId) : character))}`;
    }).join('\n\n');

    const sysPrompt = [
      'You are an expert AI roleplay assistant and creative dialogue editor.',
      `Your role is to edit and rewrite a character's response in an ongoing roleplay conversation based on the user's instructions.`,
      `Character profile:`,
      `- Name: "${character.name}"`,
      `- Description / Persona: ${ex(character.description) || 'In character'}`,
      `Writing guidelines:`,
      `- Stay strictly in character as "${character.name}".`,
      `- Maintain the roleplay convention: actions and scene beats in *asterisks*, spoken dialogue in "double quotes".`,
      `- NARRATION PERSON: descriptions address "${userName || 'the user'}" as "you" and "${character.name}" as "she"/"he"/their name between asterisks (never *I ...* outside quotes); in dialogue the character speaks as "I" and may call the user by name.`,
      `- Implement the requested changes naturally into the response.`,
      `- Return ONLY the edited response text. Do NOT include commentary, explanations, greetings, or wrap the whole output in markdown code blocks.`,
    ].join('\n');

    const userPrompt = [
      preceding ? `Prior scene context:\n${preceding}\n` : '',
      `Current response from "${character.name}":\n${ex(origNode.content)}\n`,
      `User's modification request:\n"${instruction}"\n`,
      `Please provide the rewritten response now:`
    ].filter(Boolean).join('\n');

    try {
      let editedText = '';
      if (!cfg.apiKey && cfg.provider !== 'ollama') {
        // Fallback in simulated mode without API key
        editedText = `*${character.name} shifts posture, addressing your point with a fresh tone.* "${origNode.content.replace(/^["*]|["*]$/g, '').trim()} — let us handle this differently: ${instruction}."`;
      } else if (cfg.provider === 'anthropic') {
        const resp = await agentCallAnthropicPlain(cfg, sysPrompt, [{ role: 'user', content: userPrompt }], [], null);
        editedText = resp.text.trim();
      } else {
        const resp = await agentCallOpenAIPlain(cfg, sysPrompt, [{ role: 'user', content: userPrompt }], [], null);
        editedText = resp.text.trim();
      }

      if (!editedText) throw new Error('AI produced an empty response edit');
      const newNode = db.editNode(chatId, nodeId, editedText);
      try { db.setChatPose(chatId, db.poseAtTip(chatId)); } catch {}
      return send(res, 200, { chat: db.getChat(chatId), node: newNode });
    } catch (e) {
      return send(res, 400, { error: e.message });
    }
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/nodes\/([\w-]+)$/))) {
    const chatId = m[1];
    const nodeId = m[2];
    const chat = db.getChat(chatId);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    if (req.method === 'PUT') {
      const content = String(body.content || '').trim();
      if (!content) return send(res, 400, { error: 'Message is empty' });
      let node;
      try { node = db.editNode(chatId, nodeId, content); }
      catch (e) { return send(res, 400, { error: e.message }); }
      // The edited message is a fresh variant with no pose of its own, so the
      // image follows the history of the branch now on screen.
      try { db.setChatPose(chatId, db.poseAtTip(chatId)); } catch {}
      return send(res, 200, { chat: db.getChat(chatId), node });
    }
    if (req.method === 'DELETE') {
      try { db.deleteNode(chatId, nodeId); }
      catch (e) { return send(res, 400, { error: e.message }); }
      // The deleted message and its stamps are gone: fall back to the shot that
      // was showing before it, rather than leaving its image on screen.
      try { db.setChatPose(chatId, db.poseAtTip(chatId)); } catch {}
      return send(res, 200, { chat: db.getChat(chatId) });
    }
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/switch$/)) && req.method === 'POST') {
    const chatId = m[1];
    if (!db.getChat(chatId)) return send(res, 404, { error: 'Chat not found' });
    try { db.switchNode(chatId, body.nodeId); }
    catch (e) { return send(res, 400, { error: e.message }); }
    // Another version of a message is now on screen, so the image follows that
    // version's history instead of the one just navigated away from.
    try { db.setChatPose(chatId, db.poseAtTip(chatId)); } catch {}
    return send(res, 200, { chat: db.getChat(chatId) });
  }

  if (req.method === 'POST' && p === '/api/personalities') {
    if (!body.name || !String(body.name).trim()) return send(res, 400, { error: 'Name is required' });
    const created = db.createPersona(body);
    return send(res, 200, { id: created.id, personalities: db.getPersonalities() });
  }
  if ((m = p.match(/^\/api\/personalities\/([\w-]+)$/))) {
    const id = m[1];
    if (req.method === 'PUT') {
      const p2 = db.updatePersona(id, body);
      if (!p2) return send(res, 404, { error: 'Personality not found' });
      return send(res, 200, { personalities: db.getPersonalities() });
    }
    if (req.method === 'DELETE') {
      try { db.deletePersona(id); }
      catch (e) { return send(res, 400, { error: e.message }); }
      return send(res, 200, { personalities: db.getPersonalities() });
    }
  }

  if (req.method === 'POST' && p === '/api/presets') {
    if (!body.name || !String(body.name).trim()) return send(res, 400, { error: 'Preset name is required' });
    return send(res, 200, db.createPreset(body));
  }
  if ((m = p.match(/^\/api\/presets\/([\w-]+)$/))) {
    const id = m[1];
    if (req.method === 'PUT') {
      const pr = db.updatePreset(id, body);
      if (!pr) return send(res, 404, { error: 'Preset not found' });
      return send(res, 200, pr);
    }
    if (req.method === 'DELETE') {
      db.deletePreset(id);
      const s = db.getSettings();
      if (s.activePresetId === id) db.updateSettings({ activePresetId: null });
      return send(res, 200, { ok: true, presets: db.getPresets(), settings: db.getSettings() });
    }
  }

  if (req.method === 'GET' && p === '/api/provider/models') {
    let baseUrl = (u.searchParams.get('baseUrl') || '').trim().replace(/\/+$/, '');
    const apiKey = u.searchParams.get('apiKey') || '';
    /* Accept provider roots without a version segment, same as chat calls. */
    if (!baseUrl) return send(res, 400, { error: 'Base URL is required' });
    if (!/\/v\d+$/.test(baseUrl)) baseUrl += '/v1';
    try {
      const r = await fetchJson(baseUrl + '/models', {
        method: 'GET',
        headers: { ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      });
      const models = [];
      const contextLengths = {};
      for (const mm of (r?.data || [])) {
        if (!mm || !mm.id) continue;
        models.push(mm.id);
        const ctx = mm.context_length || mm.max_model_len || (mm.top_provider && mm.top_provider.context_length);
        if (ctx && Number.isFinite(ctx)) contextLengths[mm.id] = Number(ctx);
      }
      return send(res, 200, { models, contextLengths });
    } catch (e) {
      return send(res, 502, { error: e.message });
    }
  }

  if (req.method === 'PUT' && p === '/api/settings') {
    return send(res, 200, db.updateSettings(body));
  }

  return send(res, 404, { error: 'Not found' });
}

function serveStatic(req, res, u) {
  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const t0 = Date.now();
  if (u.pathname.startsWith('/api/') && req.method !== 'OPTIONS') {
    res.on('finish', () => {
      tlog('http', `${req.method} ${u.pathname}${u.search || ''} → ${res.statusCode} (${Date.now() - t0}ms)`);
    });
    res.on('close', () => { if (!res.writableEnded) tlog('http', `${req.method} ${u.pathname} → connection closed before response completed`); });
  }
  try {
    if (u.pathname.startsWith('/api/')) return await route(req, res, u);
    return serveStatic(req, res, u);
  } catch (e) {
    return send(res, 500, { error: e.message || 'Server error' });
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    const bound = HOST || '0.0.0.0';
    /* Only advertise addresses when actually listening on the network. */
    const open = !HOST || HOST === '0.0.0.0' || HOST === '::';
    const nets = open
      ? Object.values(os.networkInterfaces()).flat().filter((n) => n && n.family === 'IPv4' && !n.internal)
      : [];
    const where = nets.length ? ` → also try ${nets.map((n) => `http://${n.address}:${PORT}`).join(', ')}` : '';
    console.log(`aichat running → ${bound}:${PORT}${where}`);
  });
}

module.exports = {
  server,
  poseCfg,
  resolveDecisionsUrl,
  runPoseAgent,
  decidePose,
};
