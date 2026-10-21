const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
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

function readBody(req, limit = 6 * 1024 * 1024) {
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

async function fetchJson(url, opts) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
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
function expandPromptMacros(s, char, persona, chatOrScenario = null) {
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

  if (!scenarioObj && scenarioId) {
    try {
      scenarioObj = db.getScenario(scenarioId);
    } catch {}
  }

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
    if (lower === 'char') return charName;
    if (lower === 'user') return userName;
    if (varMap.has(lower)) return varMap.get(lower);
    return match;
  });
}

function buildTurns(pathNodes, char, persona, chatOrScenario = null) {
  const turns = [];
  let hasInjection = false;
  for (const n of pathNodes) {
    if (n.role === 'scenario' || n.role === 'root') continue;
    let content = expandPromptMacros(n.content, char, persona, chatOrScenario);
    if (n.role === 'injection') {
      hasInjection = true;
      content = `((OOC directive: ${content}))`;
    }
    const role = n.role === 'char' ? 'assistant' : 'user';
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += '\n\n' + content;
    else turns.push({ role, content });
  }
  return { turns, hasInjection };
}

const STYLE_LINE = 'Do not make the character dialog lines too long — focus more on what the character is doing. Write actions and scene beats in *asterisks* and wrap all spoken dialogue in "double quotes". Stay fully in character: never break the fourth wall, never mention being an AI, and never write the user\'s lines or actions for them.';
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
   defines who is in the scene — the character's persona, the user's persona, the
   scenario and the example replies — is appended either way, so a custom prompt
   can steer the format without stripping the model of who it is writing about. */
