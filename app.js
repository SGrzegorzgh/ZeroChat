const I = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 22-8z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><path d="M12 7v5l4 2"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  rotl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  rotr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
  chevl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

const EMOJIS = ['🧙','🧝','🧛','🧜','🐉','🦊','🐺','🦉','🤖','👾','🕵️','🚀','🌸','🌙','⭐','✨','👑','⚔️','🛡️','🎭','👻','💀','🌌','🔥'];

const PROVIDERS = {
  openrouter: { label: 'OpenRouter', desc: '400+ models, one key', baseUrl: 'https://openrouter.ai/api/v1', models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'openai/gpt-4o-mini', 'google/gemini-2.0-flash-001', 'meta-llama/llama-3.1-70b-instruct', 'mistralai/mistral-large'] },
  openai: { label: 'OpenAI', desc: 'GPT-4o & friends', baseUrl: 'https://api.openai.com/v1', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini'] },
  anthropic: { label: 'Anthropic', desc: 'Claude models', baseUrl: 'https://api.anthropic.com/v1', models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'] },
  ollama: { label: 'Ollama', desc: 'Local models, no key', baseUrl: 'http://localhost:11434/v1', models: ['llama3.1', 'mistral', 'qwen2.5', 'gemma2', 'phi3'] },
  custom: { label: 'Custom', desc: 'Any OpenAI-compatible API', baseUrl: '', models: [] },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const trunc = (s, n = 34) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);

let state = { characters: [], personalities: [], presets: [], settings: {}, poses: {}, posesLoaded: {}, scenarios: [] };
const UI_KEY = 'aichat.ui.v1';
let ui = { activeCharacterId: null, activeChatIds: {}, sidebarTab: 'chars' };
try { const s = JSON.parse(localStorage.getItem(UI_KEY)); if (s) ui = { ...ui, ...s }; } catch {}
const saveUi = () => { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {} };
let typing = false;
let typingAt = null;
let streaming = null;
let editingId = null;

async function streamGenerate(path, body, onDelta) {
  const r = await fetch('/api' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const ct = r.headers.get('content-type') || '';
  if (!r.ok || !ct.includes('text/event-stream')) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || r.statusText || 'Request failed');
  }
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let full = '';
  let result = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) !== -1) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const line = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      let ev;
      try { ev = JSON.parse(line.slice(6)); } catch { continue; }
      if (ev.type === 'pose') {
        const chat = activeChat(activeChar());
        if (ev.reset) {
          // Revert (delete / edit / re-generate): repaint the shot that was on
          // screen before the removed message, but leave the last message's own
          // avatar alone — it is stamped with its own pose, not the current one.
          if (chat) chat.poseId = ev.poseId || null;
          applyChatBg();
          renderHeader();
          toast(ev.poseName ? 'Back to: ' + ev.poseName : 'Image cleared');
        } else {
          applyPoseLive(ev.poseId, ev.poseName);
          toast('Pose: ' + ev.poseName);
        }
        continue;
      }
      if (ev.type === 'delta') {
        full += ev.text;
        onDelta(full);
      } else if (ev.type === 'done') {
        result = ev;
      } else if (ev.type === 'error') {
        return ev;
      }
    }
  }
  if (!result) throw new Error('Stream ended unexpectedly');
  return result;
}

function pathOf(tree, uptoId) {
  const out = [];
  if (!tree || !tree.nodes || !tree.nodes.root) return out;
  let cur = tree.nodes.root;
  let guard = 0;
  while (cur && cur.children.length && guard++ < 1000) {
    const n = tree.nodes[cur.children[Math.min(cur.active, cur.children.length - 1)]];
    if (!n) break;
    out.push(n);
    if (uptoId && n.id === uptoId) break;
    cur = n;
  }
  return out;
}

function tipNode(chat) {
  const path = pathOf(chat.tree);
  return path.length ? path[path.length - 1] : null;
}

async function api(path, opts = {}) {
  const r = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || r.statusText || 'Request failed');
  return d;
}

async function bootstrap() {
  const d = await api('/bootstrap');
  state.characters = d.characters;
  state.personalities = d.personalities;
  state.presets = d.presets || [];
  state.settings = d.settings;
  state.scenarios = d.scenarios || [];
  api('/default-prompt').then((r) => { defaultPromptCache = r.prompt; }).catch(() => {});
}

function md(s) {
  let t = esc(s);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  /* Spoken lines. esc() has already turned every " into &quot;, so the pairs are
     matched as entities here. Lazy matching means a stray or inch-mark quote is
     left as plain text rather than swallowing the rest of the line. */
  t = t.replace(/&quot;(.*?)&quot;/g, '<span class="dlg">$1</span>');
  return t.replace(/\n/g, '<br>');
}

function fmtDate(ts) {
  const d = new Date(ts);
  const n = new Date();
  const hm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === n.toDateString()) return 'Today ' + hm;
  const y = new Date(n); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Yesterday ' + hm;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + hm;
}

const activeChar = () => state.characters.find((c) => c.id === ui.activeCharacterId) || null;
const activePersona = () => state.personalities.find((p) => p.id === state.settings.activePersonalityId) || state.personalities[0] || null;
const activePreset = () => state.presets.find((p) => p.id === state.settings.activePresetId) || null;

function effectiveAi() {
  const s = state.settings;
  const pr = activePreset();
  const pick = (k, dflt) => {
    const pv = pr ? pr[k] : undefined;
    if (pv !== undefined && pv !== null && pv !== '' && pv !== 'default') return pv;
    const sv = s[k];
    if (sv !== undefined && sv !== null && sv !== '' && sv !== 'default') return sv;
    return dflt;
  };
  return {
    provider: pick('provider', 'openrouter'),
    model: pick('model', ''),
    apiKey: pick('apiKey', ''),
    name: pr ? pr.name : null,
  };
}

function activeChat(c) {
  const wanted = ui.activeChatIds[c.id];
  return c.chats.find((x) => x.id === wanted)
    || c.chats.slice().sort((a, b) => b.updatedAt - a.updatedAt)[0]
    || null;
}

function avatarHtml(c, cls = '', zoomable = false, src = null) {
  const img = src || c.avatar || c.image;
  if (img) {
    return `<span class="avatar ${cls}${zoomable ? ' zoomable' : ''}" style="background-image:url('${img}')" title="View image"></span>`;
  }
  return `<span class="avatar ${cls} emoji">${esc(c.emoji)}</span>`;
}

function personaAvatarHtml(p, cls = '', zoomable = false) {
  if (p && (p.avatar || p.image)) {
    return `<span class="avatar ${cls}${zoomable ? ' zoomable' : ''}" style="background-image:url('${p.avatar || p.image}')" title="View image"></span>`;
  }
  const letter = p && p.name ? p.name.trim().charAt(0).toUpperCase() : 'Y';
  return `<span class="avatar ${cls} emoji letter">${esc(letter)}</span>`;
}

function fullImageSrc(c) {
  return (c && (c.image || c.avatar)) || null;
}

/* ---- poses ---------------------------------------------------------------
   state.poses[charId] holds the full list (images included) once loaded;
   the bootstrap copy on the character (c.poses) is the lightweight fallback. */

function poseList(charId) {
  if (!charId) return [];
  const c = state.characters.find((x) => x.id === charId);
  return state.poses[charId] || (c && c.poses) || [];
}

function poseById(charId, poseId) {
  if (!poseId) return null;
  return poseList(charId).find((p) => p.id === poseId) || null;
}

function poseImg(p) {
  return (p && (p.image || p.thumb)) || null;
}

// The square crop is a UI-sized thumbnail (256px) — fine for avatars, terrible
// stretched across the full-screen backdrop. The backdrop only uses the
// free-form full image and falls back to the character's own picture.
function poseBackdrop(p) {
  return (p && p.image) || null;
}

function currentPose(chat) {
  const c = activeChar();
  if (!c || !c.posesEnabled) return null;
  const ch = chat === undefined ? (c && activeChat(c)) : chat;
  if (!ch) return null;
  if (ch.poseId) return poseById(ch.characterId, ch.poseId);
  const list = poseList(ch.characterId);
  return list.find((p) => p.isDefault) || list[0] || null;
}

function poseTagHtml(p) {
  if (!p || !p.thumb) return '';
  return `<span class="pose-tag" title="Pose on screen: ${esc(p.name)}">${I.image}${esc(p.name)}</span>`;
}

function toast(msg) {
  // Silent: toast popups removed to prevent obstruction
}

function showWelcome() {
  $('#chat-view').classList.add('hidden');
  $('#welcome').classList.remove('hidden');
  renderWelcomeGrid();
}

function showChat() {
  $('#welcome').classList.add('hidden');
  $('#chat-view').classList.remove('hidden');
}

function renderSidebar() {
  $('#char-list').innerHTML = state.characters.map((c) => `
    <div class="char-item ${ui.activeCharacterId === c.id ? 'active' : ''}" data-id="${c.id}">
      ${avatarHtml(c)}
      <span class="ci-text">
        <span class="ci-name">${esc(c.name)}</span>
        <span class="ci-tag">${esc(c.note || c.description)}</span>
      </span>
    </div>`).join('');
}

function renderWelcomeGrid() {
  $('#welcome-grid').innerHTML = state.characters.map((c) => `
    <div class="w-card" data-id="${c.id}">
      ${avatarHtml(c, 'big')}
      <div class="w-name">${esc(c.name)}</div>
      <div class="w-tag">${esc(c.description)}</div>
      <div class="w-chats">${I.chat} ${c.chats.length} chat${c.chats.length === 1 ? '' : 's'}</div>
    </div>`).join('') + `
    <div class="w-card w-new" data-new="1">
      <span class="w-plus">${I.plus}</span>
      <div class="w-name">Create character</div>
      <div class="w-tag">Upload an avatar, write their story</div>
    </div>`;
}

function renderHeader() {
  const c = activeChar();
  if (!c) return;
  const pose = c.posesEnabled ? currentPose() : null;
  const chat = activeChat(c);
  const scenTitle = chat && (chat.scenarioTitle || (chat.scenarioId && state.scenarios.find((s) => s.id === chat.scenarioId)?.title));
  $('#char-info').innerHTML = `${avatarHtml(c, '', true, pose && pose.thumb)}
    <div class="ch-text">
      <div class="ch-name-row">
        <span class="ch-name">${esc(c.name)}</span>
        ${scenTitle ? `<span class="ch-scenario-badge" title="Scenario: ${esc(scenTitle)}">🎬 ${esc(scenTitle)}</span>` : ''}
      </div>
      <div class="ch-tag">${esc(c.description)}</div>
    </div>`;
  const p = activePersona();
  $('#persona-label').textContent = p ? p.name : '—';
  const pr = activePreset();
  $('#preset-label').textContent = pr ? pr.name : 'AI';

  const pillLabel = $('#chats-pill-label');
  if (pillLabel) {
    pillLabel.textContent = chat && chat.title ? chat.title : 'Chats';
  }
}

let currentBgSrc = null;
let currentBgLayer = 0;

function applyChatBg() {
  const c = activeChar();
  const bg = $('#chat-bg');
  if (!bg) return;
  const op = Math.min(1, Math.max(0, Number(state.settings.bgOpacity)));
  const bl = Math.min(24, Math.max(0, Number(state.settings.bgBlur)));
  const dim = Math.min(1, Math.max(0.3, Number.isFinite(+state.settings.actionDim) ? +state.settings.actionDim : 0.72));
  document.documentElement.style.setProperty('--bgop', String(op));
  document.documentElement.style.setProperty('--bgblur', bl + 'px');
  document.documentElement.style.setProperty('--act-dim', String(dim));

  let layers = bg.querySelectorAll('.chat-bg-layer');
  if (!layers.length) {
    bg.innerHTML = '<div class="chat-bg-layer" id="chat-bg-a"></div><div class="chat-bg-layer" id="chat-bg-b"></div>';
    layers = bg.querySelectorAll('.chat-bg-layer');
  }

  const src = (c && op > 0) ? ((c.posesEnabled && poseBackdrop(currentPose())) || fullImageSrc(c)) : null;

  if (!src) {
    currentBgSrc = null;
    layers.forEach((l) => l.classList.remove('active'));
    bg.classList.add('none');
    return;
  }

  bg.classList.remove('none');
  if (src === currentBgSrc) return;

  currentBgSrc = src;
  const nextIdx = (currentBgLayer + 1) % layers.length;
  const curLayer = layers[currentBgLayer];
  const nextLayer = layers[nextIdx];

  const activate = () => {
    if (currentBgSrc !== src) return;
    nextLayer.style.backgroundImage = `url("${src.replace(/"/g, '\\"')}")`;
    void nextLayer.offsetWidth;
    nextLayer.classList.add('active');
    if (curLayer) curLayer.classList.remove('active');
    currentBgLayer = nextIdx;
  };

  const img = new Image();
  img.src = src;
  if (img.complete) {
    activate();
  } else {
    img.onload = activate;
    img.onerror = activate;
  }
}

function setHint() {
  const ai = effectiveAi();
  const live = ai.apiKey || ai.provider === 'ollama';
  const providerLabel = PROVIDERS[ai.provider]?.label || 'Custom';
  const who = ai.name ? `${ai.name} (${providerLabel})` : providerLabel;
  const zapTip = `<span class="zap-hint">${I.zap}</span> menu for OOC &amp; respond-as-me`;
  $('#composer-hint').innerHTML = live
    ? `<span class="live">Live · ${esc(who)} · ${esc(ai.model || 'no model set')}</span><span>·</span><span>Enter to send · Shift+Enter for a new line · ${zapTip}</span>`
    : `<span class="sim">No API key — replies are simulated · set one in Settings</span><span>·</span><span>Enter to send · Shift+Enter for a new line · ${zapTip}</span>`;
}

function msgMetaHtml(n, chat, opts, tag = '') {
  const parent = chat.tree.nodes[n.parent];
  const kids = parent ? parent.children : [];
  const total = kids.length;
  const idx = kids.indexOf(n.id);
  const nav = total > 1
    ? `<span class="vnav"><button data-nav="prev" title="Previous version" ${idx <= 0 ? 'disabled' : ''}>${I.chevl}</button><span class="v-count">${idx + 1}/${total}</span><button data-nav="next" title="Next version" ${idx >= total - 1 ? 'disabled' : ''}>${I.chevr}</button></span>`
    : '';
  const isChar = n.role === 'char';
  const isInj = n.role === 'injection';
  const delTitle = isInj ? 'Remove this directive (messages after it stay)' : 'Delete this message and everything after it';
  const acts = `<span class="m-acts">
    <button data-act="copy" title="Copy message text">${I.copy}</button>
    <button data-act="edit" title="Edit message">${I.pencil}</button>
    ${isChar ? `<button data-act="ooc" title="Insert OOC directive after this message">${I.zap}</button>` : ''}
    ${opts.regen ? `<button data-act="regen" title="Regenerate this reply">${I.rotr}</button>` : ''}
    <button data-act="del" class="danger" title="${delTitle}">${I.trash}</button>
  </span>`;
  return `<div class="msg-meta">${tag}${nav}<span class="m-acts-wrap">${acts}</span></div>`;
}

function editBoxHtml(n) {
  return `<div class="edit-box">
    <textarea id="edit-ta">${esc(n.content)}</textarea>
    <div class="edit-actions">
      <button data-act="esave" class="mini primary">Save</button>
      <button data-act="ecancel" class="mini">Cancel</button>
    </div>
  </div>`;
}

/* Mirror of the server's template tags, for display and preview: character-authored
   text and scenario prompts show the names and character variables substituted,
   while the user's own messages stay exactly as they were typed. */

function getAllVariables() {
  const varsMap = new Map();
  // Collect from scenarios
  for (const sc of (state.scenarios || [])) {
    if (sc.characterVariables && typeof sc.characterVariables === 'object') {
      for (const [charId, charVars] of Object.entries(sc.characterVariables)) {
        if (!charVars || typeof charVars !== 'object') continue;
        const c = (state.characters || []).find((x) => x.id === charId);
        for (const [k, v] of Object.entries(charVars)) {
          if (!k) continue;
          const norm = k.trim().toLowerCase();
          const valStr = String(v == null ? '' : v).trim();
          if (!valStr) continue;
          if (!varsMap.has(norm)) {
            varsMap.set(norm, { key: norm, usedBy: [] });
          }
          varsMap.get(norm).usedBy.push({
            characterId: charId,
            characterName: c ? c.name : charId,
            scenarioTitle: sc.title,
            value: valStr,
          });
        }
      }
    }
    // Also detect tags from scenario content
    const tagMatches = (sc.content || '').matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g);
    for (const m of tagMatches) {
      const norm = m[1].trim().toLowerCase();
      if (norm === 'char' || norm === 'user') continue;
      if (!varsMap.has(norm)) {
        varsMap.set(norm, { key: norm, usedBy: [] });
      }
    }
  }
  // Collect from characters
  for (const c of (state.characters || [])) {
    if (c.variables && typeof c.variables === 'object') {
      for (const [k, v] of Object.entries(c.variables)) {
        if (!k) continue;
        const norm = k.trim().toLowerCase();
        const valStr = String(v == null ? '' : v).trim();
        if (!valStr) continue;
        if (!varsMap.has(norm)) {
          varsMap.set(norm, { key: norm, usedBy: [] });
        }
        if (!varsMap.get(norm).usedBy.some((u) => u.characterId === c.id)) {
          varsMap.get(norm).usedBy.push({
            characterId: c.id,
            characterName: c.name,
            value: valStr,
          });
        }
      }
    }
  }
  return Array.from(varsMap.values()).sort((a, b) => a.key.localeCompare(b.key));
}

function insertAtCaret(ta, text) {
  if (!ta) return;
  const start = ta.selectionStart || 0;
  const end = ta.selectionEnd || 0;
  const val = ta.value;
  ta.value = val.slice(0, start) + text + val.slice(end);
  const newPos = start + text.length;
  ta.setSelectionRange(newPos, newPos);
  ta.focus();
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function resolveScenarioCharacterVariables(characterId, scenarioOrId) {
  if (!characterId || !scenarioOrId) return null;
  let sc = null;
  if (typeof scenarioOrId === 'string') {
    sc = (state.scenarios || []).find((x) => x.id === scenarioOrId);
  } else if (typeof scenarioOrId === 'object' && scenarioOrId !== null) {
    if (scenarioOrId.characterVariables) sc = scenarioOrId;
    else if (scenarioOrId.scenarioId || scenarioOrId.scenario_id) {
      const sId = scenarioOrId.scenarioId || scenarioOrId.scenario_id;
      sc = (state.scenarios || []).find((x) => x.id === sId);
    }
  }
  if (sc && sc.characterVariables && sc.characterVariables[characterId]) {
    return sc.characterVariables[characterId];
  }
  return null;
}

function expandTags(s, characterId, customVarsOrScenario = null, customCharName = null, maybeScenarioId = null) {
  if (s == null) return '';
  const str = String(s);
  if (str.indexOf('{{') === -1) return str;
  const persona = activePersona();
  const c = state.characters.find((x) => x.id === characterId);
  const charName = customCharName || (c && c.name) || 'the character';
  const userName = (persona && persona.name) || 'the user';

  let vars = {};
  let scenarioParam = maybeScenarioId;

  if (typeof customVarsOrScenario === 'string') {
    scenarioParam = customVarsOrScenario;
  } else if (customVarsOrScenario && typeof customVarsOrScenario === 'object') {
    if (customVarsOrScenario.characterVariables || customVarsOrScenario.scenarioId || customVarsOrScenario.scenario_id) {
      scenarioParam = customVarsOrScenario;
    } else {
      vars = customVarsOrScenario;
    }
  }

  if ((!vars || Object.keys(vars).length === 0) && scenarioParam) {
    const scVars = resolveScenarioCharacterVariables(characterId, scenarioParam);
    if (scVars) vars = scVars;
  }

  // Fallback to character's own variables if any
  if ((!vars || Object.keys(vars).length === 0) && c && c.variables && typeof c.variables === 'object') {
    vars = c.variables;
  }

  const varMap = new Map();
  for (const [k, v] of Object.entries(vars || {})) {
    if (k) varMap.set(k.trim().toLowerCase(), String(v == null ? '' : v));
  }

  return str.replace(/\{\{\s*([\w.-]+)\s*\}\}/gi, (match, key) => {
    const lower = key.toLowerCase();
    if (lower === 'char') return charName;
    if (lower === 'user') return userName;
    if (varMap.has(lower)) {
      const val = varMap.get(lower);
      return val != null ? String(val) : '';
    }
    return match;
  });
}

function renderPreviewMarkdown(raw, characterId, customVars = null, customCharName = null, scenarioOrId = null) {
  if (!raw || !raw.trim()) {
    return `<div class="prow-desc" style="padding:16px;text-align:center">Nothing to preview. Switch to Edit to write.</div>`;
  }
  const persona = activePersona();
  const c = state.characters.find((x) => x.id === characterId);
  const charName = customCharName || (c && c.name) || 'the character';
  const userName = (persona && persona.name) || 'the user';

  let vars = customVars;
  if (!vars && scenarioOrId) {
    vars = resolveScenarioCharacterVariables(characterId, scenarioOrId);
  }
  if (!vars) {
    vars = (c && c.variables && typeof c.variables === 'object') ? c.variables : {};
  }

  const varMap = new Map();
  for (const [k, v] of Object.entries(vars || {})) {
    if (k) varMap.set(k.trim().toLowerCase(), String(v == null ? '' : v));
  }

  // 1. Convert markdown to HTML (safely escaping raw user text)
  let html = md(raw);

  // 2. Substitute {{...}} tokens into rendered HTML badges (NOT re-escaped)
  html = html.replace(/\{\{\s*([\w.-]+)\s*\}\}/gi, (match, key) => {
    const lower = key.toLowerCase();
    if (lower === 'char') {
      return `<mark class="var-hl char" title="{{char}}">${esc(charName)}</mark>`;
    }
    if (lower === 'user') {
      return `<mark class="var-hl user" title="{{user}}">${esc(userName)}</mark>`;
    }
    if (varMap.has(lower)) {
      const val = varMap.get(lower);
      if (val && val.trim()) {
        return `<mark class="var-hl var" title="{{${esc(lower)}}}">${esc(val.trim())}</mark>`;
      }
      return `<span class="var-unset" title="Variable '{{${esc(lower)}}}' is empty">[empty: {{${esc(lower)}}}]</span>`;
    }
    return `<span class="var-unset" title="Variable '{{${esc(lower)}}}' is not defined for this character">[unset: {{${esc(lower)}}}]</span>`;
  });

  return html;
}

function msgHtml(c, p, n, chat) {
  const cObj = state.characters.find((x) => x.id === chat.characterId);
  const msgPose = (n.role === 'char' && cObj && cObj.posesEnabled) ? poseById(chat.characterId, n.poseId) : null;
  const meta = msgMetaHtml(n, chat, { regen: n.role === 'char' }, poseTagHtml(msgPose));
  let body;
  if (editingId === n.id) {
    body = editBoxHtml(n);
  } else if (n.role === 'injection') {
    const dot = n.state === 'pending' ? '<span class="inj-dot" title="Will be sent with the next reply"></span>' : '';
    body = `<div class="bubble"><span class="inj-tag">${I.zap}<span>Directive</span>${dot}</span>${md(n.content)}</div>`;
  } else if (n.role === 'scenario') {
    body = `<div class="ms-body">${md(expandTags(n.content, chat.characterId, chat.scenarioId || chat))}</div>`;
  } else {
    /* Character lines render their tags; the user's own text is left alone. */
    const text = n.role === 'char' ? expandTags(n.content, chat.characterId, chat.scenarioId || chat) : n.content;
    body = `<div class="bubble">${md(text)}</div>`;
  }
  if (n.role === 'scenario') {
    return `<div class="msg-scenario" data-id="${n.id}">
      <div class="ms-head">${I.book}<span>Scenario</span></div>
      ${body}${meta}</div>`;
  }
  const main = `<div class="msg-main${editingId === n.id ? ' editing' : ''}">${body}${meta}</div>`;
  if (n.role === 'injection') {
    return `<div class="msg user injection ${n.state === 'pending' ? 'inj-pending' : ''}" data-id="${n.id}">${main}${personaAvatarHtml(p, 'sm', true)}</div>`;
  }
  if (n.role === 'user') {
    return `<div class="msg user${n.pending ? ' pending' : ''}" data-id="${n.id}">${main}${personaAvatarHtml(p, 'sm', true)}</div>`;
  }
  return `<div class="msg char" data-id="${n.id}">${avatarHtml(c, 'sm', true, msgPose && msgPose.thumb)}${main}</div>`;
}

let isSteerMode = false;

function setSteerMode(active) {
  isSteerMode = active;
  const btn = $('#composer-actions-btn');
  const input = $('#msg-input');
  const sendBtn = $('#send-btn');
  if (btn) btn.classList.toggle('active', isSteerMode);
  if (input) {
    input.classList.toggle('steer-mode', isSteerMode);
    input.placeholder = isSteerMode
      ? 'Direct the scene (OOC): What should happen next? (e.g. A storm suddenly rolls in...)'
      : 'Say something...';
  }
  if (sendBtn) {
    sendBtn.classList.toggle('steer-send', isSteerMode);
    sendBtn.title = isSteerMode ? 'Send directive (OOC)' : 'Send message';
  }
}

function updateComposerButtons() {
  const c = activeChar();
  const chat = c && activeChat(c);
  const text = $('#msg-input').value.trim();
  const tip = chat ? tipNode(chat) : null;
  const canReply = !!tip && (tip.role === 'user' || tip.role === 'injection') && !tip.pending;
  $('#send-btn').disabled = typing || !chat || !text;
  if ($('#inject-btn')) $('#inject-btn').disabled = typing || !chat || !text;
  if ($('#generate-btn')) $('#generate-btn').disabled = typing || !chat || !canReply;
  if ($('#composer-actions-btn')) $('#composer-actions-btn').disabled = typing || !chat;

  const bar = $('#composer-directive-bar');
  if (bar) {
    const hasPendingDirective = !!tip && tip.role === 'injection' && !tip.pending;
    bar.classList.toggle('hidden', !hasPendingDirective);
    if (hasPendingDirective) {
      const cdGen = $('#cd-generate-btn');
      if (cdGen) cdGen.disabled = typing;
    }
  }
}

function liveStreamUpdate() {
  if (!streaming) return;
  const sc = $('#chat-scroll');
  let bubble = document.querySelector('#chat-feed .msg.streaming .bubble');
  if (!bubble) {
    renderChat();
    bubble = document.querySelector('#chat-feed .msg.streaming .bubble');
  }
  if (bubble) {
    bubble.innerHTML = md(streaming.text);
    if (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 160) sc.scrollTop = sc.scrollHeight;
  }
}

function renderChat(opts = {}) {
  const c = activeChar();
  if (!c) { showWelcome(); return; }
  showChat();
  applyChatBg();
  renderHeader();
  const chat = activeChat(c);
  const p = activePersona();
  const feed = $('#chat-feed');
  const sc = $('#chat-scroll');
  const prevScroll = sc.scrollTop;
  const nodes = chat ? pathOf(chat.tree, typing && typingAt ? typingAt : null) : [];
  let html = nodes.map((n) => msgHtml(c, p, n, chat)).join('');
  if (typing) {
    const isUserStream = streaming && streaming.role === 'user';
    if (isUserStream) {
      const live = streaming && chat && streaming.chatId === chat.id && streaming.text;
      html += live
        ? `<div class="msg user streaming"><div class="msg-main"><div class="bubble">${md(streaming.text)}</div></div>${personaAvatarHtml(p, 'sm', true)}</div>`
        : `<div class="msg user"><div class="msg-main"><div class="bubble dots"><span></span><span></span><span></span></div></div>${personaAvatarHtml(p, 'sm', true)}</div>`;
    } else {
      const cp = currentPose(chat);
      const live = streaming && chat && streaming.chatId === chat.id && streaming.text;
      html += live
        ? `<div class="msg char streaming">${avatarHtml(c, 'sm', true, cp && cp.thumb)}<div class="msg-main"><div class="bubble">${md(streaming.text)}</div></div></div>`
        : `<div class="msg char"><span class="avatar sm emoji">${esc(c.emoji)}</span><div class="bubble dots"><span></span><span></span><span></span></div></div>`;
    }
  }
  feed.innerHTML = html;
  sc.scrollTop = opts.keepScroll ? prevScroll : sc.scrollHeight;
  updateComposerButtons();
}

async function openCharacter(id, chatId) {
  const c = state.characters.find((x) => x.id === id);
  if (!c) return;
  ui.activeCharacterId = id;
  let ch = null;
  if (chatId) {
    ch = c.chats.find((x) => x.id === chatId);
    if (ch) ui.activeChatIds[c.id] = chatId;
  }
  if (!ch) {
    ch = activeChat(c);
    if (ch) ui.activeChatIds[c.id] = ch.id;
  }
  if (!ch) {
    const allowed = state.scenarios.filter((s) => isScenarioAllowed(s, c.id));
    ch = await createChatFor(c, allowed.length > 0 ? allowed[0].id : null);
  }
  saveUi();
  closeSidebar();
  renderSidebar();
  renderChat();
  loadPoses(id);
}

async function createChatFor(c, scenarioId = null) {
  const body = { characterId: c.id };
  if (scenarioId) body.scenarioId = scenarioId;
  const ch = await api('/chats', { method: 'POST', body: JSON.stringify(body) });
  c.chats.unshift(ch);
  ui.activeChatIds[c.id] = ch.id;
  return ch;
}

async function newChat() {
  const c = activeChar();
  if (!c) return;
  openScenarioPicker(c);
}

async function delChat(id) {
  const c = activeChar();
  const chat = c.chats.find((x) => x.id === id);
  if (!chat) return;
  const ok = await customConfirm({
    title: 'Delete conversation?',
    message: `Are you sure you want to delete "${chat.title}"? This cannot be undone.`,
    confirmText: 'Delete chat',
    danger: true,
  });
  if (!ok) return;
  try { await api('/chats/' + id, { method: 'DELETE' }); }
  catch (e) { toast(e.message); return; }
  c.chats = c.chats.filter((x) => x.id !== id);
  if (ui.activeChatIds[c.id] === id) {
    const next = c.chats.slice().sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (next) ui.activeChatIds[c.id] = next.id;
    else await createChatFor(c);
  }
  saveUi();
  renderChat();
  renderChatsMenu();
  toast('Chat deleted');
}

function mergeChat(chat, fresh) {
  chat.tree = fresh.tree;
  chat.title = fresh.title;
  chat.updatedAt = fresh.updatedAt;
  if ('poseId' in fresh) chat.poseId = fresh.poseId || null;
}

function pushOptimistic(chat, role, content) {
  const parent = tipNode(chat) || chat.tree.nodes.root;
  const node = { id: 'tmp-' + uid(), role, content, parent: parent.id, children: [], active: 0, createdAt: now(), pending: true, state: role === 'injection' ? 'pending' : undefined };
  chat.tree.nodes[node.id] = node;
  parent.children.push(node.id);
  parent.active = parent.children.length - 1;
  return node;
}

function popOptimistic(chat, node) {
  delete chat.tree.nodes[node.id];
  const parent = chat.tree.nodes[node.parent];
  if (parent) {
    parent.children = parent.children.filter((x) => x !== node.id);
    parent.active = Math.max(0, Math.min(parent.active, parent.children.length - 1));
  }
}

async function sendUser() {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || typing) return;
  const ta = $('#msg-input');
  const text = ta.value.trim();
  if (!text) return;
  ta.value = '';
  msgInputManualHeight = 0;
  ta.style.height = '';
  autoGrow();
  const tmp = pushOptimistic(chat, 'user', text);
  typing = true;
  typingAt = tmp.id;
  streaming = { chatId: chat.id, text: '' };
  renderChat();
  try {
    const r = await streamGenerate(`/chats/${chat.id}/messages`, { role: 'user', content: text }, (full) => {
      if (streaming) streaming.text = full;
      liveStreamUpdate();
    });
    if (r.chat) mergeChat(chat, r.chat);
    if (r.error) toast(r.error);
  } catch (e) {
    popOptimistic(chat, tmp);
    ta.value = text;
    autoGrow();
    toast(e.message);
  }
  typing = false;
  typingAt = null;
  streaming = null;
  saveUi();
  renderChat();
  renderChatsMenu();
}

