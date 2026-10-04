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
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
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
  $('#composer-hint').innerHTML = live
    ? `<span class="live">Live · ${esc(who)} · ${esc(ai.model || 'no model set')}</span><span>·</span><span>Enter to send · Shift+Enter for a new line · <span class="zap-hint">${I.zap}</span> steers the next reply</span>`
    : `<span class="sim">No API key — replies are simulated · set one in Settings</span><span>·</span><span>Enter to send · Shift+Enter for a new line · <span class="zap-hint">${I.zap}</span> steers the next reply</span>`;
}

function msgMetaHtml(n, chat, opts, tag = '') {
  const parent = chat.tree.nodes[n.parent];
  const kids = parent ? parent.children : [];
  const total = kids.length;
  const idx = kids.indexOf(n.id);
  const nav = total > 1
    ? `<span class="vnav"><button data-nav="prev" title="Previous version" ${idx <= 0 ? 'disabled' : ''}>${I.chevl}</button><span class="v-count">${idx + 1}/${total}</span><button data-nav="next" title="Next version" ${idx >= total - 1 ? 'disabled' : ''}>${I.chevr}</button></span>`
    : '';
  const acts = `<span class="m-acts">
    <button data-act="edit" title="Edit message">${I.pencil}</button>
    ${opts.regen ? `<button data-act="regen" title="Regenerate this reply">${I.rotr}</button>` : ''}
    <button data-act="del" class="danger" title="Delete this message and everything after it">${I.trash}</button>
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
  for (const c of (state.characters || [])) {
    if (c.variables && typeof c.variables === 'object') {
      for (const [k, v] of Object.entries(c.variables)) {
        if (!k) continue;
        const norm = k.trim().toLowerCase();
        const valStr = String(v == null ? '' : v).trim();
        if (!valStr) continue; // If empty or removed, does not exist!

        if (!varsMap.has(norm)) {
          varsMap.set(norm, {
            key: norm,
            usedBy: [],
          });
        }
        varsMap.get(norm).usedBy.push({
          characterId: c.id,
          characterName: c.name,
          value: valStr,
        });
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

function expandTags(s, characterId, customVars = null, customCharName = null) {
  if (s == null) return '';
  const str = String(s);
  if (str.indexOf('{{') === -1) return str;
  const persona = activePersona();
  const c = state.characters.find((x) => x.id === characterId);
  const charName = customCharName || (c && c.name) || 'the character';
  const userName = (persona && persona.name) || 'the user';
  const vars = customVars || ((c && c.variables && typeof c.variables === 'object') ? c.variables : {});
  const varMap = new Map();
  for (const [k, v] of Object.entries(vars)) {
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

function renderPreviewMarkdown(raw, characterId, customVars = null, customCharName = null) {
  if (!raw || !raw.trim()) {
    return `<div class="prow-desc" style="padding:16px;text-align:center">Nothing to preview. Switch to Edit to write.</div>`;
  }
  const persona = activePersona();
  const c = state.characters.find((x) => x.id === characterId);
  const charName = customCharName || (c && c.name) || 'the character';
  const userName = (persona && persona.name) || 'the user';
  const vars = customVars || ((c && c.variables && typeof c.variables === 'object') ? c.variables : {});
  const varMap = new Map();
  for (const [k, v] of Object.entries(vars)) {
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
    body = `<div class="ms-body">${md(expandTags(n.content, chat.characterId))}</div>`;
  } else {
    /* Character lines render their tags; the user's own text is left alone. */
    const text = n.role === 'char' ? expandTags(n.content, chat.characterId) : n.content;
    body = `<div class="bubble">${md(text)}</div>`;
  }
  if (n.role === 'scenario') {
    return `<div class="msg-scenario" data-id="${n.id}">
      <div class="ms-head">${I.book}<span>Scenario</span></div>
      ${body}${meta}</div>`;
  }
  const main = `<div class="msg-main">${body}${meta}</div>`;
  if (n.role === 'injection') {
    return `<div class="msg user injection ${n.state === 'pending' ? 'inj-pending' : ''}" data-id="${n.id}">${main}${personaAvatarHtml(p, 'sm', true)}</div>`;
  }
  if (n.role === 'user') {
    return `<div class="msg user${n.pending ? ' pending' : ''}" data-id="${n.id}">${main}${personaAvatarHtml(p, 'sm', true)}</div>`;
  }
  return `<div class="msg char" data-id="${n.id}">${avatarHtml(c, 'sm', true, msgPose && msgPose.thumb)}${main}</div>`;
}

function updateComposerButtons() {
  const c = activeChar();
  const chat = c && activeChat(c);
  const text = $('#msg-input').value.trim();
  const tip = chat ? tipNode(chat) : null;
  const canReply = !!tip && (tip.role === 'user' || tip.role === 'injection') && !tip.pending;
  $('#send-btn').disabled = typing || !chat || !text;
  $('#inject-btn').disabled = typing || !chat || !text;
  $('#generate-btn').disabled = typing || !chat || !canReply;
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
    const cp = currentPose(chat);
    const live = streaming && chat && streaming.chatId === chat.id && streaming.text;
    html += live
      ? `<div class="msg char streaming">${avatarHtml(c, 'sm', true, cp && cp.thumb)}<div class="msg-main"><div class="bubble">${md(streaming.text)}</div></div></div>`
      : `<div class="msg char"><span class="avatar sm emoji">${esc(c.emoji)}</span><div class="bubble dots"><span></span><span></span><span></span></div></div>`;
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
  if (!confirm(`Delete "${chat.title}"? This cannot be undone.`)) return;
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
  if (!confirm('Delete this message and everything after it on this branch?')) return;
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

function autoGrow() {
  const ta = $('#msg-input');
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
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

function openModal(id) { $('#' + id).classList.add('open'); }
function closeModal(id) { $('#' + id).classList.remove('open'); }

function openViewer(src) {
  $('#img-viewer-img').src = src;
  $('#img-viewer').classList.remove('hidden');
}
function closeViewer() {
  $('#img-viewer').classList.add('hidden');
  $('#img-viewer-img').src = '';
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
}

function updatePersonaForm() {
  $('#pf-label').textContent = peMode === 'edit' ? 'Edit personality' : 'Add personality';
  $('#pf-save').textContent = peMode === 'edit' ? 'Save changes' : 'Add personality';
  $('#pf-cancel').classList.toggle('hidden', peMode !== 'edit');
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
  const wrap = $('#ce-insert-var-wrap');
  if (wrap) wrap.classList.toggle('hidden', !isEdit);
  if (!isEdit) renderCeDescPreview();
}

function syncCeVariablesFromInputs() {
  $$('#ce-vars-list .ce-var-row').forEach((row) => {
    const key = row.dataset.key;
    const inp = $('.ce-var-val-input', row);
    if (key && inp) ceVariables[key] = inp.value.trim();
  });
}

function renderCeDescPreview() {
  const raw = $('#ce-desc').value;
  const charName = $('#ce-name').value.trim() || 'Character';
  syncCeVariablesFromInputs();
  $('#ce-desc-prev-wrap').innerHTML = renderPreviewMarkdown(raw, null, ceVariables, charName);
}

function renderCeVarsList() {
  const list = $('#ce-vars-list');
  if (!list) return;
  const entries = Object.entries(ceVariables);
  if (entries.length === 0) {
    list.innerHTML = `<div class="prow-desc" style="padding:10px;text-align:center">No variables set. Click &ldquo;+ Add variable&rdquo; to create one.</div>`;
    return;
  }
  list.innerHTML = entries.map(([key, val]) => `
    <div class="ce-var-row" data-key="${esc(key)}">
      <div class="ce-var-key-col">
        <span class="ce-var-key-tag" title="{{${esc(key)}}}">{{${esc(key)}}}</span>
      </div>
      <div class="ce-var-val-col">
        <input type="text" class="ce-var-val-input" data-key="${esc(key)}" value="${esc(val)}" placeholder="Value for {{${esc(key)}}}">
      </div>
      <button type="button" class="icon-btn tiny danger ce-var-del-btn" data-del-var="${esc(key)}" title="Remove variable">${I.trash}</button>
    </div>
  `).join('');
}

function openCeVarPicker() {
  $('#ce-var-picker').classList.remove('hidden');
  $('#ce-var-picker-input').value = '';
  renderCeVarPickerList('');
  setTimeout(() => $('#ce-var-picker-input').focus(), 60);
}

function closeCeVarPicker() {
  $('#ce-var-picker').classList.add('hidden');
}

function renderCeVarPickerList(q = '') {
  const list = $('#ce-var-picker-list');
  if (!list) return;
  const normQ = q.trim().toLowerCase();
  const existingKeys = new Set(Object.keys(ceVariables).map((k) => k.toLowerCase()));
  const all = getAllVariables().filter((v) => !existingKeys.has(v.key.toLowerCase()));
  let filtered = all;
  if (normQ) {
    filtered = all.filter((v) => v.key.toLowerCase().includes(normQ));
  }
  const canCreate = normQ && !all.some((v) => v.key.toLowerCase() === normQ) && !existingKeys.has(normQ);
  let html = '';
  if (canCreate) {
    html += `
      <div class="var-picker-item" data-add-key="${esc(normQ)}">
        <span class="var-picker-item-name">➕ Create "{{${esc(normQ)}}}"</span>
        <span class="var-picker-item-sub">New custom variable</span>
      </div>
    `;
  }
  if (filtered.length) {
    html += filtered.map((v) => `
      <div class="var-picker-item" data-add-key="${esc(v.key)}">
        <span class="var-picker-item-name">{{${esc(v.key)}}}</span>
        <span class="var-picker-item-sub">Used in ${v.usedBy.length} char${v.usedBy.length === 1 ? '' : 's'}</span>
      </div>
    `).join('');
  } else if (!canCreate) {
    html += `<div class="prow-desc" style="padding:10px;text-align:center">${normQ ? 'No matching variables' : 'All available variables already added'}</div>`;
  }
  list.innerHTML = html;
}

/* Insert Variable Dropdown Popups for Character and Scenario editors */
function openInsertVarPopup(mode) {
  const popup = $(`#${mode}-insert-var-popup`);
  if (!popup) return;
  const wasHidden = popup.classList.contains('hidden');
  closeInsertVarPopups();
  if (wasHidden) {
    popup.classList.remove('hidden');
    const input = $(`#${mode}-insert-var-search`);
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
    renderInsertVarList(mode, '');
  }
}

