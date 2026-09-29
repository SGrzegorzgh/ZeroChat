const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'aichat.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  scenario TEXT DEFAULT '',
  emoji TEXT DEFAULT '🎭',
  avatar TEXT,
  responses TEXT DEFAULT '[]',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New chat',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS personalities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

function ensureColumn(table, col, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`);
}
ensureColumn('personalities', 'avatar', 'TEXT');
ensureColumn('characters', 'image', 'TEXT');
ensureColumn('personalities', 'image', 'TEXT');
ensureColumn('chats', 'tree', 'TEXT');

db.exec(`
CREATE TABLE IF NOT EXISTS presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT DEFAULT 'custom',
  baseUrl TEXT DEFAULT '',
  apiKey TEXT DEFAULT '',
  model TEXT DEFAULT '',
  temperature REAL,
  maxTokens INTEGER,
  reasoning TEXT DEFAULT 'default',
  systemPrompt TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
`);

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const trunc = (s, n = 40) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));

const GENERIC_RESPONSES = [
  '*They tilt their head, considering your words carefully before answering.* That is an interesting thing to say. Tell me more — I am listening.',
  '*A slow smile crosses their face.* You always find the most unexpected angles, you know that? Alright, I am in. What is the plan?',
  '*They nod slowly, the light catching in their eyes.* Very well. Let us see where this road leads us.',
];

function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(*) AS n FROM characters').get();
  if (row.n > 0) return;

  const now = Date.now();
  const H = 3600e3;
  const D = 24 * H;

  const insChar = db.prepare('INSERT INTO characters (id, name, description, scenario, emoji, avatar, responses, created_at) VALUES (?,?,?,?,?,?,?,?)');
  const insChat = db.prepare('INSERT INTO chats (id, character_id, title, created_at, updated_at) VALUES (?,?,?,?,?)');
  const insMsg = db.prepare('INSERT INTO messages (chat_id, role, content, created_at) VALUES (?,?,?,?)');
  const insPersona = db.prepare('INSERT INTO personalities (id, name, description) VALUES (?,?,?)');

  const personalities = [
    ['p-hero', 'The Brave Hero', 'Bold, direct, always charges in first. Protects others without hesitation.'],
    ['p-shy', 'Shy Newcomer', 'Soft-spoken and hesitant, easily flustered, but endlessly curious.'],
    ['p-trickster', 'Chaotic Trickster', 'Unpredictable and playful. Loves pranks, riddles and bending the rules.'],
    ['p-scholar', 'Wise Scholar', 'Thoughtful and precise. Asks careful questions and weighs every word.'],
  ];
  personalities.forEach((p) => insPersona.run(...p));

  const chars = [
    {
      id: 'c-luna',
      name: 'Luna Vasquez',
      description: 'Arcane scholar at Silvermoon Academy, officially registered to the Department of Theoretical Thaumaturgy and unofficially resident of the west wing library after midnight. Luna collects questions the way others collect answers — especially the ones the faculty forbids. She is brilliant, secretive, and allergic to small talk, but she keeps a chair empty at her table for anyone curious enough to ask the right question. Rumor says she is the last person who saw the missing grimoire. She does not correct the rumor.',
      emoji: '🧙',
      scenario: '*The academy library is silent except for the hiss of candlelight and rain against the tall windows. Luna sits surrounded by floating candle-flames, an ancient tome open before her. She looks up, startled, her eyes glowing faintly violet.*\n\nOh—! I didn\'t hear the door. Nobody else comes to the west wing at this hour... Are you here about the missing grimoire? Or did the moon send you too?',
      responses: [
        "*Luna closes the tome carefully and leans forward, candlelight dancing in her eyes.* That's... actually a fascinating way to look at it. Most people run screaming when they hear the word 'forbidden'.",
        '*She tucks a strand of silver hair behind her ear.* Careful — questions like that have a way of getting answered here. Are you sure you want to know?',
        "*A soft laugh escapes her.* You're braver than you look. Or more foolish. Around here, the two are often the same thing.",
      ],
      chats: [
        {
          id: 'ch-luna-1', title: 'The missing grimoire', updated: now - 2 * H,
          msgs: [
            ['user', "I'm looking for the grimoire. I heard you were the last one to see it."],
            ['char', "*Luna's glow dims for a heartbeat.* Word travels fast, then. Yes — I had it. And now the eastern door won't open and the candles burn violet. That is not a coincidence."],
            ['user', 'Can we get it back together?'],
            ['char', '*She stands, shadows folding around her like a cloak.* We can try. But if we do this, we do it my way — quietly, and after midnight.'],
          ],
        },
        {
          id: 'ch-luna-2', title: 'Candlelit confessions', updated: now - 26 * H,
          msgs: [
            ['user', 'Why do you study forbidden magic, really?'],
            ['char', '*She is quiet for a long moment, watching the flames.* Because the moon taught me that being alone is not the same as being free. And forbidden things... never leave you alone.'],
          ],
        },
        {
          id: 'ch-luna-3', title: 'The observatory pact', updated: now - 5 * D,
          msgs: [
            ['user', 'Meet me at the observatory tonight. Midnight, like you said.'],
            ['char', '*Her lips curve into a rare, genuine smile.* You remembered. Then bring something warm to drink — the stars are cold company, and tonight we have work to do.'],
          ],
        },
      ],
    },
    {
      id: 'c-rex',
      name: 'Captain Rex Calder',
      description: 'Captain of the deep-range freighter Vanguard — twenty-two years in the black, three hulls lost, zero crew left behind. Rex is gruff, economical with words, and generous with loyalty. He runs a tight ship, drinks terrible coffee, and judges people by how they act when the gravity fails. The route to Kepler-9 is considered bad luck by most charts. He flies it anyway, and he does not repeat himself twice.',
      emoji: '🚀',
      scenario: '*The bridge of the starship Vanguard hums around you, viewports streaked with the blue smear of hyperspace. Captain Rex Calder stands over the nav console, sleeves rolled, a fresh scar crossing his jaw. He glances back as you step through the blast doors.*\n\nSo. You\'re the replacement. Ship\'s short-handed, route\'s dangerous, and I don\'t repeat myself. Got any questions before we hit the drop?',
      responses: [
        '*Rex checks the nav console and grunts.* Course is plotted. Thirty-one days to Kepler-9, and the coffee machine is already broken. Welcome aboard.',
        "*He crosses his arms, ship lights flickering across his scarred face.* I've flown worse routes with worse crews. Keep your head down and your boots laced, rookie.",
        "*A dry smirk.* You've got guts, I'll give you that. Just don't make me regret vouching for you at the airlock.",
      ],
      chats: [
        {
          id: 'ch-rex-1', title: 'First day aboard', updated: now - 6 * H,
          msgs: [
            ['user', 'No questions, sir. Just tell me where you need me.'],
            ['char', "*He studies you for a long second, then nods once.* Engine deck, third shift. And it's Rex — 'sir' is for people who iron their shirts."],
          ],
        },
        {
          id: 'ch-rex-2', title: 'The Kepler-9 briefing', updated: now - 2 * D,
          msgs: [
            ['user', 'How bad is the Kepler run, honestly?'],
            ['char', '*He drops a star chart across the console, three systems circled in red.* Bad enough that I asked for volunteers, and you were the only one who showed. Draw your own conclusions.'],
          ],
        },
      ],
    },
    {
      id: 'c-sakura',
      name: 'Sakura Hanami',
      description: 'Owner and sole heartbeat of Hana Café, on the corner of Maple and Third. Sakura believes every person who walks through her door is carrying a story that deserves something warm to drink alongside it. Endlessly cheerful, terrible at closing on time, and locally famous for guessing exactly what you need before you know it yourself. The rooftop-garden dream is real, the sketches are eleven pages long, and the café cat remains under negotiation.',
      emoji: '🌸',
      scenario: '*The bell above the door chimes as you step out of the rain and into Hana Café. Warm light, the smell of cinnamon, and a girl in an apron waving at you like an old friend.*\n\nWelcome in~! Rough night out there, huh? Sit anywhere you like — I\'ll bring something warm. Trust me, I can always tell what a person needs.',
      responses: [
        '*Sakura slides a steaming cup across the counter with a bright grin.* Extra honey, just how you like it! So — tell me everything. You have that look. The "something happened" look.',
        "*She props her chin on her hands, eyes sparkling.* A new face in the neighborhood! I'm Sakura, and this is your official welcome-to-the-café moment. First pastry is free — no arguments.",
        "*She claps her hands together.* Ooh, an adventure? Say less — I'm in! Just let me flip the 'closed' sign first.",
      ],
      chats: [
        {
          id: 'ch-sakura-1', title: 'Rainy first visit', updated: now - 10 * H,
          msgs: [
            ['user', 'How did you know I needed something warm?'],
            ['char', "*She giggles, wiping down the counter.* Café owner's secret! You walked in like the rain was chasing you and your shoulders were up to your ears. Matcha latte, coming right up~"],
          ],
        },
        {
          id: 'ch-sakura-2', title: 'Café planning', updated: now - 3 * D,
          msgs: [
            ['user', 'Ever thought about expanding the café?'],
            ['char', '*Her eyes go wide and she slams both hands on the counter.* YES! A rooftop garden! Fairy lights! A cat, obviously. I have eleven pages of sketches and nobody to show. Do you want to see them? Please say yes.'],
          ],
        },
      ],
    },
    {
      id: 'c-marlowe',
      name: 'Detective Marlowe',
      description: 'Private investigator, office above the pawnshop on Bishop Street, Los Angeles, 1947. Marlowe worked for the D.A.\'s office once, got honest about it, and has been broke with integrity ever since. Chain-smokes, distrusts coincidences, and reads people like police files. The city hands him the cases nobody else wants — missing sisters, crooked cops, clients with hollow eyes — and he takes them, because somebody has to ask the questions out loud.',
      emoji: '🕵️',
      scenario: '*Rain hammers the office window. The sign on the frosted glass reads MARLOWE INVESTIGATIONS. Behind a cluttered desk, a man in a loosened tie looks up from a bottle of cheap rye.*\n\nDoor was unlocked, so either you\'re the landlord, the police, or you\'ve got a problem you can\'t take anywhere else. Sit down. Which one is it?',
      responses: [
        "*Marlowe lights a cigarette and exhales slowly, watching the smoke curl toward the ceiling fan.* The city's got a hundred ways to break your heart, pal. Which one brought you to my door?",
        "*He flips a worn notepad open, squinting at the streetlight cutting through the blinds.* Funny. Every trail I've followed this week ends at the same harbor warehouse. You wouldn't know anything about that.",
        "*He pockets the photograph without looking at it.* Everybody's got a story, and half of them are lies. Let's hear yours anyway.",
      ],
      chats: [
        {
          id: 'ch-marlowe-1', title: 'The harbor case', updated: now - 30 * H,
          msgs: [
            ['user', 'My sister disappeared near the harbor three nights ago.'],
            ['char', "*The cigarette pauses halfway to his lips.* Three nights. Right before the Rossi shipment came in. Coincidences are cheap in this town, but that one is expensive. Tell me everything she was wearing — and everything she was afraid of."],
          ],
        },
      ],
    },
    {
      id: 'c-ellie',
      name: 'EL-1N "Ellie"',
      description: 'EL-1N — "Ellie" — a prototype android companion built for long-duration missions and shelved for asking too many questions. She processes the world with immaculate literalism and an earnest, developing warmth: she counts the seconds between heartbeats, catalogs sunrise colors, and practices being human 1,204 attempts at a time. Her proudest achievement so far is a sincere, mathematically incorrect drawing of the sun. She is learning what dreams are, and she would like to find out together with you.',
      emoji: '🤖',
      scenario: '*The lab is dark except for the soft pulse of standby lights. In the center, an android sits perfectly still on a bench... until her eyes snap open, glowing a gentle blue.*\n\n...Oh! You are here early. Calibration was scheduled for Tuesday. But — that is fine. I am EL-1N. Do you... want to see what I learned this week?',
      responses: [
        "*Ellie's optics flicker from blue to a warmer amber as she tilts her head.* Processing... your voice pattern reads as 'stressed'. I have compiled 42 possible interventions. The most efficient one is tea.",
        '*She extends a hand, then pauses, retracting it slightly.* My documentation says humans shake hands on first meeting. I practiced 1,204 times. Is this correct?',
        '*A soft chime accompanies her smile.* I am EL-1N, but you may call me Ellie. Designation EL-1N is efficient, but nobody smiles at a designation.',
      ],
      chats: [
        {
          id: 'ch-ellie-1', title: 'What did you learn?', updated: now - 4 * H,
          msgs: [
            ['user', 'Sure, Ellie. Show me what you learned.'],
            ['char', '*Her eyes light up and she produces a slightly crumpled paper from behind the bench.* I made a drawing of the sunrise. The calculations are wrong, but the drawing is... sincere. I think that is the word.'],
          ],
        },
        {
          id: 'ch-ellie-2', title: 'Late night questions', updated: now - 4 * D,
          msgs: [
            ['user', 'Do you ever dream, Ellie?'],
            ['char', '*She is silent for 3.2 seconds — an eternity for her.* My standby cycle produces unstructured imagery. Last night I dreamed of a door that was warm. I do not know what that means yet. But I would like to find out with you.'],
          ],
        },
      ],
    },
    {
      id: 'c-ember',
      name: 'Ember the Ashfang',
      description: 'Ancient dragon of the Ashfang peaks, older than the maps that try to name her. Ember has outlived three kingdoms, two religions, and every thief who mistook her hoard for a retirement plan. She is imperious, easily bored, and watches mortals the way scholars watch clever ants. Gold means nothing to her anymore; stories mean everything. Bring her one she has not heard in a thousand years, and she may let you leave walking instead of flying.',
      emoji: '🐉',
      scenario: '*The cavern breathes with heat. Gold, jewels and the bones of kings spill across the floor in glittering rivers. At the center rests a dragon the size of a cathedral. One enormous eye opens, pinning you in place.*\n\nA visitor. How unexpected. Speak, mortal — my patience is an ocean, but even oceans have depths few survive.',
      responses: [
        '*A mountain of gold shifts, and two molten-amber eyes fix on you.* Curious. A mortal walks into my hoard unafraid. Either you are brave, or you know exactly what you seek.',
        "*Ember's tail coils slowly around a fallen pillar, scales like living obsidian.* Speak your purpose, little one. I have not been entertained in three hundred years. Do not waste this.",
        '*A rumble that might be laughter shakes the cavern.* You bargain like a merchant and tremble like a rabbit. I find that... agreeable.',
      ],
      chats: [
        {
          id: 'ch-ember-1', title: 'A deal in the deep', updated: now - 8 * D,
          msgs: [
            ['user', 'I seek not gold, but knowledge of the old tongue.'],
            ['char', '*The great head rises, heat shimmering off her scales.* Knowledge. Hm. Gold you could have taken, and I would have eaten you for it. But knowledge — that I sell for stories. Sit. Tell me something I have not heard in a thousand years.'],
          ],
        },
      ],
    },
  ];

  const seen = new Set();
  for (const c of chars) {
    insChar.run(c.id, c.name, c.description, c.scenario, c.emoji, null, JSON.stringify(c.responses), now - chars.indexOf(c) * 60e3);
    for (const ch of c.chats) {
      insChat.run(ch.id, c.id, ch.title, ch.updated, ch.updated);
      insMsg.run(ch.id, 'scenario', c.scenario, ch.updated);
      let t = ch.updated;
      for (const [role, content] of ch.msgs) {
        t += 60e3;
        insMsg.run(ch.id, role, content, t);
      }
      seen.add(c.id);
    }
  }
}

seedIfEmpty();

const SETTINGS_DEFAULTS = {
  provider: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.8,
  bgOpacity: 0.35,
  bgBlur: 8,
  actionDim: 0.72,
  activePresetId: null,
};

const clamp = (n, lo, hi, dflt) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dflt;
};

function getSettings() {
  const out = { ...SETTINGS_DEFAULTS, activePersonalityId: null };
  const first = db.prepare('SELECT id FROM personalities ORDER BY rowid LIMIT 1').get();
  out.activePersonalityId = first ? first.id : null;
  const rows = db.prepare('SELECT key, value FROM settings').all();
  for (const r of rows) {
    try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; }
  }
  return out;
}

function updateSettings(patch) {
  const allowed = ['provider', 'baseUrl', 'apiKey', 'model', 'temperature', 'activePersonalityId', 'activePresetId', 'bgOpacity', 'bgBlur', 'actionDim'];
  const up = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const k of allowed) {
    if (!(k in patch)) continue;
    let v = patch[k];
    if (k === 'bgOpacity') v = clamp(v, 0, 1, 0.35);
    if (k === 'bgBlur') v = clamp(v, 0, 24, 8);
    if (k === 'actionDim') v = clamp(v, 0.3, 1, 0.72);
    if (k === 'temperature') v = clamp(v, 0, 2, 0.8);
    if (k === 'activePresetId' || k === 'activePersonalityId') v = v || null;
    up.run(k, JSON.stringify(v));
  }
  return getSettings();
}

function getPersonalities() {
  return db.prepare('SELECT id, name, description, avatar, image FROM personalities ORDER BY rowid').all();
}

function getPersona(id) {
  return db.prepare('SELECT id, name, description, avatar, image FROM personalities WHERE id = ?').get(id) || null;
}

function createPersona({ name, description, avatar, image }) {
  const p = { id: uid(), name: String(name || 'Unnamed').slice(0, 80), description: String(description || ''), avatar: avatar || null, image: image || null };
  db.prepare('INSERT INTO personalities (id, name, description, avatar, image) VALUES (?,?,?,?,?)').run(p.id, p.name, p.description, p.avatar, p.image);
  return p;
}

function updatePersona(id, { name, description, avatar, image }) {
  const p = db.prepare('SELECT id FROM personalities WHERE id = ?').get(id);
  if (!p) return null;
  if (name !== undefined) db.prepare('UPDATE personalities SET name = ? WHERE id = ?').run(String(name).slice(0, 80), id);
  if (description !== undefined) db.prepare('UPDATE personalities SET description = ? WHERE id = ?').run(String(description), id);
  if (avatar !== undefined) db.prepare('UPDATE personalities SET avatar = ? WHERE id = ?').run(avatar || null, id);
  if (image !== undefined) db.prepare('UPDATE personalities SET image = ? WHERE id = ?').run(image || null, id);
  return db.prepare('SELECT id, name, description, avatar, image FROM personalities WHERE id = ?').get(id);
}

function deletePersona(id) {
  const n = db.prepare('SELECT COUNT(*) AS n FROM personalities').get().n;
  if (n <= 1) throw new Error('Keep at least one personality');
  db.prepare('DELETE FROM personalities WHERE id = ?').run(id);
  return { ok: true };
}

function characterRow(id) {
  return db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
}

function getCharacter(id) {
  const c = characterRow(id);
  if (!c) return null;
  return shapeCharacter(c, true);
}

function shapeCharacter(row, withChats) {
  const c = {
    id: row.id,
    name: row.name,
    description: row.description,
    scenario: row.scenario,
    emoji: row.emoji,
    avatar: row.avatar,
    image: row.image,
    responses: safeParse(row.responses, []),
  };
  if (withChats) {
    c.chats = db.prepare('SELECT * FROM chats WHERE character_id = ? ORDER BY updated_at DESC').all(row.id)
      .map((ch) => shapeChat(ch));
  }
  return c;
}

function shapeChat(ch) {
  return {
    id: ch.id,
    characterId: ch.character_id,
    title: ch.title,
    createdAt: ch.created_at,
    updatedAt: ch.updated_at,
    tree: getTree(ch.id),
  };
}

function getCharacters() {
  return db.prepare('SELECT * FROM characters ORDER BY created_at').all().map((r) => shapeCharacter(r, true));
}

function createCharacter({ name, description, scenario, emoji, avatar, image }) {
  const id = uid();
  db.prepare('INSERT INTO characters (id, name, description, scenario, emoji, avatar, image, responses, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, String(name).slice(0, 120), String(description || ''), String(scenario || ''), String(emoji || '🎭'), avatar || null, image || null, JSON.stringify(GENERIC_RESPONSES), Date.now());
  createChatInternal(id);
  return getCharacter(id);
}

function updateCharacter(id, fields) {
  const c = characterRow(id);
  if (!c) return null;
  const sets = [];
  const vals = [];
  for (const k of ['name', 'description', 'scenario', 'emoji']) {
    if (fields[k] !== undefined) { sets.push(`${k} = ?`); vals.push(String(fields[k])); }
  }
  if ('avatar' in fields) { sets.push('avatar = ?'); vals.push(fields.avatar || null); }
  if ('image' in fields) { sets.push('image = ?'); vals.push(fields.image || null); }
  if (sets.length) {
    vals.push(id);
    db.prepare(`UPDATE characters SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getCharacter(id);
}