async function sendInjection() {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || typing) return;
  const ta = $('#msg-input');
  const text = ta.value.trim();
  if (!text) return;
  ta.value = '';
  msgInputManualHeight = 0;
  ta.style.height = '';
  autoGrow();
  const tmp = pushOptimistic(chat, 'injection', text);
  renderChat();
  try {
    const r = await api(`/chats/${chat.id}/messages`, { method: 'POST', body: JSON.stringify({ role: 'injection', content: text }) });
    mergeChat(chat, r.chat);
    toast('Directive queued — it will steer the next reply');
  } catch (e) {
    popOptimistic(chat, tmp);
    ta.value = text;
    autoGrow();
    toast(e.message);
  }
  saveUi();
  renderChat();
  renderChatsMenu();
}

async function generateReplyAt(parentId) {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || typing || !parentId || parentId === 'root') return;
  typing = true;
  typingAt = parentId;
  streaming = { chatId: chat.id, text: '' };
  renderChat();
  try {
    const r = await streamGenerate(`/chats/${chat.id}/generate`, { parentId }, (full) => {
      if (streaming) streaming.text = full;
      liveStreamUpdate();
    });
    if (r.chat) mergeChat(chat, r.chat);
    if (r.error) toast(r.error);
  } catch (e) {
    toast(e.message);
  }
  typing = false;
  typingAt = null;
  streaming = null;
  saveUi();
  renderChat();
  renderChatsMenu();
}

async function regenMsg(id) {
  const c = activeChar();
  const chat = c && activeChat(c);
  const node = chat && chat.tree.nodes[id];
  if (!node || node.role !== 'char' || typing) return;
  await generateReplyAt(node.parent);
}

function poseRevertNote(prevPoseId, chat) {
  if (!chat || (chat.poseId || null) === (prevPoseId || null)) return;
  const p = chat.poseId ? poseById(chat.characterId, chat.poseId) : null;
  toast(p ? 'Back to: ' + p.name : 'Image cleared');
}

async function delMsg(id) {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || !chat.tree.nodes[id]) return;
  const isInj = chat.tree.nodes[id].role === 'injection';
  const ok = await customConfirm({
    title: isInj ? 'Remove directive?' : 'Delete message turn?',
    message: isInj
      ? 'Remove this directive? The messages after it stay in the chat. This cannot be undone.'
      : 'Delete this message box (including all alternative versions you can switch to) and everything after it? This cannot be undone.',
    confirmText: isInj ? 'Remove directive' : 'Delete message',
    danger: true,
  });
  if (!ok) return;
  const prev = chat.poseId;
  try {
    const r = await api(`/chats/${chat.id}/nodes/${id}`, { method: 'DELETE' });
    mergeChat(chat, r.chat);
    poseRevertNote(prev, chat);
  } catch (e) { toast(e.message); return; }
  saveUi();
  renderChat({ keepScroll: true });
  renderChatsMenu();
}

async function insertOocAt(id) {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || !chat.tree.nodes[id]) return;
  try {
    const r = await api(`/chats/${chat.id}/nodes/${id}/insert-ooc`, { method: 'POST', body: JSON.stringify({ content: '' }) });
    mergeChat(chat, r.chat);
    editingId = r.node.id;
    saveUi();
    renderChat({ keepScroll: true });
    const ta = $('#edit-ta');
    if (ta) {
      makeTextareaAutoResize(ta, { min: 60, max: 280 });
      ta.focus();
    }
  } catch (e) {
    console.error('Insert OOC failed:', e.message);
  }
}

async function respondAsMe() {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || typing) return;
  const ta = $('#msg-input');
  const guidance = ta ? ta.value.trim() : '';
  if (ta) {
    ta.value = '';
    ta.style.height = '';
    msgInputManualHeight = 0;
  }
  const tip = tipNode(chat);
  const parentId = tip ? tip.id : null;
  if (!parentId || parentId === 'root') return;
  typing = true;
  typingAt = parentId;
  streaming = { chatId: chat.id, text: '', role: 'user' };
  renderChat();
  try {
    const r = await streamGenerate(`/chats/${chat.id}/generate`, { parentId, asUser: true, guidance }, (full) => {
      if (streaming) streaming.text = full;
      liveStreamUpdate();
    });
    if (r && r.chat) mergeChat(chat, r.chat);
  } catch (e) {
    console.error('Respond as me failed:', e.message);
  }
  typing = false;
  typingAt = null;
  streaming = null;
  saveUi();
  renderChat();
}

async function saveEdit(id) {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat || !chat.tree.nodes[id]) return;
  const ta = $('#edit-ta');
  const text = ta ? ta.value.trim() : '';
  if (!text) { toast('Message is empty'); return; }
  const prev = chat.poseId;
  try {
    const r = await api(`/chats/${chat.id}/nodes/${id}`, { method: 'PUT', body: JSON.stringify({ content: text }) });
    mergeChat(chat, r.chat);
    poseRevertNote(prev, chat);
  } catch (e) { toast(e.message); return; }
  editingId = null;
  saveUi();
  renderChat({ keepScroll: true });
  renderChatsMenu();
}

async function switchVariant(dir, nodeId) {
  const c = activeChar();
  const chat = c && activeChat(c);
  const node = chat && chat.tree.nodes[nodeId];
  if (!node) return;
  const parent = chat.tree.nodes[node.parent];
  const idx = parent.children.indexOf(nodeId);
  const target = parent.children[dir === 'prev' ? idx - 1 : idx + 1];
  if (!target) return;
  const prev = chat.poseId;
  try {
    const r = await api(`/chats/${chat.id}/switch`, { method: 'POST', body: JSON.stringify({ nodeId: target }) });
    mergeChat(chat, r.chat);
    poseRevertNote(prev, chat);
  } catch (e) { toast(e.message); return; }
  saveUi();
  renderChat({ keepScroll: true });
  renderChatsMenu();
}

let msgInputManualHeight = 0;
let agentInputManualHeight = 0;

function autoGrow() {
  const ta = $('#msg-input');
  if (!ta) return;
  if (!ta.value.trim()) {
    msgInputManualHeight = 0;
    ta.style.height = '';
    ta.style.overflowY = 'hidden';
    ta.style.resize = 'none';
    return;
  }
  if (msgInputManualHeight > 0) {
    ta.style.height = Math.max(msgInputManualHeight, ta.scrollHeight) + 'px';
    ta.style.overflowY = 'auto';
    ta.style.resize = 'vertical';
    return;
  }
  ta.style.height = 'auto';
  const maxLimit = window.innerWidth <= 768 ? 180 : 280;
  if (ta.scrollHeight <= maxLimit) {
    ta.style.height = Math.max(46, ta.scrollHeight) + 'px';
    ta.style.overflowY = 'hidden';
    ta.style.resize = 'none';
  } else {
    ta.style.height = maxLimit + 'px';
    ta.style.overflowY = 'auto';
    ta.style.resize = 'vertical';
  }
}

function makeTextareaAutoResize(ta, { min = 50, max = 280, isComposer = false } = {}) {
  if (!ta) return () => {};
  const isAgent = ta.id === 'agent-input';
  const getManual = () => (isAgent ? agentInputManualHeight : msgInputManualHeight);
  const setManual = (h) => {
    if (isAgent) agentInputManualHeight = h;
    else msgInputManualHeight = h;
  };

  const resize = () => {
    if (isComposer && !ta.value.trim()) {
      setManual(0);
      ta.style.height = '';
      ta.style.overflowY = 'hidden';
      ta.style.resize = 'none';
      return;
    }
    const manualH = getManual();
    if (isComposer && manualH > 0) {
      ta.style.height = Math.max(manualH, ta.scrollHeight) + 'px';
      ta.style.overflowY = 'auto';
      ta.style.resize = 'vertical';
      return;
    }
    ta.style.height = 'auto';
    const limit = typeof max === 'function' ? max() : max;
    if (ta.scrollHeight <= limit) {
      ta.style.height = Math.max(min, ta.scrollHeight) + 'px';
      ta.style.overflowY = 'hidden';
      ta.style.resize = 'none';
    } else {
      ta.style.height = limit + 'px';
      ta.style.overflowY = 'auto';
      ta.style.resize = 'vertical';
    }
  };

  ta.addEventListener('input', resize);

  // For composers, use their dedicated top touch handle
  let bar = null;
  if (isComposer) {
    bar = isAgent ? document.getElementById('agent-touch-handle') : document.getElementById('composer-touch-handle');
  } else if (!ta.dataset.hasResizeBar && ta.parentNode) {
    ta.dataset.hasResizeBar = '1';
    bar = document.createElement('div');
    bar.className = 'touch-resize-handle';
    bar.title = 'Drag to adjust height';
    bar.innerHTML = '<span></span>';
    ta.parentNode.insertBefore(bar, ta.nextSibling);
  }

  if (bar) {
    let startY = 0;
    let startH = 0;

    const onPointerMove = (e) => {
      const clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      const dy = isComposer ? (startY - clientY) : (clientY - startY);
      const maxH = isComposer ? Math.min(Math.round(window.innerHeight * 0.65), 550) : 600;
      const newH = Math.min(maxH, Math.max(min, startH + dy));
      ta.style.height = newH + 'px';
      ta.style.overflowY = 'auto';
      ta.style.resize = 'vertical';
      if (isComposer) setManual(newH);
      if (e.cancelable) e.preventDefault();
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    };

    const startDrag = (clientY) => {
      startY = clientY;
      startH = ta.offsetHeight;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    };

    bar.addEventListener('pointerdown', (e) => {
      startDrag(e.clientY);
    });

    bar.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientY);
      }
    });

    bar.addEventListener('dblclick', () => {
      if (isComposer) {
        setManual(0);
        ta.style.height = '';
        resize();
      }
    });
  }

  resize();
}

function makeElementResizable(el, { min = 110, max = 650, defaultHeight = null } = {}) {
  if (!el || el.dataset.hasResizeBar || !el.parentNode) return;
  el.dataset.hasResizeBar = '1';
  const bar = document.createElement('div');
  bar.className = 'touch-resize-handle';
  bar.title = 'Drag to adjust height (double-click to reset)';
  bar.innerHTML = '<span></span>';
  el.parentNode.insertBefore(bar, el.nextSibling);
  el._resizeBar = bar;
  // Start in sync with the element's initial visibility — preview boxes boot
  // hidden (Edit tab is the default), and a visible bar after a hidden box
  // reads as a dead second handle under the editable textarea.
  bar.classList.toggle('hidden', el.classList.contains('hidden'));

  let startY = 0;
  let startH = 0;

  const onPointerMove = (e) => {
    const clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const dy = clientY - startY;
    const newH = Math.min(max, Math.max(min, startH + dy));
    el.style.height = newH + 'px';
    el.style.maxHeight = 'none';
    if (e.cancelable) e.preventDefault();
  };

  const onPointerUp = () => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
  };

  const startDrag = (clientY) => {
    startY = clientY;
    startH = el.offsetHeight;
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  };

  bar.addEventListener('pointerdown', (e) => startDrag(e.clientY));
  bar.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) startDrag(e.touches[0].clientY);
  });
  bar.addEventListener('dblclick', () => {
    el.style.height = defaultHeight ? defaultHeight + 'px' : '';
    el.style.maxHeight = '';
  });
}

function closeMenus() {
  $$('.menu.open').forEach((m) => m.classList.remove('open'));
}

function toggleMenu(wrapId) {
  const wrap = $('#' + wrapId);
  const menu = $('.menu', wrap);
  const wasOpen = menu.classList.contains('open');
  closeMenus();
  if (!wasOpen) {
    if (wrapId === 'persona-wrap') renderPersonaMenu();
    if (wrapId === 'chats-wrap') renderChatsMenu();
    if (wrapId === 'preset-wrap') renderPresetMenu();
    if (wrapId === 'more-wrap') renderMoreMenu();
    if (wrapId === 'composer-actions-wrap') renderComposerActionsMenu();
    menu.classList.add('open');
  }
}

function renderPersonaMenu() {
  const menu = $('#persona-menu');
  menu.innerHTML = `
    <div class="menu-title">Playing as</div>
    ${state.personalities.map((p) => `
      <button class="menu-item ${p.id === state.settings.activePersonalityId ? 'active' : ''}" data-pid="${p.id}">
        ${personaAvatarHtml(p, 'sm')}
        <span class="mi-main">
          <span class="mi-name">${esc(p.name)}</span>
          <span class="mi-desc">${esc(p.note || p.description)}</span>
        </span>
        ${p.id === state.settings.activePersonalityId ? `<span class="mi-check">${I.check}</span>` : ''}
      </button>`).join('')}
    <div class="menu-sep"></div>
    <button class="menu-item manage" id="pm-manage">${I.pencil}<span>Manage personalities</span></button>`;
}

function renderChatsMenu() {
  const c = activeChar();
  const menu = $('#chats-menu');
  if (!c) { menu.innerHTML = ''; return; }
  const chat = activeChat(c);
  menu.innerHTML = `
    <button class="menu-item primary" id="cm-new">${I.plus}<span>New chat</span></button>
    <div class="menu-title">Chats with ${esc(c.name)}</div>
    ${c.chats.slice().sort((a, b) => b.updatedAt - a.updatedAt).map((ch) => {
      const sTitle = ch.scenarioTitle || (ch.scenarioId && state.scenarios.find((s) => s.id === ch.scenarioId)?.title);
      return `
      <button class="menu-item chat-row ${chat && ch.id === chat.id ? 'active' : ''}" data-cid="${ch.id}">
        <span class="mi-main">
          <span class="mi-name">${esc(ch.title)}</span>
          <span class="mi-desc">
            ${sTitle ? `<span class="mi-scen-tag">${esc(sTitle)}</span> · ` : ''}${pathOf(ch.tree).filter((n) => n.role !== 'scenario').length} messages · ${fmtDate(ch.updatedAt)}
          </span>
        </span>
        <span class="row-del" data-del="${ch.id}" title="Delete chat">${I.trash}</span>
      </button>`;
    }).join('')}`;
}

async function setPersona(pid) {
  if (!state.personalities.find((p) => p.id === pid)) return;
  try {
    state.settings = await api('/settings', { method: 'PUT', body: JSON.stringify({ activePersonalityId: pid }) });
  } catch (e) { toast(e.message); return; }
  renderHeader();
  if ($('#modal-persona').classList.contains('open')) renderPersonaList();
  renderSidebarPersonas();
}

function renderPersonaList() {
  $('#persona-list').innerHTML = state.personalities.map((p) => `
    <div class="prow ${p.id === state.settings.activePersonalityId ? 'active' : ''}">
      <button class="radio" data-use="${p.id}" title="Set as active"></button>
      ${personaAvatarHtml(p)}
      <span class="prow-text">
        <span class="prow-name">${esc(p.name)}${p.id === state.settings.activePersonalityId ? ' <span class="prow-you">· playing now</span>' : ''}</span>
        <span class="prow-desc">${esc(p.note || p.description)}</span>
      </span>
      <span class="row-actions">
        <button class="icon-btn tiny" data-edit="${p.id}" title="Edit">${I.pencil}</button>
        <button class="icon-btn tiny danger" data-del="${p.id}" title="Delete">${I.trash}</button>
      </span>
    </div>`).join('');
}

const modalSnapshots = {};

function getModalSnapshot(id) {
  if (id === 'modal-char') {
    return JSON.stringify({
      name: ($('#ce-name')?.value || '').trim(),
      desc: ($('#ce-desc')?.value || '').trim(),
      note: ($('#ce-note')?.value || '').trim(),
      posesEnabled: Boolean($('#ce-poses-enabled')?.checked),
      emoji: ceEmoji || null,
      avatar: ceAvatar || null,
      image: ceImage || null
    });
  }
  if (id === 'modal-scenario') {
    return JSON.stringify({
      title: ($('#se-title')?.value || '').trim(),
      desc: ($('#se-desc')?.value || '').trim(),
      content: ($('#se-content')?.value || '').trim(),
      characterVariables: seCharacterVariables || {}
    });
  }
  if (id === 'modal-scenario-vars') {
    return JSON.stringify(msvLiveVars || {});
  }
  if (id === 'modal-settings') {
    const selected = $('#prov-grid .prov.selected');
    return JSON.stringify({
      provider: selected ? selected.dataset.pv : 'custom',
      baseUrl: ($('#set-url')?.value || '').trim(),
      apiKey: ($('#set-key')?.value || '').trim(),
      model: ($('#set-model')?.value || '').trim(),
      temperature: +($('#set-temp')?.value || 1),
      bgOpacity: Math.round(+($('#set-bgop')?.value || 50)),
      bgBlur: Math.round(+($('#set-bgblur')?.value || 12)),
      actionDim: Math.round(+($('#set-actdim')?.value || 65)),
      poseAgent: Boolean($('#pose-agent')?.checked),
      poseRecheck: Boolean($('#pose-recheck')?.checked),
      poseProvider: ($('#pose-provider')?.value || '').trim(),
      poseBaseUrl: ($('#pose-url')?.value || '').trim(),
      poseApiKey: ($('#pose-key')?.value || '').trim(),
      poseModel: ($('#pose-model')?.value || '').trim(),
      poseLikelihood: Math.round(+($('#set-poselike')?.value || 50)),
      poseContextCount: Math.round(+($('#set-posecontext')?.value || 3))
    });
  }
  if (id === 'modal-preset') {
    const selected = $('#pr-prov-grid .prov.selected');
    return JSON.stringify({
      name: ($('#pr-name')?.value || '').trim(),
      provider: selected ? selected.dataset.pv : 'custom',
      baseUrl: ($('#pr-url')?.value || '').trim(),
      apiKey: ($('#pr-key')?.value || '').trim(),
      model: ($('#pr-model')?.value || '').trim(),
      temperature: +($('#pr-temp')?.value || 1),
      tokens: ($('#pr-tokens')?.value || '').trim(),
      reasoning: $('#pr-reasoning')?.value || 'default',
      sysprompt: ($('#pr-sysprompt')?.value || '').trim()
    });
  }
  if (id === 'modal-persona') {
    return JSON.stringify({
      name: ($('#pf-name')?.value || '').trim(),
      desc: ($('#pf-desc')?.value || '').trim(),
      note: ($('#pf-note')?.value || '').trim(),
      avatar: peAvatar || null,
      image: peImage || null
    });
  }
  if (id === 'modal-poses') {
    const form = $('#pose-form');
    if (form && !form.classList.contains('hidden')) {
      const name = ($('#pose-name')?.value || '').trim();
      const desc = ($('#pose-desc')?.value || '').trim();
      return JSON.stringify({ editing: true, name, desc });
    }
    return JSON.stringify({ editing: false });
  }
  return null;
}

function takeModalSnapshot(id) {
  modalSnapshots[id] = getModalSnapshot(id);
}

function clearModalSnapshot(id) {
  delete modalSnapshots[id];
}

function isModalDirty(id) {
  if (!(id in modalSnapshots)) return false;
  const initial = modalSnapshots[id];
  if (initial === null || initial === undefined) return false;
  const current = getModalSnapshot(id);
  return current !== initial;
}

function openModal(id) {
  const el = $('#' + id);
  if (!el) return;
  el.classList.add('open');
  takeModalSnapshot(id);
}

function closeModal(id) {
  const el = $('#' + id);
  if (!el) return;
  clearModalSnapshot(id);
  el.classList.remove('open');
}

let confirmResolver = null;

function customConfirm({
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
} = {}) {
  return new Promise((resolve) => {
    if (confirmResolver) confirmResolver(false);
    confirmResolver = resolve;

    const titleEl = $('#confirm-title');
    const msgEl = $('#confirm-message');
    const okBtn = $('#confirm-ok-btn');
    const cancelBtn = $('#confirm-cancel-btn');
    const iconWrap = $('#confirm-icon-wrap');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (okBtn) {
      okBtn.textContent = confirmText;
      okBtn.className = danger ? 'btn btn-danger' : 'btn btn-primary';
    }
    if (cancelBtn) cancelBtn.textContent = cancelText;
    if (iconWrap) iconWrap.classList.toggle('danger', danger);

    openModal('modal-confirm');
    setTimeout(() => { if (okBtn) okBtn.focus(); }, 60);
  });
}

function closeConfirm(result) {
  closeModal('modal-confirm');
  if (confirmResolver) {
    const res = confirmResolver;
    confirmResolver = null;
    res(result);
  }
}

async function requestCloseModal(modalOrId) {
  const m = typeof modalOrId === 'string' ? $('#' + modalOrId) : modalOrId;
  if (!m || !m.classList.contains('open')) return true;
  if (m.id === 'modal-confirm') {
    closeConfirm(false);
    return true;
  }
  if (isModalDirty(m.id)) {
    const discard = await customConfirm({
      title: 'Discard unsaved changes?',
      message: 'You have unsaved changes that will be lost if you close this window.',
      confirmText: 'Discard changes',
      danger: true,
    });
    if (!discard) return false;
  }
  closeModal(m.id);
  return true;
}

/* --- Fullscreen image viewer -------------------------------------------------
   Any thumbnail (agent tool results, attachment chips, portraits...) opens
   here. Wheel / pinch zooms toward the pointer, drag pans when zoomed,
   double-click toggles 1x / 2.5x. Escape, ✕ or clicking the backdrop closes. */
const LB_MIN = 1;
const LB_MAX = 8;
let lbZoom = { scale: 1, x: 0, y: 0 };

const lbClamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function viewerElCenter() {
  const img = $('#img-viewer-img');
  const r = img.getBoundingClientRect();
  /* getBoundingClientRect may be transformed already — the untransformed
     element center is that visual center minus the pan offset. */
  return { x: r.left + r.width / 2 - lbZoom.x, y: r.top + r.height / 2 - lbZoom.y };
}

function viewerClampPan() {
  const img = $('#img-viewer-img');
  const w = img.offsetWidth * lbZoom.scale;
  const h = img.offsetHeight * lbZoom.scale;
  const maxX = Math.max(0, (w - window.innerWidth) / 2);
  const maxY = Math.max(0, (h - window.innerHeight) / 2);
  lbZoom.x = lbClamp(lbZoom.x, -maxX, maxX);
  lbZoom.y = lbClamp(lbZoom.y, -maxY, maxY);
}

function viewerApply() {
  const img = $('#img-viewer-img');
  img.style.transform = `translate(${lbZoom.x}px, ${lbZoom.y}px) scale(${lbZoom.scale})`;
  $('#img-viewer').classList.toggle('zoomed', lbZoom.scale > 1.001);
}

function viewerZoomAt(clientX, clientY, factor) {
  const next = lbClamp(lbZoom.scale * factor, LB_MIN, LB_MAX);
  if (next === lbZoom.scale) return;
  factor = next / lbZoom.scale;
  const c = viewerElCenter();
  /* Keep the point currently under the pointer visually fixed while zooming. */
  lbZoom.x += (clientX - c.x - lbZoom.x) * (1 - factor);
  lbZoom.y += (clientY - c.y - lbZoom.y) * (1 - factor);
  lbZoom.scale = next;
  viewerClampPan();
  viewerApply();
}

function openViewer(src) {
  lbZoom = { scale: 1, x: 0, y: 0 };
  const img = $('#img-viewer-img');
  img.style.transform = '';
  img.src = src;
  $('#img-viewer').classList.remove('hidden');
  $('#img-viewer').classList.remove('zoomed', 'grabbing');
}
function closeViewer() {
  $('#img-viewer').classList.add('hidden');
  $('#img-viewer').classList.remove('zoomed', 'grabbing');
  $('#img-viewer-img').src = '';
}

function viewerWire() {
  const v = $('#img-viewer');
  if (v.dataset.wired) return;
  v.dataset.wired = '1';
  const img = $('#img-viewer-img');
  const pointers = new Map();
  let lbMoved = false;
  let pinch = null;

  v.addEventListener('wheel', (e) => {
    e.preventDefault();
    viewerZoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  v.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lbMoved = false;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    }
    if (e.target === img || e.target === v) v.classList.add('grabbing');
  });
  v.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      lbMoved = true;
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      if (dist > 0) viewerZoomAt(cx, cy, dist / pinch.dist);
      lbZoom.x += cx - pinch.cx;
      lbZoom.y += cy - pinch.cy;
      viewerClampPan();
      viewerApply();
      pinch = { dist, cx, cy };
    } else if (pointers.size === 1 && lbZoom.scale > 1) {
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) lbMoved = true;
      lbZoom.x += dx;
      lbZoom.y += dy;
      viewerClampPan();
      viewerApply();
    } else if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      lbMoved = true;
    }
  });
  const pointerUp = (e) => {
    pointers.delete(e.pointerId);
    pinch = null;
    if (!pointers.size) v.classList.remove('grabbing');
  };
  v.addEventListener('pointerup', pointerUp);
  v.addEventListener('pointercancel', pointerUp);
  v.addEventListener('dblclick', (e) => {
    e.preventDefault();
    lbZoom = { scale: lbZoom.scale > 1.001 ? 1 : 2.5, x: 0, y: 0 };
    viewerApply();
  });
  /* Close on a plain click, but not when the gesture was a pan or pinch. */
  v.addEventListener('click', (e) => {
    if (e.target === $('#img-viewer-close') || e.target.closest('#img-viewer-close')) return;
    if (lbMoved) { lbMoved = false; return; }
    closeViewer();
  });
  $('#img-viewer-close').addEventListener('click', closeViewer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !v.classList.contains('hidden')) closeViewer();
  });
}