function closeInsertVarPopups() {
  $$('.insert-var-popup').forEach((p) => p.classList.add('hidden'));
}

function renderInsertVarList(mode, q = '') {
  const list = $(`#${mode}-insert-var-list`);
  if (!list) return;
  const normQ = (q || '').trim().toLowerCase();

  const items = [
    { key: 'char', sub: 'Character name' },
    { key: 'user', sub: 'Your personality name' },
  ];

  const seen = new Set(['char', 'user']);
  if (mode === 'ce') {
    syncCeVariablesFromInputs();
    for (const [k, v] of Object.entries(ceVariables)) {
      const lower = k.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        items.push({ key: lower, sub: v ? `"${v.slice(0, 15)}${v.length > 15 ? '…' : ''}"` : 'This character' });
      }
    }
  }
  for (const v of getAllVariables()) {
    const lower = v.key.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      const count = v.usedBy.length;
      items.push({ key: lower, sub: count > 0 ? `Used in ${count} char${count === 1 ? '' : 's'}` : '' });
    }
  }

  let filtered = items;
  if (normQ) {
    filtered = items.filter((it) => it.key.includes(normQ) || (it.sub && it.sub.toLowerCase().includes(normQ)));
  }

  const canInsertCustom = normQ && !items.some((it) => it.key === normQ);
  let html = '';
  if (canInsertCustom) {
    html += `
      <button type="button" class="insert-var-item" data-insert-key="${esc(normQ)}">
        <span class="insert-var-tag">➕ {{${esc(normQ)}}}</span>
        <span class="insert-var-sub">Insert tag</span>
      </button>
    `;
  }
  if (filtered.length) {
    html += filtered.map((it) => `
      <button type="button" class="insert-var-item" data-insert-key="${esc(it.key)}">
        <span class="insert-var-tag">{{${esc(it.key)}}}</span>
        <span class="insert-var-sub">${esc(it.sub)}</span>
      </button>
    `).join('');
  } else if (!canInsertCustom) {
    html += `<div class="prow-desc" style="padding:10px;text-align:center">No variables found</div>`;
  }
  list.innerHTML = html;
}