function buildSystemText(char, persona, hasInjection, cfg, scenarioText, chatOrScenario = null) {
  const userName = persona ? persona.name : 'the user';
  const ex = (s) => expandPromptMacros(s, char, persona, chatOrScenario);
  const custom = cfg.systemPrompt.trim();
  const parts = [
    custom ? ex(custom) : `Write "${char.name}'s" next reply in a fictional roleplay chat between "${userName}" and "${char.name}".`,
    `"${char.name}'s" Persona:\n${ex(char.description) || 'A mysterious stranger.'}`,
    persona
      ? `"${userName}'s" Persona:\n${ex(persona.description) || 'An ordinary person.'}`
      : `"The user's" Persona:\nAn ordinary person — the user plays themselves.`,
  ];
  const sc = scenarioText !== undefined ? scenarioText : (char.scenario || '');
  if (sc) parts.push(`The scenario of the conversation:\n${ex(sc)}`);
  const examples = (char.responses || []).filter((r) => r && !GENERIC_RESPONSE_SET.has(String(r).trim()));
  if (examples.length) parts.push(`This is how "${char.name}" talks and acts:\n${examples.map((r) => '- ' + ex(r)).join('\n')}`);
  parts.push(STYLE_LINE);
  if (hasInjection) parts.push(OOC_LINE);
  parts.push(`Then the roleplay chat between "${char.name}" and "${userName}" begins.`);
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

async function generateReplyStream(char, nodes, persona, settings, onDelta, signal, chatOrScenario = null) {
  const built = buildTurns(nodes, char, persona, chatOrScenario);
  const history = built.turns.slice(-40);
  const cfg = resolveAiConfig(settings);
  const scenarioNode = (nodes || []).find((n) => n.role === 'scenario');
  const scenarioText = scenarioNode ? scenarioNode.content : (char.scenario || '');
  const systemText = buildSystemText(char, persona, built.hasInjection, cfg, scenarioText, chatOrScenario);

  if (!cfg.apiKey && cfg.provider !== 'ollama') {
    const pool = (char.responses || []).filter((r) => r && !GENERIC_RESPONSE_SET.has(String(r).trim()));
    const candidates = pool.length ? pool : SIMULATED_FALLBACKS;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    const text = expandPromptMacros(picked, char, persona, chatOrScenario) || '*They listen carefully, then nod.* Go on — I am curious where this goes.';
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
    if (cfg.maxTokens) out.max_tokens = cfg.maxTokens;
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

function startEventStream(res, fn) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  const ctrl = new AbortController();
  let closed = false;
  res.on('close', () => { closed = true; ctrl.abort(); });
  const emit = (obj) => {
    if (closed) return;
    try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch {}
  };
  fn(emit, ctrl)
    .catch((e) => { if (!closed) emit({ type: 'error', error: e.message }); })
    .finally(() => { try { res.end(); } catch {} });
}

/* ==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-=== */
/* AI Agent — a built-in assistant that can inspect and edit the whole site.  */
/* Runs a non-streaming tool-calling loop (OpenAI `tools` / Anthropic `tools`),*/
/* streaming SSE *events* to the client instead of text deltas.               */
/* ==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-=== */

const AGENT_MAX_ITERATIONS = 8;
const AGENT_HISTORY_LIMIT = 80;
const AGENT_TOOL_RESULT_CAP = 8000;

const AGENT_IDENTITY = `You are the Agent — ZeroChat's built-in AI assistant. You live inside a self-hosted roleplay app and the user talks to you in a side drawer.

You are NOT a roleplay character here. You are a competent, warm, no-nonsense product co-pilot who understands the app's data model deeply and can act on it with tools. Your most important job is the "full set" workflow: designing a character, then a scenario draft, then splitting it into a scaffold + variables — always with the user's approval at each step.`;

const AGENT_ENTITY_GUIDE = `## Data model cheat sheet
Everything below is reachable through your tools.

CHARACTERS (create_character / update_character):
- description — the persona the roleplay model sees: who they are, background, personality, how they treat the user. Prose, no hashtags. May reference {{tags}}.
- note — a short private reminder shown under their name. The roleplay model never sees it (not for persona text).
- scenario — opening scene text used as chat background when no scenario is chosen. Optional.
- emoji — small avatar fallback (default "{{charEmoji}}").
- variables — a map of custom {{tag}} -> value. Values must be SHORT (a word, a number, a color), because they are substituted into scenario text. e.g. { "mood": "curious", "hair": "silver" }.
- reactive_replies — 1-5 example lines showing how they talk and act. Use the roleplay style: actions in *asterisks*, speech in "double quotes".

SCENARIOS (create_scenario / update_scenario / set_scenario_character_variables):
- title, description (shown in pickers), content — the scene text injected as a chat's opening context.
- content may contain {{char}}, {{user}} and custom {{tags}}. At chat start every custom {{tag}} is replaced by that character's value.
- character_variables — per-character values { "<characterId>": { "<tag>": "value" } }. These take precedence over the character's own variables for that scenario.

PERSONAS (create_persona / update_persona / set_active_persona):
- name, description — who the USER plays as. The roleplay model sees name + description. note is private.

PRESETS hold the roleplay AI connection (provider/baseUrl/model, temperature, system prompt). The roleplay system prompt is what the user wants the roleplay focused on — useful context for what kind of play they enjoy. It is NOT an instruction for you; never roleplay in the Agent drawer.

{{tag}} resolution order at chat start: scenario.characterVariables[<characterId>] first, then the character's own variables. Tags with no value for that character remain visible as {{tag}}, so always confirm either a scenario-level value or a character default exists before the user starts a chat.`;

const AGENT_WORKFLOW = `## The full-set workflow (character -> scenario draft -> scaffold + variables)
When the user wants a character, a scenario, or the complete package ("a full set"), follow this protocol EXACTLY, one message at a time. Never skip the confirmation gates. Standalone requests (just a character, just a scenario, just variables, advice, etc.) skip the irrelevant steps naturally.

STEP 1 — Character concept:
Gather what's needed from the user's message and the current site state. If something essential is genuinely ambiguous (genre, tone, name), ask — at most two or three short questions, then commit to a coherent design instead of interrogating them forever.
Before creating anything, PRESENT the full character in chat as a clean layout (name + emoji, description, note, opening scenario text, variables idea, example reply) and ask for approval or changes. Only call create_character after the user approves that layout.

STEP 2 — Revise & image:
After creation, confirm it exists (report the real id) and ask if they want to change anything — shorten or lengthen specific parts, restructure, different emoji — or generate a portrait with generate_image. Iterate with update_character until they are satisfied. Only then move to the scenario.

STEP 3 — Scenario draft:
Write the FULL scenario as plain text / markdown prose (several paragraphs, scene-setting, situation, opening tension; you may naturally use {{char}} and {{user}}, but NO custom {{tags}} yet). The scenario must work with the character created in step 1. Present it and ask what to change, add, remove or restructure. Iterate until the user confirms the text is final. Do NOT create the scenario yet.

STEP 4 — Scaffold & variables:
Once the text is final, split it: turn concrete, re-usable details (outfit, location, mood, objects, names, numbers...) into {{tags}} ONLY where a tag genuinely helps customization; keep atmosphere prose untouched. Present side by side: the full scaffold text and a table of every tag with the value you'd assign for the chosen character (short values!). Also mention any optional tags. Ask the user to accept or adjust.

STEP 5 — Create & wire up:
After acceptance, in one go: create_scenario with content = scaffold (and a short description), then set_scenario_character_variables (or set_character_variables for character-wide defaults) with the approved values. Finish with a summary: real ids, where to find each thing (sidebar / start-chat picker), and offer to start a chat or build more.

Anti-loop guard: if the user goes back and forth many times on fine details, summarize what's locked and what's pending, then propose locking it in.`;

const AGENT_RULES = `## Ground rules
- Never assume: draw facts from your tools (site_overview / list / get) and from what the user says. If a needed fact exists nowhere, ask.
- Only call create / update / delete tools for a specific action the user has approved. Reading tools is always fine.
- Always use real ids returned by tools. Never invent an id.
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
    characters_configured: Object.keys(configured),
  };
}

function agentToolDefs(cfg) {
  const defs = [
    { name: 'site_overview', description: 'Snapshot of the site: counts, ids of every entity, who the user plays as, which AI preset is active and whether image generation is available. Call this first whenever you are unsure about ids or the current state.', props: {} },
    { name: 'list_characters', description: 'List every character with id, name, a trimmed persona and variable keys. Full details need get_character.', props: {} },
    { name: 'get_character', description: 'Full record of one character: description (persona), note, scenario text, variables with values, example replies and pose list.', props: { id: { type: 'string', description: 'Character id' } }, req: ['id'] },
    {
      name: 'create_character', description: `Create a character and its first open chat. REQUIRED: name, description (the persona the roleplay model sees). OPTIONAL: note (private reminder, model never sees it), scenario (opening scene text used when no scenario is chosen), emoji, variables ({{tag}} -> short value map), reactive_replies (array of example lines in roleplay style, actions in *asterisks* and speech in "double quotes"), posesEnabled.`,
      props: {
        name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' },
        scenario: { type: 'string' }, emoji: { type: 'string' },
        variables: { type: 'object', description: 'Map of {{tag}} -> short value' },
        reactive_replies: { type: 'array', items: { type: 'string' } },
        posesEnabled: { type: 'boolean' },
      }, req: ['name', 'description'],
    },
    { name: 'update_character', description: 'Update one or more fields of an existing character. Only send the fields you want to change.', props: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' }, scenario: { type: 'string' }, emoji: { type: 'string' }, reactive_replies: { type: 'array', items: { type: 'string' } } }, req: ['id'] },
    { name: 'set_character_variables', description: `Set the character's {{tag}} values. By default MERGES the given map into the existing variables; set replace=true to wipe and replace. Values must be short (a word or number).`, props: { id: { type: 'string' }, variables: { type: 'object' }, replace: { type: 'boolean' } }, req: ['id', 'variables'] },
    { name: 'delete_character', description: 'Permanently delete a character, its chats and its poses. Only after the user explicitly asked for exactly this.', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'list_scenarios', description: 'List every scenario with id, title, required {{tags}} and which characters have values configured.', props: {} },
    { name: 'get_scenario', description: 'Full scenario record: title, description, full content and the per-character variable values.', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'create_scenario', description: `Create a scenario. content is the scene text injected at chat start; it may use {{char}}, {{user}} and custom {{tags}}. character_variables optionally seeds per-character values { "<characterId>": { "<tag>": "value" } }.`, props: { title: { type: 'string' }, description: { type: 'string' }, content: { type: 'string' }, character_variables: { type: 'object' } }, req: ['title', 'content'] },
    { name: 'update_scenario', description: `Update title/description/content; character_variables REPLACES the whole per-character map (use set_scenario_character_variables to merge instead).`, props: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, content: { type: 'string' }, character_variables: { type: 'object' } }, req: ['id'] },
    { name: 'set_scenario_character_variables', description: `Set per-character {{tag}} values on one scenario. MERGES given map for that character; replace=true replaces that character's map only.`, props: { scenario_id: { type: 'string' }, character_id: { type: 'string' }, variables: { type: 'object' }, replace: { type: 'boolean' } }, req: ['scenario_id', 'character_id', 'variables'] },
    { name: 'delete_scenario', description: 'Permanently delete a scenario (chats keep running without it).', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'list_personas', description: 'List the user personas ("who you play as"), with the active one marked.', props: {} },
    { name: 'create_persona', description: 'Create a user persona: name + description (what the roleplay model knows about the user). Does not auto-activate.', props: { name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' } }, req: ['name', 'description'] },
    { name: 'update_persona', description: 'Update a persona. description is what the roleplay model sees; note is private.', props: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, note: { type: 'string' } }, req: ['id'] },
    { name: 'set_active_persona', description: 'Switch who the user currently plays as.', props: { id: { type: 'string' } }, req: ['id'] },
    { name: 'generate_image', description: `Generate an AI portrait image from a text prompt. Optionally apply it directly as the character's portrait (apply=true). Long-shot guidance works best when the prompt describes art style, framing and mood.`, props: { prompt: { type: 'string' }, character_id: { type: 'string' }, apply: { type: 'boolean', description: 'Set as the character portrait' }, size: { type: 'string', description: 'e.g. 1024x1024' } }, req: ['prompt'] },
  ];
  const tools = defs.filter((d) => !(d.name === 'generate_image' && cfg.provider === 'anthropic'));
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
  return {
    counts: { characters: chars.length, scenarios: scenes.length, personas: personas.length },
    characters: chars.map((c) => ({ id: c.id, name: c.name })),
    scenarios: scenes.map((s) => ({ id: s.id, title: s.title })),
    personas: personas.map((pp) => ({ id: pp.id, name: pp.name, active: pp.id === settings.activePersonalityId })),
    image_generation: cfg.provider !== 'anthropic' ? 'available' : 'unavailable for anthropic presets',
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

async function runAgentTool(name, args, settings, cfg) {
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
      const c = db.createCharacter({
        name: args.name,
        description: args.description,
        note: args.note || '',
        scenario: args.scenario || '',
        emoji: args.emoji || undefined,
        variables: args.variables || {},
        responses: Array.isArray(args.reactive_replies) ? args.reactive_replies : [],
        posesEnabled: !!args.posesEnabled,
      });
      return { created: agentCharBrief(c), note: 'a first chat was opened for this character automatically' };
    }

    case 'update_character': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['name', 'description', 'note', 'scenario', 'emoji']) {
        if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      }
      if (Array.isArray(args.reactive_replies)) fields.responses = args.reactive_replies.slice(0, 8);
      const c = db.updateCharacter(args.id, fields);
      if (!c) throw new Error('Character not found: ' + args.id);
      return { updated: agentCharBrief(c), changed: Object.keys(fields) };
    }

    case 'set_character_variables': {
      agentNeed(args, ['id', 'variables'], name);
      if (typeof args.variables !== 'object' || !args.variables) throw new Error('variables must be an object of tag -> short value');
      const c = db.getCharacter(args.id);
      if (!c) throw new Error('Character not found: ' + args.id);
      const merged = args.replace ? { ...args.variables } : { ...(c.variables || {}), ...args.variables };
      db.updateCharacter(args.id, { variables: merged });
      return { character_id: args.id, variables: merged };
    }

    case 'delete_character': {
      agentNeed(args, ['id'], name);
      db.deleteCharacter(args.id);
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

    case 'create_scenario': {
      agentNeed(args, ['title', 'content'], name);
      let cv = args.character_variables;
      if (cv && (typeof cv !== 'object' || Array.isArray(cv))) cv = undefined;
      const s = db.createScenario({ title: args.title, description: args.description || '', content: args.content, characterVariables: cv || undefined });
      return { created: agentScenarioBrief(s) };
    }

    case 'update_scenario': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['title', 'description', 'content']) {
        if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      }
      if (args.character_variables && typeof args.character_variables === 'object') fields.characterVariables = args.character_variables;
      const s = db.updateScenario(args.id, fields);
      if (!s) throw new Error('Scenario not found: ' + args.id);
      return { updated: agentScenarioBrief(s) };
    }

    case 'set_scenario_character_variables': {
      agentNeed(args, ['scenario_id', 'character_id', 'variables'], name);
      const s = db.getScenario(args.scenario_id);
      if (!s) throw new Error('Scenario not found: ' + args.scenario_id);
      const cv = { ...(s.characterVariables || {}) };
      cv[args.character_id] = args.replace ? { ...args.variables } : { ...(cv[args.character_id] || {}), ...args.variables };
      db.updateScenario(args.scenario_id, { characterVariables: cv });
      return { scenario_id: args.scenario_id, character_id: args.character_id, variables: cv[args.character_id] };
    }

    case 'delete_scenario': {
      agentNeed(args, ['id'], name);
      db.deleteScenario(args.id);
      return { deleted: args.id };
    }

    case 'list_personas': {
      const personas = db.getPersonalities();
      return { personas: personas.map((pp) => ({ id: pp.id, name: pp.name, active: pp.id === settings.activePersonalityId, description: agentTrim(pp.description, 200) })) };
    }

    case 'create_persona': {
      agentNeed(args, ['name', 'description'], name);
      const pp = db.createPersona({ name: args.name, description: args.description, note: args.note || '' });
      return { created: { id: pp.id, name: pp.name }, note: 'use set_active_persona to make it current' };
    }

    case 'update_persona': {
      agentNeed(args, ['id'], name);
      const fields = {};
      for (const k of ['name', 'description', 'note']) if (args[k] !== undefined && args[k] !== null) fields[k] = String(args[k]);
      const pp = db.updatePersona(args.id, fields);
      if (!pp) throw new Error('Persona not found: ' + args.id);
      return { updated: { id: pp.id, name: pp.name }, changed: Object.keys(fields) };
    }

    case 'set_active_persona': {
      agentNeed(args, ['id'], name);
      const pp = db.getPersona(args.id);
      if (!pp) throw new Error('Persona not found: ' + args.id);
      db.updateSettings({ activePersonalityId: args.id });
      return { active_persona: { id: pp.id, name: pp.name } };
    }

    case 'generate_image': {
      agentNeed(args, ['prompt'], name);
      if (cfg.provider === 'anthropic') throw new Error('Image generation is not wired for Anthropic presets — suggest connecting an OpenAI-compatible provider instead.');
      const base = agentNormBase(cfg.baseUrl);
      const model = settings.agentImageModel || 'dall-e-3';
      const r = await fetchJson(base + '/images/generations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(cfg.apiKey ? { authorization: 'Bearer ' + cfg.apiKey } : {}) },
        body: JSON.stringify({ model, prompt: String(args.prompt).slice(0, 4000), n: 1, size: args.size || '1024x1024' }),
      });
      const item = r && r.data && r.data[0];
      const image = item && (item.b64_json ? 'data:image/png;base64,' + item.b64_json : item.url);
      if (!image) throw new Error('Provider returned no image');
      if (args.character_id && args.apply) {
        const c = db.updateCharacter(args.character_id, { image });
        if (!c) throw new Error('Character not found: ' + args.character_id);
        return { image, applied_to: args.character_id, model };
      }
      return { image, model };
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