let peMode = 'new';
let peId = null;
let peAvatar = null;
let peImage = null;

function updatePfAvatarUI() {
  const pv = $('#pf-preview');
  if (peAvatar) {
    pv.classList.remove('emoji', 'letter');
    pv.textContent = '';
    pv.style.backgroundImage = `url('${peAvatar}')`;
  } else {
    const p = peMode === 'edit' ? state.personalities.find((x) => x.id === peId) : null;
    pv.classList.add('emoji');
    pv.style.backgroundImage = '';
    pv.textContent = p && p.name ? p.name.trim().charAt(0).toUpperCase() : '🙂';
  }
  const full = $('#pf-preview-full');
  full.classList.toggle('hidden', !peImage);
  if (peImage) full.style.backgroundImage = `url('${peImage}')`;
  $('#pf-remove-avatar').classList.toggle('hidden', !peAvatar && !peImage);
}

function openPersonaModal() {
  peMode = 'new';
  peId = null;
  peAvatar = null;
  peImage = null;
  $('#pf-name').value = '';
  $('#pf-desc').value = '';
  $('#pf-note').value = '';
  updatePersonaForm();
  updatePfAvatarUI();
  renderPersonaList();
  openModal('modal-persona');
  setTimeout(() => $('#pf-name').focus(), 60);
  takeModalSnapshot('modal-persona');
}

function updatePersonaForm() {
  $('#pf-label').textContent = peMode === 'edit' ? 'Edit personality' : 'Add personality';
  $('#pf-save').textContent = peMode === 'edit' ? 'Save changes' : 'Add personality';
  $('#pf-cancel').classList.toggle('hidden', peMode !== 'edit');
  const exp = $('#pf-export');
  if (exp) exp.classList.toggle('hidden', peMode !== 'edit');
}

async function personaFormSave() {
  const name = $('#pf-name').value.trim();
  const description = $('#pf-desc').value.trim();
  const note = $('#pf-note').value.trim();
  if (!name) { toast('Give the personality a name'); return; }
  const body = { name, description, note, avatar: peAvatar, image: peImage };
  try {
    if (peMode === 'edit') {
      const r = await api('/personalities/' + peId, { method: 'PUT', body: JSON.stringify(body) });
      state.personalities = r.personalities;
      toast('Personality updated');
    } else {
      const r = await api('/personalities', { method: 'POST', body: JSON.stringify(body) });
      state.personalities = r.personalities;
      await setPersona(r.id);
      toast('Personality added');
    }
  } catch (e) { toast(e.message); return; }
  renderHeader();
  renderPersonaList();
  renderChat();
  peMode = 'new'; peId = null; peAvatar = null; peImage = null;
  $('#pf-name').value = ''; $('#pf-desc').value = ''; $('#pf-note').value = '';
  updatePersonaForm();
  closeModal('modal-persona');
}

let ceMode = 'new';
let ceId = null;
let ceEmoji = EMOJIS[0];
let ceAvatar = null;
let ceImage = null;
let delArmed = null;
let ceVariables = {};

function switchCeDescTab(tab) {
  const isEdit = tab === 'edit';
  $('#ce-tab-edit').classList.toggle('active', isEdit);
  $('#ce-tab-preview').classList.toggle('active', !isEdit);
  $('#ce-desc-edit-wrap').classList.toggle('hidden', !isEdit);
  $('#ce-desc-prev-wrap').classList.toggle('hidden', isEdit);
  // The preview box's resize handle sits AFTER the box in the DOM — it must
  // never stay visible while the box itself is hidden (it would show up as a
  // dead second bar under the description textarea in Edit mode).
  if ($('#ce-desc-prev-wrap')._resizeBar) {
    $('#ce-desc-prev-wrap')._resizeBar.classList.toggle('hidden', isEdit);
  }
  if (!isEdit) renderCeDescPreview();
}

function renderCeDescPreview() {
  const raw = $('#ce-desc').value;
  const charName = $('#ce-name').value.trim() || 'Character';
  $('#ce-desc-prev-wrap').innerHTML = renderPreviewMarkdown(raw, ceId, null, charName);
}

let ceScenSelectedId = null;
let ceScenTab = 'preview'; // 'preview' | 'vars'
let ceScenDropdownOpen = false;

function renderCeScenActiveCard() {
  const card = $('#ce-scen-active-card');
  const title = $('#ce-scen-active-title');
  const desc = $('#ce-scen-active-desc');
  const switchBtn = $('#ce-scen-switch-btn-text');
  if (!card || !title || !desc || !switchBtn) return;

  const scen = (state.scenarios || []).find((s) => s.id === ceScenSelectedId);
  if (scen) {
    card.classList.add('is-selected');
    title.textContent = scen.title;
    desc.textContent = scen.description || scen.content.slice(0, 110);
    switchBtn.textContent = 'Switch ▾';
  } else {
    card.classList.remove('is-selected');
    title.textContent = 'Select a scenario to test against…';
    desc.textContent = 'Click here or Choose to select from available scenarios.';
    switchBtn.textContent = 'Choose ▾';
  }
}

function renderCeScenCards(query = '') {
  const container = $('#ce-scen-cards-scroll');
  if (!container) return;
  const q = (query || '').trim().toLowerCase();
  let scenarios = state.scenarios || [];
  if (q) {
    scenarios = scenarios.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.content && s.content.toLowerCase().includes(q))
    );
  }

  if (scenarios.length === 0) {
    container.innerHTML = `<div class="prow-desc" style="padding:16px;text-align:center">${q ? `No scenarios matching "${esc(query)}"` : 'No scenarios available'}</div>`;
    return;
  }

  container.innerHTML = scenarios.map((s) => {
    const isSelected = ceScenSelectedId === s.id;
    // Count variables in this scenario
    const tagsRegex = /\{\{\s*([\w.-]+)\s*\}\}/gi;
    const tags = new Set();
    let m;
    while ((m = tagsRegex.exec(s.content)) !== null) {
      tags.add(m[1].toLowerCase());
    }
    const varCount = tags.size;

    return `
      <div class="ce-scen-opt-card ${isSelected ? 'selected' : ''}" data-scen-id="${s.id}">
        <div class="ce-scen-opt-card-top">
          <div class="ce-scen-opt-title-group">
            <span>🎬</span>
            <span class="ce-scen-opt-card-title">${esc(s.title)}</span>
          </div>
          ${isSelected ? '<span class="ce-scen-opt-sel-tick">✓ Active</span>' : ''}
        </div>
        <div class="ce-scen-opt-card-desc">${esc(s.description || s.content.slice(0, 95))}</div>
        <div class="ce-scen-opt-card-foot">
          <span class="ce-scen-opt-vars-pill">${varCount} template variable${varCount === 1 ? '' : 's'}</span>
          <span style="color:var(--muted)">Click to select</span>
        </div>
      </div>
    `;
  }).join('');
}

function openCeScenDropdown() {
  const menu = $('#ce-scen-dropdown');
  if (!menu) return;
  menu.classList.remove('hidden');
  ceScenDropdownOpen = true;
  const input = $('#ce-scen-search-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 40);
  }
  renderCeScenCards('');
}

function closeCeScenDropdown() {
  const menu = $('#ce-scen-dropdown');
  if (!menu) return;
  menu.classList.add('hidden');
  ceScenDropdownOpen = false;
}

function toggleCeScenDropdown() {
  if (ceScenDropdownOpen) {
    closeCeScenDropdown();
  } else {
    openCeScenDropdown();
  }
}

function openCeScenPanel() {
  const panel = $('#ce-scen-panel');
  const card = $('#ce-modal-card');
  if (!panel || !card) return;
  panel.classList.remove('hidden');
  card.classList.add('with-scen-panel');
  $('#ce-scen-panel-toggle')?.classList.add('active');
  renderCeScenActiveCard();
  if (!ceScenSelectedId) {
    openCeScenDropdown();
  } else {
    closeCeScenDropdown();
  }
  updateCeScenPanelUI();
}

function closeCeScenPanel() {
  const panel = $('#ce-scen-panel');
  const card = $('#ce-modal-card');
  if (!panel || !card) return;
  panel.classList.add('hidden');
  card.classList.remove('with-scen-panel');
  $('#ce-scen-panel-toggle')?.classList.remove('active');
  closeCeScenDropdown();
}

function toggleCeScenPanel() {
  const panel = $('#ce-scen-panel');
  if (!panel) return;
  if (panel.classList.contains('hidden')) {
    openCeScenPanel();
  } else {
    closeCeScenPanel();
  }
}

function switchCeScenTab(tab) {
  ceScenTab = tab;
  const isPrev = tab === 'preview';
  $('#ce-scen-tab-preview')?.classList.toggle('active', isPrev);
  $('#ce-scen-tab-vars')?.classList.toggle('active', !isPrev);
  $('#ce-scen-view-preview')?.classList.toggle('hidden', !isPrev);
  $('#ce-scen-view-vars')?.classList.toggle('hidden', isPrev);
}

function renderCeScenPreviewMarkdown(raw, charName, customVars, scen = null) {
  if (!raw || !raw.trim()) return '';
  const persona = activePersona();
  const userName = (persona && persona.name) || 'the user';
  const cName = charName || 'the character';

  // 1. Process markdown safely
  let html = md(raw);

  const vars = (scen && scen.characterVariables && scen.characterVariables[ceId]) || customVars || {};

  // 2. Replace {{...}} with highlighted badges (GREEN for configured, RED for unconfigured/missing)
  html = html.replace(/\{\{\s*([\w.-]+)\s*\}\}/gi, (match, key) => {
    const lower = key.toLowerCase();
    if (lower === 'char') {
      const hasName = Boolean(cName && cName.trim() && cName !== 'the character');
      return hasName
        ? `<mark class="scen-hl configured" title="{{char}}: Character Name (${esc(cName)})">${esc(cName)}</mark>`
        : `<mark class="scen-hl missing" title="{{char}}: Name not configured">[missing: {{char}}]</mark>`;
    }
    if (lower === 'user') {
      return `<mark class="scen-hl configured" title="{{user}}: Personality Name (${esc(userName)})">${esc(userName)}</mark>`;
    }
    const val = vars[lower];
    if (val && String(val).trim()) {
      return `<mark class="scen-hl configured" title="{{${esc(lower)}}}: Configured (${esc(String(val).trim())})">${esc(String(val).trim())}</mark>`;
    }
    return `<mark class="scen-hl missing" title="{{${esc(lower)}}}: Not configured on this character in this scenario">[missing: {{${esc(lower)}}}]</mark>`;
  });

  return html;
}

let ceScenSaveTimeout = null;
function saveCeScenarioVars(scen) {
  if (!scen || !scen.id) return;
  api('/scenarios/' + scen.id, {
    method: 'PUT',
    body: JSON.stringify({ characterVariables: scen.characterVariables }),
  }).catch((e) => console.error('Failed to save scenario character variables:', e));
}

function updateCeScenPanelUI() {
  const panel = $('#ce-scen-panel');
  if (!panel || panel.classList.contains('hidden')) return;

  const charName = $('#ce-name')?.value.trim() || '';

  renderCeScenActiveCard();
  const scenId = ceScenSelectedId;

  const contentWrap = $('#ce-scen-content-wrap');
  const emptyHint = $('#ce-scen-empty-hint');
  if (!scenId) {
    contentWrap?.classList.add('hidden');
    emptyHint?.classList.remove('hidden');
    return;
  }

  const scen = (state.scenarios || []).find((s) => s.id === scenId);
  if (!scen) {
    contentWrap?.classList.add('hidden');
    emptyHint?.classList.remove('hidden');
    return;
  }

  contentWrap?.classList.remove('hidden');
  emptyHint?.classList.add('hidden');

  if (!scen.characterVariables) scen.characterVariables = {};
  if (!scen.characterVariables[ceId]) scen.characterVariables[ceId] = {};
  const scCharVars = scen.characterVariables[ceId];

  // Extract all {{tag}} tokens from scenario.content
  const tagsRegex = /\{\{\s*([\w.-]+)\s*\}\}/gi;
  const foundTags = new Set();
  let m;
  while ((m = tagsRegex.exec(scen.content)) !== null) {
    foundTags.add(m[1].toLowerCase());
  }

  const customTags = [];
  let hasCharTag = false;
  let hasUserTag = false;

  for (const tag of foundTags) {
    if (tag === 'char') { hasCharTag = true; continue; }
    if (tag === 'user') { hasUserTag = true; continue; }
    customTags.push(tag);
  }

  customTags.sort((a, b) => a.localeCompare(b));

  let configuredCount = 0;
  let missingCount = 0;

  for (const tag of customTags) {
    const val = scCharVars[tag];
    const isSet = Boolean(val && String(val).trim());
    if (isSet) configuredCount++; else missingCount++;
  }

  // Update Status Banner
  const banner = $('#ce-scen-status-banner');
  if (banner) {
    if (customTags.length === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `<span>ℹ This scenario does not use any template variables.</span>`;
    } else if (missingCount === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `
        <span>✓ All scenario variables configured for ${esc(charName || 'this character')}</span>
        <span class="ce-scen-stat-pill green">${configuredCount} of ${customTags.length}</span>
      `;
    } else {
      banner.className = 'ce-scen-status-banner has-missing';
      banner.innerHTML = `
        <span>⚠ ${missingCount} variable${missingCount === 1 ? '' : 's'} not configured for ${esc(charName || 'this character')}</span>
        <span class="ce-scen-stat-pill red">${missingCount} missing</span>
      `;
    }
  }

  // Update Variables Checklist view with editable inputs for this character in this scenario
  const varsList = $('#ce-scen-vars-list');
  if (varsList) {
    if (customTags.length === 0 && !hasCharTag && !hasUserTag) {
      varsList.innerHTML = `<div class="prow-desc" style="padding:14px;text-align:center">No variables found in this scenario.</div>`;
    } else {
      let html = '';
      if (customTags.length > 0) {
        html += customTags.map((tag) => {
          const val = scCharVars[tag] != null ? String(scCharVars[tag]) : '';
          const isSet = Boolean(val && val.trim().length > 0);
          return `
            <div class="ce-scen-var-card ${isSet ? 'configured' : 'missing'}" data-scen-var-card="${esc(tag)}">
              <div class="ce-scen-var-head">
                <span class="ce-scen-var-tag ${isSet ? 'configured' : 'missing'}">
                  <code>{{${esc(tag)}}}</code>
                </span>
                <span class="ce-scen-var-badge ${isSet ? 'configured' : 'missing'}">
                  ${isSet ? 'Configured' : 'Missing'}
                </span>
              </div>
              <textarea
                class="search-input ce-scen-var-input"
                data-scen-var="${esc(tag)}"
                placeholder="Value for ${esc(charName || 'this character')} in ${esc(scen.title)}…"
                rows="1"
                autocomplete="off">${esc(val)}</textarea>
            </div>
          `;
        }).join('');
      }
      if (hasCharTag || hasUserTag) {
        const persona = activePersona();
        html += `
          <div class="se-system-tags-card" style="margin-top:6px">
            <span style="font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--muted)">Built-in macros</span>
            ${hasCharTag ? `<div class="se-system-tag-row"><code>{{char}}</code><span>&rarr; ${esc(charName || 'Character Name')}</span></div>` : ''}
            ${hasUserTag ? `<div class="se-system-tag-row"><code>{{user}}</code><span>&rarr; ${esc(persona ? persona.name : 'the user')}</span></div>` : ''}
          </div>
        `;
      }
      varsList.innerHTML = html;
      varsList.querySelectorAll('.ce-scen-var-input').forEach((input) => {
        makeTextareaAutoResize(input, { min: 38, max: 240 });
      });
    }
  }

  // Update Preview view for this specific character in this scenario
  const previewBox = $('#ce-scen-preview-text');
  if (previewBox) {
    previewBox.innerHTML = renderCeScenPreviewMarkdown(scen.content, charName, scCharVars, scen);
  }
}

function openCharModal(char) {
  ceMode = char ? 'edit' : 'new';
  ceId = char ? char.id : ('c-' + uid());
  ceEmoji = char ? char.emoji : EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  ceAvatar = char ? char.avatar : null;
  ceImage = char ? char.image : null;
  ceVariables = { ...(char && char.variables && typeof char.variables === 'object' ? char.variables : {}) };

  $('#ce-title').textContent = char ? 'Edit character' : 'New character';
  $('#ce-poses-enabled').checked = !!(char && char.posesEnabled);
  $('#ce-name').value = char ? char.name : '';
  $('#ce-desc').value = char ? char.description : '';
  $('#ce-note').value = char ? char.note || '' : '';

  switchCeDescTab('edit');
  closeCeScenPanel();
  renderCeScenActiveCard();
  switchCeScenTab('preview');
  renderCeEmojiGrid();
  updateCeAvatarUI();
  updateCePosesToggleUI();
  const del = $('#ce-delete');
  del.classList.toggle('hidden', ceMode !== 'edit');
  const exp = $('#ce-export');
  if (exp) exp.classList.toggle('hidden', ceMode !== 'edit');
  disarmDelete();
  openModal('modal-char');
  setTimeout(() => $('#ce-name').focus(), 60);
  if (ceId) loadPoses(ceId);
  updateCePosesNote();
  takeModalSnapshot('modal-char');
}

function updateCePosesToggleUI() {
  const enabled = $('#ce-poses-enabled').checked;
  $('#ce-poses').classList.toggle('hidden', !enabled);
  $('#ce-poses-note').classList.toggle('hidden', !enabled);
  const lbl = $('#ce-avatar-label');
  if (lbl) lbl.textContent = enabled ? 'Default profile picture' : 'Profile picture';
}

function renderCeEmojiGrid() {
  $('#ce-emojis').innerHTML = EMOJIS.map((e) => `
    <button type="button" class="eg-btn ${e === ceEmoji ? 'sel' : ''}" data-emoji="${e}">${e}</button>`).join('');
}

function updateCeAvatarUI() {
  const pv = $('#ce-preview');
  if (ceAvatar) {
    pv.classList.remove('emoji');
    pv.textContent = '';
    pv.style.backgroundImage = `url('${ceAvatar}')`;
  } else {
    pv.classList.add('emoji');
    pv.style.backgroundImage = '';
    pv.textContent = ceEmoji;
  }
  $('#ce-emoji-block').classList.toggle('hidden', !!ceAvatar);
  $('#ce-remove-avatar').classList.toggle('hidden', !ceAvatar && !ceImage);
  const full = $('#ce-preview-full');
  full.classList.toggle('hidden', !ceImage);
  if (ceImage) full.style.backgroundImage = `url('${ceImage}')`;
}

function disarmDelete() {
  const btn = $('#ce-delete');
  btn.classList.remove('armed');
  btn.textContent = 'Delete character';
  clearTimeout(delArmed);
  delArmed = null;
}

async function charFormSave() {
  const name = $('#ce-name').value.trim();
  if (!name) { toast('Give your character a name'); return; }
  const body = {
    name,
    description: $('#ce-desc').value.trim(),
    note: $('#ce-note').value.trim(),
    emoji: ceEmoji,
    avatar: ceAvatar,
    image: ceImage,
    posesEnabled: $('#ce-poses-enabled').checked,
  };
  try {
    let saved;
    if (ceMode === 'new') {
      body.id = ceId;
      saved = await api('/characters', { method: 'POST', body: JSON.stringify(body) });
      state.characters.push(saved);
      ui.activeCharacterId = saved.id;
      saveUi();
      toast('Character created');
    } else {
      saved = await api('/characters/' + ceId, { method: 'PUT', body: JSON.stringify(body) });
      const i = state.characters.findIndex((x) => x.id === ceId);
      state.characters[i] = saved;
      toast('Character saved');
    }
    if (ceScenSelectedId) {
      const scen = state.scenarios.find((s) => s.id === ceScenSelectedId);
      if (scen) saveCeScenarioVars(scen);
    }
  } catch (e) { toast(e.message); return; }
  renderSidebar();
  renderSidebarVars();
  renderChat();
  closeModal('modal-char');
  loadPoses(ceMode === 'new' ? ui.activeCharacterId : ceId);
}

/* ---- poses: loading, live swap and the poses modal ---------------------- */

const poseSeq = {};

async function loadPoses(charId) {
  if (!charId) return;
  const seq = (poseSeq[charId] = (poseSeq[charId] || 0) + 1);
  try {
    const d = await api(`/characters/${charId}/poses`);
    if (poseSeq[charId] !== seq) return;
    state.poses[charId] = d.poses || [];
    state.posesLoaded[charId] = true;
  } catch (e) {
    console.error('[poses] load failed', e);
    if (poseSeq[charId] === seq) toast(e.message);
    return;
  }
  if (ui.activeCharacterId === charId) {
    applyChatBg();
    renderHeader();
    renderChat({ keepScroll: true });
  }
  updateCePosesNote();
}

function updateCePosesNote() {
  const note = $('#ce-poses-note');
  if (!note) return;
  const charId = $('#modal-char').classList.contains('open') ? ceId : ui.activeCharacterId;
  const list = charId ? poseList(charId) : [];
  if (!list.length) { note.textContent = 'Default poses · no images yet'; return; }
  const withImg = list.filter((p) => p.hasImage || p.image).length;
  const def = list.find((p) => p.isDefault);
  note.textContent = `${list.length} poses · ${withImg} with images${def ? ` · Default: ${def.name}` : ''}`;
}

/* Swap the on-screen pose without re-rendering the feed: a full re-render here
   would yank the scroll position mid-stream. */
function applyPoseLive(poseId, poseName) {
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!chat) return;
  chat.poseId = poseId || null;
  if (poseName && !poseById(chat.characterId, chat.poseId)) {
    // Local list is stale — pull it so the swap can actually paint.
    console.warn('[poses] unknown pose', poseId);
    loadPoses(chat.characterId);
  }
  applyChatBg();
  renderHeader();
  patchLastCharMsg();
}

function patchLastCharMsg() {
  const msgs = $$('#chat-feed .msg.char');
  const el = msgs[msgs.length - 1];
  const c = activeChar();
  const chat = c && activeChat(c);
  if (!el || !chat) return;
  const p = poseById(chat.characterId, chat.poseId);
  const av = $('.avatar', el);
  if (av) {
    if (p && p.thumb) {
      av.classList.remove('emoji');
      av.style.backgroundImage = `url('${p.thumb}')`;
    } else {
      av.style.backgroundImage = (c.avatar || c.image) ? `url('${c.avatar || c.image}')` : '';
      av.classList.toggle('emoji', !(c.avatar || c.image));
      if (c.avatar || c.image) av.textContent = '';
      else av.textContent = c.emoji;
    }
  }
  const meta = $('.msg-meta', el);
  if (!meta) return;
  const existing = $('.pose-tag', meta);
  const tag = poseTagHtml(p);
  if (!tag) { if (existing) existing.remove(); return; }
  if (existing) existing.outerHTML = tag;
  else meta.insertAdjacentHTML('afterbegin', tag);
}

let poseCharId = null;
let poseEditId = null;
let poseCreating = false;
let poseUploadId = null;
let poseDelArm = null;

async function openPosesModal(charIdOverride) {
  const charModalOpen = $('#modal-char').classList.contains('open');
  if (charModalOpen && ceMode !== 'edit') { toast('Save the character first'); return; }
  const charId = (charModalOpen && ceId) ? ceId : (charIdOverride || ui.activeCharacterId);
  const c = charId && state.characters.find((x) => x.id === charId);
  if (!c) { toast('Save the character first'); return; }
  poseCharId = charId;
  closePoseForm();
  clearPoseDelArm();
  await loadPoses(charId);
  $('#pose-char-name').textContent = c.name;
  renderPosesGrid();
  openModal('modal-poses');
  takeModalSnapshot('modal-poses');
}

