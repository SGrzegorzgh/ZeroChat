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
async function postAgentJson(url, headers, body, signal) {
  if (signal && signal.aborted) return { status: 0, json: null, text: '', aborted: true };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
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

async function route(req, res, u) {
  const p = u.pathname;
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
  let m;

  if (req.method === 'GET' && p === '/api/bootstrap') return send(res, 200, db.bootstrap());

  if (req.method === 'GET' && p === '/api/default-prompt') return send(res, 200, { prompt: DEFAULT_PRESET_PROMPT });

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