let ceScenSelectedId = null;
let ceScenTab = 'preview'; // 'preview' | 'vars'
let ceScenDropdownOpen = false;

function renderCeScenActiveCard() {
  const card = $('#ce-scen-active-card');
  const title = $('#ce-scen-active-title');
  const badge = $('#ce-scen-active-badge');
  const desc = $('#ce-scen-active-desc');
  const switchBtn = $('#ce-scen-switch-btn-text');
  if (!card || !title || !desc || !switchBtn) return;

  const scen = (state.scenarios || []).find((s) => s.id === ceScenSelectedId);
  if (scen) {
    card.classList.add('is-selected');
    title.textContent = scen.title;
    desc.textContent = scen.description || scen.content.slice(0, 110);
    switchBtn.textContent = 'Switch ▾';
    if (badge) {
      badge.className = `scen-badge ${scen.accessMode || 'all'}`;
      badge.textContent = accessBadgeLabel(scen);
      badge.classList.remove('hidden');
    }
  } else {
    card.classList.remove('is-selected');
    title.textContent = 'Select a scenario to test against…';
    desc.textContent = 'Click here or Choose to select from available scenarios.';
    switchBtn.textContent = 'Choose ▾';
    if (badge) badge.classList.add('hidden');
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
            <span class="scen-badge ${s.accessMode || 'all'}">${accessBadgeLabel(s)}</span>
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
  $('#ce-scen-bar-toggle')?.classList.add('active');
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
  $('#ce-scen-bar-toggle')?.classList.remove('active');
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

function renderCeScenPreviewMarkdown(raw, charName, customVars) {
  if (!raw || !raw.trim()) return '';
  const persona = activePersona();
  const userName = (persona && persona.name) || 'the user';
  const cName = charName || 'the character';

  // 1. Process markdown safely
  let html = md(raw);

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
    const val = customVars && customVars[lower];
    if (val && String(val).trim()) {
      return `<mark class="scen-hl configured" title="{{${esc(lower)}}}: Configured (${esc(String(val).trim())})">${esc(String(val).trim())}</mark>`;
    }
    return `<mark class="scen-hl missing" title="{{${esc(lower)}}}: Not configured on this character">[missing: {{${esc(lower)}}}]</mark>`;
  });

  return html;
}