function renderPosesGrid() {
  const grid = $('#poses-grid');
  if (!grid) return;
  const c = state.characters.find((x) => x.id === poseCharId);
  const chat = c && c.id === ui.activeCharacterId ? activeChat(c) : null;
  const list = poseList(poseCharId);
  grid.innerHTML = list.map((p) => {
    const active = !!chat && chat.poseId === p.id;
    const isDef = !!p.isDefault;
    const src = p.thumb || p.image;
    const has = !!(p.hasThumb || p.hasImage || src);
    // A square-only pose can never fill the backdrop and the director skips it,
    // so the card must not look identical to one with a full image.
    const full = !!(p.hasImage || p.image);
    const thumbOnly = has && !full;
    return `
    <div class="pose-card ${active ? 'active' : ''} ${isDef ? 'is-default' : ''}" data-id="${p.id}">
      <div class="pose-thumb ${has ? '' : 'none'}">${has ? `<img src="${esc(src)}" alt="${esc(p.name)}">` : esc((p.name || '?').trim().charAt(0))}</div>
      <div class="pose-body">
        <div class="pose-name">${esc(p.name)}</div>
        <div class="pose-desc">${esc(p.description || '')}</div>
        <div class="pose-badges">
          ${isDef ? '<span class="pose-badge def">★ Default</span>' : ''}
          ${active ? '<span class="pose-badge act">On screen</span>' : ''}
          ${thumbOnly ? '<span class="pose-badge" title="Only the square crop was saved — the full image is missing">Thumb only</span>' : ''}
        </div>
        <div class="pose-acts">
          <button type="button" class="pose-act ${has ? 'on' : ''}" data-pose-act="img" title="${has ? 'Replace image' : 'Choose image'}">${I.image}</button>
          <button type="button" class="pose-act" data-pose-act="edit" title="Rename / describe">${I.pencil}</button>
          ${!isDef ? `<button type="button" class="pose-act" data-pose-act="default" title="Make this the default pose">${I.star}</button>` : ''}
          <button type="button" class="pose-act" data-pose-act="use" title="Show this pose now">${I.check}</button>
          <button type="button" class="pose-act danger" data-pose-act="del" title="Delete">${I.trash}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  updateCePosesNote();
}

function openPoseForm(p) {
  const form = $('#pose-form');
  if (!form) return;
  poseEditId = p ? p.id : null;
  poseCreating = !p;
  $('#pose-name').value = p ? p.name : '';
  $('#pose-desc').value = p ? p.description || '' : '';
  form.classList.remove('hidden');
  setTimeout(() => $('#pose-name').focus(), 30);
}

function closePoseForm() {
  const form = $('#pose-form');
  if (form) form.classList.add('hidden');
  poseEditId = null;
  poseCreating = false;
}

async function poseFormSave() {
  const name = $('#pose-name').value.trim();
  if (!name) { toast('Name is required'); return; }
  const creating = poseCreating || !poseEditId;
  const charId = poseCharId;
  try {
    if (creating) {
      await api(`/characters/${charId}/poses`, { method: 'POST', body: JSON.stringify({ name, description: $('#pose-desc').value.trim() }) });
    } else {
      await api('/poses/' + poseEditId, { method: 'PUT', body: JSON.stringify({ name, description: $('#pose-desc').value.trim() }) });
    }
  } catch (e) { toast(e.message); return; }
  closePoseForm();
  await loadPoses(charId);
  renderPosesGrid();
  toast(creating ? 'Pose added' : 'Pose updated');
}

async function poseAdd() {
  const charId = poseCharId;
  if (!charId) return;
  try {
    const r = await api(`/characters/${charId}/poses`, { method: 'POST', body: JSON.stringify({ name: 'New pose', description: '' }) });
    await loadPoses(charId);
    renderPosesGrid();
    openPoseForm(r.pose || null);
  } catch (e) {
    // Offline — keep the click useful by drafting the pose locally instead.
    toast(e.message);
    openPoseForm(null);
  }
}

async function savePoseImage(id, r) {
  if (!r) return;
  const charId = poseCharId;
  const body = { thumb: r.square };
  if (r.full) body.image = r.full;
  try {
    await api('/poses/' + id, { method: 'PUT', body: JSON.stringify(body) });
  } catch (e) { toast(e.message); return; }
  await loadPoses(charId);
  renderPosesGrid();
  toast('Pose image updated');
}

async function usePose(p) {
  const c = activeChar();
  if (!c || c.id !== poseCharId) { toast('Only the character you are chatting with can swap live'); return; }
  const chat = activeChat(c);
  if (!chat) { toast('No chat to update'); return; }
  let r;
  try {
    r = await api(`/chats/${chat.id}/pose`, { method: 'POST', body: JSON.stringify({ poseId: p.id }) });
  } catch (e) { toast(e.message); return; }
  if (r.chat) mergeChat(chat, r.chat);
  applyPoseLive(chat.poseId, p.name);
  renderPosesGrid();
  toast('Showing: ' + p.name);
}

async function poseSetDefault(p) {
  const charId = poseCharId;
  try {
    await api(`/characters/${charId}/poses/${p.id}/default`, { method: 'POST' });
  } catch (e) {
    try {
      await api('/poses/' + p.id, { method: 'PUT', body: JSON.stringify({ isDefault: true }) });
    } catch (err) { toast(err.message); return; }
  }
  await loadPoses(charId);
  const c = state.characters.find((x) => x.id === charId);
  if (c) {
    try {
      const fresh = await api('/characters/' + charId);
      Object.assign(c, fresh);
      renderSidebar();
      renderHeader();
    } catch {}
  }
  renderPosesGrid();
  toast(`Default pose set to "${p.name}"`);
}

function clearPoseDelArm() {
  if (!poseDelArm) return;
  clearTimeout(poseDelArm.timer);
  poseDelArm.btn.classList.remove('on');
  poseDelArm.btn.title = 'Delete';
  poseDelArm = null;
}

function poseDelete(p, btn) {
  if (poseDelArm && poseDelArm.id === p.id) {
    clearPoseDelArm();
    deletePose(p);
    return;
  }
  clearPoseDelArm();
  btn.classList.add('on');
  btn.title = 'Click again to confirm';
  poseDelArm = { id: p.id, btn, timer: setTimeout(clearPoseDelArm, 2600) };
  toast('Click delete again to confirm');
}

async function deletePose(p) {
  const charId = poseCharId;
  try {
    await api('/poses/' + p.id, { method: 'DELETE' });
  } catch (e) { toast(e.message); return; }
  const c = state.characters.find((x) => x.id === charId);
  if (c) c.poses = (c.poses || []).filter((x) => x.id !== p.id);
  const chat = c && c.id === ui.activeCharacterId ? activeChat(c) : null;
  if (chat && chat.poseId === p.id) chat.poseId = null;
  await loadPoses(charId);
  renderPosesGrid();
  toast('Deleted "' + p.name + '"');
}

function provGridHtml(sel) {
  return Object.entries(PROVIDERS).map(([key, p]) => `
    <button type="button" class="prov ${sel === key ? 'selected' : ''}" data-pv="${key}">
      <span class="prov-name">${p.label}</span>
      <span class="prov-desc">${p.desc}</span>
    </button>`).join('');
}

function switchSettingsTab(tabName) {
  $$('.settings-tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.stab === tabName));
  $$('.settings-tab-pane').forEach((p) => p.classList.toggle('hidden', p.id !== `set-pane-${tabName}`));
}

function updateSettingsStatusCard() {
  const card = $('#set-status-card');
  if (!card) return;
  const ai = effectiveAi();
  const live = ai.apiKey || ai.provider === 'ollama';
  const providerLabel = PROVIDERS[ai.provider]?.label || 'Custom';
  const modelName = ai.model || 'Default';
  card.innerHTML = live
    ? `<div class="status-badge live">🟢 Ready to Chat</div>
       <div class="status-desc">Connected to <strong>${esc(providerLabel)}</strong> (${esc(modelName)}). Real AI replies are enabled.</div>`
    : `<div class="status-badge sim">⚪ Simulated Mode</div>
       <div class="status-desc">No API key entered. AI replies are simulated samples until you add a key below.</div>`;
}

function openSettings(tab = 'ai') {
  const s = state.settings;
  $('#prov-grid').innerHTML = provGridHtml(s.provider);
  $('#set-url').value = s.baseUrl;
  $('#set-key').value = s.apiKey;
  $('#set-key').type = 'password';
  $('#key-toggle').textContent = 'Show';
  $('#set-model').value = s.model;
  setComboModels($('#set-model').closest('.combo'), PROVIDERS[s.provider]?.models || []);
  $('#set-temp').value = s.temperature;
  $('#temp-val').textContent = (+s.temperature).toFixed(1);
  $('#set-bgop').value = Math.round((+s.bgOpacity || 0) * 100);
  $('#bgop-val').textContent = Math.round((+s.bgOpacity || 0) * 100) + '%';
  $('#set-bgblur').value = +s.bgBlur || 0;
  $('#bgblur-val').textContent = (+s.bgBlur || 0) + 'px';
  const dimPct = Math.round((Number.isFinite(+s.actionDim) ? +s.actionDim : 0.72) * 100);
  $('#set-actdim').value = dimPct;
  $('#actdim-val').textContent = dimPct + '%';
  $('#pose-agent').checked = !!s.poseAgent;
  $('#pose-recheck').checked = s.poseRecheck !== false;
  $('#pose-provider').value = s.poseProvider || 'openrouter';
  $('#pose-url').value = s.poseBaseUrl || '';
  $('#pose-key').value = s.poseApiKey || '';
  $('#pose-model').value = s.poseModel || 'typesafe/jev-1.13';
  updatePoseProviderHints();
  $('#set-agent-override').checked = !!s.agentOverride;
  $('#agent-prov-grid').innerHTML = provGridHtml(s.agentProvider || 'openrouter');
  $('#agent-url').value = s.agentBaseUrl || '';
  $('#agent-key').value = s.agentApiKey || '';
  $('#agent-key').type = 'password';
  $('#agent-key-toggle').textContent = 'Show';
  $('#agent-model').value = s.agentModel || '';
  setComboModels($('#agent-model').closest('.combo'), PROVIDERS[s.agentProvider || 'openrouter']?.models || []);
  $('#agent-image-model').value = s.agentImageModel || '';
  $('#agent-image-edit-model').value = s.agentImageEditModel || '';
  updateAgentConnUI();
  const posePct = Math.round((Number.isFinite(+s.poseLikelihood) ? +s.poseLikelihood : 0.6) * 100);
  $('#set-poselike').value = posePct;
  $('#poselike-val').textContent = posePct + '%';
  const poseCtx = Number.isFinite(+s.poseContextCount) ? +s.poseContextCount : 3;
  $('#set-posecontext').value = poseCtx;
  $('#posecontext-val').textContent = poseCtx === 0 ? 'None (latest reply only)' : `${poseCtx} message${poseCtx === 1 ? '' : 's'}`;
  renderPresetList();
  switchSettingsTab(tab);
  updateSettingsStatusCard();
  openModal('modal-settings');
  takeModalSnapshot('modal-settings');
}

function updateAgentConnUI() {
  const el = $('#agent-conn-fields');
  if (el) el.hidden = !$('#set-agent-override').checked;
}

function setAgentProviderUI(pv) {
  $$('#agent-prov-grid .prov').forEach((b) => b.classList.toggle('selected', b.dataset.pv === pv));
  const meta = PROVIDERS[pv];
  if (!meta) return;
  $('#agent-url').value = meta.baseUrl || '';
  setComboModels($('#agent-model').closest('.combo'), meta.models || []);
  $('#agent-model').value = (meta.models && meta.models[0]) || '';
}

function updatePoseProviderHints() {
  const prov = $('#pose-provider').value;
  const urlEl = $('#pose-url');
  const modelEl = $('#pose-model');
  if (prov === 'openrouter') {
    urlEl.placeholder = 'Leave blank for OpenRouter (https://openrouter.ai/api/alpha/decisions)';
    modelEl.placeholder = 'typesafe/jev-1.13 (default)';
  } else if (prov === 'custom') {
    urlEl.placeholder = 'e.g. http://localhost:8000/v1 (calls /v1/decisions)';
    modelEl.placeholder = 'e.g. jev';
  } else {
    urlEl.placeholder = 'e.g. https://api.openai.com/v1';
    modelEl.placeholder = 'e.g. jev or gpt-6-luna';
  }
}

/* --- model picker ---------------------------------------------------------
   A dropdown of the provider's models with a search box, sitting on top of a
   text field that stays free for a custom model id. Everything is scoped to the
   .combo root so the settings and preset forms can both use it. */
const comboState = new WeakMap();

function comboEl(combo) {
  return {
    value: $('.combo-value', combo),
    pop: $('.combo-pop', combo),
    search: $('.combo-search', combo),
    list: $('.combo-list', combo),
    custom: $('.combo-custom', combo),
  };
}

function comboMatch(model, q) {
  if (!q) return true;
  const m = model.toLowerCase();
  if (m.includes(q)) return true;
  // Also match on any segment of a namespaced id, so "gpt" finds
  // "openai/gpt-4o" and "4o" finds it too.
  return m.split(/[\/:._-]/).some((seg) => seg.includes(q));
}

function comboCustomLabel(combo, el) {
  const typed = el.value.value.trim();
  const known = (comboState.get(combo)?.models || []).includes(typed);
  el.custom.textContent = typed || '—';
  el.custom.classList.toggle('pending', !!typed && !known);
  el.custom.title = typed ? (known ? 'Already in the list' : 'Not in the list — will be sent as-is') : '';
}

function comboRender(combo) {
  const el = comboEl(combo);
  const st = comboState.get(combo);
  const q = el.search.value.trim().toLowerCase();
  const models = (st.models || []).filter((m) => comboMatch(m, q));
  const current = el.value.value.trim();
  if (!models.length) {
    el.list.innerHTML = `<div class="combo-empty">${st.models.length ? 'No model matches that search' : 'No models yet — press “Fetch list”'}</div>`;
  } else {
    el.list.innerHTML = models
      .map((m) => `<button type="button" class="combo-opt ${m === current ? 'current' : ''}" data-model="${esc(m)}" role="option" aria-selected="${m === current}">${esc(m)}${m === current ? '<span class="combo-tick">●</span>' : ''}</button>`)
      .join('');
  }
  $$('.combo-opt', el.list).forEach((b, i) => b.classList.toggle('sel', i === st.sel));
  if (st.sel >= $$('.combo-opt', el.list).length) st.sel = -1;
  if (el.list.scrollHeight && st.sel >= 0) {
    const node = $$('.combo-opt', el.list)[st.sel];
    if (node) node.scrollIntoView({ block: 'nearest' });
  }
  comboCustomLabel(combo, el);
}

function comboOpen(combo, focusSearch = true) {
  const st = comboState.get(combo);
  if (!st) return;
  comboCloseAll();
  st.open = true;
  const el = comboEl(combo);
  el.pop.hidden = false;
  el.search.value = '';
  st.sel = -1;
  comboRender(combo);
  /* Open on the full list, scrolled to the model already in use. */
  const cur = $('.combo-opt.current', el.list);
  if (cur) cur.scrollIntoView({ block: 'center' });
  if (focusSearch) el.search.focus();
}

function comboClose(combo) {
  const st = comboState.get(combo);
  if (!st) return;
  st.open = false;
  comboEl(combo).pop.hidden = true;
}

function comboCloseAll() {
  $$('.combo').forEach(comboClose);
}

function comboPick(combo, model) {
  const el = comboEl(combo);
  el.value.value = model;
  comboCustomLabel(combo, el);
  comboFocusValue(combo);
}

/* Hand the caret back to the id field after closing, without the focus handler
   helpfully reopening the list we just dismissed. */
function comboFocusValue(combo) {
  const st = comboState.get(combo);
  const el = comboEl(combo);
  comboClose(combo);
  st.refocusing = true;
  el.value.focus();
}

function comboStep(combo, dir) {
  const st = comboState.get(combo);
  const el = comboEl(combo);
  const n = $$('.combo-opt', el.list).length;
  if (!n) return;
  st.sel = (st.sel + dir + n) % n;
  comboRender(combo);
}

function setupModelCombo(combo, initialModels = []) {
  if (!combo || comboState.has(combo)) return;
  const el = comboEl(combo);
  const st = { models: initialModels.slice(), open: false, sel: -1 };
  comboState.set(combo, st);

  /* Clicking the field reveals the list but keeps the caret where the user
     clicked — they may be typing a custom id, and yanking focus into the
     search box would swallow those keystrokes. */
  el.value.addEventListener('focus', () => {
    if (st.refocusing) { st.refocusing = false; return; }
    comboOpen(combo, false);
  });
  el.value.addEventListener('input', () => comboCustomLabel(combo, el));
  el.value.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); comboOpen(combo); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = $$('.combo-opt', el.list)[st.sel];
      comboPick(combo, opt ? opt.dataset.model : el.value.value.trim());
    } else if (e.key === 'Escape') comboClose(combo);
  });
  el.search.addEventListener('input', () => { st.sel = -1; comboRender(combo); });
  el.search.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); comboStep(combo, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); comboStep(combo, -1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = $$('.combo-opt', el.list)[st.sel];
      /* Enter with nothing highlighted accepts the typed id as a custom model,
         which is what the field is for. */
      comboPick(combo, opt ? opt.dataset.model : el.value.value.trim());
    } else if (e.key === 'Escape') { comboFocusValue(combo); }
  });
  /* Keep the caret in the search box when an option is pressed, so the list
     stays put while the click completes. */
  el.list.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-model]')) e.preventDefault();
  });
  el.list.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-model]');
    if (opt) comboPick(combo, opt.dataset.model);
  });
  el.list.addEventListener('mousemove', (e) => {
    const opt = e.target.closest('[data-model]');
    if (!opt) return;
    const i = $$('.combo-opt', el.list).indexOf(opt);
    if (i === st.sel) return;
    st.sel = i;
    comboRender(combo);
  });
  comboCustomLabel(combo, el);
}

function setComboModels(combo, models) {
  const st = comboState.get(combo);
  if (!st) return;
  st.models = [...new Set(models.filter(Boolean))];
  st.sel = -1;
  comboRender(combo);
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.combo')) comboCloseAll();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') comboCloseAll();
});

function setProviderUI(pv) {
  $$('#prov-grid .prov').forEach((b) => b.classList.toggle('selected', b.dataset.pv === pv));
  const meta = PROVIDERS[pv];
  if (!meta) return;
  $('#set-url').value = meta.baseUrl;
  setComboModels($('#set-model').closest('.combo'), meta.models);
  $('#set-model').value = meta.models[0] || '';
  updateSettingsStatusCard();
}

async function fetchModelList(baseUrl, apiKey, combo, btn, provSel = '#prov-grid .prov.selected') {
  /* Empty base URL fields mean "provider default" — resolve it the same way the
     AI calls do, so Fetch list works out of the box for OpenRouter & co. */
  if (!baseUrl) baseUrl = PROVIDERS[$(provSel)?.dataset.pv || '']?.baseUrl || '';
  if (!baseUrl) { toast('Set a base URL first'); return; }
  const old = btn.textContent;
  btn.textContent = '…';
  btn.disabled = true;
  try {
    const r = await api(`/provider/models?baseUrl=${encodeURIComponent(baseUrl)}&apiKey=${encodeURIComponent(apiKey)}`);
    setComboModels(combo, r.models);
    comboOpen(combo);
    toast(r.models.length ? `Found ${r.models.length} models` : 'No models returned');
  } catch (e) {
    toast(e.message);
  }
  btn.textContent = old;
  btn.disabled = false;
}

function presetSummary(p) {
  return [
    PROVIDERS[p.provider]?.label || p.provider,
    p.model || 'inherit model',
    p.temperature !== null && p.temperature !== undefined ? `temp ${(+p.temperature).toFixed(1)}` : null,
    p.reasoning !== 'default' ? `reasoning: ${p.reasoning}` : null,
    p.maxTokens ? `max ${p.maxTokens}` : null,
  ].filter(Boolean).join(' · ');
}

function renderPresetList() {
  const s = state.settings;
  const countEl = $('#preset-count');
  if (countEl) countEl.textContent = state.presets.length ? `${state.presets.length}` : 'none yet';
  $('#preset-list').innerHTML = state.presets.map((p) => `
    <div class="prow ${p.id === s.activePresetId ? 'active' : ''}">
      <button class="radio" data-use="${p.id}" title="Use this preset"></button>
      <span class="prow-text">
        <span class="prow-name">${esc(p.name)}${p.id === s.activePresetId ? ' <span class="prow-you">· active</span>' : ''}</span>
        <span class="prow-desc">${esc(presetSummary(p))}</span>
      </span>
      <span class="row-actions">
        <button class="icon-btn tiny" data-edit="${p.id}" title="Edit">${I.pencil}</button>
        <button class="icon-btn tiny danger" data-del="${p.id}" title="Delete">${I.trash}</button>
      </span>
    </div>`).join('') || '<div class="preset-empty">No presets — chats use the provider settings above.</div>';
}

async function settingsSave() {
  const selected = $('#prov-grid .prov.selected');
  const agentProv = $('#agent-prov-grid .prov.selected');
  const body = {
    provider: selected ? selected.dataset.pv : 'custom',
    baseUrl: $('#set-url').value.trim(),
    apiKey: $('#set-key').value.trim(),
    model: $('#set-model').value.trim(),
    temperature: +$('#set-temp').value,
    bgOpacity: +$('#set-bgop').value / 100,
    bgBlur: +$('#set-bgblur').value,
    actionDim: +$('#set-actdim').value / 100,
    poseAgent: $('#pose-agent').checked,
    poseRecheck: $('#pose-recheck').checked,
    poseProvider: $('#pose-provider').value,
    poseBaseUrl: $('#pose-url').value.trim(),
    poseApiKey: $('#pose-key').value.trim(),
    poseModel: $('#pose-model').value.trim(),
    poseLikelihood: (+$('#set-poselike').value || 0) / 100,
    poseContextCount: Math.round(+$('#set-posecontext').value || 0),
    agentOverride: $('#set-agent-override').checked,
    agentProvider: agentProv ? agentProv.dataset.pv : 'custom',
    agentBaseUrl: $('#agent-url').value.trim(),
    agentApiKey: $('#agent-key').value.trim(),
    agentModel: $('#agent-model').value.trim(),
    agentImageModel: $('#agent-image-model').value.trim(),
    agentImageEditModel: $('#agent-image-edit-model').value.trim(),
  };
  try {
    state.settings = await api('/settings', { method: 'PUT', body: JSON.stringify(body) });
    closeModal('modal-settings');
    setHint();
    applyChatBg();
    const agentSub = agentEl('#agent-model-label');
    if (agentSub) agentSub.textContent = agentModelLabel();
    toast('Settings saved');
    if (body.poseAgent) poseAgentHint();
  } catch (e) { toast(e.message); }
}

function poseAgentHint() {
  const c = activeChar();
  if (!c) return;
  if (poseList(c.id).some((p) => p.hasImage || p.image || p.hasThumb || p.thumb)) return;
  toast('Add images to your poses to let the director swap them');
}

async function setPreset(pid) {
  try {
    state.settings = await api('/settings', { method: 'PUT', body: JSON.stringify({ activePresetId: pid || null }) });
  } catch (e) { toast(e.message); return; }
  renderHeader();
  setHint();
  renderPresetList();
}

function renderPresetMenu() {
  const menu = $('#preset-menu');
  const pr = activePreset();
  menu.innerHTML = `
    <div class="menu-title">AI preset</div>
    <button class="menu-item ${!pr ? 'active' : ''}" data-pset="">
      <span class="mi-main">
        <span class="mi-name">Provider settings</span>
        <span class="mi-desc">Uses the main Settings configuration</span>
      </span>
      ${!pr ? `<span class="mi-check">${I.check}</span>` : ''}
    </button>
    ${state.presets.map((p) => `
      <button class="menu-item ${pr && p.id === pr.id ? 'active' : ''}" data-pset="${p.id}">
        <span class="mi-main">
          <span class="mi-name">${esc(p.name)}</span>
          <span class="mi-desc">${esc(presetSummary(p))}</span>
        </span>
        ${pr && p.id === pr.id ? `<span class="mi-check">${I.check}</span>` : ''}
      </button>`).join('')}
    <div class="menu-sep"></div>
    <button class="menu-item manage" id="ps-manage">${I.gear}<span>Manage presets</span></button>`;
}

/* Mobile overflow menu (the "⋯" header button): the persona + preset switchers
   live here on phones so the header stays to two tidy buttons — see styles.css. */
function renderMoreMenu() {
  const menu = $('#more-menu');
  const c = activeChar();
  const pr = activePreset();
  const pid = state.settings.activePersonalityId;
  menu.innerHTML = `
    <div class="menu-title">Playing as</div>
    ${state.personalities.map((p) => `
      <button class="menu-item ${p.id === pid ? 'active' : ''}" data-pid="${p.id}">
        ${personaAvatarHtml(p, 'sm')}
        <span class="mi-main">
          <span class="mi-name">${esc(p.name)}</span>
          <span class="mi-desc">${esc(p.note || p.description)}</span>
        </span>
        ${p.id === pid ? `<span class="mi-check">${I.check}</span>` : ''}
      </button>`).join('')}
    <div class="menu-sep"></div>
    <div class="menu-title">AI preset</div>
    <button class="menu-item ${!pr ? 'active' : ''}" data-pset="">
      <span class="mi-main">
        <span class="mi-name">Provider settings</span>
        <span class="mi-desc">Uses the main Settings configuration</span>
      </span>
      ${!pr ? `<span class="mi-check">${I.check}</span>` : ''}
    </button>
    ${state.presets.map((p) => `
      <button class="menu-item ${pr && p.id === pr.id ? 'active' : ''}" data-pset="${p.id}">
        <span class="mi-main">
          <span class="mi-name">${esc(p.name)}</span>
          <span class="mi-desc">${esc(presetSummary(p))}</span>
        </span>
        ${pr && p.id === pr.id ? `<span class="mi-check">${I.check}</span>` : ''}
      </button>`).join('')}
    <div class="menu-sep"></div>
    ${c ? `<button class="menu-item" id="mf-edit-char">${I.pencil}<span>Edit ${esc(c.name)}</span></button>` : ''}
    <button class="menu-item" id="mf-agent">${I.sparkles}<span>AI Agent</span></button>
    <button class="menu-item" id="mf-manage-presets">${I.gear}<span>Manage presets</span></button>
    <button class="menu-item" id="mf-settings">${I.gear}<span>Settings</span></button>`;
}

/* Tiny popover above the composer's ⚡ button: the two "special send" actions
   (OOC steering and writing as your persona) so the composer row itself only
   ever carries one un-accidental button — see styles.css .composer-actions-*. */
function renderComposerActionsMenu() {
  $('#composer-actions-menu').innerHTML = `
    <div class="menu-title">Composer actions</div>
    <button class="menu-item ${isSteerMode ? 'active' : ''}" data-act="steer">
      ${I.zap}
      <span class="mi-main">
        <span class="mi-name">Steer scene (OOC)</span>
        <span class="mi-desc">Direct what happens next, without speaking as your character</span>
      </span>
      ${isSteerMode ? `<span class="mi-check">${I.check}</span>` : ''}
    </button>
    <button class="menu-item" data-act="respond-me">
      ${I.user}
      <span class="mi-main">
        <span class="mi-name">Respond as me</span>
        <span class="mi-desc">AI writes your next message${$('#msg-input').value.trim() ? ' — input text is used as a hint' : ''}</span>
      </span>
    </button>`;
}

let prMode = 'new';
let prId = null;
let defaultPromptCache = null;

function openPresetModal(p) {
  prMode = p ? 'edit' : 'new';
  prId = p ? p.id : null;
  $('#pr-title').textContent = p ? 'Edit preset' : 'New preset';
  $('#pr-name').value = p ? p.name : '';
  $('#pr-prov-grid').innerHTML = provGridHtml(p ? p.provider : state.settings.provider);
  $('#pr-url').value = p ? p.baseUrl : state.settings.baseUrl;
  $('#pr-key').value = p ? p.apiKey : '';
  $('#pr-key').type = 'password';
  $('#pr-key-toggle').textContent = 'Show';
  $('#pr-model').value = p ? p.model : '';
  setComboModels($('#pr-model').closest('.combo'), PROVIDERS[p ? p.provider : state.settings.provider]?.models || []);
  $('#pr-temp').value = p && p.temperature !== null && p.temperature !== undefined ? p.temperature : state.settings.temperature;
  $('#pr-temp-val').textContent = (+$('#pr-temp').value).toFixed(1);
  $('#pr-maxtok').value = p && p.maxTokens !== null && p.maxTokens !== undefined ? p.maxTokens : '';
  $('#pr-reason').value = p ? p.reasoning : 'default';
  if (p) {
    $('#pr-sys').value = p.systemPrompt;
  } else {
    // New preset: start from the built-in prompt so it can be edited instead of hidden
    $('#pr-sys').value = defaultPromptCache || '';
    if (!defaultPromptCache) {
      api('/default-prompt').then((r) => {
        defaultPromptCache = r.prompt;
        if (prMode === 'new' && !$('#pr-sys').value) $('#pr-sys').value = r.prompt;
      }).catch(() => {});
    }
  }
  $('#pr-sys').placeholder = 'Leave empty to use the built-in roleplay prompt. {{char}} and {{user}} are replaced with the character and persona names.';
  $('#pr-delete').classList.toggle('hidden', prMode !== 'edit');
  openModal('modal-preset');
  setTimeout(() => $('#pr-name').focus(), 60);
  takeModalSnapshot('modal-preset');
}

async function presetFormSave() {
  const name = $('#pr-name').value.trim();
  if (!name) { toast('Give the preset a name'); return; }
  const body = {
    name,
    provider: $('#pr-prov-grid .prov.selected')?.dataset.pv || 'custom',
    baseUrl: $('#pr-url').value.trim(),
    apiKey: $('#pr-key').value.trim(),
    model: $('#pr-model').value.trim(),
    temperature: +$('#pr-temp').value,
    maxTokens: $('#pr-maxtok').value.trim() === '' ? null : +$('#pr-maxtok').value,
    reasoning: $('#pr-reason').value,
    systemPrompt: $('#pr-sys').value,
  };
  try {
    if (prMode === 'edit') {
      const saved = await api('/presets/' + prId, { method: 'PUT', body: JSON.stringify(body) });
      const i = state.presets.findIndex((x) => x.id === prId);
      state.presets[i] = saved;
    } else {
      const saved = await api('/presets', { method: 'POST', body: JSON.stringify(body) });
      state.presets.push(saved);
      await setPreset(saved.id);
    }
    toast('Preset saved');
  } catch (e) { toast(e.message); return; }
  closeModal('modal-preset');
  renderPresetList();
  renderHeader();
  setHint();
}

async function presetDelete() {
  const p = state.presets.find((x) => x.id === prId);
  if (!p) return;
  const ok = await customConfirm({
    title: 'Delete AI preset?',
    message: `Delete preset "${p.name}"? This cannot be undone.`,
    confirmText: 'Delete preset',
    danger: true,
  });
  if (!ok) return;
  try {
    const r = await api('/presets/' + prId, { method: 'DELETE' });
    state.presets = r.presets;
    state.settings = r.settings;
    toast('Preset deleted');
  } catch (e) { toast(e.message); return; }
  closeModal('modal-preset');
  renderPresetList();
  renderHeader();
  setHint();
}

/* ---- Scenarios Management & Access List --------------------------------- */

function isScenarioAllowed(s, charId) {
  return true;
}

function accessBadgeLabel(s) {
  return '';
}

function switchSidebarTab(tab) {
  ui.sidebarTab = tab === 'vars' ? 'chars' : tab;
  saveUi();
  const isChars = tab === 'chars';
  const isScen = tab === 'scenarios';
  const isPers = tab === 'personas';

  $('#tab-chars-btn').classList.toggle('active', isChars);
  $('#tab-scenarios-btn').classList.toggle('active', isScen);
  $('#tab-personas-btn')?.classList.toggle('active', isPers);

  $('#panel-chars').classList.toggle('hidden', !isChars);
  $('#panel-scenarios').classList.toggle('hidden', !isScen);
  $('#panel-personas')?.classList.toggle('hidden', !isPers);

  if (isChars) renderSidebar();
  else if (isScen) renderSidebarScenarios();
  else if (isPers) renderSidebarPersonas();
}

function renderSidebarPersonas() {
  const list = $('#persona-sidebar-list');
  if (!list) return;
  const activeId = state.settings.activePersonalityId;
  if (!state.personalities || state.personalities.length === 0) {
    list.innerHTML = `<div class="prow-desc" style="padding:16px 10px;text-align:center">No personas created.<br>Click "New persona" below.</div>`;
    return;
  }
  list.innerHTML = state.personalities.map((p) => {
    const isActive = p.id === activeId;
    return `
      <div class="sidebar-persona-item ${isActive ? 'active' : ''}" data-pid="${p.id}">
        ${personaAvatarHtml(p, 'sm')}
        <div class="spi-main">
          <div class="spi-name-row">
            <span class="spi-name">${esc(p.name)}</span>
            ${isActive ? '<span class="spi-badge">Active</span>' : ''}
          </div>
          <span class="spi-desc">${esc(p.note || p.description || 'No description')}</span>
        </div>
        <button type="button" class="icon-btn tiny spi-edit" data-edit-persona="${p.id}" title="Edit persona">
          ${I.pencil}
        </button>
      </div>
    `;
  }).join('');
}

function renderSidebarScenarios() {
  const list = $('#scenario-list');
  if (!list) return;
  if (!state.scenarios || state.scenarios.length === 0) {
    list.innerHTML = `<div class="prow-desc" style="padding:16px 10px;text-align:center">No scenarios found.<br>Click "New scenario" below.</div>`;
    return;
  }
  list.innerHTML = state.scenarios.map((s) => `
    <div class="scen-item" data-id="${s.id}">
      <span class="scen-icon">🎬</span>
      <span class="scen-main">
        <span class="scen-row">
          <span class="scen-name">${esc(s.title)}</span>
        </span>
        <span class="scen-desc">${esc(s.description || s.content.slice(0, 85))}</span>
      </span>
    </div>
  `).join('');
}

function renderSidebarVars(query = '') {
  const list = $('#vars-list');
  if (!list) return;
  const q = (query || '').trim().toLowerCase();
  let all = getAllVariables();
  if (q) {
    all = all.filter((v) =>
      v.key.toLowerCase().includes(q) ||
      v.usedBy.some((u) => u.characterName.toLowerCase().includes(q) || u.value.toLowerCase().includes(q))
    );
  }
  const badge = $('#vars-count-badge');
  if (badge) badge.textContent = all.length;

  if (all.length === 0) {
    list.innerHTML = `<div class="prow-desc" style="padding:24px 14px;text-align:center">${q ? `No variables matching "${esc(query)}"` : 'No variables created yet.<br>Add variables to any scenario (e.g. <code>{{outfit}}</code>) and configure values for characters.'}</div>`;
    return;
  }

  list.innerHTML = all.map((v) => {
    const usedCount = v.usedBy.length;
    return `
      <div class="var-item" data-var-key="${esc(v.key)}">
        <div class="var-item-head">
          <code class="var-tag" title="{{${esc(v.key)}}}">{{${esc(v.key)}}}</code>
          <div class="var-acts">
            <button type="button" class="btn btn-ghost tiny var-copy-btn" data-copy="{{${esc(v.key)}}}">Copy</button>
            <button type="button" class="btn btn-ghost tiny danger var-del-global-btn" data-del-var="${esc(v.key)}" title="Delete from all characters">Delete</button>
          </div>
        </div>
        <div class="var-usage-lbl">${usedCount} character${usedCount === 1 ? '' : 's'} using this</div>
        <div class="var-item-usage" data-toggle-vals="${esc(v.key)}">
          <span>View values</span>
          <span>▾</span>
        </div>
        <div class="var-char-values hidden" id="var-vals-${esc(v.key)}">
          ${v.usedBy.map((u) => `
            <div class="var-char-row">
              <span class="var-char-name">${esc(u.characterName)}:</span>
              <span class="var-char-val" title="${esc(u.value)}">&ldquo;${esc(u.value)}&rdquo;</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

let seMode = 'new';
let seId = null;
let seCharacterVariables = {};
let seVarsSelectedCharId = null;
let seDelArmed = null;

function switchSeTab(tab) {
  const isEdit = tab === 'edit';
  $('#se-tab-edit').classList.toggle('active', isEdit);
  $('#se-tab-preview').classList.toggle('active', !isEdit);
  $('#se-content-edit-wrap').classList.toggle('hidden', !isEdit);
  $('#se-content-prev-wrap').classList.toggle('hidden', isEdit);
  // Same as the character description: hide the preview box's resize handle
  // whenever the box is hidden, so Edit mode shows only the textarea's own bar.
  if ($('#se-content-prev-wrap')._resizeBar) {
    $('#se-content-prev-wrap')._resizeBar.classList.toggle('hidden', isEdit);
  }
  const pill = $('#se-char-swap-wrap');
  if (pill) pill.classList.toggle('hidden', isEdit);
  if (!isEdit) {
    const editH = $('#se-content')?.style.height;
    if (editH) $('#se-content-prev-wrap').style.height = editH;
    renderSePreview();
  } else {
    const prevH = $('#se-content-prev-wrap')?.style.height;
    if (prevH) $('#se-content').style.height = prevH;
  }
}

let seCharDropdownOpen = false;

function renderSeCharActiveCard() {
  const card = $('#se-char-active-card');
  const title = $('#se-char-active-title');
  const desc = $('#se-char-active-desc');
  const avatar = $('#se-char-active-avatar');
  const prevAvatar = $('#se-preview-char-avatar');
  const prevName = $('#se-preview-char-name');
  const switchBtn = $('#se-char-switch-btn-text');
  if (!card || !title || !desc || !switchBtn) return;

  const char = (state.characters || []).find((c) => c.id === seVarsSelectedCharId) || state.characters[0];
  if (char) {
    card.classList.add('is-selected');
    title.textContent = char.name;
    desc.textContent = char.description || char.note || 'Configuring variables for ' + char.name;
    switchBtn.textContent = 'Switch ▾';
    if (avatar) {
      avatar.className = 'avatar sm' + (char.avatar ? '' : ' letter');
      avatar.textContent = char.avatar ? '' : (char.emoji || char.name.charAt(0));
      avatar.style.backgroundImage = char.avatar ? `url('${char.avatar}')` : '';
    }
    if (prevAvatar) {
      prevAvatar.className = 'avatar tiny' + (char.avatar ? '' : ' letter');
      prevAvatar.textContent = char.avatar ? '' : (char.emoji || char.name.charAt(0));
      prevAvatar.style.backgroundImage = char.avatar ? `url('${char.avatar}')` : '';
    }
    if (prevName) prevName.textContent = char.name;
  } else {
    card.classList.remove('is-selected');
    title.textContent = 'Select a character…';
    desc.textContent = 'Click here or Choose to select from available characters.';
    switchBtn.textContent = 'Choose ▾';
    if (avatar) {
      avatar.className = 'avatar sm letter';
      avatar.textContent = '👤';
      avatar.style.backgroundImage = '';
    }
    if (prevName) prevName.textContent = 'None';
  }
}

function renderSeCharCards(query = '') {
  const container = $('#se-char-cards-scroll');
  if (!container) return;
  const q = (query || '').trim().toLowerCase();
  let characters = state.characters || [];
  if (q) {
    characters = characters.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.note && c.note.toLowerCase().includes(q))
    );
  }
  if (characters.length === 0) {
    container.innerHTML = `<div class="prow-desc" style="padding:16px;text-align:center">${q ? `No characters matching "${esc(query)}"` : 'No characters available'}</div>`;
    return;
  }

  const rawContent = $('#se-content')?.value || '';
  const reqVars = getScenarioRequiredVariables(rawContent);

  container.innerHTML = characters.map((c) => {
    const isSelected = seVarsSelectedCharId === c.id;
    const charVars = (seCharacterVariables && seCharacterVariables[c.id]) || {};
    const missingCount = reqVars.filter((v) => !charVars[v] || !String(charVars[v]).trim()).length;
    const configuredCount = reqVars.length - missingCount;

    let statusPill = '';
    if (reqVars.length === 0) {
      statusPill = `<span style="color:var(--muted)">No variables</span>`;
    } else if (missingCount === 0) {
      statusPill = `<span style="color:#4ade80">✓ ${configuredCount} of ${reqVars.length} set</span>`;
    } else {
      statusPill = `<span style="color:#f87171">⚠ ${missingCount} missing</span>`;
    }

    return `
      <div class="se-char-opt-card ${isSelected ? 'selected' : ''}" data-char-id="${c.id}">
        <div class="se-char-opt-card-top">
          <div class="se-char-opt-title-group">
            ${avatarHtml(c, 'sm')}
            <span class="se-char-opt-card-title">${esc(c.name)}</span>
          </div>
          ${isSelected ? '<span class="ce-scen-opt-sel-tick">✓ Active</span>' : ''}
        </div>
        <div class="se-char-opt-card-desc">${esc(c.description || c.note || 'No description')}</div>
        <div class="se-char-opt-card-foot">
          <span class="ce-scen-opt-vars-pill">${statusPill}</span>
          <span style="color:var(--muted)">Click to select</span>
        </div>
      </div>
    `;
  }).join('');
}

function openSeCharDropdown() {
  const menu = $('#se-char-dropdown');
  if (!menu) return;
  menu.classList.remove('hidden');
  seCharDropdownOpen = true;
  const input = $('#se-char-search-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 40);
  }
  renderSeCharCards('');
}

function closeSeCharDropdown() {
  const menu = $('#se-char-dropdown');
  if (!menu) return;
  menu.classList.add('hidden');
  seCharDropdownOpen = false;
}

function toggleSeCharDropdown() {
  if (seCharDropdownOpen) closeSeCharDropdown();
  else openSeCharDropdown();
}

function renderSePreview() {
  const raw = $('#se-content').value;
  const charId = seVarsSelectedCharId;
  const charVars = (seCharacterVariables && charId && seCharacterVariables[charId]) ? seCharacterVariables[charId] : null;
  $('#se-content-prev-wrap').innerHTML = renderPreviewMarkdown(raw, charId, charVars);
}

function renderSeVarsForm() {
  const form = $('#se-vars-form');
  const banner = $('#se-vars-status-banner');
  if (!form) return;

  const char = state.characters.find((x) => x.id === seVarsSelectedCharId) || state.characters[0];
  if (!char) {
    form.innerHTML = `<div class="prow-desc" style="padding:16px;text-align:center">No characters found. Create a character first.</div>`;
    if (banner) banner.className = 'ce-scen-status-banner hidden';
    return;
  }

  const rawContent = $('#se-content')?.value || '';
  const tagRegex = /\{\{\s*([\w.-]+)\s*\}\}/g;
  const foundTags = new Set();
  let m;
  while ((m = tagRegex.exec(rawContent)) !== null) {
    foundTags.add(m[1].trim().toLowerCase());
  }

  if (!seCharacterVariables[char.id]) seCharacterVariables[char.id] = {};
  const charVars = seCharacterVariables[char.id];
  const customTags = [];
  let hasCharTag = false;
  let hasUserTag = false;

  for (const tag of foundTags) {
    if (tag === 'char') { hasCharTag = true; continue; }
    if (tag === 'user') { hasUserTag = true; continue; }
    customTags.push(tag);
  }

  customTags.sort((a, b) => a.localeCompare(b));

  let configuredCount = 0;
  let missingCount = 0;
  for (const tag of customTags) {
    const val = charVars[tag];
    if (val && String(val).trim().length > 0) configuredCount++;
    else missingCount++;
  }

  if (banner) {
    banner.classList.remove('hidden');
    if (customTags.length === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `<span>ℹ No template variables in scenario prompt</span>`;
    } else if (missingCount === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `
        <span>✓ All scenario variables configured for ${esc(char.name)}</span>
        <span class="ce-scen-stat-pill green">${configuredCount} of ${customTags.length}</span>
      `;
    } else {
      banner.className = 'ce-scen-status-banner has-missing';
      banner.innerHTML = `
        <span>⚠ ${missingCount} variable${missingCount === 1 ? '' : 's'} missing for ${esc(char.name)}</span>
        <span class="ce-scen-stat-pill red">${missingCount} missing</span>
      `;
    }
  }

  if (customTags.length === 0 && !hasCharTag && !hasUserTag) {
    form.innerHTML = `
      <div class="prow-desc" style="padding:24px 16px;text-align:center;line-height:1.6">
        No template variables detected in the prompt.<br>
        Add variables like <code>{{outfit}}</code>, <code>{{hair}}</code>, or <code>{{weapon}}</code> on the left to customize the scene for ${esc(char.name)}.
      </div>
    `;
    return;
  }

  let html = '';
  if (customTags.length > 0) {
    html += customTags.map((tag) => {
      const val = charVars[tag] != null ? String(charVars[tag]) : '';
      const isSet = Boolean(val && val.trim().length > 0);
      return `
        <div class="se-var-field ${isSet ? 'configured' : 'missing'}" data-var-card="${esc(tag)}">
          <div class="se-var-head">
            <span class="se-var-label">
              <code>{{${esc(tag)}}}</code>
            </span>
            <span class="ce-scen-var-badge ${isSet ? 'configured' : 'missing'}">
              ${isSet ? 'Configured' : 'Missing'}
            </span>
          </div>
          <textarea
            class="search-input se-var-input"
            data-var="${esc(tag)}"
            placeholder="Value for ${esc(char.name)}…"
            rows="1"
            autocomplete="off">${esc(val)}</textarea>
        </div>
      `;
    }).join('');
  }

  if (hasCharTag || hasUserTag) {
    const persona = activePersona();
    html += `
      <div class="se-system-tags-card">
        <span style="font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--muted)">Built-in macros</span>
        ${hasCharTag ? `<div class="se-system-tag-row"><code>{{char}}</code><span>&rarr; ${esc(char.name)}</span></div>` : ''}
        ${hasUserTag ? `<div class="se-system-tag-row"><code>{{user}}</code><span>&rarr; ${esc(persona ? persona.name : 'the user')}</span></div>` : ''}
      </div>
    `;
  }

  form.innerHTML = html;
  form.querySelectorAll('.se-var-input').forEach((input) => {
    makeTextareaAutoResize(input, { min: 38, max: 240 });
  });
}

function openScenarioModal(sc = null) {
  seMode = sc ? 'edit' : 'new';
  seId = sc ? sc.id : null;
  seCharacterVariables = sc && sc.characterVariables ? JSON.parse(JSON.stringify(sc.characterVariables)) : {};

  $('#se-title-text').textContent = sc ? 'Edit scenario' : 'New scenario';
  $('#se-title').value = sc ? sc.title : '';
  $('#se-desc').value = sc ? sc.description : '';
  $('#se-notes').value = sc ? (sc.specialNotes || '') : '';
  $('#se-content').value = sc ? sc.content : '';

  const initialCharId = pickScenarioChar ? pickScenarioChar.id : (ui.activeCharacterId || (state.characters[0] ? state.characters[0].id : null));
  seVarsSelectedCharId = initialCharId;

  const editBox = $('#se-content');
  if (editBox) editBox.style.height = '';
  const prevBox = $('#se-content-prev-wrap');
  if (prevBox) prevBox.style.height = '';

  renderSeCharActiveCard();
  closeSeCharDropdown();
  renderSeVarsForm();
  switchSeTab('edit');

  const del = $('#se-delete');
  del.classList.toggle('hidden', seMode !== 'edit');
  disarmSeDelete();

  const play = $('#se-play');
  play.classList.toggle('hidden', seMode !== 'edit');

  const exp = $('#se-export');
  if (exp) exp.classList.toggle('hidden', seMode !== 'edit');

  openModal('modal-scenario');
  setTimeout(() => $('#se-title').focus(), 60);
  takeModalSnapshot('modal-scenario');
}

function disarmSeDelete() {
  const btn = $('#se-delete');
  if (!btn) return;
  btn.classList.remove('armed');
  btn.textContent = 'Delete scenario';
  clearTimeout(seDelArmed);
  seDelArmed = null;
}

async function scenarioFormSave() {
  const title = $('#se-title').value.trim();
  if (!title) { toast('Give your scenario a title'); return; }
  const content = $('#se-content').value.trim();
  if (!content) { toast('Enter the opening scenario scene'); return; }

  const body = {
    title,
    description: $('#se-desc').value.trim(),
    content,
    specialNotes: $('#se-notes')?.value || '',
    accessMode: 'all',
    characterIds: [],
    characterVariables: seCharacterVariables,
  };

  try {
    let saved;
    if (seMode === 'new') {
      saved = await api('/scenarios', { method: 'POST', body: JSON.stringify(body) });
      state.scenarios.push(saved);
      toast('Scenario created');
    } else {
      saved = await api('/scenarios/' + seId, { method: 'PUT', body: JSON.stringify(body) });
      const idx = state.scenarios.findIndex((x) => x.id === seId);
      if (idx !== -1) state.scenarios[idx] = saved;
      toast('Scenario saved');
    }
    closeModal('modal-scenario');
    renderSidebarScenarios();
    renderHeader();
  } catch (e) {
    toast(e.message);
  }
}

// Missing Variables Modal State & Functions
let msvChar = null;
let msvScenario = null;
let msvRequiredVars = [];
let msvMissingVars = [];
let msvLiveVars = {};

function getScenarioRequiredVariables(content) {
  if (!content) return [];
  const tagRegex = /\{\{\s*([\w.-]+)\s*\}\}/g;
  const tags = new Set();
  let m;
  while ((m = tagRegex.exec(content)) !== null) {
    const tag = m[1].trim().toLowerCase();
    if (tag !== 'char' && tag !== 'user') {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

function openMissingVarsModal(character, scenario, requiredVars, missingVars) {
  msvChar = character;
  msvScenario = scenario;
  msvRequiredVars = requiredVars;
  msvMissingVars = missingVars;

  const existing = (scenario.characterVariables && scenario.characterVariables[character.id]) || {};
  msvLiveVars = { ...existing };

  $('#msv-header-title').textContent = `${missingVars.length} variable${missingVars.length === 1 ? '' : 's'} missing!`;
  $('#msv-header-sub').textContent = `Configure required variables for ${character.name} before starting "${scenario.title}".`;

  const banner = $('#msv-char-banner');
  if (banner) {
    banner.innerHTML = `
      ${avatarHtml(character, 'md')}
      <div class="msv-char-info">
        <span class="msv-char-name">${esc(character.name)}</span>
        <span class="msv-scen-title">🎬 ${esc(scenario.title)}</span>
      </div>
    `;
  }

  updateMsvCountHeader();

  const list = $('#msv-inputs-list');
  if (list) {
    list.innerHTML = missingVars.map((v) => {
      const curVal = msvLiveVars[v] || '';
      return `
        <div class="msv-input-card ${curVal.trim() ? 'filled' : 'missing'}" data-msv-card="${esc(v)}">
          <div class="msv-input-head">
            <span class="msv-input-label"><code>{{${esc(v)}}}</code></span>
            <span class="ce-scen-var-badge ${curVal.trim() ? 'configured' : 'missing'}" data-msv-badge="${esc(v)}">
              ${curVal.trim() ? 'Configured' : 'Missing'}
            </span>
          </div>
          <textarea
            class="search-input msv-var-input"
            data-var="${esc(v)}"
            placeholder="Enter value for {{${esc(v)}}}…"
            rows="1"
            autocomplete="off">${esc(curVal)}</textarea>
        </div>
      `;
    }).join('');
  }

  const rawBox = $('#msv-raw-text');
  if (rawBox) {
    rawBox.innerHTML = `<pre class="msv-raw-box">${esc(scenario.content)}</pre>`;
  }

  updateMsvLivePreview();

  openModal('modal-scenario-vars');
  setTimeout(() => {
    const firstInput = $('#msv-inputs-list input');
    if (firstInput) firstInput.focus();
  }, 60);
}

function updateMsvCountHeader() {
  const header = $('#msv-count-header');
  if (!header) return;
  const remaining = msvMissingVars.filter((v) => !msvLiveVars[v] || !String(msvLiveVars[v]).trim()).length;
  if (remaining === 0) {
    header.className = 'msv-count-header all-set';
    header.innerHTML = `<span>✓ All variables configured! Ready to start.</span>`;
  } else {
    header.className = 'msv-count-header';
    header.innerHTML = `<span>⚠ ${remaining} variable${remaining === 1 ? '' : 's'} missing!</span>`;
  }
}

function updateMsvLivePreview() {
  const prevBox = $('#msv-prev-content');
  if (!prevBox || !msvScenario || !msvChar) return;
  prevBox.innerHTML = renderPreviewMarkdown(msvScenario.content, msvChar.id, msvLiveVars, msvChar.name);
}

async function startChatWithScenario(character, scenario) {
  if (!scenario) {
    try {
      ui.activeCharacterId = character.id;
      const ch = await createChatFor(character, null);
      saveUi();
      closeSidebar();
      renderSidebar();
      renderChat();
      loadPoses(character.id);
    } catch (e) { toast(e.message); }
    return;
  }

  const reqVars = getScenarioRequiredVariables(scenario.content);
  const charVars = (scenario.characterVariables && scenario.characterVariables[character.id]) || {};
  const missing = reqVars.filter((v) => {
    const val = charVars[v];
    return !val || !String(val).trim();
  });

  if (missing.length > 0) {
    openMissingVarsModal(character, scenario, reqVars, missing);
    return;
  }

  // All variables set! Start chat immediately without blocking.
  try {
    ui.activeCharacterId = character.id;
    const ch = await createChatFor(character, scenario.id);
    saveUi();
    closeSidebar();
    renderSidebar();
    renderChat();
    loadPoses(character.id);
  } catch (e) { toast(e.message); }
}

async function scenarioDelete() {
  const btn = $('#se-delete');
  if (!btn.classList.contains('armed')) {
    btn.classList.add('armed');
    btn.textContent = 'Click again to confirm';
    seDelArmed = setTimeout(disarmSeDelete, 2600);
    return;
  }
  try {
    await api('/scenarios/' + seId, { method: 'DELETE' });
    state.scenarios = state.scenarios.filter((x) => x.id !== seId);
    disarmSeDelete();
    closeModal('modal-scenario');
    renderSidebarScenarios();
    renderHeader();
    toast('Scenario deleted');
  } catch (e) {
    toast(e.message);
  }
}

let pickScenarioChar = null;

function renderPsGrid(query = '') {
  if (!pickScenarioChar) return;
  const q = (query || '').trim().toLowerCase();
  let allowed = state.scenarios.filter((s) => isScenarioAllowed(s, pickScenarioChar.id));
  if (q) {
    allowed = allowed.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.content && s.content.toLowerCase().includes(q))
    );
  }
  const grid = $('#ps-grid');
  if (!grid) return;
  if (allowed.length === 0) {
    grid.innerHTML = q
      ? `<div class="prow-desc" style="grid-column:1/-1;padding:16px 0;text-align:center">No scenarios matching "${esc(query)}".</div>`
      : `<div class="prow-desc" style="grid-column:1/-1;padding:16px 0;text-align:center">No accessible scenarios for ${esc(pickScenarioChar.name)}. Create one or start freeform.</div>`;
  } else {
    grid.innerHTML = allowed.map((s) => {
      const reqVars = getScenarioRequiredVariables(s.content);
      const charVars = (s.characterVariables && s.characterVariables[pickScenarioChar.id]) || {};
      const missing = reqVars.filter((v) => !charVars[v] || !String(charVars[v]).trim());
      let varBadge = '';
      if (missing.length > 0) {
        varBadge = `<span class="ce-scen-stat-pill red sm">${missing.length} missing</span>`;
      } else if (reqVars.length > 0) {
        varBadge = `<span class="ce-scen-stat-pill green sm">✓ Ready</span>`;
      }
      return `
        <div class="ps-item-card" data-scen-id="${s.id}">
          <div class="ps-item-top">
            <div class="ps-item-header">
              <span class="ps-item-title">${esc(s.title)}</span>
              <div class="ps-item-badges">
                ${varBadge}
              </div>
            </div>
            <div class="ps-item-desc">${esc(s.description || s.content.slice(0, 110))}</div>
          </div>
          <div class="ps-item-foot">
            <button type="button" class="btn btn-ghost sm">Start chat</button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function openScenarioPicker(c) {
  pickScenarioChar = c;
  $('#ps-title').textContent = `Choose a scenario for ${c.name}`;
  const sInp = $('#ps-search');
  if (sInp) sInp.value = '';
  renderPsGrid('');
  openModal('modal-pick-scenario');
  setTimeout(() => { if (sInp) sInp.focus(); }, 60);
}

let pickCharScenario = null;

function renderPcList(query = '') {
  if (!pickCharScenario) return;
  const q = (query || '').trim().toLowerCase();
  let allowed = state.characters.filter((c) => isScenarioAllowed(pickCharScenario, c.id));
  if (q) {
    allowed = allowed.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.note && c.note.toLowerCase().includes(q))
    );
  }
  const list = $('#pc-list');
  if (!list) return;
  if (allowed.length === 0) {
    list.innerHTML = q
      ? `<div class="prow-desc" style="padding:16px;text-align:center">No characters matching "${esc(query)}".</div>`
      : `<div class="prow-desc" style="padding:16px;text-align:center">No characters found. Create a character first.</div>`;
  } else {
    list.innerHTML = allowed.map((c) => `
      <div class="pc-row" data-char-id="${c.id}">
        ${avatarHtml(c)}
        <div class="pc-info">
          <div class="pc-name">${esc(c.name)}</div>
          <div class="pc-desc">${esc(c.description)}</div>
        </div>
        <button type="button" class="btn btn-ghost sm">Play</button>
      </div>
    `).join('');
  }
}

function openCharPickerForScenario(s) {
  pickCharScenario = s;
  $('#pc-title').textContent = `Play: ${s.title}`;
  const sInp = $('#pc-search');
  if (sInp) sInp.value = '';
  renderPcList('');
  closeModal('modal-scenario');
  openModal('modal-pick-char');
  setTimeout(() => { if (sInp) sInp.focus(); }, 60);
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
}

function renderAll() {
  renderSidebar();
  renderSidebarScenarios();
  renderSidebarPersonas();
  setHint();
  if (ui.sidebarTab === 'scenarios') switchSidebarTab('scenarios');
  else if (ui.sidebarTab === 'personas') switchSidebarTab('personas');
  else switchSidebarTab('chars');
  if (ui.activeCharacterId && state.characters.find((c) => c.id === ui.activeCharacterId)) {
    openCharacter(ui.activeCharacterId);
  } else {
    showWelcome();
  }
}

const crop = { img: null, dataUrl: null, onDone: null, pass: 'square', S: 0, Fw: 0, Fh: 0, cover: 1, scale: 1, steps: 0, dx: 0, dy: 0, square: null, f: 1, rect: { x: 0, y: 0, w: 0, h: 0 }, applying: false };

function openCropFlow(dataUrl, onDone) {
  crop.onDone = onDone;
  crop.dataUrl = dataUrl;
  crop.applying = false;
  startCropPass('square');
}

function startCropPass(pass) {
  const img = new Image();
  img.onload = () => {
    crop.img = img;
    crop.pass = pass;
    crop.applying = false;
    crop.steps = 0; crop.scale = 1; crop.dx = 0; crop.dy = 0;
    crop.rect = { x: 0, y: 0, w: 0, h: 0 };
    $('#crop-img').src = crop.dataUrl;
    openModal('modal-crop');
    layoutCrop();
    renderCropUI();
  };
  img.onerror = () => { crop.applying = false; toast('Could not read that image'); };
  img.src = crop.dataUrl;
}

function renderCropUI() {
  const free = crop.pass === 'free';
  $('#crop-title').textContent = free ? 'Crop full image' : 'Crop profile icon';
  $('#crop-note').textContent = free
    ? 'The image stays fixed — drag the frame to position it, drag the corner handle to reshape it. This becomes the chat background and the full-size view when the avatar is tapped.'
    : 'Drag to reposition the image inside the square. This becomes the profile icon.';
  $('#crop-apply').textContent = free ? 'Apply' : 'Next: full image';
  $('#crop-skip').classList.toggle('hidden', !free);
  $('#crop-frame').classList.toggle('hidden', !free);
  $('.crop-zoom').classList.toggle('hidden', free);
  $('#crop-zoom').value = '1';
  $('#crop-zoom-val').textContent = '1.0×';
}

function layoutCrop() {
  const view = $('#crop-view');
  crop.S = view.clientWidth || 280;
  if (crop.pass === 'square') {
    crop.Fw = crop.Fh = crop.S;
    updateCover();
    clampPan();
    applyCropTransform();
  } else {
    crop.f = Math.min(crop.S / crop.img.naturalWidth, crop.S / crop.img.naturalHeight);
    applyFreeTransform();
    if (crop.rect.w) {
      clampRect();
    } else {
      defaultFreeRect();
    }
    positionRect();
  }
}

function updateCover() {
  const nw = crop.img.naturalWidth;
  const nh = crop.img.naturalHeight;
  crop.cover = crop.steps % 2
    ? Math.max(crop.Fw / nh, crop.Fh / nw)
    : Math.max(crop.Fw / nw, crop.Fh / nh);
}

function visualBounds() {
  const nw = crop.img.naturalWidth;
  const nh = crop.img.naturalHeight;
  const Vw = Math.round((crop.steps % 2 ? nh : nw) * crop.f);
  const Vh = Math.round((crop.steps % 2 ? nw : nh) * crop.f);
  return { left: (crop.S - Vw) / 2, top: (crop.S - Vh) / 2, w: Vw, h: Vh };
}

function defaultFreeRect() {
  const b = visualBounds();
  const portrait = crop.img.naturalHeight > crop.img.naturalWidth;
  let w;
  let h;
  if (portrait) {
    h = Math.min(b.h * 0.92, b.w * 0.92 * 16 / 9);
    w = h * 9 / 16;
    if (w > b.w * 0.92) { w = b.w * 0.92; h = Math.min(b.h * 0.92, w * 16 / 9); }
  } else {
    w = Math.min(b.w * 0.92, b.h * 0.92 * 16 / 9);
    h = w * 9 / 16;
    if (h > b.h * 0.92) { h = b.h * 0.92; w = Math.min(b.w * 0.92, h * 16 / 9); }
  }
  w = Math.max(48, w);
  h = Math.max(48, h);
  crop.rect.w = Math.round(w);
  crop.rect.h = Math.round(h);
  crop.rect.x = Math.round(b.left + (b.w - w) / 2);
  crop.rect.y = Math.round(b.top + (b.h - h) / 2);
}

function applyFreeTransform() {
  const nw = crop.img.naturalWidth;
  const nh = crop.img.naturalHeight;
  const img = $('#crop-img');
  img.style.width = nw * crop.f + 'px';
  img.style.height = nh * crop.f + 'px';
  img.style.transform = `translate(-50%, -50%) rotate(${crop.steps * 90}deg)`;
}

function clampRect() {
  const b = visualBounds();
  crop.rect.w = Math.min(crop.rect.w, b.w);
  crop.rect.h = Math.min(crop.rect.h, b.h);
  crop.rect.x = Math.min(Math.max(crop.rect.x, b.left), b.left + b.w - crop.rect.w);
  crop.rect.y = Math.min(Math.max(crop.rect.y, b.top), b.top + b.h - crop.rect.h);
}

function positionRect() {
  const f = $('#crop-frame');
  f.style.left = crop.rect.x + 'px';
  f.style.top = crop.rect.y + 'px';
  f.style.width = crop.rect.w + 'px';
  f.style.height = crop.rect.h + 'px';
}

function drawnDims() {
  return {
    dw: crop.img.naturalWidth * crop.cover * crop.scale,
    dh: crop.img.naturalHeight * crop.cover * crop.scale,
  };
}

function clampPan() {
  const { dw, dh } = drawnDims();
  const effW = crop.steps % 2 ? dh : dw;
  const effH = crop.steps % 2 ? dw : dh;
  const mx = Math.max(0, (effW - crop.Fw) / 2);
  const my = Math.max(0, (effH - crop.Fh) / 2);
  crop.dx = Math.min(mx, Math.max(-mx, crop.dx));
  crop.dy = Math.min(my, Math.max(-my, crop.dy));
}

function applyCropTransform() {
  const { dw, dh } = drawnDims();
  const img = $('#crop-img');
  img.style.width = dw + 'px';
  img.style.height = dh + 'px';
  img.style.transform = `translate(calc(-50% + ${crop.dx}px), calc(-50% + ${crop.dy}px)) rotate(${crop.steps * 90}deg)`;
}

function cropQualityCap() {
  const { dw, dh } = drawnDims();
  const kMax = crop.steps % 2 ? crop.img.naturalHeight / dh : crop.img.naturalWidth / dw;
  return Number.isFinite(kMax) && kMax > 0 ? kMax : 1;
}

function applyCrop() {
  if (crop.applying) return;
  crop.applying = true;
  const canvas = $('#crop-canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (crop.pass === 'square') {
    const { dw, dh } = drawnDims();
    const k = Math.min(256 / crop.Fw, cropQualityCap());
    const W = Math.max(1, Math.round(crop.Fw * k));
    const H = Math.max(1, Math.round(crop.Fh * k));
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2 + crop.dx * k, H / 2 + crop.dy * k);
    ctx.rotate(crop.steps * Math.PI / 2);
    ctx.drawImage(crop.img, -dw * k / 2, -dh * k / 2, dw * k, dh * k);
    ctx.restore();
    crop.square = canvas.toDataURL('image/jpeg', 0.86);
    startCropPass('free');
    return;
  }

  const nw = crop.img.naturalWidth;
  const nh = crop.img.naturalHeight;
  const RW = crop.steps % 2 ? nh : nw;
  const RH = crop.steps % 2 ? nw : nh;
  const rot = document.createElement('canvas');
  rot.width = RW;
  rot.height = RH;
  const rc = rot.getContext('2d');
  rc.imageSmoothingEnabled = true;
  rc.imageSmoothingQuality = 'high';
  rc.translate(RW / 2, RH / 2);
  rc.rotate(crop.steps * Math.PI / 2);
  rc.drawImage(crop.img, -nw / 2, -nh / 2, nw, nh);

  const b = visualBounds();
  const rx = Math.min(Math.max((crop.rect.x - b.left) / crop.f, 0), RW);
  const ry = Math.min(Math.max((crop.rect.y - b.top) / crop.f, 0), RH);
  const rw = Math.min(crop.rect.w / crop.f, RW - rx);
  const rh = Math.min(crop.rect.h / crop.f, RH - ry);
  const k = Math.min(1200 / Math.max(rw, rh), 1);
  const W = Math.max(1, Math.round(rw * k));
  const H = Math.max(1, Math.round(rh * k));
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(rot, rx, ry, rw, rh, 0, 0, W, H);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  crop.applying = false;
  closeModal('modal-crop');
  const done = crop.onDone;
  crop.onDone = null;
  done({ square: crop.square, full: dataUrl });
}

function skipFullCrop() {
  if (crop.pass !== 'free' || crop.applying) return;
  crop.applying = false;
  closeModal('modal-crop');
  const done = crop.onDone;
  crop.onDone = null;
  done({ square: crop.square, full: null });
}

function downloadJson(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function triggerExport(type, id = null, filename = null) {
  try {
    let url = `/api/export?type=${encodeURIComponent(type)}`;
    if (id) url += `&id=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Export failed with status ${res.status}`);
    }
    const data = await res.json();
    const dateStr = new Date().toISOString().slice(0, 10);
    const fname = filename || `aichat-${type}-${dateStr}.json`;
    downloadJson(data, fname);
    toast(`Exported ${type}`);
  } catch (err) {
    toast(`Export failed: ${err.message}`);
  }
}

async function handleImportFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Selected file is not valid JSON');
    }
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.ok) {
      throw new Error(result.error || `Import failed with status ${res.status}`);
    }
    const imp = result.imported || {};
    const parts = [];
    if (imp.characters) parts.push(`${imp.characters} character${imp.characters === 1 ? '' : 's'}`);
    if (imp.poses) parts.push(`${imp.poses} pose${imp.poses === 1 ? '' : 's'}`);
    if (imp.scenarios) parts.push(`${imp.scenarios} scenario${imp.scenarios === 1 ? '' : 's'}`);
    if (imp.personas) parts.push(`${imp.personas} persona${imp.personas === 1 ? '' : 's'}`);
    if (imp.variables) parts.push(`${imp.variables} variable value${imp.variables === 1 ? '' : 's'}`);
    const summary = parts.length > 0 ? parts.join(', ') : 'no items found';
    toast(`Imported: ${summary}`);

    await bootstrap();
    renderAll();
  } catch (err) {
    toast(`Import failed: ${err.message}`);
  } finally {
    const inp = $('#global-import-file');
    if (inp) inp.value = '';
  }
}