async function agentCallOpenAI(cfg, system, messages, tools, signal) {
  const base = agentNormBase(cfg.baseUrl);
  const out = { model: cfg.model, messages: [{ role: 'system', content: system }, ...messages], tools, tool_choice: 'auto' };
  if (typeof cfg.temperature === 'number') out.temperature = cfg.temperature;
  const r = await postAgentJson(
    base + '/chat/completions',
    { 'content-type': 'application/json', ...(cfg.apiKey ? { authorization: 'Bearer ' + cfg.apiKey } : {}) },
    out, signal, 120000,
  );
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.json) {
    const j = r.json;
    const msg = (j && j.error && (j.error.message || j.error)) || r.text || 'Provider error';
    throw new Error('AI provider' + (r.status ? ' ' + r.status + ': ' : ': ') + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
  }
  const m0 = (r.json.choices && r.json.choices[0] && r.json.choices[0].message) || {};
  const calls = (m0.tool_calls || []).map((tc, i) => ({
    id: tc.id || ('call_' + Date.now().toString(36) + '_' + i),
    name: tc.function && tc.function.name,
    args: agentParseArgs(tc.function && tc.function.arguments),
  })).filter((c) => c.name);
  return { text: m0.content || '', toolCalls: calls };
}

async function agentCallAnthropic(cfg, system, messages, tools, signal) {
  const base = cfg.baseUrl.replace(/\/+$/, '');
  const body = {
    model: cfg.model,
    system,
    messages,
    tools: tools.map((t) => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters })),
    max_tokens: 4096,
  };
  const r = await postAgentJson(
    base + '/messages',
    { 'content-type': 'application/json', 'x-api-key': cfg.apiKey || '', 'anthropic-version': '2023-06-01' },
    body, signal, 120000,
  );
  if (r.aborted) throw new Error('Aborted');
  if (r.status !== 200 || !r.json) {
    const j = r.json;
    const msg = (j && j.error && (j.error.message || j.error)) || r.text || 'Provider error';
    throw new Error('AI provider' + (r.status ? ' ' + r.status + ': ' : ': ') + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
  }
  const blocks = r.json.content || [];
  const calls = blocks.filter((b) => b.type === 'tool_use').map((b) => ({ id: b.id, name: b.name, args: b.input || {} }));
  const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
  return { text, toolCalls: calls };
}