function updateCeScenPanelUI() {
  const panel = $('#ce-scen-panel');
  if (!panel || panel.classList.contains('hidden')) return;

  syncCeVariablesFromInputs();
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

  // Extract all {{tag}} tokens from scenario.content
  const tagsRegex = /\{\{\s*([\w.-]+)\s*\}\}/gi;
  const foundTags = new Set();
  let m;
  while ((m = tagsRegex.exec(scen.content)) !== null) {
    foundTags.add(m[1].toLowerCase());
  }

  // Calculate configuration status for each variable
  const varStatusList = [];
  let configuredCount = 0;
  let missingCount = 0;

  for (const tag of foundTags) {
    if (tag === 'char') {
      const isSet = Boolean(charName);
      if (isSet) configuredCount++; else missingCount++;
      varStatusList.push({
        key: 'char',
        label: 'Character Name',
        isConfigured: isSet,
        value: charName || 'Name is currently empty',
        isSystem: true,
      });
    } else if (tag === 'user') {
      const persona = activePersona();
      configuredCount++;
      varStatusList.push({
        key: 'user',
        label: 'Personality Name',
        isConfigured: true,
        value: persona ? persona.name : 'the user',
        isSystem: true,
      });
    } else {
      const val = ceVariables[tag];
      const isSet = Boolean(val && String(val).trim());
      if (isSet) configuredCount++; else missingCount++;
      varStatusList.push({
        key: tag,
        label: `{{${tag}}}`,
        isConfigured: isSet,
        value: isSet ? String(val).trim() : 'Not configured on this character',
        isSystem: false,
      });
    }
  }

  // Sort: missing first, then configured
  varStatusList.sort((a, b) => {
    if (a.isConfigured !== b.isConfigured) return a.isConfigured ? 1 : -1;
    return a.key.localeCompare(b.key);
  });

  // Update Status Banner
  const banner = $('#ce-scen-status-banner');
  if (banner) {
    if (foundTags.size === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `<span>ℹ This scenario does not use any template variables.</span>`;
    } else if (missingCount === 0) {
      banner.className = 'ce-scen-status-banner all-good';
      banner.innerHTML = `
        <span>✓ All scenario variables configured</span>
        <span class="ce-scen-stat-pill green">${configuredCount} of ${foundTags.size}</span>
      `;
    } else {
      banner.className = 'ce-scen-status-banner has-missing';
      banner.innerHTML = `
        <span>⚠ ${missingCount} variable${missingCount === 1 ? '' : 's'} not configured for this character</span>
        <span class="ce-scen-stat-pill red">${missingCount} missing</span>
      `;
    }
  }

  // Update Variables Checklist view
  const varsList = $('#ce-scen-vars-list');
  if (varsList) {
    if (varStatusList.length === 0) {
      varsList.innerHTML = `<div class="prow-desc" style="padding:14px;text-align:center">No variables found in this scenario.</div>`;
    } else {
      varsList.innerHTML = varStatusList.map((v) => `
        <div class="ce-scen-var-card ${v.isConfigured ? 'configured' : 'missing'}">
          <div class="ce-scen-var-meta">
            <span class="ce-scen-var-tag ${v.isConfigured ? 'configured' : 'missing'}">
              ${v.isConfigured ? '✓' : '✕'} {{${esc(v.key)}}}
            </span>
            <span class="ce-scen-var-val">${esc(v.value)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="ce-scen-var-badge ${v.isConfigured ? 'configured' : 'missing'}">
              ${v.isConfigured ? 'Configured' : 'Missing'}
            </span>
            ${!v.isConfigured && !v.isSystem ? `
              <button type="button" class="btn btn-ghost sm ce-scen-add-var-btn" data-key="${esc(v.key)}" title="Add {{${esc(v.key)}}} to this character">+ Add</button>
            ` : ''}
          </div>
        </div>
      `).join('');
    }
  }

  // Update Preview view for this specific character
  const previewBox = $('#ce-scen-preview-text');
  if (previewBox) {
    previewBox.innerHTML = renderCeScenPreviewMarkdown(scen.content, charName, ceVariables);
  }
}