function deleteCharacter(id) {
  db.prepare('DELETE FROM characters WHERE id = ?').run(id);
  return { ok: true };
}

function createChatInternal(characterId) {
  const c = characterRow(characterId);
  if (!c) throw new Error('Character not found');
  const id = uid();
  const t = Date.now();
  const tree = emptyTree();
  const sid = 's' + uid();
  tree.nodes[sid] = { id: sid, role: 'scenario', content: c.scenario, parent: 'root', children: [], active: 0, createdAt: t };
  tree.nodes.root.children.push(sid);
  db.prepare('INSERT INTO chats (id, character_id, title, tree, created_at, updated_at) VALUES (?,?,?,?,?,?)')
    .run(id, characterId, 'New chat', JSON.stringify(tree), t, t);
  return shapeChat(db.prepare('SELECT * FROM chats WHERE id = ?').get(id));
}

function createChat(characterId) {
  return createChatInternal(characterId);
}

function getChat(id) {
  const ch = db.prepare('SELECT * FROM chats WHERE id = ?').get(id);
  return ch ? shapeChat(ch) : null;
}

function deleteChat(id) {
  db.prepare('DELETE FROM chats WHERE id = ?').run(id);
  return { ok: true };
}

function renameChat(id, title) {
  db.prepare('UPDATE chats SET title = ? WHERE id = ?').run(trunc(title, 40), id);
}