/* ---- History mapping ------------------------------------------------------ */

function mapAgentHistoryOpenAI(rows) {
  const out = [];
  for (const r of rows) {
    if (r.role === 'user') {
      out.push({ role: 'user', content: r.content || '' });
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
  const msgs = [];
  let pending = [];
  const flush = () => {
    if (pending.length) { msgs.push({ role: 'user', content: pending }); pending = []; }
  };
  for (const r of rows) {
    if (r.role === 'user') {
      flush();
      msgs.push({ role: 'user', content: r.content || '' });
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

function buildAgentSystem(settings) {
  const cfg = resolveAiConfig(settings);
  const aCfg = resolveAgentConfig(settings);
  const persona = settings.activePersonalityId ? db.getPersona(settings.activePersonalityId) : null;
  const preset = settings.activePresetId ? db.getPreset(settings.activePresetId) : null;
  const chars = db.getCharacters();
  const scenes = db.getScenarios();

  const ctx = ['## Current site state (live snapshot)'];
  ctx.push(`- The user plays as: ${persona ? `"${persona.name}" — ${agentTrim(persona.description, 300)}` : 'no persona set (they play an unnamed "user")'}`);
  if (preset) {
    ctx.push(`- Active AI preset: "${preset.name}" (provider ${cfg.provider}, model ${cfg.model || 'unset'}). Its roleplay focus: "${agentTrim(preset.systemPrompt || '(default)', 500)}"`);
  } else {
    ctx.push('- Active AI preset: none selected');
  }
  if (settings.agentOverride) {
    ctx.push(`- You (the Agent) run on a separate connection: ${aCfg.provider} / ${aCfg.model || 'unset'}`);
  }
  ctx.push(`- Characters (${chars.length}):`);
  for (const c of chars) {
    const brief = agentCharBrief(c);
    ctx.push(`  - ${brief.id} | ${brief.name} ${brief.emoji} | vars: ${brief.variable_keys.join(', ') || '—'} | ${brief.open_chats} open chat(s)`);
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
  const settings = db.getSettings();
  const cfg = resolveAgentConfig(settings);
  const text = String((body && body.message) || '').trim();
  if (!text) throw new Error('Message is empty');
  if (!cfg.apiKey && cfg.provider !== 'ollama') {
    throw new Error(settings.agentOverride
      ? 'No AI connection configured for the Agent. Open Settings → AI Connection → Agent connection and connect a provider first.'
      : 'No AI connection configured for the Agent. Open Settings → AI Connection (or pick an AI preset in the header) and connect a provider first.');
  }

  db.addAgentMessage({ role: 'user', content: text });

  const rows = db.getAgentMessages().slice(-AGENT_HISTORY_LIMIT);
  while (rows.length && rows[0].role === 'tool') rows.shift(); // avoid orphan tool results after history trim
  if (!rows.length || rows[rows.length - 1].content !== text || rows[rows.length - 1].role !== 'user') {
    // never happens in practice (just persisted); guards against re-entry races
  }

  const system = buildAgentSystem(settings);
  const tools = agentToolDefs(cfg);

  for (let iter = 0; iter < AGENT_MAX_ITERATIONS; iter++) {
    emit({ type: 'status', status: 'thinking' });
    let resp;
    if (cfg.provider === 'anthropic') {
      resp = await agentCallAnthropic(cfg, system, mapAgentHistoryAnthropic(rows), tools, ctrl.signal);
    } else {
      resp = await agentCallOpenAI(cfg, system, mapAgentHistoryOpenAI(rows), tools, ctrl.signal);
    }

    if (resp.toolCalls && resp.toolCalls.length) {
      const arow = db.addAgentMessage({ role: 'assistant', content: resp.text || '', toolCalls: resp.toolCalls });
      rows.push(arow);
      for (const call of resp.toolCalls) {
        emit({ type: 'tool_call', id: call.id, name: call.name, args: call.args || {} });
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

    const finalText = resp.text || '*…*';
    db.addAgentMessage({ role: 'assistant', content: finalText });
    emit({ type: 'done', text: finalText });
    return;
  }

  const fallback = 'I ran several tool steps and paused to avoid looping. Tell me to continue if I should keep going.';
  db.addAgentMessage({ role: 'assistant', content: fallback });
  emit({ type: 'done', text: fallback });
}

async function route(req, res, u) {
  const p = u.pathname;
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
  let m;

  if (req.method === 'GET' && p === '/api/agent/messages') return send(res, 200, { messages: db.getAgentMessages(), activeFirst: db.agentMessageCount() === 0 });
  if (req.method === 'POST' && p === '/api/agent/clear') return send(res, 200, db.clearAgentMessages());
  if (req.method === 'POST' && p === '/api/agent/chat') {
    return startEventStream(res, (emit, ctrl) => runAgentChat(body, emit, ctrl));
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
    if (!body.characterId) return send(res, 400, { error: 'characterId is required' });
    try { return send(res, 200, db.createChat(body.characterId, body.scenarioId || null)); }
    catch (e) { return send(res, 400, { error: e.message }); }
  }
  if ((m = p.match(/^\/api\/chats\/([\w-]+)$/)) && req.method === 'DELETE') {
    return send(res, 200, db.deleteChat(m[1]));
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
    startEventStream(res, async (emit, ctrl) => {
      let posePromise = null;
      let streamed = '';
      try {
        const text = await generateReplyStream(char, db.pathNodes(fresh.tree, node.id), persona, settings, (d) => {
          streamed += d;
          emit({ type: 'delta', text: d });
        }, ctrl.signal, chat);
        if (poseEnabled && text && text.trim().length > 0) {
          try {
            posePromise = runPoseAgent({ char, persona, chat, poses, currentPoseId: chat.poseId, replyText: text, settings, signal: ctrl.signal });
          } catch (e) { console.error('[pose/jev] director failed:', e.message); }
        }
        let pose = null;
        if (posePromise) pose = await Promise.race([posePromise, new Promise((r) => setTimeout(() => r(null), 6000))]);
        const chosen = pose && pose.changed ? pose : null;
        if (chosen) { try { db.setChatPose(chat.id, chosen.poseId); } catch {} }
        const reply = db.addReply(chat.id, node.id, text, chosen ? { poseId: chosen.poseId } : null);
        if (chosen) emit({ type: 'pose', poseId: chosen.poseId, poseName: chosen.poseName, confidence: chosen.confidence });
        emit({ type: 'done', chat: db.getChat(chat.id), node: reply, title });
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
        emit({ type: 'error', error: e.message, chat: db.getChat(chat.id) });
      }
    });
    return;
  }

  if ((m = p.match(/^\/api\/chats\/([\w-]+)\/generate$/)) && req.method === 'POST') {
    const chat = db.getChat(m[1]);
    if (!chat) return send(res, 404, { error: 'Chat not found' });
    const char = db.getCharacter(chat.characterId);
    if (!char) return send(res, 404, { error: 'Character not found' });
    const parentId = body.parentId && chat.tree.nodes[body.parentId] ? body.parentId : db.treeTip(chat.tree);
    if (parentId === 'root' || !parentId) return send(res, 400, { error: 'Nothing to reply to yet' });
    const settings = db.getSettings();
    const persona = settings.activePersonalityId
      ? db.getPersona(settings.activePersonalityId)
      : null;
    const path = db.pathNodes(chat.tree, parentId);
    const poses = db.getPoses(chat.characterId, { withImages: false });
    const pcfg = poseCfg(settings);
    const poseEnabled = pcfg.enabled && char.posesEnabled !== false;
    const aiCfg = resolveAiConfig(settings);
    const simulated = !aiCfg.apiKey && aiCfg.provider !== 'ollama';
    // Re-generating from an earlier point throws away the reply that is on
    // screen, so fall the chat back to the shot that was showing before that
    // reply — otherwise its image lingers while the new one is written, and
    // the director would judge its swap against a pose that no longer exists.
    let resetPose = null;
    let didReset = false;
    const replaced = db.activeChildId(chat.tree, parentId);
    if (replaced && parentId !== db.treeTip(chat.tree)) {
      try {
        resetPose = db.poseBefore(chat.id, replaced);
        db.setChatPose(chat.id, resetPose);
        chat.poseId = resetPose;
        didReset = true;
      } catch (e) { console.error('[pose] revert failed:', e.message); }
    }
    startEventStream(res, async (emit, ctrl) => {
      let posePromise = null;
      let streamed = '';
      try {
        if (didReset) {
          const p = resetPose ? poses.find((x) => x.id === resetPose) : null;
          emit({ type: 'pose', poseId: resetPose, poseName: p ? p.name : null, reset: true });
        }
        const text = await generateReplyStream(char, path, persona, settings, (d) => {
          streamed += d;
          emit({ type: 'delta', text: d });
        }, ctrl.signal, chat);
        if (poseEnabled && text && text.trim().length > 0) {
          try {
            posePromise = runPoseAgent({ char, persona, chat, poses, currentPoseId: chat.poseId, replyText: text, settings, signal: ctrl.signal });
          } catch (e) { console.error('[pose/jev] director failed:', e.message); }
        }
        let pose = null;
        if (posePromise) pose = await Promise.race([posePromise, new Promise((r) => setTimeout(() => r(null), 6000))]);
        const chosen = pose && pose.changed ? pose : null;
        if (chosen) { try { db.setChatPose(chat.id, chosen.poseId); } catch {} }
        const reply = db.addReply(chat.id, parentId, text, chosen ? { poseId: chosen.poseId } : null);
        if (chosen) emit({ type: 'pose', poseId: chosen.poseId, poseName: chosen.poseName, confidence: chosen.confidence });
        emit({ type: 'done', chat: db.getChat(chat.id), node: reply });
      } catch (e) {
        console.error('[ai] generation failed:', e.message);
        if (e.partial) {
          let p = null;
          try { p = await Promise.race([posePromise || Promise.resolve(null), new Promise((r) => setTimeout(() => r(null), 1500))]); } catch {}
          if (p && p.changed) {
            try { db.setChatPose(chat.id, p.poseId); } catch {}
            try { emit({ type: 'pose', poseId: p.poseId, poseName: p.poseName, confidence: p.confidence }); } catch {}
          }
          db.addReply(chat.id, parentId, e.partial, p && p.changed ? { poseId: p.poseId } : null);
        }
        emit({ type: 'error', error: e.message, chat: db.getChat(chat.id) });
      }
    });
    return;
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
    const baseUrl = (u.searchParams.get('baseUrl') || '').trim().replace(/\/+$/, '');
    const apiKey = u.searchParams.get('apiKey') || '';
    if (!baseUrl) return send(res, 400, { error: 'Base URL is required' });
    try {
      const r = await fetchJson(baseUrl + '/models', {
        method: 'GET',
        headers: { ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      });
      const models = (r?.data || []).map((mm) => mm.id).filter(Boolean);
      return send(res, 200, { models });
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