function wireEvents() {
  $$('.combo').forEach((c) => setupModelCombo(c));
  $('#tab-chars-btn').addEventListener('click', () => switchSidebarTab('chars'));
  $('#tab-scenarios-btn').addEventListener('click', () => switchSidebarTab('scenarios'));
  $('#tab-personas-btn')?.addEventListener('click', () => switchSidebarTab('personas'));
  $('#new-char-btn').addEventListener('click', () => openCharModal(null));
  $('#new-scenario-btn').addEventListener('click', () => openScenarioModal(null));
  $('#new-persona-btn')?.addEventListener('click', () => openPersonaModal());

  // Auto-resize and touch-drag handles for text inputs
  const msgTa = $('#msg-input');
  if (msgTa) {
    makeTextareaAutoResize(msgTa, {
      min: 46,
      max: () => (window.innerWidth <= 768 ? 180 : 280),
      isComposer: true,
    });
  }
  const autoTextareas = [
    { id: '#ce-desc', min: 80, max: 260 },
    { id: '#ce-note', min: 54, max: 180 },
    { id: '#se-content', min: 120, max: 340 },
    { id: '#se-desc', min: 54, max: 180 },
    { id: '#se-notes', min: 60, max: 240 },
    { id: '#pf-desc', min: 70, max: 220 },
    { id: '#pf-note', min: 54, max: 160 },
    { id: '#pr-sys', min: 80, max: 300 },
    { id: '#pose-desc', min: 54, max: 180 },
  ];
  for (const item of autoTextareas) {
    const el = $(item.id);
    if (el) makeTextareaAutoResize(el, item);
  }

  makeElementResizable($('#se-content-prev-wrap'), { min: 110, max: 550, defaultHeight: 180 });
  makeElementResizable($('#ce-scen-preview-text'), { min: 110, max: 550, defaultHeight: 220 });
  makeElementResizable($('#ce-desc-prev-wrap'), { min: 110, max: 550, defaultHeight: 180 });

  $('#persona-sidebar-list')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-persona]');
    if (editBtn) {
      const p = state.personalities.find((x) => x.id === editBtn.dataset.editPersona);
      if (p) {
        peMode = 'edit'; peId = p.id; peAvatar = p.avatar || null; peImage = p.image || null;
        $('#pf-name').value = p.name;
        $('#pf-desc').value = p.description;
        $('#pf-note').value = p.note || '';
        updatePersonaForm();
        updatePfAvatarUI();
        openModal('modal-persona');
      }
      return;
    }
    const item = e.target.closest('.sidebar-persona-item');
    if (item && item.dataset.pid) {
      setPersona(item.dataset.pid);
    }
  });

  // Settings Tabs
  $$('.settings-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchSettingsTab(btn.dataset.stab));
  });

  // Clicking Character Info opens Edit Character
  $('#char-info')?.addEventListener('click', (e) => {
    if (e.target.closest('.avatar')) return;
    const c = activeChar();
    if (c) openCharModal(c);
  });

  // Import & Export buttons
  const fileInput = $('#global-import-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) handleImportFile(f);
    });
  }
  const triggerImport = () => { if (fileInput) fileInput.click(); };

  $('#import-chars-btn')?.addEventListener('click', triggerImport);
  $('#import-scenarios-btn')?.addEventListener('click', triggerImport);
  $('#import-personas-btn')?.addEventListener('click', triggerImport);
  $('#import-vars-btn')?.addEventListener('click', triggerImport);
  $('#set-import-btn')?.addEventListener('click', triggerImport);

  $('#export-chars-btn')?.addEventListener('click', () => {
    triggerExport('characters', null, 'aichat-characters.json');
  });
  $('#export-scenarios-btn')?.addEventListener('click', () => {
    triggerExport('scenarios', null, 'aichat-scenarios.json');
  });
  $('#export-personas-btn')?.addEventListener('click', () => {
    triggerExport('personas', null, 'aichat-personas.json');
  });
  $('#export-vars-btn')?.addEventListener('click', () => {
    triggerExport('variables', null, 'aichat-variables.json');
  });
  $('#set-export-all-btn')?.addEventListener('click', () => {
    triggerExport('all', null, 'aichat-all.json');
  });

  $('#ce-export')?.addEventListener('click', () => {
    if (ceId) {
      const c = state.characters.find((x) => x.id === ceId);
      const name = c ? c.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') : ceId;
      triggerExport('characters', ceId, `character-${name}.json`);
    }
  });

  $('#se-export')?.addEventListener('click', () => {
    if (seId) {
      const s = state.scenarios.find((x) => x.id === seId);
      const name = s ? s.title.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') : seId;
      triggerExport('scenarios', seId, `scenario-${name}.json`);
    }
  });

  $('#pf-export')?.addEventListener('click', () => {
    if (peId) {
      const p = state.personalities.find((x) => x.id === peId);
      const name = p ? p.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') : peId;
      triggerExport('personas', peId, `persona-${name}.json`);
    }
  });
  $('#char-list').addEventListener('click', (e) => {
    const item = e.target.closest('.char-item');
    if (item) openCharacter(item.dataset.id);
  });
  $('#scenario-list').addEventListener('click', (e) => {
    const item = e.target.closest('.scen-item');
    if (!item) return;
    const sc = state.scenarios.find((x) => x.id === item.dataset.id);
    if (sc) openScenarioModal(sc);
  });
  $('#welcome-grid').addEventListener('click', (e) => {
    if (e.target.closest('[data-new]')) { openCharModal(null); return; }
    const card = e.target.closest('.w-card');
    if (card) {
      const c = state.characters.find((x) => x.id === card.dataset.id);
      if (!c) return;
      if (c.chats && c.chats.length > 0) openCharacter(c.id);
      else { ui.activeCharacterId = c.id; openScenarioPicker(c); }
    }
  });
  $('#menu-btn').addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
  $('#scrim').addEventListener('click', () => { closeSidebar(); closeAgentDrawer(); });

  // Variables Directory in Sidebar (if present)
  $('#vars-search')?.addEventListener('input', (e) => {
    renderSidebarVars(e.target.value);
  });
  $('#vars-list')?.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.var-copy-btn');
    if (copyBtn) {
      const tag = copyBtn.dataset.copy;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tag).then(() => toast(`Copied ${tag} to clipboard`));
      } else {
        toast(`Tag: ${tag}`);
      }
      return;
    }
    const delGlobal = e.target.closest('.var-del-global-btn');
    if (delGlobal) {
      const key = delGlobal.dataset.delVar;
      const ok = await customConfirm({
        title: 'Delete variable?',
        message: `Delete variable "{{${key}}}" from all characters? This cannot be undone.`,
        confirmText: 'Delete variable',
        danger: true,
      });
      if (!ok) return;
      const affected = state.characters.filter((c) => c.variables && c.variables[key]);
      for (const c of affected) {
        delete c.variables[key];
        api(`/characters/${c.id}`, { method: 'PUT', body: JSON.stringify(c) }).catch(console.error);
      }
      renderSidebarVars($('#vars-search')?.value || '');
      toast(`Deleted {{${key}}} from all characters`);
      return;
    }
    const usage = e.target.closest('[data-toggle-vals]');
    if (usage) {
      const key = usage.dataset.toggleVals;
      const vals = $(`#var-vals-${key}`);
      if (vals) vals.classList.toggle('hidden');
    }
  });

  // Scenario Modal events
  $('#se-tab-edit').addEventListener('click', () => switchSeTab('edit'));
  $('#se-tab-preview').addEventListener('click', () => switchSeTab('preview'));
  $('#se-char-active-card')?.addEventListener('click', () => {
    toggleSeCharDropdown();
  });
  $('#se-char-switch-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSeCharDropdown();
  });
  $('#se-char-preview-pill')?.addEventListener('click', () => {
    toggleSeCharDropdown();
  });
  $('#se-char-search-input')?.addEventListener('input', (e) => {
    renderSeCharCards(e.target.value);
  });
  $('#se-char-cards-scroll')?.addEventListener('click', (e) => {
    const card = e.target.closest('.se-char-opt-card');
    if (!card) return;
    const cid = card.dataset.charId;
    if (!cid) return;
    seVarsSelectedCharId = cid;
    closeSeCharDropdown();
    renderSeCharActiveCard();
    renderSeVarsForm();
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
  });
  $('#se-vars-form')?.addEventListener('input', (e) => {
    const inp = e.target.closest('.se-var-input');
    if (!inp) return;
    const varName = inp.dataset.var;
    if (!varName || !seVarsSelectedCharId) return;
    if (!seCharacterVariables[seVarsSelectedCharId]) seCharacterVariables[seVarsSelectedCharId] = {};
    seCharacterVariables[seVarsSelectedCharId][varName] = inp.value;

    const isSet = Boolean(inp.value && inp.value.trim().length > 0);
    const card = inp.closest('.se-var-field');
    if (card) {
      card.className = `se-var-field ${isSet ? 'configured' : 'missing'}`;
      const badge = card.querySelector('.ce-scen-var-badge');
      if (badge) {
        badge.className = `ce-scen-var-badge ${isSet ? 'configured' : 'missing'}`;
        badge.textContent = isSet ? 'Configured' : 'Missing';
      }
    }

    const banner = $('#se-vars-status-banner');
    if (banner) {
      const inputs = $$('#se-vars-form .se-var-input');
      const total = inputs.length;
      let missing = 0;
      inputs.forEach((i) => { if (!i.value || !i.value.trim()) missing++; });
      const configured = total - missing;
      const char = state.characters.find((x) => x.id === seVarsSelectedCharId);
      const charName = char ? char.name : 'this character';
      if (total === 0) {
        banner.className = 'ce-scen-status-banner all-good';
        banner.innerHTML = `<span>ℹ No template variables in scenario prompt</span>`;
      } else if (missing === 0) {
        banner.className = 'ce-scen-status-banner all-good';
        banner.innerHTML = `
          <span>✓ All scenario variables configured for ${esc(charName)}</span>
          <span class="ce-scen-stat-pill green">${configured} of ${total}</span>
        `;
      } else {
        banner.className = 'ce-scen-status-banner has-missing';
        banner.innerHTML = `
          <span>⚠ ${missing} variable${missing === 1 ? '' : 's'} missing for ${esc(charName)}</span>
          <span class="ce-scen-stat-pill red">${missing} missing</span>
        `;
      }
    }

    renderSeCharCards($('#se-char-search-input')?.value || '');
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
  });
  $('#se-content').addEventListener('input', () => {
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
    renderSeVarsForm();
  });
  $('#se-save').addEventListener('click', scenarioFormSave);
  $('#se-delete').addEventListener('click', scenarioDelete);
  $('#se-play').addEventListener('click', () => {
    const sc = state.scenarios.find((x) => x.id === seId);
    if (sc) openCharPickerForScenario(sc);
  });

  // Scenario Picker Modal events
  $('#ps-search').addEventListener('input', (e) => {
    renderPsGrid(e.target.value);
  });
  $('#ps-freeform-btn').addEventListener('click', async () => {
    if (!pickScenarioChar) return;
    closeModal('modal-pick-scenario');
    try {
      await createChatFor(pickScenarioChar, null);
      saveUi();
      renderSidebar();
      renderChat();
    } catch (e) { toast(e.message); }
  });
  $('#ps-grid').addEventListener('click', async (e) => {
    const card = e.target.closest('.ps-item-card');
    if (!card || !pickScenarioChar) return;
    const scId = card.dataset.scenId;
    const sc = state.scenarios.find((s) => s.id === scId);
    if (!sc) return;
    closeModal('modal-pick-scenario');
    startChatWithScenario(pickScenarioChar, sc);
  });
  $('#ps-new-btn').addEventListener('click', () => {
    closeModal('modal-pick-scenario');
    openScenarioModal(null);
  });

  // Character Picker for Scenario modal events
  $('#pc-search').addEventListener('input', (e) => {
    renderPcList(e.target.value);
  });
  $('#pc-list').addEventListener('click', async (e) => {
    const row = e.target.closest('.pc-row');
    if (!row || !pickCharScenario) return;
    const charId = row.dataset.charId;
    const c = state.characters.find((x) => x.id === charId);
    if (!c) return;
    closeModal('modal-pick-char');
    startChatWithScenario(c, pickCharScenario);
  });

  // Missing Variables Modal (#modal-scenario-vars) events
  $('#msv-inputs-list')?.addEventListener('input', (e) => {
    const inp = e.target.closest('.msv-var-input');
    if (!inp) return;
    const varName = inp.dataset.var;
    if (!varName) return;
    msvLiveVars[varName] = inp.value;

    const isSet = Boolean(inp.value && inp.value.trim().length > 0);
    const card = inp.closest('.msv-input-card');
    if (card) {
      card.className = `msv-input-card ${isSet ? 'filled' : 'missing'}`;
      const badge = card.querySelector('[data-msv-badge]');
      if (badge) {
        badge.className = `ce-scen-var-badge ${isSet ? 'configured' : 'missing'}`;
        badge.textContent = isSet ? 'Configured' : 'Missing';
      }
    }

    updateMsvCountHeader();
    updateMsvLivePreview();
  });

  $('#msv-start-chat')?.addEventListener('click', async () => {
    if (!msvChar || !msvScenario) return;
    try {
      if (!msvScenario.characterVariables) msvScenario.characterVariables = {};
      if (!msvScenario.characterVariables[msvChar.id]) msvScenario.characterVariables[msvChar.id] = {};
      for (const [k, v] of Object.entries(msvLiveVars)) {
        if (k && String(v).trim()) {
          msvScenario.characterVariables[msvChar.id][k] = String(v).trim();
        }
      }

      await api('/scenarios/' + msvScenario.id, {
        method: 'PUT',
        body: JSON.stringify({ characterVariables: msvScenario.characterVariables }),
      });

      const idx = state.scenarios.findIndex((x) => x.id === msvScenario.id);
      if (idx !== -1) state.scenarios[idx] = msvScenario;

      closeModal('modal-scenario-vars');

      ui.activeCharacterId = msvChar.id;
      const ch = await createChatFor(msvChar, msvScenario.id);
      saveUi();
      closeSidebar();
      renderSidebar();
      renderChat();
      loadPoses(msvChar.id);
      toast('Chat started');
    } catch (e) {
      toast(e.message);
    }
  });

  $('#msv-cancel')?.addEventListener('click', () => {
    closeModal('modal-scenario-vars');
  });

  $('#persona-btn').addEventListener('click', () => toggleMenu('persona-wrap'));
  $('#chats-btn').addEventListener('click', () => toggleMenu('chats-wrap'));
  $('#preset-btn').addEventListener('click', () => toggleMenu('preset-wrap'));
  $('#more-btn').addEventListener('click', () => toggleMenu('more-wrap'));
  $('#settings-btn').addEventListener('click', () => { closeMenus(); openSettings(); });
  $('#edit-char-btn').addEventListener('click', () => { closeMenus(); const c = activeChar(); if (c) openCharModal(c); });

  $('#more-menu').addEventListener('click', (e) => {
    const pid = e.target.closest('[data-pid]');
    if (pid) { setPersona(pid.dataset.pid); closeMenus(); return; }
    const pset = e.target.closest('[data-pset]');
    if (pset) { setPreset(pset.dataset.pset); closeMenus(); return; }
    if (e.target.closest('#mf-edit-char')) {
      closeMenus();
      const c = activeChar();
      if (c) openCharModal(c);
      return;
    }
    if (e.target.closest('#mf-agent')) { closeMenus(); openAgentDrawer(); return; }
    if (e.target.closest('#mf-manage-presets')) { closeMenus(); openSettings('presets'); return; }
    if (e.target.closest('#mf-settings')) { closeMenus(); openSettings(); }
  });

  $('#preset-menu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-pset]');
    if (item) { setPreset(item.dataset.pset); closeMenus(); return; }
    if (e.target.closest('#ps-manage')) { closeMenus(); openSettings('presets'); }
  });

  $('#preset-list').addEventListener('click', async (e) => {
    const use = e.target.closest('[data-use]');
    if (use) { setPreset(use.dataset.use); return; }
    const edit = e.target.closest('[data-edit]');
    if (edit) {
      openPresetModal(state.presets.find((x) => x.id === edit.dataset.edit));
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      prMode = 'edit';
      prId = del.dataset.del;
      await presetDelete();
      prMode = 'new'; prId = null;
    }
  });
  $('#preset-new').addEventListener('click', () => openPresetModal(null));

  $('#pr-prov-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.prov');
    if (!card) return;
    $$('#pr-prov-grid .prov').forEach((b) => b.classList.toggle('selected', b === card));
    const meta = PROVIDERS[card.dataset.pv];
    if (meta) {
      $('#pr-url').value = meta.baseUrl;
      setComboModels($('#pr-model').closest('.combo'), meta.models);
      if (meta.models.length) $('#pr-model').value = meta.models[0];
    }
  });
  $('#pr-key-toggle').addEventListener('click', () => {
    const input = $('#pr-key');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    $('#pr-key-toggle').textContent = showing ? 'Show' : 'Hide';
  });
  $('#pr-temp').addEventListener('input', (e) => {
    $('#pr-temp-val').textContent = (+e.target.value).toFixed(1);
  });
  $('#pr-fetch-models').addEventListener('click', () => {
    /* Same fallback the server does at generation time: an empty preset key
       means "use the global one", so the list fetch must send it too. */
    const key = $('#pr-key').value.trim() || state.settings.apiKey;
    fetchModelList($('#pr-url').value.trim(), key, $('#pr-model').closest('.combo'), $('#pr-fetch-models'), '#pr-prov-grid .prov.selected');
  });
  $('#pr-save').addEventListener('click', presetFormSave);
  $('#pr-cancel').addEventListener('click', () => requestCloseModal('modal-preset'));
  $('#pr-delete').addEventListener('click', presetDelete);

  $('#set-fetch-models').addEventListener('click', () => {
    fetchModelList($('#set-url').value.trim(), $('#set-key').value.trim(), $('#set-model').closest('.combo'), $('#set-fetch-models'), '#prov-grid .prov.selected');
  });
  $('#agent-fetch-models').addEventListener('click', () => {
    fetchModelList($('#agent-url').value.trim(), $('#agent-key').value.trim(), $('#agent-model').closest('.combo'), $('#agent-fetch-models'), '#agent-prov-grid .prov.selected');
  });
  $('#set-bgop').addEventListener('input', (e) => {
    $('#bgop-val').textContent = e.target.value + '%';
    document.documentElement.style.setProperty('--bgop', String(+e.target.value / 100));
  });
  $('#set-bgblur').addEventListener('input', (e) => {
    $('#bgblur-val').textContent = e.target.value + 'px';
    document.documentElement.style.setProperty('--bgblur', e.target.value + 'px');
  });
  $('#set-actdim').addEventListener('input', (e) => {
    $('#actdim-val').textContent = e.target.value + '%';
    document.documentElement.style.setProperty('--act-dim', String(+e.target.value / 100));
  });
  $('#set-poselike').addEventListener('input', (e) => {
    $('#poselike-val').textContent = e.target.value + '%';
  });
  $('#set-posecontext').addEventListener('input', (e) => {
    const v = +e.target.value;
    $('#posecontext-val').textContent = v === 0 ? 'None (latest reply only)' : `${v} message${v === 1 ? '' : 's'}`;
  });

  viewerWire();
  $('#chat-feed').addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      const wrap = nav.closest('[data-id]');
      if (wrap) switchVariant(nav.dataset.nav, wrap.dataset.id);
      return;
    }
    const act = e.target.closest('[data-act]');
    if (act) {
      const wrap = act.closest('[data-id]');
      if (!wrap) return;
      const id = wrap.dataset.id;
      if (act.dataset.act === 'edit') {
        editingId = id;
        renderChat({ keepScroll: true });
        const ta = $('#edit-ta');
        if (ta) {
          ta.style.height = Math.max(192, Math.min(ta.scrollHeight, 450)) + 'px';
          makeTextareaAutoResize(ta, { min: 192, max: 450 });
          ta.focus();
          ta.setSelectionRange(ta.value.length, ta.value.length);
        }
      } else if (act.dataset.act === 'ecancel') {
        editingId = null;
        renderChat({ keepScroll: true });
      } else if (act.dataset.act === 'esave') {
        saveEdit(id);
      } else if (act.dataset.act === 'copy') {
        const c = activeChar();
        const chat = c && activeChat(c);
        const node = chat && chat.tree.nodes[id];
        if (node && node.content) {
          navigator.clipboard.writeText(node.content);
          act.innerHTML = I.check;
          act.classList.add('copied');
          setTimeout(() => {
            act.innerHTML = I.copy;
            act.classList.remove('copied');
          }, 1200);
        }
      } else if (act.dataset.act === 'ooc') {
        insertOocAt(id);
      } else if (act.dataset.act === 'regen') {
        regenMsg(id);
      } else if (act.dataset.act === 'del') {
        delMsg(id);
      }
    }
  }, false);
  $('#chat-feed').addEventListener('click', (e) => {
    const av = e.target.closest('.avatar.zoomable');
    if (!av) return;
    const msg = av.closest('.msg');
    const c = activeChar();
    const chat = c && activeChat(c);
    const node = (msg && chat && chat.tree.nodes[msg.dataset.id]) || null;
    const src = msg && msg.classList.contains('user')
      ? fullImageSrc(activePersona())
      : (poseImg(node && poseById(chat.characterId, node.poseId)) || fullImageSrc(c));
    if (src) { e.stopPropagation(); openViewer(src); }
  }, true);
  $('#char-info').addEventListener('click', (e) => {
    if (!e.target.closest('.avatar.zoomable')) return;
    const src = poseImg(currentPose()) || fullImageSrc(activeChar());
    if (src) { e.stopPropagation(); openViewer(src); }
  }, true);

  $('#persona-menu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-pid]');
    if (item) { setPersona(item.dataset.pid); closeMenus(); return; }
    if (e.target.closest('#pm-manage')) { closeMenus(); openPersonaModal(); }
  });

  $('#chats-menu').addEventListener('click', (e) => {
    if (e.target.closest('#cm-new')) { newChat(); closeMenus(); return; }
    const del = e.target.closest('[data-del]');
    if (del) { delChat(del.dataset.del); return; }
    const row = e.target.closest('[data-cid]');
    if (row) {
      ui.activeChatIds[activeChar().id] = row.dataset.cid;
      saveUi();
      renderChat();
      closeMenus();
    }
  });

  $('#send-btn').addEventListener('click', () => {
    if (isSteerMode) {
      sendInjection();
      setSteerMode(false);
    } else {
      sendUser();
    }
  });
  $('#composer-actions-btn')?.addEventListener('click', () => toggleMenu('composer-actions-wrap'));
  $('#composer-actions-menu')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="steer"]')) {
      setSteerMode(!isSteerMode);
      closeMenus();
      if (isSteerMode) $('#msg-input').focus();
      return;
    }
    if (e.target.closest('[data-act="respond-me"]')) {
      closeMenus();
      // The two modes are mutually exclusive: writing as your persona
      // cancels an armed OOC directive styling.
      if (isSteerMode) setSteerMode(false);
      respondAsMe();
    }
  });
  $('#cd-generate-btn')?.addEventListener('click', () => {
    const c = activeChar();
    const chat = c && activeChat(c);
    const tip = chat && tipNode(chat);
    if (tip && !typing) generateReplyAt(tip.id);
  });
  $('#inject-btn')?.addEventListener('click', sendInjection);
  $('#generate-btn')?.addEventListener('click', () => {
    const c = activeChar();
    const chat = c && activeChat(c);
    const tip = chat && tipNode(chat);
    if (tip) generateReplyAt(tip.id);
  });
  $('#msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isSteerMode) {
        sendInjection();
        setSteerMode(false);
      } else {
        sendUser();
      }
    }
  });
  $('#msg-input').addEventListener('input', () => { autoGrow(); updateComposerButtons(); });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrap')) closeMenus();
    if (!e.target.closest('.ce-scen-selector')) closeCeScenDropdown();
    if (!e.target.closest('.se-char-selector')) closeSeCharDropdown();
  });

  $('#confirm-ok-btn')?.addEventListener('click', () => closeConfirm(true));
  $('#confirm-cancel-btn')?.addEventListener('click', () => closeConfirm(false));

  $$('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m) requestCloseModal(m); });
  });
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => {
    const m = b.closest('.modal');
    if (m) requestCloseModal(m);
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = Array.from($$('.modal.open'));
      if (openModals.length) {
        const top = openModals[openModals.length - 1];
        requestCloseModal(top);
        return;
      }
      if (document.body.classList.contains('agent-open')) {
        closeAgentDrawer();
        return;
      }
      closeMenus(); closeSidebar(); closeViewer();
      if (editingId) { editingId = null; renderChat({ keepScroll: true }); }
    }
  });

  window.addEventListener('beforeunload', (e) => {
    const openModals = Array.from($$('.modal.open'));
    const hasDirty = openModals.some((m) => isModalDirty(m.id));
    if (hasDirty) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  $('#prov-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.prov');
    if (card) setProviderUI(card.dataset.pv);
  });
  $('#agent-prov-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.prov');
    if (card) setAgentProviderUI(card.dataset.pv);
  });
  $('#set-agent-override').addEventListener('change', updateAgentConnUI);
  $('#agent-key-toggle').addEventListener('click', () => {
    const input = $('#agent-key');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    $('#agent-key-toggle').textContent = showing ? 'Show' : 'Hide';
  });
  $('#key-toggle').addEventListener('click', () => {
    const input = $('#set-key');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    $('#key-toggle').textContent = showing ? 'Show' : 'Hide';
  });
  $('#set-temp').addEventListener('input', (e) => {
    $('#temp-val').textContent = (+e.target.value).toFixed(1);
  });
  $('#settings-save').addEventListener('click', settingsSave);
  $('#pose-provider').addEventListener('change', updatePoseProviderHints);

  $('#persona-list').addEventListener('click', async (e) => {
    const use = e.target.closest('[data-use]');
    if (use) { setPersona(use.dataset.use); return; }
    const edit = e.target.closest('[data-edit]');
    if (edit) {
      const p = state.personalities.find((x) => x.id === edit.dataset.edit);
      peMode = 'edit'; peId = p.id; peAvatar = p.avatar || null; peImage = p.image || null;
      $('#pf-name').value = p.name;
      $('#pf-desc').value = p.description;
      $('#pf-note').value = p.note || '';
      updatePersonaForm();
      updatePfAvatarUI();
      $('#pf-name').focus();
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const p = state.personalities.find((x) => x.id === del.dataset.del);
      if (!p) return;
      const ok = await customConfirm({
        title: 'Delete persona?',
        message: `Delete persona "${p.name}"? This cannot be undone.`,
        confirmText: 'Delete persona',
        danger: true,
      });
      if (!ok) return;
      try {
        const r = await api('/personalities/' + p.id, { method: 'DELETE' });
        state.personalities = r.personalities;
        if (state.settings.activePersonalityId === p.id && state.personalities.length) {
          await setPersona(state.personalities[0].id);
        }
        renderPersonaList();
        renderHeader();
        toast('Personality deleted');
      } catch (err) { toast(err.message); }
    }
  });
  $('#pf-save').addEventListener('click', personaFormSave);
  $('#pf-cancel').addEventListener('click', () => {
    peMode = 'new'; peId = null; peAvatar = null; peImage = null;
    $('#pf-name').value = ''; $('#pf-desc').value = ''; $('#pf-note').value = '';
    updatePersonaForm();
    updatePfAvatarUI();
  });
  $('#pf-upload').addEventListener('click', () => $('#pf-file').click());
  $('#pf-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please choose an image file'); return; }
    const reader = new FileReader();
    reader.onload = () => openCropFlow(reader.result, (r) => {
      if (!r) return;
      peAvatar = r.square;
      peImage = r.full;
      updatePfAvatarUI();
    });
    reader.onerror = () => toast('Could not read that file');
    reader.readAsDataURL(file);
  });
  $('#pf-remove-avatar').addEventListener('click', () => {
    peAvatar = null;
    peImage = null;
    updatePfAvatarUI();
  });

  $('#modal-char').addEventListener('click', (e) => {
    const eg = e.target.closest('[data-emoji]');
    if (eg) { ceEmoji = eg.dataset.emoji; renderCeEmojiGrid(); updateCeAvatarUI(); }
  });
  $('#ce-upload').addEventListener('click', () => $('#ce-file').click());
  $('#ce-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please choose an image file'); return; }
    const reader = new FileReader();
    reader.onload = () => openCropFlow(reader.result, (r) => {
      if (!r) return;
      ceAvatar = r.square;
      ceImage = r.full;
      updateCeAvatarUI();
    });
    reader.onerror = () => toast('Could not read that file');
    reader.readAsDataURL(file);
  });
  $('#ce-remove-avatar').addEventListener('click', () => {
    ceAvatar = null;
    ceImage = null;
    updateCeAvatarUI();
  });

  // Character Modal Tabs & Variables events
  $('#ce-tab-edit').addEventListener('click', () => switchCeDescTab('edit'));
  $('#ce-tab-preview').addEventListener('click', () => switchCeDescTab('preview'));
  $('#ce-desc').addEventListener('input', () => {
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });
  $('#ce-name').addEventListener('input', () => {
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });

  // Character Modal Scenario Inspector Side Panel events
  $('#ce-scen-panel-toggle')?.addEventListener('click', toggleCeScenPanel);
  $('#ce-scen-panel-close')?.addEventListener('click', closeCeScenPanel);
  $('#ce-scen-active-card')?.addEventListener('click', () => {
    toggleCeScenDropdown();
  });
  $('#ce-scen-switch-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCeScenDropdown();
  });
  $('#ce-scen-search-input')?.addEventListener('input', (e) => {
    renderCeScenCards(e.target.value);
  });
  $('#ce-scen-cards-scroll')?.addEventListener('click', (e) => {
    const card = e.target.closest('.ce-scen-opt-card');
    if (!card) return;
    const scenId = card.dataset.scenId;
    if (!scenId) return;
    ceScenSelectedId = scenId;
    closeCeScenDropdown();
    renderCeScenActiveCard();
    updateCeScenPanelUI();
  });
  $('#ce-scen-tab-preview')?.addEventListener('click', () => switchCeScenTab('preview'));
  $('#ce-scen-tab-vars')?.addEventListener('click', () => switchCeScenTab('vars'));
  $('#ce-scen-vars-list')?.addEventListener('input', (e) => {
    const inp = e.target.closest('.ce-scen-var-input');
    if (!inp || !ceScenSelectedId || !ceId) return;
    const varName = inp.dataset.scenVar;
    if (!varName) return;

    const scen = state.scenarios.find((s) => s.id === ceScenSelectedId);
    if (!scen) return;
    if (!scen.characterVariables) scen.characterVariables = {};
    if (!scen.characterVariables[ceId]) scen.characterVariables[ceId] = {};
    scen.characterVariables[ceId][varName] = inp.value;

    const isSet = Boolean(inp.value && inp.value.trim().length > 0);
    const card = inp.closest('.ce-scen-var-card');
    if (card) {
      card.className = `ce-scen-var-card ${isSet ? 'configured' : 'missing'}`;
      const badge = card.querySelector('.ce-scen-var-badge');
      if (badge) {
        badge.className = `ce-scen-var-badge ${isSet ? 'configured' : 'missing'}`;
        badge.textContent = isSet ? 'Configured' : 'Missing';
      }
      const tagEl = card.querySelector('.ce-scen-var-tag');
      if (tagEl) {
        tagEl.className = `ce-scen-var-tag ${isSet ? 'configured' : 'missing'}`;
      }
    }

    // Update banner count
    const banner = $('#ce-scen-status-banner');
    if (banner) {
      const inputs = $$('#ce-scen-vars-list .ce-scen-var-input');
      const total = inputs.length;
      let missing = 0;
      inputs.forEach((i) => { if (!i.value || !i.value.trim()) missing++; });
      const configured = total - missing;
      const charName = $('#ce-name')?.value.trim() || 'this character';
      if (total === 0) {
        banner.className = 'ce-scen-status-banner all-good';
        banner.innerHTML = `<span>ℹ This scenario does not use any template variables.</span>`;
      } else if (missing === 0) {
        banner.className = 'ce-scen-status-banner all-good';
        banner.innerHTML = `
          <span>✓ All scenario variables configured for ${esc(charName)}</span>
          <span class="ce-scen-stat-pill green">${configured} of ${total}</span>
        `;
      } else {
        banner.className = 'ce-scen-status-banner has-missing';
        banner.innerHTML = `
          <span>⚠ ${missing} variable${missing === 1 ? '' : 's'} not configured for ${esc(charName)}</span>
          <span class="ce-scen-stat-pill red">${missing} missing</span>
        `;
      }
    }

    // Update preview
    const charName = $('#ce-name')?.value.trim() || '';
    const previewBox = $('#ce-scen-preview-text');
    if (previewBox) {
      previewBox.innerHTML = renderCeScenPreviewMarkdown(scen.content, charName, scen.characterVariables[ceId], scen);
    }

    clearTimeout(ceScenSaveTimeout);
    ceScenSaveTimeout = setTimeout(() => saveCeScenarioVars(scen), 500);
  });

  $('#ce-save').addEventListener('click', charFormSave);
  $('#ce-delete').addEventListener('click', async () => {
    const btn = $('#ce-delete');
    if (!btn.classList.contains('armed')) {
      btn.classList.add('armed');
      btn.textContent = 'Click again to confirm';
      delArmed = setTimeout(disarmDelete, 2600);
      return;
    }
    try { await api('/characters/' + ceId, { method: 'DELETE' }); }
    catch (e) { toast(e.message); return; }
    const c = state.characters.find((x) => x.id === ceId);
    state.characters = state.characters.filter((x) => x.id !== ceId);
    if (ui.activeCharacterId === ceId) ui.activeCharacterId = null;
    saveUi();
    disarmDelete();
    closeModal('modal-char');
    renderSidebar();
    showWelcome();
    toast(`Deleted "${c ? c.name : 'character'}"`);
  });

  $('#ce-poses').addEventListener('click', openPosesModal);
  $('#ce-poses-enabled').addEventListener('change', updateCePosesToggleUI);
  $('#pose-add').addEventListener('click', poseAdd);
  $('#pose-save').addEventListener('click', poseFormSave);
  $('#pose-cancel').addEventListener('click', async () => {
    const name = ($('#pose-name')?.value || '').trim();
    const desc = ($('#pose-desc')?.value || '').trim();
    if (name || desc) {
      const ok = await customConfirm({
        title: 'Discard pose changes?',
        message: 'You have unsaved changes to this pose.',
        confirmText: 'Discard',
        danger: true,
      });
      if (!ok) return;
    }
    closePoseForm();
  });
  $('#poses-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.pose-card');
    if (!card) return;
    e.stopPropagation();
    const p = poseList(poseCharId).find((x) => x.id === card.dataset.id);
    if (!p) return;
    const act = e.target.closest('[data-pose-act]');
    const kind = act ? act.dataset.poseAct : 'use';
    if (kind === 'img') {
      poseUploadId = p.id;
      $('#pose-file').click();
    } else if (kind === 'edit') {
      clearPoseDelArm();
      openPoseForm(p);
    } else if (kind === 'default') {
      poseSetDefault(p);
    } else if (kind === 'use') {
      usePose(p);
    } else if (kind === 'del') {
      poseDelete(p, act);
    }
  });
  $('#pose-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    const id = poseUploadId;
    poseUploadId = null;
    if (!file || !id) return;
    if (!file.type.startsWith('image/')) { toast('Please choose an image file'); return; }
    const reader = new FileReader();
    reader.onload = () => openCropFlow(reader.result, (r) => {
      if (r) savePoseImage(id, r);
      // The crop modal never closes the poses one, but re-open defensively.
      if (!$('#modal-poses').classList.contains('open')) openModal('modal-poses');
      renderPosesGrid();
    });
    reader.onerror = () => toast('Could not read that file');
    reader.readAsDataURL(file);
  });

  const view = $('#crop-view');
  let dragging = false, sx = 0, sy = 0, sdx = 0, sdy = 0;
  view.addEventListener('pointerdown', (e) => {
    if (crop.pass !== 'square' || e.target.closest('#crop-frame')) return;
    dragging = true;
    view.setPointerCapture(e.pointerId);
    sx = e.clientX; sy = e.clientY; sdx = crop.dx; sdy = crop.dy;
    view.classList.add('grabbing');
  });
  view.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    crop.dx = sdx + (e.clientX - sx);
    crop.dy = sdy + (e.clientY - sy);
    clampPan();
    applyCropTransform();
  });
  const endDrag = () => { dragging = false; view.classList.remove('grabbing'); };
  view.addEventListener('pointerup', endDrag);
  view.addEventListener('pointercancel', endDrag);

  const frame = $('#crop-frame');
  let framing = false, fx = 0, fy = 0, frx = 0, fry = 0;
  frame.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#crop-handle')) return;
    framing = true;
    frame.setPointerCapture(e.pointerId);
    fx = e.clientX; fy = e.clientY; frx = crop.rect.x; fry = crop.rect.y;
    frame.classList.add('grabbing');
  });
  frame.addEventListener('pointermove', (e) => {
    if (!framing) return;
    crop.rect.x = frx + (e.clientX - fx);
    crop.rect.y = fry + (e.clientY - fy);
    clampRect();
    positionRect();
  });
  const endFrame = () => { framing = false; frame.classList.remove('grabbing'); };
  frame.addEventListener('pointerup', endFrame);
  frame.addEventListener('pointercancel', endFrame);

  const handle = $('#crop-handle');
  let sizing = false, hx = 0, hy = 0, hw = 0, hh = 0;
  handle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    sizing = true;
    handle.setPointerCapture(e.pointerId);
    hx = e.clientX; hy = e.clientY; hw = crop.rect.w; hh = crop.rect.h;
  });
  handle.addEventListener('pointermove', (e) => {
    if (!sizing) return;
    const b = visualBounds();
    crop.rect.w = Math.min(Math.max(hw + (e.clientX - hx), 32), b.left + b.w - crop.rect.x);
    crop.rect.h = Math.min(Math.max(hh + (e.clientY - hy), 32), b.top + b.h - crop.rect.y);
    positionRect();
  });
  const endSize = () => { sizing = false; };
  handle.addEventListener('pointerup', endSize);
  handle.addEventListener('pointercancel', endSize);

  $('#crop-rotl').addEventListener('click', () => {
    if (crop.applying || !crop.img) return;
    crop.steps = (crop.steps + 3) % 4;
    if (crop.pass === 'square') { updateCover(); clampPan(); applyCropTransform(); }
    else { applyFreeTransform(); clampRect(); positionRect(); }
  });
  $('#crop-rotr').addEventListener('click', () => {
    if (crop.applying || !crop.img) return;
    crop.steps = (crop.steps + 1) % 4;
    if (crop.pass === 'square') { updateCover(); clampPan(); applyCropTransform(); }
    else { applyFreeTransform(); clampRect(); positionRect(); }
  });
  $('#crop-zoom').addEventListener('input', (e) => {
    if (crop.pass !== 'square' || crop.applying) return;
    crop.scale = +e.target.value;
    clampPan(); applyCropTransform();
    $('#crop-zoom-val').textContent = crop.scale.toFixed(1) + '×';
  });
  $('#crop-reset').addEventListener('click', () => {
    if (crop.applying || !crop.img) return;
    crop.steps = 0; crop.scale = 1; crop.dx = 0; crop.dy = 0;
    if (crop.pass === 'square') {
      $('#crop-zoom').value = '1';
      $('#crop-zoom-val').textContent = '1.0×';
      updateCover(); clampPan(); applyCropTransform();
    } else {
      defaultFreeRect();
      applyFreeTransform();
      positionRect();
    }
  });
  $('#crop-apply').addEventListener('click', applyCrop);
  $('#crop-skip').addEventListener('click', skipFullCrop);
  $('#crop-cancel').addEventListener('click', () => {
    crop.applying = false;
    crop.onDone = null;
    closeModal('modal-crop');
  });
  window.addEventListener('resize', () => {
    if ($('#modal-crop').classList.contains('open') && crop.img) layoutCrop();
  });
}