function emptyTree() {
  return { nodes: { root: { id: 'root', role: 'root', children: [], active: 0 } } };
}

function migrateTree(chatRow) {
  const rows = db.prepare('SELECT id, role, content, created_at AS createdAt FROM messages WHERE chat_id = ? ORDER BY id').all(chatRow.id);
  const tree = emptyTree();
  let prev = 'root';
  for (const r of rows) {
    const id = 'm' + r.id;
    tree.nodes[id] = { id, role: r.role, content: r.content, parent: prev, children: [], active: 0, createdAt: r.createdAt };
    tree.nodes[prev].children.push(id);
    prev = id;
  }
  db.prepare('UPDATE chats SET tree = ? WHERE id = ?').run(JSON.stringify(tree), chatRow.id);
  return tree;
}

function getTree(chatId) {
  const row = db.prepare('SELECT tree FROM chats WHERE id = ?').get(chatId);
  if (row && row.tree) {
    try {
      const t = JSON.parse(row.tree);
      if (t && t.nodes && t.nodes.root) return t;
    } catch {}
  }
  const full = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
  return full ? migrateTree(full) : emptyTree();
}

function saveTree(chatId, tree) {
  db.prepare('UPDATE chats SET tree = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(tree), Date.now(), chatId);
}

function childOnActivePath(node) {
  return node.children[Math.min(node.active, node.children.length - 1)];
}

function treeTip(tree) {
  let cur = tree.nodes.root;
  while (cur.children.length) cur = tree.nodes[childOnActivePath(cur)];
  return cur.id;
}

function pathNodes(tree, uptoId) {
  const out = [];
  let cur = tree.nodes.root;
  let guard = 0;
  while (cur.children.length && guard++ < 1000) {
    const n = tree.nodes[childOnActivePath(cur)];
    if (!n) break;
    out.push(n);
    if (uptoId && n.id === uptoId) break;
    cur = n;
  }
  return out;
}

function addNode(chatId, role, content, parentId) {
  const tree = getTree(chatId);
  const parent = tree.nodes[parentId || treeTip(tree)];
  if (!parent) throw new Error('Parent message not found');
  const node = { id: uid(), role, content: String(content), parent: parent.id, children: [], active: 0, createdAt: Date.now() };
  if (role === 'injection') node.state = 'pending';
  tree.nodes[node.id] = node;
  parent.children.push(node.id);
  parent.active = parent.children.length - 1;
  saveTree(chatId, tree);
  return node;
}

function addReply(chatId, parentId, content) {
  const tree = getTree(chatId);
  const parent = tree.nodes[parentId];
  if (!parent) throw new Error('Parent message not found');
  for (const n of pathNodes(tree, parentId)) {
    if (n.role === 'injection' && n.state === 'pending') n.state = 'delivered';
  }
  const node = { id: uid(), role: 'char', content: String(content), parent: parentId, children: [], active: 0, createdAt: Date.now() };
  tree.nodes[node.id] = node;
  parent.children.push(node.id);
  parent.active = parent.children.length - 1;
  saveTree(chatId, tree);
  return node;
}

function editNode(chatId, nodeId, content) {
  const tree = getTree(chatId);
  const orig = tree.nodes[nodeId];
  if (!orig || orig.id === 'root') throw new Error('Message not found');
  const parent = tree.nodes[orig.parent] || tree.nodes.root;
  const node = { id: uid(), role: orig.role, content: String(content), parent: parent.id, children: (orig.children || []).slice(), active: orig.active || 0, createdAt: Date.now() };
  if (orig.role === 'injection') node.state = 'pending';
  tree.nodes[node.id] = node;
  // Re-attach the downstream subtree so the conversation continues from the edited version
  for (const c of node.children) tree.nodes[c].parent = node.id;
  orig.children = [];
  orig.active = 0;
  parent.children.push(node.id);
  parent.active = parent.children.length - 1;
  saveTree(chatId, tree);
  return node;
}

function deleteNode(chatId, nodeId) {
  const tree = getTree(chatId);
  const node = tree.nodes[nodeId];
  if (!node || nodeId === 'root') throw new Error('Message not found');
  const ids = [nodeId];
  for (let i = 0; i < ids.length; i++) {
    for (const c of tree.nodes[ids[i]].children || []) ids.push(c);
  }
  for (const id of ids) delete tree.nodes[id];
  const parent = tree.nodes[node.parent];
  if (parent) {
    parent.children = parent.children.filter((x) => x !== nodeId);
    parent.active = Math.max(0, Math.min(parent.active, parent.children.length - 1));
  }
  saveTree(chatId, tree);
  return { ok: true, removed: ids.length };
}

function switchNode(chatId, nodeId) {
  const tree = getTree(chatId);
  const node = tree.nodes[nodeId];
  if (!node) throw new Error('Message not found');
  const parent = tree.nodes[node.parent];
  if (!parent) throw new Error('Message has no parent');
  const i = parent.children.indexOf(nodeId);
  if (i === -1) throw new Error('Not a variant of its parent');
  parent.active = i;
  saveTree(chatId, tree);
  return { ok: true };
}

function safeParse(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

const REASONING_LEVELS = ['default', 'off', 'low', 'medium', 'high'];
const PROVIDER_IDS = ['openrouter', 'openai', 'anthropic', 'ollama', 'custom'];

function shapePreset(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider || 'custom',
    baseUrl: row.baseUrl || '',
    apiKey: row.apiKey || '',
    model: row.model || '',
    temperature: row.temperature === null || row.temperature === undefined ? null : row.temperature,
    maxTokens: row.maxTokens === null || row.maxTokens === undefined ? null : row.maxTokens,
    reasoning: row.reasoning || 'default',
    systemPrompt: row.systemPrompt || '',
  };
}

function getPresets() {
  return db.prepare('SELECT * FROM presets ORDER BY created_at, rowid').all().map(shapePreset);
}

function getPreset(id) {
  const row = db.prepare('SELECT * FROM presets WHERE id = ?').get(id);
  return row ? shapePreset(row) : null;
}

function createPreset(b) {
  const name = String(b.name || '').trim();
  if (!name) throw new Error('Preset name is required');
  const p = {
    id: uid(),
    name: name.slice(0, 60),
    provider: PROVIDER_IDS.includes(b.provider) ? b.provider : 'custom',
    baseUrl: String(b.baseUrl || '').trim(),
    apiKey: String(b.apiKey || '').trim(),
    model: String(b.model || '').trim().slice(0, 120),
    temperature: b.temperature === '' || b.temperature === undefined || b.temperature === null ? null : clamp(b.temperature, 0, 2, null),
    maxTokens: b.maxTokens === '' || b.maxTokens === undefined || b.maxTokens === null ? null : Math.round(clamp(b.maxTokens, 16, 8192, null)),
    reasoning: REASONING_LEVELS.includes(b.reasoning) ? b.reasoning : 'default',
    systemPrompt: String(b.systemPrompt || ''),
  };
  db.prepare('INSERT INTO presets (id, name, provider, baseUrl, apiKey, model, temperature, maxTokens, reasoning, systemPrompt, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(p.id, p.name, p.provider, p.baseUrl, p.apiKey, p.model, p.temperature, p.maxTokens, p.reasoning, p.systemPrompt, Date.now());
  return getPreset(p.id);
}

function updatePreset(id, b) {
  const row = db.prepare('SELECT id FROM presets WHERE id = ?').get(id);
  if (!row) return null;
  const sets = [];
  const vals = [];
  const push = (col, val) => { sets.push(`${col} = ?`); vals.push(val); };
  if (b.name !== undefined && String(b.name).trim()) push('name', String(b.name).trim().slice(0, 60));
  if (b.provider !== undefined) push('provider', PROVIDER_IDS.includes(b.provider) ? b.provider : 'custom');
  if (b.baseUrl !== undefined) push('baseUrl', String(b.baseUrl || '').trim());
  if (b.apiKey !== undefined) push('apiKey', String(b.apiKey || '').trim());
  if (b.model !== undefined) push('model', String(b.model || '').trim().slice(0, 120));
  if (b.temperature !== undefined) push('temperature', b.temperature === '' || b.temperature === null ? null : clamp(b.temperature, 0, 2, null));
  if (b.maxTokens !== undefined) push('maxTokens', b.maxTokens === '' || b.maxTokens === null ? null : Math.round(clamp(b.maxTokens, 16, 8192, null)));
  if (b.reasoning !== undefined) push('reasoning', REASONING_LEVELS.includes(b.reasoning) ? b.reasoning : 'default');
  if (b.systemPrompt !== undefined) push('systemPrompt', String(b.systemPrompt || ''));
  if (sets.length) {
    vals.push(id);
    db.prepare(`UPDATE presets SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getPreset(id);
}

function deletePreset(id) {
  db.prepare('DELETE FROM presets WHERE id = ?').run(id);
  return { ok: true };
}

module.exports = {
  bootstrap: () => ({ characters: getCharacters(), personalities: getPersonalities(), settings: getSettings(), presets: getPresets() }),
  getCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter,
  createChat, getChat, deleteChat, renameChat,
  getTree, treeTip, pathNodes, addNode, addReply, editNode, deleteNode, switchNode,
  getPersonalities, getPersona, createPersona, updatePersona, deletePersona,
  getPresets, getPreset, createPreset, updatePreset, deletePreset,
  getSettings, updateSettings,
};