function openCharModal(char) {
  ceMode = char ? 'edit' : 'new';
  ceId = char ? char.id : null;
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
  closeCeVarPicker();
  closeInsertVarPopups();
  closeCeScenPanel();
  renderCeScenActiveCard();
  switchCeScenTab('preview');
  renderCeVarsList();
  renderCeEmojiGrid();
  updateCeAvatarUI();
  updateCePosesToggleUI();
  const del = $('#ce-delete');
  del.classList.toggle('hidden', ceMode !== 'edit');
  disarmDelete();
  openModal('modal-char');
  setTimeout(() => $('#ce-name').focus(), 60);
  if (ceId) loadPoses(ceId);
  updateCePosesNote();
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
  syncCeVariablesFromInputs();
  // Prune any empty/blank variables so unused variables are automatically deleted
  const cleanVars = {};
  for (const [k, v] of Object.entries(ceVariables)) {
    const norm = k.trim().toLowerCase();
    const val = (v || '').trim();
    if (norm && val) {
      cleanVars[norm] = val;
    }
  }
  ceVariables = cleanVars;
  const body = {
    name,
    description: $('#ce-desc').value.trim(),
    note: $('#ce-note').value.trim(),
    emoji: ceEmoji,
    avatar: ceAvatar,
    image: ceImage,
    posesEnabled: $('#ce-poses-enabled').checked,
    variables: ceVariables,
  };
  try {
    let saved;
    if (ceMode === 'new') {
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

async function openPosesModal() {
  const charModalOpen = $('#modal-char').classList.contains('open');
  if (charModalOpen && ceMode !== 'edit') { toast('Save the character first'); return; }
  const charId = (charModalOpen && ceId) ? ceId : ui.activeCharacterId;
  const c = charId && state.characters.find((x) => x.id === charId);
  if (!c) { toast('Save the character first'); return; }
  poseCharId = charId;
  closePoseForm();
  clearPoseDelArm();
  await loadPoses(charId);
  $('#pose-char-name').textContent = c.name;
  renderPosesGrid();
  openModal('modal-poses');
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

function openSettings() {
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
  const posePct = Math.round((Number.isFinite(+s.poseLikelihood) ? +s.poseLikelihood : 0.6) * 100);
  $('#set-poselike').value = posePct;
  $('#poselike-val').textContent = posePct + '%';
  const poseCtx = Number.isFinite(+s.poseContextCount) ? +s.poseContextCount : 3;
  $('#set-posecontext').value = poseCtx;
  $('#posecontext-val').textContent = poseCtx === 0 ? 'None (latest reply only)' : `${poseCtx} message${poseCtx === 1 ? '' : 's'}`;
  renderPresetList();
  openModal('modal-settings');
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
}

async function fetchModelList(baseUrl, apiKey, combo, btn) {
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
  $('#preset-count').textContent = state.presets.length ? `${state.presets.length}` : 'none yet';
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
  };
  try {
    state.settings = await api('/settings', { method: 'PUT', body: JSON.stringify(body) });
    closeModal('modal-settings');
    setHint();
    applyChatBg();
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
  if (!confirm(`Delete preset "${p.name}"?`)) return;
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
  if (!s || !charId) return true;
  const mode = s.accessMode || 'all';
  if (mode === 'all') return true;
  const list = Array.isArray(s.characterIds) ? s.characterIds : [];
  if (mode === 'whitelist') return list.includes(charId);
  if (mode === 'blacklist') return !list.includes(charId);
  return true;
}

function accessBadgeLabel(s) {
  if (s.accessMode === 'whitelist') return `${(s.characterIds || []).length} allowed`;
  if (s.accessMode === 'blacklist') return `${(s.characterIds || []).length} blocked`;
  return 'All chars';
}

function switchSidebarTab(tab) {
  ui.sidebarTab = tab;
  saveUi();
  const isChars = tab === 'chars';
  const isScen = tab === 'scenarios';
  const isVars = tab === 'vars';

  $('#tab-chars-btn').classList.toggle('active', isChars);
  $('#tab-scenarios-btn').classList.toggle('active', isScen);
  $('#tab-vars-btn').classList.toggle('active', isVars);

  $('#panel-chars').classList.toggle('hidden', !isChars);
  $('#panel-scenarios').classList.toggle('hidden', !isScen);
  $('#panel-vars').classList.toggle('hidden', !isVars);

  if (isChars) renderSidebar();
  else if (isScen) renderSidebarScenarios();
  else if (isVars) renderSidebarVars();
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
          <span class="scen-badge ${s.accessMode}">${accessBadgeLabel(s)}</span>
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
    list.innerHTML = `<div class="prow-desc" style="padding:24px 14px;text-align:center">${q ? `No variables matching "${esc(query)}"` : 'No variables created yet.<br>Add variables to any character (under Character Editor &rarr; Character Variables) and they will appear here.'}</div>`;
    return;
  }

  list.innerHTML = all.map((v) => {
    const usedCount = v.usedBy.length;
    return `
      <div class="var-item" data-var-key="${esc(v.key)}">
        <div class="var-item-head">
          <code class="var-tag">{{${esc(v.key)}}}</code>
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
let seAccessMode = 'all';
let seCharacterIds = new Set();
let seDelArmed = null;

function switchSeTab(tab) {
  const isEdit = tab === 'edit';
  $('#se-tab-edit').classList.toggle('active', isEdit);
  $('#se-tab-preview').classList.toggle('active', !isEdit);
  $('#se-content-edit-wrap').classList.toggle('hidden', !isEdit);
  $('#se-content-prev-wrap').classList.toggle('hidden', isEdit);
  const wrap = $('#se-insert-var-wrap');
  if (wrap) wrap.classList.toggle('hidden', !isEdit);
  if (!isEdit) renderSePreview();
}

function renderSePreview() {
  const raw = $('#se-content').value;
  const sel = $('#se-preview-char-select');
  const charId = sel ? sel.value : null;
  $('#se-content-prev-wrap').innerHTML = renderPreviewMarkdown(raw, charId, null);
}

function populateSeCharSelect(selectedCharId = null) {
  const sel = $('#se-preview-char-select');
  if (!sel) return;
  if (!state.characters || state.characters.length === 0) {
    sel.innerHTML = '<option value="">No characters</option>';
    return;
  }
  sel.innerHTML = state.characters.map((c) => `
    <option value="${c.id}">${esc(c.name)}</option>
  `).join('');
  if (selectedCharId && state.characters.some((c) => c.id === selectedCharId)) {
    sel.value = selectedCharId;
  } else if (ui.activeCharacterId && state.characters.some((c) => c.id === ui.activeCharacterId)) {
    sel.value = ui.activeCharacterId;
  } else {
    sel.value = state.characters[0].id;
  }
}

function openScenarioModal(sc = null) {
  seMode = sc ? 'edit' : 'new';
  seId = sc ? sc.id : null;
  seAccessMode = sc ? (sc.accessMode || 'all') : 'all';
  seCharacterIds = new Set(sc && Array.isArray(sc.characterIds) ? sc.characterIds : []);

  $('#se-title-text').textContent = sc ? 'Edit scenario' : 'New scenario';
  $('#se-title').value = sc ? sc.title : '';
  $('#se-desc').value = sc ? sc.description : '';
  $('#se-content').value = sc ? sc.content : '';

  populateSeCharSelect(pickScenarioChar ? pickScenarioChar.id : null);
  switchSeTab('edit');
  closeInsertVarPopups();

  const radios = $$('input[name="se-access-mode"]');
  radios.forEach((r) => { r.checked = (r.value === seAccessMode); });

  const sInp = $('#se-chars-search');
  if (sInp) sInp.value = '';

  updateSeAccessUI();
  renderSeCharsList();

  const del = $('#se-delete');
  del.classList.toggle('hidden', seMode !== 'edit');
  disarmSeDelete();

  const play = $('#se-play');
  play.classList.toggle('hidden', seMode !== 'edit');

  openModal('modal-scenario');
  setTimeout(() => $('#se-title').focus(), 60);
}

function updateSeAccessUI() {
  const isRestricted = seAccessMode !== 'all';
  $('#se-chars-block').classList.toggle('hidden', !isRestricted);
  const lbl = $('#se-chars-label');
  if (lbl) {
    lbl.textContent = seAccessMode === 'whitelist'
      ? 'Whitelisted characters (allowed to enter):'
      : 'Blacklisted characters (blocked from entering):';
  }
}

function renderSeCharsList(query = '') {
  const list = $('#se-chars-list');
  if (!list) return;
  const q = (query || '').trim().toLowerCase();
  let chars = state.characters;
  if (q) {
    chars = chars.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.note && c.note.toLowerCase().includes(q))
    );
  }
  if (chars.length === 0) {
    list.innerHTML = `<div class="prow-desc" style="grid-column:1/-1;padding:14px;text-align:center">No characters matching "${esc(query)}".</div>`;
    return;
  }
  list.innerHTML = chars.map((c) => {
    const checked = seCharacterIds.has(c.id);
    return `
      <label class="scen-char-chk-row">
        <input type="checkbox" class="scen-char-chk" data-cid="${c.id}" ${checked ? 'checked' : ''}>
        ${avatarHtml(c, 'sm')}
        <span class="scen-char-chk-name">${esc(c.name)}</span>
      </label>
    `;
  }).join('');
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
    accessMode: seAccessMode,
    characterIds: Array.from(seCharacterIds),
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
    grid.innerHTML = allowed.map((s) => `
      <div class="ps-item-card" data-scen-id="${s.id}">
        <div class="ps-item-top">
          <div class="ps-item-header">
            <span class="ps-item-title">${esc(s.title)}</span>
            <span class="scen-badge ${s.accessMode}">${accessBadgeLabel(s)}</span>
          </div>
          <div class="ps-item-desc">${esc(s.description || s.content.slice(0, 110))}</div>
        </div>
        <div class="ps-item-foot">
          <button type="button" class="btn btn-ghost sm">Start chat</button>
        </div>
      </div>
    `).join('');
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
      : `<div class="prow-desc" style="padding:16px;text-align:center">No characters have access to this scenario based on its access list.</div>`;
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
  renderSidebarVars();
  setHint();
  if (ui.sidebarTab === 'scenarios') switchSidebarTab('scenarios');
  else if (ui.sidebarTab === 'vars') switchSidebarTab('vars');
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

function wireEvents() {
  $$('.combo').forEach((c) => setupModelCombo(c));
  $('#tab-chars-btn').addEventListener('click', () => switchSidebarTab('chars'));
  $('#tab-scenarios-btn').addEventListener('click', () => switchSidebarTab('scenarios'));
  $('#tab-vars-btn').addEventListener('click', () => switchSidebarTab('vars'));
  $('#new-char-btn').addEventListener('click', () => openCharModal(null));
  $('#new-scenario-btn').addEventListener('click', () => openScenarioModal(null));
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
  $('#scrim').addEventListener('click', closeSidebar);

  // Variables Directory in Sidebar
  $('#vars-search').addEventListener('input', (e) => {
    renderSidebarVars(e.target.value);
  });
  $('#vars-list').addEventListener('click', async (e) => {
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
      if (!confirm(`Delete variable "{{${key}}}" from all characters?`)) return;
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
  $('#se-preview-char-select').addEventListener('change', () => {
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
  });
  $('#se-insert-var-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openInsertVarPopup('se');
  });
  $('#se-insert-var-search').addEventListener('input', (e) => {
    renderInsertVarList('se', e.target.value);
  });
  $('#se-insert-var-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = $('#se-insert-var-list .insert-var-item');
      if (first) first.click();
    }
  });
  $('#se-insert-var-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-insert-key]');
    if (!item) return;
    const key = item.dataset.insertKey;
    insertAtCaret($('#se-content'), `{{${key}}}`);
    closeInsertVarPopups();
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
  });
  $('#se-content').addEventListener('input', () => {
    if ($('#se-tab-preview').classList.contains('active')) renderSePreview();
  });
  $$('input[name="se-access-mode"]').forEach((r) => {
    r.addEventListener('change', (e) => {
      seAccessMode = e.target.value;
      updateSeAccessUI();
    });
  });
  $('#se-chars-search').addEventListener('input', (e) => {
    renderSeCharsList(e.target.value);
  });
  $('#se-chars-list').addEventListener('change', (e) => {
    const chk = e.target.closest('.scen-char-chk');
    if (!chk) return;
    if (chk.checked) seCharacterIds.add(chk.dataset.cid);
    else seCharacterIds.delete(chk.dataset.cid);
  });
  $('#se-chars-select-all').addEventListener('click', () => {
    const q = ($('#se-chars-search')?.value || '').trim().toLowerCase();
    const targets = q
      ? state.characters.filter((c) => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)) || (c.note && c.note.toLowerCase().includes(q)))
      : state.characters;
    targets.forEach((c) => seCharacterIds.add(c.id));
    renderSeCharsList(q);
  });
  $('#se-chars-clear-all').addEventListener('click', () => {
    const q = ($('#se-chars-search')?.value || '').trim().toLowerCase();
    if (q) {
      const targets = state.characters.filter((c) => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)) || (c.note && c.note.toLowerCase().includes(q)));
      targets.forEach((c) => seCharacterIds.delete(c.id));
    } else {
      seCharacterIds.clear();
    }
    renderSeCharsList(q);
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
    closeModal('modal-pick-scenario');
    try {
      await createChatFor(pickScenarioChar, scId);
      saveUi();
      renderSidebar();
      renderChat();
    } catch (e) { toast(e.message); }
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
    try {
      ui.activeCharacterId = c.id;
      const ch = await createChatFor(c, pickCharScenario.id);
      saveUi();
      closeSidebar();
      renderSidebar();
      renderChat();
      loadPoses(c.id);
    } catch (err) { toast(err.message); }
  });

  $('#persona-btn').addEventListener('click', () => toggleMenu('persona-wrap'));
  $('#chats-btn').addEventListener('click', () => toggleMenu('chats-wrap'));
  $('#preset-btn').addEventListener('click', () => toggleMenu('preset-wrap'));
  $('#settings-btn').addEventListener('click', () => { closeMenus(); openSettings(); });
  $('#edit-char-btn').addEventListener('click', () => { closeMenus(); const c = activeChar(); if (c) openCharModal(c); });

  $('#preset-menu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-pset]');
    if (item) { setPreset(item.dataset.pset); closeMenus(); return; }
    if (e.target.closest('#ps-manage')) { closeMenus(); openSettings(); }
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
    fetchModelList($('#pr-url').value.trim(), key, $('#pr-model').closest('.combo'), $('#pr-fetch-models'));
  });
  $('#pr-save').addEventListener('click', presetFormSave);
  $('#pr-cancel').addEventListener('click', () => closeModal('modal-preset'));
  $('#pr-delete').addEventListener('click', presetDelete);

  $('#set-fetch-models').addEventListener('click', () => {
    fetchModelList($('#set-url').value.trim(), $('#set-key').value.trim(), $('#set-model').closest('.combo'), $('#set-fetch-models'));
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

  $('#img-viewer').addEventListener('click', closeViewer);
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
        if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
      } else if (act.dataset.act === 'ecancel') {
        editingId = null;
        renderChat({ keepScroll: true });
      } else if (act.dataset.act === 'esave') {
        saveEdit(id);
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

  $('#send-btn').addEventListener('click', sendUser);
  $('#inject-btn').addEventListener('click', sendInjection);
  $('#generate-btn').addEventListener('click', () => {
    const c = activeChar();
    const chat = c && activeChat(c);
    const tip = chat && tipNode(chat);
    if (tip) generateReplyAt(tip.id);
  });
  $('#msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUser(); }
  });
  $('#msg-input').addEventListener('input', () => { autoGrow(); updateComposerButtons(); });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrap')) closeMenus();
    if (!e.target.closest('.insert-var-wrap')) closeInsertVarPopups();
    if (!e.target.closest('.ce-scen-selector')) closeCeScenDropdown();
  });

  $$('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
  });
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('.modal').classList.remove('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.modal.open').forEach((m) => m.classList.remove('open'));
      closeMenus(); closeSidebar(); closeViewer();
      if (editingId) { editingId = null; renderChat({ keepScroll: true }); }
    }
  });

  $('#prov-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.prov');
    if (card) setProviderUI(card.dataset.pv);
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
      if (!confirm(`Delete personality "${p.name}"?`)) return;
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
  $('#ce-insert-var-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openInsertVarPopup('ce');
  });
  $('#ce-insert-var-search').addEventListener('input', (e) => {
    renderInsertVarList('ce', e.target.value);
  });
  $('#ce-insert-var-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = $('#ce-insert-var-list .insert-var-item');
      if (first) first.click();
    }
  });
  $('#ce-insert-var-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-insert-key]');
    if (!item) return;
    const key = item.dataset.insertKey;
    insertAtCaret($('#ce-desc'), `{{${key}}}`);
    closeInsertVarPopups();
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
  });
  $('#ce-desc').addEventListener('input', () => {
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });
  $('#ce-name').addEventListener('input', () => {
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });
  $('#ce-add-var-btn').addEventListener('click', openCeVarPicker);
  $('#ce-var-picker-cancel').addEventListener('click', closeCeVarPicker);
  $('#ce-var-picker-input').addEventListener('input', (e) => {
    renderCeVarPickerList(e.target.value);
  });
  $('#ce-var-picker-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = $('#ce-var-picker-list [data-add-key]');
      if (first) first.click();
    }
  });
  $('#ce-var-picker-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-add-key]');
    if (!item) return;
    const key = item.dataset.addKey;
    ceVariables[key] = '';
    renderCeVarsList();
    closeCeVarPicker();
    const row = $(`#ce-vars-list [data-key="${key}"] input`);
    if (row) row.focus();
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });
  $('#ce-vars-list').addEventListener('click', (e) => {
    const del = e.target.closest('[data-del-var]');
    if (!del) return;
    delete ceVariables[del.dataset.delVar];
    renderCeVarsList();
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });
  $('#ce-vars-list').addEventListener('input', (e) => {
    const inp = e.target.closest('.ce-var-val-input');
    if (!inp) return;
    ceVariables[inp.dataset.key] = inp.value.trim();
    if ($('#ce-tab-preview').classList.contains('active')) renderCeDescPreview();
    updateCeScenPanelUI();
  });

  // Character Modal Scenario Inspector Side Panel events
  $('#ce-scen-panel-toggle')?.addEventListener('click', toggleCeScenPanel);
  $('#ce-scen-bar-toggle')?.addEventListener('click', toggleCeScenPanel);
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
  $('#ce-scen-vars-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.ce-scen-add-var-btn');
    if (!btn) return;
    const key = btn.dataset.key;
    if (!key) return;
    ceVariables[key] = '';
    renderCeVarsList();
    closeCeVarPicker();
    const row = $(`#ce-vars-list [data-key="${key}"] input`);
    if (row) {
      row.focus();
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    updateCeScenPanelUI();
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
  $('#pose-cancel').addEventListener('click', closePoseForm);
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

(async function init() {
  wireEvents();
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
})();