/* ---- AI Agent drawer ------------------------------------------------------ */

const AGENT_TOOL_LABELS = {
  site_overview: 'Read the site',
  list_characters: 'Listing characters',
  get_character: 'Reading character',
  create_character: 'Created character',
  update_character: 'Updated character',
  set_character_variables: 'Set variables',
  delete_character: 'Deleted character',
  list_scenarios: 'Listing scenarios',
  get_scenario: 'Reading scenario',
  create_scenario: 'Created scenario',
  update_scenario: 'Updated scenario',
  set_scenario_character_variables: 'Attached variables to scenario',
  delete_scenario: 'Deleted scenario',
  list_personas: 'Listing personas',
  create_persona: 'Created persona',
  update_persona: 'Updated persona',
  set_active_persona: 'Switched active persona',
  generate_image: 'Generated image',
  edit_image: 'Edited image',
  apply_image: 'Applied image',
  list_presets: 'Listing presets',
  get_preset: 'Inspecting preset',
};

const AGENT_SUGGESTIONS = [
  'Let\'s create a new character together — a full set with a scenario.',
  'Create a character and generate a portrait plus two poses for her.',
  'I attached an image — turn it into my character\'s avatar.',
  'What characters and scenarios do I have?',
];

let agentOpen = false;
let agentBusy = false;
let agentStatus = '';
let agentLoaded = false;
let agentAttachments = []; // { id, name, dataUrl } surfaced as chips above the input

function renderAgentAttachments() {
  const row = agentEl('#agent-attachments');
  if (!row) return;
  if (!agentAttachments.length) { row.classList.add('hidden'); row.innerHTML = ''; return; }
  row.classList.remove('hidden');
  row.innerHTML = agentAttachments.map((a) => `
    <span class="agent-attach-chip" data-att-id="${esc(a.id)}" title="${esc(a.name)}">
      <img src="${esc(a.dataUrl)}" alt="${esc(a.name)}">
      <span>${esc(a.name)}</span>
      <button type="button" class="att-x" data-att-remove="${esc(a.id)}" aria-label="Remove attachment">×</button>
    </span>`).join('');
}

async function agentAttachFiles(files) {
  const list = Array.from(files || []);
  if (!list.length) return;
  for (const f of list) {
    if (agentAttachments.length >= 6) { toast('Maximum 6 attachments per message'); break; }
    const isImage = /^image\//i.test(f.type || '') || /\.(png|jpe?g|webp|avif|gif|bmp|heic|heif)$/i.test(f.name || '');
    if (!isImage) { toast(`"${f.name || 'File'}" is not an image`); continue; }
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => reject(new Error('Could not read that file'));
        fr.readAsDataURL(f);
      });
      const normalized = await normalizeImageDataUrl(String(dataUrl));
      if (normalized.length > 12 * 1024 * 1024) {
        toast(`"${f.name}" is too large even after scaling (max ~9 MB)`);
        continue;
      }
      const r = await api('/agent/attach', { method: 'POST', body: JSON.stringify({ name: f.name, dataUrl: normalized }) });
      agentAttachments.push({ id: r.id, name: r.name || f.name, dataUrl: normalized });
    } catch (e) {
      console.error('[agent] attach failed:', e);
      toast(e.message || 'Attachment failed');
    }
  }
  renderAgentAttachments();
}

/* Every attached image — png, jpg, webp, avif, gif, heic… — is decoded and
   normalized before upload: oversized dimensions are scaled to ≤1536px and the
   result is re-encoded into a compact, universally accepted format (WebP for
   opaque content, PNG to preserve transparency). Small PNG/JPEG/WebP sources pass
   through untouched. This keeps POST bodies far below the payload cap, where
   re-encoding camera photos to PNG could blow past it. */
function normalizeImageDataUrl(dataUrl, maxDim = 1536) {
  const mime = (dataUrl.match(/^data:(image\/[a-z0-9.+-]+);/i) || [])[1] || '';
  const draw = (source) => new Promise((resolve, reject) => {
    const sw = source.naturalWidth || source.width || 0;
    const sh = source.naturalHeight || source.height || 0;
    const big = Math.max(sw, sh);
    if (!big) return reject(new Error('Empty image'));
    const k = big > maxDim ? maxDim / big : 1;
    /* Small PNG/JPEG/WEBP under cap is compact and accepted as-is. */
    if (k === 1 && /^image\/(png|jpe?g|webp)$/i.test(mime) && dataUrl.length <= 4 * 1024 * 1024) {
      return resolve(dataUrl);
    }
    const w = Math.max(1, Math.round(sw * k));
    const h = Math.max(1, Math.round(sh * k));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
    /* Preserve transparency when present; otherwise pick the smallest encoder
       the browser offers — WebP first, JPEG fallback (photos encode ~10x
       smaller than PNG), PNG as the last resort. */
    let hasAlpha = false;
    try {
      const d = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < d.length; i += 16) { if (d[i] < 250) { hasAlpha = true; break; } }
    } catch { hasAlpha = true; }
    let out = '';
    try {
      if (!hasAlpha) {
        out = canvas.toDataURL('image/webp', 0.9);
        if (!out.startsWith('data:image/webp')) out = canvas.toDataURL('image/jpeg', 0.92);
      }
      if (!out) out = canvas.toDataURL('image/png');
    } catch { out = ''; }
    if (!out) reject(new Error('Could not re-encode that image'));
    else resolve(out);
  });
  const decodeViaImg = () => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  return decodeViaImg()
    .then(draw, async () => {
      /* Some browsers decode exotic formats (avif/heic) only through
         createImageBitmap — try that before giving up. */
      try {
        const blob = await (await fetch(dataUrl)).blob();
        return await draw(await createImageBitmap(blob));
      } catch {
        if (/^data:image\/(?:png|jpe?g|webp|gif|avif);base64,/i.test(dataUrl) && dataUrl.length <= 12 * 1024 * 1024) {
          return dataUrl;
        }
        throw new Error(`This browser can't decode ${fMimeLabel(mime)} images — try converting it to PNG or JPEG`);
      }
    });
}
function fMimeLabel(mime) {
  const m = String(mime || '').replace('image/', '').toUpperCase();
  return m && m.length < 6 ? m : 'THAT';
}
let agentMessages = [];

function agentEl(sel) { return document.querySelector(sel); }

async function loadAgent() {
  try {
    const r = await api('/agent/messages');
    agentMessages = r.messages || [];
    agentLoaded = true;
    renderAgent();
    refreshAgentChanges();
  } catch { /* agent log is optional */ }
}

function openAgentDrawer() {
  document.body.classList.add('agent-open');
  agentOpen = true;
  closeMenus(); closeSidebar();
  agentEl('#agent-model-label').textContent = agentModelLabel();
  refreshAgentChanges();
  if (!agentLoaded) loadAgent(); else renderAgent();
  setTimeout(() => agentEl('#agent-input')?.focus(), 240);
}

function closeAgentDrawer() {
  document.body.classList.remove('agent-open');
  agentOpen = false;
}

function agentModelLabel() {
  try {
    const s = state.settings;
    let ai;
    if (s.agentOverride) {
      ai = {
        provider: s.agentProvider || 'openrouter',
        model: s.agentModel || '',
        apiKey: s.agentApiKey || '',
      };
    } else {
      ai = effectiveAi();
    }
    const label = (PROVIDERS[ai.provider] ? PROVIDERS[ai.provider].label.split(' ')[0] : ai.provider);
    return ai.model ? `via ${ai.model} · ${label}` : 'no AI connection configured';
  } catch { return ''; }
}

function agentToolLabel(name) {
  return AGENT_TOOL_LABELS[name] || name;
}

function agentToolSummary(name, args, result) {
  args = args || {};
  switch (name) {
    case 'create_character':
    case 'update_character':
    case 'delete_character':
    case 'get_character': return args.name || String(args.id || '');
    case 'create_scenario':
    case 'update_scenario':
    case 'delete_scenario':
    case 'get_scenario': return args.title || String(args.id || '');
    case 'create_persona':
    case 'update_persona':
    case 'set_active_persona': return args.name || String(args.id || '');
    case 'get_preset': return args.name || String(args.id || '');
    case 'set_character_variables': return Object.keys(args.variables || {}).join(', ');
    case 'set_scenario_character_variables': return Object.keys(args.variables || {}).join(', ');
    case 'generate_image': {
      const p = agentTrimLocal(args.prompt, 60);
      if (args.target === 'pose') return `${p} → pose ${args.pose_id ? '' : (args.pose_name || '(new)')}`;
      if (args.pose_id) return `${p} → pose ${args.pose_id}`;
      if (args.character_id && (args.target === 'portrait' || args.apply)) return `${p} → portrait`;
      return p;
    }
    case 'edit_image': {
      const src = args.source_type === 'last' ? 'last image' : args.source_type || 'image';
      return `${agentTrimLocal(args.prompt, 50)} · from ${src}`;
    }
    case 'apply_image': {
      const src = args.source_type === 'attachment' ? (args.source_id || 'attachment') : 'last image';
      return `${src} → ${args.target === 'pose' ? ('pose ' + (args.pose_name || args.pose_id || '(new)')) : 'portrait'}`;
    }
    default: return '';
  }
}

function agentRoles(mi) {
  // Returns 'user' | 'agent' | 'tool' | 'error' for one feed item.
  if (mi.kind === 'error') return 'error';
  if (mi.kind === 'tool') return 'tool';
  if (mi.role === 'assistant') return 'agent';
  return mi.role;
}

/* User messages may carry [attached image: att-… — name] markers the server
   stores for history replay. Render them as clickable thumbnails instead. */
const AGENT_ATTACH_RE = /\[attached image:\s*(att-[\w-]+)\s*(?:—\s*([^\]]*))?\]/g;

function agentUserHtml(content) {
  const imgs = [];
  const text = String(content || '').replace(AGENT_ATTACH_RE, (_m0, id, name) => {
    imgs.push({ id, name: (name || 'image').trim() });
    return '';
  });
  const chips = imgs.map((a) => `
    <span class="agent-attach-chip" data-att-id="${esc(a.id)}" title="${esc(a.name)}">
      <img src="/api/agent/${esc(a.id)}/file" alt="${esc(a.name)}" loading="lazy">
      <span>${esc(a.name)}</span>
    </span>`).join('');
  const md = agentMd(text.trim());
  return chips ? `${md}<div class="agent-attach-row">${chips}</div>` : md;
}

function agentToolCardHtml(mi) {
  // Loaded rows use toolName/toolArgs/toolResult/toolError; live events use name/args/result/ok.
  const name = mi.name || mi.toolName;
  mi = { ...mi, name, args: (mi.args !== undefined ? mi.args : mi.toolArgs), result: (mi.result !== undefined ? mi.result : mi.toolResult), ok: (mi.ok !== undefined ? mi.ok : !mi.toolError) };

  const label = agentToolLabel(name);
  const sub = agentToolSummary(name, mi.args, mi.result) || (mi.ok === false && mi.error ? agentTrimLocal(mi.error, 70) : 'done');
  const okCls = mi.ok === false ? 'err' : (mi.pending ? 'pending' : '');
  const img = mi.result && mi.result.image;
  // Stored rows keep the sanitizer's placeholder instead of bytes; only real
  // data URLs / http images can be shown.
  const hasImg = !!img && typeof img === 'string' && img !== '[image data url, hidden from the model]' &&
    (img.startsWith('data:image') || /^https?:\/\//.test(img));
  const acts = mi.pending ? '' : agentToolActions(mi);
  let html = `<div class="agent-tool ${okCls}" data-agent-tool="${mi.id || ''}">`;
  html += `<div class="agent-tool-row">`;
  html += `<span class="agent-tool-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>`;
  html += `<div class="agent-tool-main"><div class="agent-tool-name">${esc(label)}</div><div class="agent-tool-sub">${esc(sub)}</div></div>`;
  html += `<svg class="agent-tool-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
  html += `</div>`;
  if (!mi.pending) {
    if (hasImg) {
      html += `<div class="agent-tool-img"><img src="${esc(mi.result.image)}" alt="Generated image"></div>`;
    }
    html += `<div class="agent-tool-details">`;
    if (mi.args) html += `<div class="dt-label">Arguments</div><pre>${esc(JSON.stringify(mi.args, null, 2))}</pre>`;
    if (mi.result !== null && mi.result !== undefined) html += `<div class="dt-label">${mi.ok === false ? 'Error' : 'Result'}</div><pre>${esc(JSON.stringify(mi.result, null, 2))}</pre>`;
    html += `</div>`;
    if (acts) html += `<div class="agent-tool-acts">${acts}</div>`;
  }
  html += `</div>`;
  return html;
}

function agentTrimLocal(s, n) {
  const t = String(s || '');
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}

/* --- Agent markdown --------------------------------------------------------
   The Agent drafts content in markdown (headings, lists, tables, code
   fences) which the chat's simple md() doesn't cover, so agent bubbles use
   this richer renderer. Input is esc()ed; every tag added below is ours. */
function agentInline(t) {
  return t
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function agentMd(src) {
  const lines = esc(String(src || '')).replace(/\r/g, '').split('\n');
  let html = '';
  let list = null;      // 'ul' | 'ol' while a list is open
  let para = [];        // pending paragraph lines
  let code = null;      // fenced code lines
  let table = null;     // pending pipe-table rows

  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
  const flushPara = () => {
    if (para.length) { html += `<p>${para.map(agentInline).join('<br>')}</p>`; para = []; }
  };
  const closeCode = () => {
    if (code) { html += `<pre class="agent-pre">${code.join('\n')}</pre>`; code = null; }
  };
  const tableRow = (row) => {
    let cells = row.split('|');
    if (cells.length && cells[0].trim() === '') cells = cells.slice(1);
    if (cells.length && cells[cells.length - 1].trim() === '') cells = cells.slice(0, -1);
    return cells.map((c) => c.trim());
  };
  const closeTable = () => {
    if (!table) return;
    const first = tableRow(table[0]);
    const sep = /^:?-{1,}:?$/;
    const isSep = (cells) => cells.length && cells.every((c) => sep.test(c));
    html += '<div class="agent-table-wrap"><table>';
    html += `<thead><tr>${first.map((c) => `<th>${agentInline(c)}</th>`).join('')}</tr></thead>`;
    html += '<tbody>';
    table.slice(1).forEach((row) => {
      const cells = tableRow(row);
      if (isSep(cells)) return;
      const n = Math.max(first.length, cells.length);
      const tds = [];
      for (let i = 0; i < n; i++) tds.push(`<td>${agentInline(cells[i] || '')}</td>`);
      html += `<tr>${tds.join('')}</tr>`;
    });
    html += '</tbody></table></div>';
    table = null;
  };

  for (const ln of lines) {
    const t = ln.trim();
    if (/^```/.test(t)) {
      if (code) closeCode();
      else { flushPara(); closeList(); closeTable(); code = []; }
      continue;
    }
    if (code !== null) { code.push(ln); continue; }

    if (/^\|.*\|$/.test(t)) { flushPara(); closeList(); if (table) table.push(t); else { closeTable(); table = [t]; } continue; }
    if (table) closeTable();

    if (!t) { flushPara(); closeList(); continue; }

    const h = t.match(/^#{1,4}\s+(.+)$/);
    if (h) { flushPara(); closeList(); html += `<h3>${agentInline(h[1])}</h3>`; continue; }

    if (/^(-{3,}|\*{3,})$/.test(t)) { flushPara(); closeList(); html += '<hr>'; continue; }

    const ul = t.match(/^[-*•]\s+(.*)$/);
    const ol = t.match(/^(\d+)[.)]\s+(.+)$/);
    if (ul || ol) {
      flushPara();
      const want = ul ? 'ul' : 'ol';
      if (list !== want) { closeList(); html += `<${want}>`; list = want; }
      html += `<li>${agentInline(ul ? ul[1] : ol[2])}</li>`;
      continue;
    }

    const bq = t.match(/^&gt;\s?(.*)$/);
    if (bq) { flushPara(); closeList(); html += `<blockquote>${agentInline(bq[1])}</blockquote>`; continue; }

    if (list) closeList();
    para.push(t);
  }
  flushPara(); closeList(); closeCode(); closeTable();
  return html;
}

function agentToolActions(mi) {
  // Build "Open" style actions once the newer site state is loaded.
  let chain = [];
  try {
    if (['create_character', 'update_character'].includes(mi.name) && mi.result) {
      const id = (mi.result.created && mi.result.created.id) || (mi.result.updated && mi.result.updated.id) || mi.result.character_id;
      const c = id && state.characters.find((x) => x.id === id);
      if (c) {
        chain = [
          `<button type="button" class="btn btn-ghost tiny" data-agent-open-chat="${esc(c.id)}">Open chat</button>`,
          `<button type="button" class="btn btn-ghost tiny" data-agent-edit-char="${esc(c.id)}">Edit</button>`,
        ];
      }
    } else if (['create_scenario', 'update_scenario'].includes(mi.name) && mi.result) {
      const id = (mi.result.created && mi.result.created.id) || (mi.result.updated && mi.result.updated.id);
      const s = id && state.scenarios.find((x) => x.id === id);
      if (s) {
        chain = [`<button type="button" class="btn btn-ghost tiny" data-agent-edit-scen="${esc(s.id)}">Edit scenario</button>`];
      }
    } else if (['generate_image', 'edit_image', 'apply_image'].includes(mi.name) && mi.result) {
      const ap = mi.result.applied_to;
      const cid = typeof ap === 'string' ? ap : ap && ap.character_id;
      const c = cid && state.characters.find((x) => x.id === cid);
      if (c) {
        chain = [
          `<button type="button" class="btn btn-ghost tiny" data-agent-open-char="${esc(c.id)}">Open chat</button>`,
          `<button type="button" class="btn btn-ghost tiny" ${ap && ap.pose_id ? `data-agent-open-poses="${esc(c.id)}"` : `data-agent-edit-char="${esc(c.id)}"`}>${ap && ap.pose_id ? 'Poses' : 'Edit character'}</button>`,
        ];
      }
    } else if (mi.name === 'create_persona' && mi.result && mi.result.created) {
      const pi = mi.result.created.id;
      const pp = state.personalities.find((x) => x.id === pi);
      if (pp) chain = [`<button type="button" class="btn btn-ghost tiny" data-agent-activate-persona="${esc(pp.id)}">Set active</button>`];
    } else if (mi.name === 'get_preset' && mi.result && mi.result.id) {
      const pr = state.presets.find((x) => x.id === mi.result.id);
      if (pr) chain = [`<button type="button" class="btn btn-ghost tiny" data-agent-open-preset="${esc(pr.id)}">Open preset</button>`];
    }
  } catch { /* state may be mid-refresh */ }
  return chain.length ? chain.join('') : '';
}

function renderAgent() {
  const feed = agentEl('#agent-feed');
  if (!feed) return;
  let html = '';
  if (!agentMessages.length) {
    const suggestion = AGENT_SUGGESTIONS.map((s) => `<button type="button" class="btn btn-ghost tiny" data-agent-suggest="${esc(s)}">${esc(s)}</button>`).join('');
    html = `<div class="agent-msg agent empty"><div class="agent-empty">
      <svg class="ae-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.7-1.9a2 2 0 0 0 1.3-1.3Z"/></svg>
      <h4>Hi — I'm your build agent</h4>
      <p>I can design characters, draft scenarios, split them into scaffolds + variables, and wire everything up — with your approval at each step. I can also generate, edit and place portraits &amp; pose images, or work with images you attach. And I can answer anything about this site.</p>
      <div class="ae-suggest">${suggestion}</div>
    </div></div>`;
  } else {
    let openToolGroup = false;
    for (const mi of agentMessages) {
      const role = agentRoles(mi);
      if (role !== 'tool' && openToolGroup) { html += '</div>'; openToolGroup = false; }
      if (role === 'user') {
        html += `<div class="agent-msg user"><div class="agent-bubble agent-md">${agentUserHtml(mi.content || '')}</div></div>`;
      } else if (role === 'agent') {
        if ((mi.content || '').trim()) {
          html += `<div class="agent-msg agent"><div class="agent-bubble agent-md${mi.streaming ? ' streaming' : ''}">${agentMd(mi.content)}</div></div>`;
        } else if (mi.streaming) {
          html += `<div class="agent-msg agent"><div class="agent-bubble agent-md streaming"></div></div>`;
        }
      } else if (role === 'tool') {
        if (!openToolGroup) { html += `<div class="agent-msg agent tool-group">`; openToolGroup = true; }
        html += agentToolCardHtml(mi);
      } else if (role === 'error') {
        html += `<div class="agent-msg agent err"><div class="agent-bubble">${esc(mi.text || 'Something went wrong.')}</div></div>`;
      }
    }
    if (openToolGroup) html += '</div>';
  }
  feed.innerHTML = html;
  const sc = agentEl('#agent-scroll');
  if (sc) sc.scrollTop = sc.scrollHeight;
  const sendBtn = agentEl('#agent-send-btn');
  if (sendBtn) sendBtn.disabled = agentBusy;
}

function closeAgentStreamingRow() {
  const cur = agentMessages[agentMessages.length - 1];
  if (cur && cur.role === 'assistant' && cur.streaming) {
    cur.streaming = false;
    if (!(cur.content || '').trim()) agentMessages.pop();
  }
}

function setAgentStatus(status) {
  agentStatus = status || '';  const bar = agentEl('#agent-status-bar');
  const txt = agentEl('#agent-status-text');
  if (agentBusy && agentStatus) {
    bar.classList.remove('hidden');
    if (agentStatus === 'thinking') txt.textContent = 'Thinking…';
    else if (agentStatus.startsWith('running_tool:')) txt.textContent = 'Running ' + agentToolLabel(agentStatus.slice(13).toLowerCase()) + '…';
    else txt.textContent = agentStatus;
  } else {
    bar.classList.add('hidden');
  }
}

async function refreshAgentChanges() {
  const revBtn = $('#agent-revert-btn');
  if (!revBtn) return;
  try {
    const r = await api('/agent/changes');
    const changes = r.changes || [];
    revBtn.textContent = `Revert (${changes.length})`;
    if (changes.length > 0) {
      revBtn.classList.remove('hidden');
    } else {
      revBtn.classList.add('hidden');
    }
  } catch {
    revBtn.classList.add('hidden');
  }
}

async function agentSendText(text) {
  const ta = agentEl('#agent-input');
  if (ta) ta.value = text;
  return agentSend();
}

async function refreshDataAfterAgent() {
  try { await bootstrap(); } catch { return; }
  await refreshAgentChanges();
  renderSidebar();
  renderSidebarScenarios();
  renderSidebarPersonas();
  renderHeader();
  const c = activeChar();
  if (c) renderChat({ keepScroll: true });
  else showWelcome();
}

async function streamAgent(body, onEvent) {
  const r = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok || !(r.headers.get('content-type') || '').includes('text/event-stream')) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || 'Agent stream failed');
  }
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) !== -1) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const line = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      let ev;
      try { ev = JSON.parse(line.slice(6)); } catch { continue; }
      onEvent(ev);
    }
  }
}

async function agentSend() {
  const ta = agentEl('#agent-input');
  let text = (ta.value || '').trim();
  const atts = agentAttachments.slice();
  if ((!text && !atts.length) || agentBusy) return;
  if (!text && atts.length) text = 'Please take a look at the attached image(s).';
  ta.value = '';
  ta.style.height = '';
  agentInputManualHeight = 0;
  const markers = atts.map((a) => `[attached image: ${a.id} — ${a.name}]`).join('\n');
  agentMessages.push({ role: 'user', content: text + (markers ? '\n\n' + markers : '') });
  agentAttachments = [];
  renderAgentAttachments();
  agentBusy = true;
  setAgentStatus('thinking');
  renderAgent();
  try {
    await streamAgent({ message: text, attachments: atts.map((a) => a.id) }, (ev) => {
      if (ev.type === 'status') {
        agentStatus = 'thinking';
      } else if (ev.type === 'delta') {
        /* Live text from whatever turn the provider is currently streaming.
           The partial narration may be superseded by tool calls in the same
           turn — it stays in its own row either way. */
        let cur = agentMessages[agentMessages.length - 1];
        if (!cur || cur.role !== 'assistant' || !cur.streaming) {
          cur = { role: 'assistant', content: '', streaming: true };
          agentMessages.push(cur);
        }
        cur.content += ev.text;
      } else if (ev.type === 'tool_call') {
        agentStatus = 'running_tool:' + ev.name;
        closeAgentStreamingRow();
        agentMessages.push({ kind: 'tool', pending: true, id: ev.id, name: ev.name, args: ev.args });
      } else if (ev.type === 'tool_result') {
        agentStatus = 'thinking';
        const t = agentMessages.find((m) => m.kind === 'tool' && m.pending && m.id === ev.id);
        if (t) { t.pending = false; t.ok = ev.ok; t.error = ev.error; t.result = ev.result; }
      } else if (ev.type === 'done') {
        /* The server persisted the exact final text — snap the live row to it. */
        const cur = agentMessages[agentMessages.length - 1];
        if (cur && cur.role === 'assistant' && cur.streaming) {
          cur.content = ev.text || '';
          cur.streaming = false;
        } else {
          agentMessages.push({ role: 'assistant', content: ev.text || '' });
        }
        agentBusy = false;
        agentStatus = '';
      } else if (ev.type === 'error') {
        closeAgentStreamingRow();
        agentMessages.push({ kind: 'error', text: ev.error || 'Agent failed' });
        agentBusy = false;
        agentStatus = '';
      }
      renderAgent();
    });
  } catch (e) {
    closeAgentStreamingRow();
    agentMessages.push({ kind: 'error', text: e.message || 'Agent failed' });
    agentBusy = false;
    agentStatus = '';
  }
  setAgentStatus('');
  renderAgent();
  if (!agentBusy) {
    await refreshDataAfterAgent();
    renderAgent();
  }
}

function initAgentDrawerResize() {
  const drawer = $('#agent-drawer');
  const handle = $('#agent-resize-handle');
  if (!drawer || !handle) return;

  const DEFAULT_WIDTH = 645;
  const MIN_WIDTH = 340;
  const getMaxWidth = () => Math.max(MIN_WIDTH, window.innerWidth - 30);

  // Restore saved width if any
  try {
    const saved = parseInt(localStorage.getItem('zerochat_agent_drawer_width'), 10);
    if (saved && Number.isFinite(saved)) {
      const clamped = Math.min(Math.max(saved, MIN_WIDTH), getMaxWidth());
      drawer.style.width = clamped + 'px';
    }
  } catch {}

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDragging = true;
    startX = e.clientX;
    startWidth = drawer.getBoundingClientRect().width;
    try { handle.setPointerCapture(e.pointerId); } catch {}
    document.body.classList.add('agent-resizing');
    handle.classList.add('active');
    e.preventDefault();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = startX - e.clientX; // dragging to the left makes it wider
    const newWidth = Math.min(Math.max(startWidth + dx, MIN_WIDTH), getMaxWidth());
    drawer.style.width = newWidth + 'px';
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('agent-resizing');
    handle.classList.remove('active');
    try {
      if (handle.hasPointerCapture?.(e.pointerId)) {
        handle.releasePointerCapture(e.pointerId);
      }
    } catch {}
    const finalWidth = Math.round(drawer.getBoundingClientRect().width);
    if (finalWidth >= MIN_WIDTH) {
      try { localStorage.setItem('zerochat_agent_drawer_width', String(finalWidth)); } catch {}
    }
  };

  handle.addEventListener('pointerup', stopDrag);
  handle.addEventListener('pointercancel', stopDrag);

  // Double click resets to default
  handle.addEventListener('dblclick', () => {
    drawer.style.width = Math.min(DEFAULT_WIDTH, getMaxWidth()) + 'px';
    try { localStorage.removeItem('zerochat_agent_drawer_width'); } catch {}
  });

  window.addEventListener('resize', () => {
    const curWidth = drawer.getBoundingClientRect().width;
    const maxW = getMaxWidth();
    if (curWidth > maxW) {
      drawer.style.width = maxW + 'px';
    }
  });

  // Mobile swipe right to close drawer
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  drawer.addEventListener('touchstart', (e) => {
    if (!agentOpen || e.touches.length !== 1 || window.innerWidth > 640) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = false;
  }, { passive: true });

  drawer.addEventListener('touchmove', (e) => {
    if (!agentOpen || e.touches.length !== 1 || window.innerWidth > 640) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 45 && dx > dy * 1.4) {
      isSwiping = true;
    }
  }, { passive: true });

  drawer.addEventListener('touchend', () => {
    if (isSwiping) {
      isSwiping = false;
      closeAgentDrawer();
    }
  }, { passive: true });
}

/* Resize the left sidebar by dragging its right edge, mirroring the agent
   drawer handle. The width lives in the `--sidebar-w` grid variable of #app
   and persists in localStorage; double-click reverts to the 300px default.
   Phones (≤940px) use the fixed slide-over instead, so the handle is hidden
   there and calls are guarded out. */
function initSidebarResize() {
  const app = $('#app');
  const sidebar = $('#sidebar');
  const handle = $('#sidebar-resize-handle');
  if (!app || !sidebar || !handle) return;

  const DEFAULT_WIDTH = 300;
  const MIN_WIDTH = 230;
  const getMaxWidth = () => Math.min(640, Math.max(MIN_WIDTH, window.innerWidth - 380));

  // Restore saved width if any
  try {
    const saved = parseInt(localStorage.getItem('zerochat_sidebar_width'), 10);
    if (saved && Number.isFinite(saved) && window.innerWidth > 940) {
      app.style.setProperty('--sidebar-w', Math.min(Math.max(saved, MIN_WIDTH), getMaxWidth()) + 'px');
    }
  } catch {}

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDragging = true;
    startX = e.clientX;
    startWidth = sidebar.getBoundingClientRect().width;
    try { handle.setPointerCapture(e.pointerId); } catch {}
    document.body.classList.add('sidebar-resizing');
    handle.classList.add('active');
    e.preventDefault();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX; // dragging to the right makes it wider
    const newWidth = Math.min(Math.max(startWidth + dx, MIN_WIDTH), getMaxWidth());
    app.style.setProperty('--sidebar-w', newWidth + 'px');
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.classList.remove('sidebar-resizing');
    handle.classList.remove('active');
    try {
      if (handle.hasPointerCapture?.(e.pointerId)) {
        handle.releasePointerCapture(e.pointerId);
      }
    } catch {}
    const finalWidth = Math.round(sidebar.getBoundingClientRect().width);
    if (finalWidth >= MIN_WIDTH) {
      try { localStorage.setItem('zerochat_sidebar_width', String(finalWidth)); } catch {}
    }
  };

  handle.addEventListener('pointerup', stopDrag);
  handle.addEventListener('pointercancel', stopDrag);

  // Double click resets to default
  handle.addEventListener('dblclick', () => {
    app.style.setProperty('--sidebar-w', DEFAULT_WIDTH + 'px');
    try { localStorage.removeItem('zerochat_sidebar_width'); } catch {}
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 940) return;
    const curWidth = sidebar.getBoundingClientRect().width;
    const maxW = getMaxWidth();
    if (curWidth > maxW) {
      app.style.setProperty('--sidebar-w', maxW + 'px');
    }
  });
}

function wireAgent() {
  initAgentDrawerResize();
  $('#agent-btn')?.addEventListener('click', () => {
    if (agentOpen) closeAgentDrawer(); else openAgentDrawer();
  });
  $('#welcome-agent-btn')?.addEventListener('click', () => { openAgentDrawer(); setTimeout(() => agentEl('#agent-input')?.focus(), 240); });
  $('#agent-close-btn').addEventListener('click', closeAgentDrawer);
  $('#agent-revert-btn')?.addEventListener('click', async () => {
    try {
      const r = await api('/agent/changes');
      const changes = r.changes || [];
      if (!changes.length) return;
      const list = changes.map((c) => '• ' + c.action).join('\n');
      const ok = await customConfirm({
        title: 'Revert agent session changes?',
        message: `The agent made the following changes in this session:\n\n${list}\n\nReverting will restore the website state to before this whole agent session. This cannot be undone.`,
        confirmText: 'Revert website state',
        danger: true,
      });
      if (!ok) return;
      await api('/agent/revert', { method: 'POST' });
      await refreshDataAfterAgent();
      await refreshAgentChanges();
      agentMessages.push({ role: 'assistant', content: '✓ Website state has been reverted to the checkpoint before this session.' });
      renderAgent();
    } catch (e) {
      console.error('Revert failed:', e.message);
      agentMessages.push({ role: 'assistant', content: `✗ Revert failed: ${e.message}` });
      renderAgent();
    }
  });
  $('#agent-clear-btn').addEventListener('click', async () => {
    if (!agentMessages.length) return;
    const clearOk = await customConfirm({
      title: 'Clear agent conversation?',
      message: 'The whole Agent chat history will be deleted. Created characters and scenarios stay.',
      confirmText: 'Clear chat',
      danger: true,
    });
    if (!clearOk) return;
    try { await api('/agent/clear', { method: 'POST' }); } catch (e) { /* ignore */ }
    agentMessages = [];
    agentAttachments = [];
    renderAgentAttachments();
    renderAgent();
    await refreshAgentChanges();
  });

  const ta = $('#agent-input');
  makeTextareaAutoResize(ta, {
    min: 44,
    max: () => (window.innerWidth <= 768 ? 180 : 280),
    isComposer: true,
  });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      agentSend();
    }
  });
  $('#agent-send-btn').addEventListener('click', agentSend);
  $('#agent-attach-btn').addEventListener('click', () => $('#agent-file-input').click());
  $('#agent-file-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length) agentAttachFiles(files);
  });
  ta.addEventListener('paste', (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imgFiles = items
      .filter((it) => it.kind === 'file' && (it.type.startsWith('image/') || it.type === ''))
      .map((it) => it.getAsFile())
      .filter(Boolean);
    if (imgFiles.length) {
      e.preventDefault();
      agentAttachFiles(imgFiles);
    }
  });

  const drawer = $('#agent-drawer');
  const composer = $('#agent-composer');
  drawer.addEventListener('dragover', (e) => {
    if (e.dataTransfer?.types?.includes('Files')) {
      e.preventDefault();
      composer.classList.add('drag-over');
    }
  });
  drawer.addEventListener('dragleave', (e) => {
    if (!drawer.contains(e.relatedTarget)) composer.classList.remove('drag-over');
  });
  drawer.addEventListener('drop', (e) => {
    composer.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      /^image\//i.test(f.type || '') || /\.(png|jpe?g|webp|avif|gif|bmp|heic|heif)$/i.test(f.name || '')
    );
    if (files.length) {
      e.preventDefault();
      agentAttachFiles(files);
    }
  });

  $('#agent-attachments').addEventListener('click', (e) => {
    const x = e.target.closest('[data-att-remove]');
    if (x) {
      agentAttachments = agentAttachments.filter((a) => a.id !== x.dataset.attRemove);
      renderAgentAttachments();
      return;
    }
    const chipImg = e.target.closest('.agent-attach-chip img');
    if (chipImg && chipImg.src) {
      openViewer(chipImg.src);
    }
  });

  // Feed interactions: toggle tool details, run actions
  $('#agent-feed').addEventListener('click', (e) => {
    const actBtn = e.target.closest('[data-agent-open-chat]');
    if (actBtn) {
      closeAgentDrawer();
      openCharacter(actBtn.dataset.agentOpenChat);
      return;
    }
    const openChar = e.target.closest('[data-agent-open-char]');
    if (openChar) {
      closeAgentDrawer();
      openCharacter(openChar.dataset.agentOpenChar);
      return;
    }
    const openPoses = e.target.closest('[data-agent-open-poses]');
    if (openPoses) {
      closeAgentDrawer();
      openPosesModal(openPoses.dataset.agentOpenPoses);
      return;
    }
    const editChar = e.target.closest('[data-agent-edit-char]');
    if (editChar) {
      const c = state.characters.find((x) => x.id === editChar.dataset.agentEditChar);
      if (c) openCharModal(c);
      return;
    }
    const editScen = e.target.closest('[data-agent-edit-scen]');
    if (editScen) {
      const s = state.scenarios.find((x) => x.id === editScen.dataset.agentEditScen);
      if (s) openScenarioModal(s);
      return;
    }
    const openPreset = e.target.closest('[data-agent-open-preset]');
    if (openPreset) {
      const p = state.presets.find((x) => x.id === openPreset.dataset.agentOpenPreset);
      if (p) openPresetModal(p);
      return;
    }
    const activateP = e.target.closest('[data-agent-activate-persona]');
    if (activateP) {
      setPersona(activateP.dataset.agentActivatePersona);
      refreshDataAfterAgent().then(renderAgent);
      return;
    }
    const sug = e.target.closest('[data-agent-suggest]');
    if (sug) {
      $('#agent-input').value = sug.dataset.agentSuggest;
      agentEl('#agent-input').focus();
      return;
    }
    const toolImg = e.target.closest('.agent-tool-img img');
    if (toolImg) { openViewer(toolImg.src); return; }
    const chipImg = e.target.closest('.agent-attach-chip[data-att-id] img');
    if (chipImg) { openViewer(chipImg.src); return; }
    const row = e.target.closest('.agent-tool-row');
    if (row) row.closest('.agent-tool').classList.toggle('open');
  });
}

(async function init() {
  wireEvents();
  initSidebarResize();
  try {
    await bootstrap();
  } catch (e) {
    $('#chat-view').classList.add('hidden');
    $('#welcome').classList.remove('hidden');
    $('#welcome-grid').innerHTML = '';
    $('#w-sub').textContent = 'Could not reach the backend. Start it with: node server.js, then reload this page.';
    return;
  }
  renderAll();
  wireAgent();
  loadAgent();
})();