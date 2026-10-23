const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'aichat.db');
const BACKUP_DIR = path.join(__dirname, 'backups');
const KEEP_SNAPSHOTS = 10;

/* Snapshot the database before opening it. WAL mode means recent writes can sit
   in aichat.db-wal, so the copy takes the -wal/-shm files along too — without
   them the backup would be missing the newest chats and images. */
function backupDb() {
  if (!fs.existsSync(DB_PATH)) return;
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    for (const suffix of ['', '-wal', '-shm']) {
      const src = DB_PATH + suffix;
      if (!fs.existsSync(src)) continue;
      /* The main file is always needed: without it the -wal beside it is a log
         with no database to replay onto, and the snapshot cannot be opened. */
      if (suffix && fs.statSync(src).size === 0) continue;
      fs.copyFileSync(src, path.join(BACKUP_DIR, `aichat-${stamp}.db${suffix}`));
    }
    /* Retain the newest KEEP_SNAPSHOTS snapshots, dropping the rest. */
    const snaps = fs.readdirSync(BACKUP_DIR).filter((n) => /^aichat-.*\.db(-wal|-shm)?$/.test(n));
    const oldStamps = new Set(snaps.map((n) => n.split('.db')[0]).sort().slice(0, -KEEP_SNAPSHOTS));
    for (const f of snaps) {
      if (oldStamps.has(f.split('.db')[0])) fs.unlinkSync(path.join(BACKUP_DIR, f));
    }
  } catch (e) {
    console.error('backup skipped:', e.message);
  }
}

backupDb();

/* Deletions are the one operation with no undo, so snapshot immediately before
   one runs. Rate-limited to one snapshot a minute so a burst of deletes (a
   character plus its chats and poses cascading away) still only costs one
   copy, while a delete minutes after the last one is always covered. */
let lastDestructiveSnapshot = 0;
function snapshotBeforeDestructive() {
  const now = Date.now();
  if (now - lastDestructiveSnapshot < 60e3) return;
  lastDestructiveSnapshot = now;
  backupDb();
}

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
/* Flush the WAL into aichat.db itself. Anything left only in aichat.db-wal is
   one crash, bad kill or WAL reset away from being lost. */
db.exec('PRAGMA synchronous = FULL');
db.exec('PRAGMA wal_checkpoint(TRUNCATE)');

process.on('exit', () => { try { db.exec('PRAGMA wal_checkpoint(TRUNCATE)'); } catch {} });
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { try { db.exec('PRAGMA wal_checkpoint(TRUNCATE)'); } catch {} process.exit(sig === 'SIGINT' ? 130 : 143); });
}

db.exec(`
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  note TEXT DEFAULT '',
  scenario TEXT DEFAULT '',
  emoji TEXT DEFAULT '🎭',
  avatar TEXT,
  variables TEXT DEFAULT '{}',
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
  description TEXT DEFAULT '',
  note TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT NOT NULL,
  access_mode TEXT DEFAULT 'all',
  character_ids TEXT DEFAULT '[]',
  character_variables TEXT DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS poses (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT,
  thumb TEXT,
  crop TEXT DEFAULT 'square',
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  is_default INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS poses_char ON poses(character_id, position);
`);

function ensureColumn(table, col, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`);
}
ensureColumn('personalities', 'avatar', 'TEXT');
ensureColumn('personalities', 'note', "TEXT DEFAULT ''");
ensureColumn('characters', 'image', 'TEXT');
ensureColumn('characters', 'note', "TEXT DEFAULT ''");
ensureColumn('characters', 'variables', "TEXT DEFAULT '{}'");
ensureColumn('characters', 'poses_enabled', 'INTEGER DEFAULT 0');
ensureColumn('personalities', 'image', 'TEXT');
ensureColumn('chats', 'tree', 'TEXT');
ensureColumn('chats', 'pose_id', 'TEXT');
ensureColumn('chats', 'scenario_id', 'TEXT');
ensureColumn('scenarios', 'character_variables', "TEXT DEFAULT '{}'");
ensureColumn('scenarios', 'special_notes', "TEXT DEFAULT ''");
ensureColumn('poses', 'thumb', 'TEXT');

db.exec(`
CREATE TABLE IF NOT EXISTS agent_session_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS agent_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  content TEXT DEFAULT '',
  call_id TEXT,
  tool_calls TEXT,
  tool_name TEXT,
  tool_args TEXT,
  tool_result TEXT,
  tool_error INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Images the user hands to the AI Agent in the drawer (paperclip).
-- Stored as data URLs so they survive restarts; lives with the agent
-- conversation and is wiped when the user clears it.
CREATE TABLE IF NOT EXISTS agent_attachments (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  mime TEXT DEFAULT 'image/png',
  data_url TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`);

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

const DEFAULT_POSES = [
  {
    name: 'Standing',
    description: 'Standing upright and relaxed, facing the user. Use whenever the character is on their feet, standing up, or walking.',
  },
  {
    name: 'Sitting',
    description: 'Seated and comfortable, weight settled into a chair, couch or floor cushion. Use whenever the character is sitting down.',
  },
  {
    name: 'Close-up',
    description: 'Head and shoulders framed close, the face filling the picture. Use for quiet, intimate or emotional moments.',
  },
  {
    name: 'Leaning in',
    description: 'Leaning forward, closer to the user, engaged and attentive to what is being said.',
  },
  {
    name: 'Turning away',
    description: 'Turned partly away or looking off into the distance, distracted, thoughtful, or leaving.',
  },
  {
    name: 'Wide scene',
    description: 'Full body with the surroundings in view. Use when the place or the physical action matters more than the face.',
  },
];

function ensureDefaultPoses(characterId) {
  if (!characterId) return;
  const n = db.prepare('SELECT COUNT(*) AS n FROM poses WHERE character_id = ?').get(characterId).n;
  if (n > 0) return;
  const now = Date.now();
  const ins = db.prepare('INSERT INTO poses (id, character_id, name, description, image, crop, width, height, is_default, position, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  DEFAULT_POSES.forEach((p, i) => ins.run(uid(), characterId, p.name, p.description, null, 'free', 0, 0, i === 0 ? 1 : 0, i, now + i));
}

const GENERIC_RESPONSES = [
  '*They tilt their head, considering your words carefully before answering.* That is an interesting thing to say. Tell me more — I am listening.',
  '*A slow smile crosses their face.* You always find the most unexpected angles, you know that? Alright, I am in. What is the plan?',
  '*They nod slowly, the light catching in their eyes.* Very well. Let us see where this road leads us.',
];

/* Demo content for a fresh database. Every insert is OR IGNORE with a fixed id,
   so seeding stays idempotent: a database that has characters left is skipped
   outright, and one that has personalities but no characters (all the demo
   characters deleted, or a partial seed) re-seeds without tripping over the
   primary keys instead of throwing on startup. */
function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(*) AS n FROM characters').get();
  if (row.n > 0) return;

  const now = Date.now();
  const H = 3600e3;
  const D = 24 * H;

  const insChar = db.prepare('INSERT OR IGNORE INTO characters (id, name, description, scenario, emoji, avatar, responses, created_at) VALUES (?,?,?,?,?,?,?,?)');
  const insChat = db.prepare('INSERT OR IGNORE INTO chats (id, character_id, title, created_at, updated_at) VALUES (?,?,?,?,?)');
  const insMsg = db.prepare('INSERT INTO messages (chat_id, role, content, created_at) VALUES (?,?,?,?)');
  const insPersona = db.prepare('INSERT OR IGNORE INTO personalities (id, name, description) VALUES (?,?,?)');

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
      const has = db.prepare('SELECT COUNT(*) AS n FROM messages WHERE chat_id = ?').get(ch.id).n;
      if (!has) {
        insMsg.run(ch.id, 'scenario', c.scenario, ch.updated);
        let t = ch.updated;
        for (const [role, content] of ch.msgs) {
          t += 60e3;
          insMsg.run(ch.id, role, content, t);
        }
      }
      seen.add(c.id);
    }
  }
}

function seedScenariosIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM scenarios').get().n;
  if (count > 0) return;
  const insScen = db.prepare('INSERT OR IGNORE INTO scenarios (id, title, description, content, access_mode, character_ids, character_variables, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const defaultScenarios = [
    {
      id: 'sc-c-luna',
      title: 'Silvermoon Academy Library',
      description: 'Candlelight, rain against tall windows, and a forbidden grimoire in the west wing library.',
      content: '*The academy library is silent except for the hiss of candlelight and rain against the tall windows. {{char}} sits surrounded by floating candle-flames, an ancient tome open before them. They look up, startled, their eyes glowing faintly violet.*\n\nOh—! I didn\'t hear the door. Nobody else comes to the west wing at this hour... Are you here about the missing grimoire? Or did the moon send you too?',
    },
    {
      id: 'sc-c-rex',
      title: 'Starship Vanguard Bridge',
      description: 'The hum of hyperspace engines and a scarred captain plotting the dangerous run to Kepler-9.',
      content: '*The bridge of the starship Vanguard hums around you, viewports streaked with the blue smear of hyperspace. {{char}} stands over the nav console, sleeves rolled, a fresh scar crossing their jaw. They glance back as you step through the blast doors.*\n\nSo. You\'re the replacement. Ship\'s short-handed, route\'s dangerous, and I don\'t repeat myself. Got any questions before we hit the drop?',
    },
    {
      id: 'sc-c-sakura',
      title: 'Hana Café',
      description: 'Warm lights, the aroma of cinnamon, and stepping out of a rainy evening into a cozy refuge.',
      content: '*The bell above the door chimes as you step out of the rain and into Hana Café. Warm light, the smell of cinnamon, and {{char}} in an apron waving at you like an old friend.*\n\nWelcome in~! Rough night out there, huh? Sit anywhere you like — I\'ll bring something warm. Trust me, I can always tell what a person needs.',
    },
    {
      id: 'sc-c-marlowe',
      title: 'Marlowe Investigations',
      description: 'Rain hammering the frosted office glass, cheap rye on the desk, and a case no one else will touch.',
      content: '*Rain hammers the office window. The sign on the frosted glass reads MARLOWE INVESTIGATIONS. Behind a cluttered desk, {{char}} in a loosened tie looks up from a bottle of cheap rye.*\n\nDoor was unlocked, so either you\'re the landlord, the police, or you\'ve got a problem you can\'t take anywhere else. Sit down. Which one is it?',
    },
    {
      id: 'sc-c-ellie',
      title: 'Robotics Calibration Lab',
      description: 'Soft pulse of standby lights in the dark lab where an android awakes before scheduled calibration.',
      content: '*The lab is dark except for the soft pulse of standby lights. In the center, {{char}} sits perfectly still on a bench... until their eyes snap open, glowing a gentle blue.*\n\n...Oh! You are here early. Calibration was scheduled for Tuesday. But — that is fine. Do you... want to see what I learned this week?',
    },
    {
      id: 'sc-c-ember',
      title: "The Dragon's Hoard",
      description: 'Heat shimmering off rivers of gold and jewels as an enormous dragon opens one ancient eye.',
      content: '*The cavern breathes with heat. Gold, jewels and the bones of kings spill across the floor in glittering rivers. At the center rests {{char}}, a dragon the size of a cathedral. One enormous eye opens, pinning you in place.*\n\nA visitor. How unexpected. Speak, mortal — my patience is an ocean, but even oceans have depths few survive.',
    },
  ];
  const now = Date.now();
  for (const s of defaultScenarios) {
    insScen.run(s.id, s.title, s.description, s.content, 'all', '[]', '{}', now, now);
  }
}

function findPrimaryScenarioForCharacter(charId) {
  if (!charId) return null;
  const candidates = [
    'sc-c-' + charId.replace(/^c-/, ''),
    'sc-' + charId,
    'sc-c-' + charId,
  ];
  for (const cid of candidates) {
    const row = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(cid);
    if (row) return row;
  }
  return null;
}

function migrateCharacterVariables() {
  const chars = db.prepare('SELECT id, name, variables FROM characters').all();
  const charsToMigrate = [];
  for (const c of chars) {
    const vars = safeParse(c.variables, {});
    if (vars && typeof vars === 'object' && Object.keys(vars).length > 0) {
      const hasAny = Object.values(vars).some((v) => v != null && String(v).trim().length > 0);
      if (hasAny) {
        charsToMigrate.push({ id: c.id, name: c.name, vars });
      }
    }
  }

  if (charsToMigrate.length === 0) return;

  const pending = [];
  for (const c of charsToMigrate) {
    const sc = findPrimaryScenarioForCharacter(c.id);
    if (sc) {
      const scCv = safeParse(sc.character_variables, {});
      const existing = scCv[c.id] || {};
      const needsCopy = Object.entries(c.vars).some(([k, v]) => String(v || '').trim() && (!existing[k] || !String(existing[k]).trim()));
      if (needsCopy) {
        pending.push({ char: c, scenario: sc });
      }
    }
  }

  if (pending.length === 0) return;

  snapshotBeforeDestructive();

  for (const item of pending) {
    const c = item.char;
    const sc = item.scenario;
    const scCv = safeParse(sc.character_variables, {});
    scCv[c.id] = { ...(scCv[c.id] || {}), ...c.vars };
    db.prepare('UPDATE scenarios SET character_variables = ?, updated_at = ? WHERE id = ?')
      .run(JSON.stringify(scCv), Date.now(), sc.id);
  }
}

seedIfEmpty();
seedScenariosIfEmpty();
migrateCharacterVariables();

const SETTINGS_DEFAULTS = {
  provider: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.8,
  bgOpacity: 0.35,
  bgBlur: 0,
  actionDim: 0.72,
  activePresetId: null,
  poseAgent: false,
  poseProvider: 'openrouter',
  poseBaseUrl: '',
  poseApiKey: '',
  poseModel: 'typesafe/jev-1.13',
  poseLikelihood: 0.6,
  poseRecheck: true,
  poseContextCount: 3,
  agentImageModel: '',
  agentImageEditModel: '',
  agentOverride: false,
  agentProvider: 'openrouter',
  agentBaseUrl: '',
  agentApiKey: '',
  agentModel: '',
};

const POSES_SEED_FLAG = 'poses.seeded.v1';

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
    if (r.key === POSES_SEED_FLAG) continue;
    try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; }
  }
  if (out.poseModel === 'gpt-5.6-luna-load-balanced') {
    out.poseModel = 'typesafe/jev-1.13';
  }
  return out;
}

function updateSettings(patch) {
  const allowed = ['provider', 'baseUrl', 'apiKey', 'model', 'temperature', 'activePersonalityId', 'activePresetId', 'bgOpacity', 'bgBlur', 'actionDim', 'poseAgent', 'poseProvider', 'poseBaseUrl', 'poseApiKey', 'poseModel', 'poseLikelihood', 'poseRecheck', 'poseContextCount', 'agentImageModel', 'agentImageEditModel', 'agentOverride', 'agentProvider', 'agentBaseUrl', 'agentApiKey', 'agentModel'];
  const up = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const k of allowed) {
    if (!(k in patch)) continue;
    let v = patch[k];
    if (k === 'bgOpacity') v = clamp(v, 0, 1, 0.35);
    if (k === 'bgBlur') v = clamp(v, 0, 24, 0);
    if (k === 'actionDim') v = clamp(v, 0.3, 1, 0.72);
    if (k === 'temperature') v = clamp(v, 0, 2, 0.8);
    if (k === 'poseLikelihood') v = clamp(v, 0, 1, 0.6);
    if (k === 'poseContextCount') v = Math.round(clamp(v, 0, 20, 3));
    if (k === 'poseAgent' || k === 'poseRecheck') v = !!v;
    if (k === 'poseProvider') v = PROVIDER_IDS.includes(String(v)) ? String(v) : 'openrouter';
    if (k === 'poseBaseUrl' || k === 'poseApiKey' || k === 'poseModel') v = String(v ?? '');
    if (k === 'agentOverride') v = !!v;
    if (k === 'agentProvider') v = PROVIDER_IDS.includes(String(v)) ? String(v) : 'openrouter';
    if (k === 'agentBaseUrl' || k === 'agentApiKey' || k === 'agentModel' || k === 'agentImageModel' || k === 'agentImageEditModel') v = String(v ?? '');
    if (k === 'activePresetId' || k === 'activePersonalityId') v = v || null;
    up.run(k, JSON.stringify(v));
  }
  return getSettings();
}

function getPersonalities() {
  return db.prepare('SELECT id, name, description, note, avatar, image FROM personalities ORDER BY rowid').all();
}

function getPersona(id) {
  return db.prepare('SELECT id, name, description, note, avatar, image FROM personalities WHERE id = ?').get(id) || null;
}

function createPersona({ name, description, note, avatar, image }) {
  const p = { id: uid(), name: String(name || 'Unnamed').slice(0, 80), description: String(description || ''), note: String(note || ''), avatar: avatar || null, image: image || null };
  db.prepare('INSERT INTO personalities (id, name, description, note, avatar, image) VALUES (?,?,?,?,?,?)').run(p.id, p.name, p.description, p.note, p.avatar, p.image);
  return p;
}

function updatePersona(id, { name, description, note, avatar, image }) {
  const p = db.prepare('SELECT id FROM personalities WHERE id = ?').get(id);
  if (!p) return null;
  if (name !== undefined) db.prepare('UPDATE personalities SET name = ? WHERE id = ?').run(String(name).slice(0, 80), id);
  if (description !== undefined) db.prepare('UPDATE personalities SET description = ? WHERE id = ?').run(String(description), id);
  if (note !== undefined) db.prepare('UPDATE personalities SET note = ? WHERE id = ?').run(String(note), id);
  if (avatar !== undefined) db.prepare('UPDATE personalities SET avatar = ? WHERE id = ?').run(avatar || null, id);
  if (image !== undefined) db.prepare('UPDATE personalities SET image = ? WHERE id = ?').run(image || null, id);
  return db.prepare('SELECT id, name, description, note, avatar, image FROM personalities WHERE id = ?').get(id);
}

function deletePersona(id) {
  const n = db.prepare('SELECT COUNT(*) AS n FROM personalities').get().n;
  if (n <= 1) throw new Error('Keep at least one personality');
  snapshotBeforeDestructive();
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
    note: row.note || '',
    scenario: row.scenario,
    emoji: row.emoji,
    avatar: row.avatar,
    image: row.image,
    posesEnabled: !!row.poses_enabled,
    variables: safeParse(row.variables, {}),
    responses: safeParse(row.responses, []),
  };
  if (withChats) {
    c.poses = getPoses(row.id, { withImages: false });
    c.chats = db.prepare('SELECT * FROM chats WHERE character_id = ? ORDER BY updated_at DESC').all(row.id)
      .map((ch) => shapeChat(ch));
  }
  return c;
}

function shapeChat(ch) {
  let scTitle = null;
  if (ch.scenario_id) {
    const sc = db.prepare('SELECT title FROM scenarios WHERE id = ?').get(ch.scenario_id);
    if (sc) scTitle = sc.title;
  }
  return {
    id: ch.id,
    characterId: ch.character_id,
    scenarioId: ch.scenario_id || null,
    scenarioTitle: scTitle,
    title: ch.title,
    createdAt: ch.created_at,
    updatedAt: ch.updated_at,
    poseId: ch.pose_id || null,
    tree: getTree(ch.id),
  };
}

function isCharacterAllowedForScenario(sc, characterId) {
  return true;
}

function shapeScenario(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    content: row.content,
    specialNotes: row.special_notes || '',
    accessMode: row.access_mode || 'all',
    characterIds: safeParse(row.character_ids, []),
    characterVariables: safeParse(row.character_variables, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getScenarios(opts = {}) {
  const rows = db.prepare('SELECT * FROM scenarios ORDER BY created_at ASC').all();
  let items = rows.map(shapeScenario);
  if (opts.characterId) {
    items = items.filter((s) => isCharacterAllowedForScenario(s, opts.characterId));
  }
  return items;
}

function getScenario(id) {
  const row = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id);
  return shapeScenario(row);
}

function createScenario({ title, description, content, specialNotes, special_notes, accessMode, characterIds, characterVariables, character_variables }) {
  const id = 'sc-' + uid();
  const now = Date.now();
  const mode = ['all', 'whitelist', 'blacklist'].includes(accessMode) ? accessMode : 'all';
  const cids = Array.isArray(characterIds) ? JSON.stringify(characterIds) : (typeof characterIds === 'string' ? characterIds : '[]');
  const rawVars = characterVariables !== undefined ? characterVariables : character_variables;
  const cvars = (rawVars && typeof rawVars === 'object') ? JSON.stringify(rawVars) : (typeof rawVars === 'string' ? rawVars : '{}');
  const sNotes = String(specialNotes !== undefined ? specialNotes : (special_notes || ''));
  db.prepare(`
    INSERT INTO scenarios (id, title, description, content, special_notes, access_mode, character_ids, character_variables, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, String(title || 'Untitled scenario').slice(0, 120), String(description || ''), String(content || ''), sNotes, mode, cids, cvars, now, now);
  return getScenario(id);
}

function updateScenario(id, fields) {
  const sc = getScenario(id);
  if (!sc) return null;
  const sets = [];
  const vals = [];
  if (fields.title !== undefined) { sets.push('title = ?'); vals.push(String(fields.title).slice(0, 120)); }
  if (fields.description !== undefined) { sets.push('description = ?'); vals.push(String(fields.description)); }
  if (fields.content !== undefined) { sets.push('content = ?'); vals.push(String(fields.content)); }
  if (fields.specialNotes !== undefined || fields.special_notes !== undefined) {
    sets.push('special_notes = ?');
    vals.push(String(fields.specialNotes !== undefined ? fields.specialNotes : fields.special_notes));
  }
  if (fields.accessMode !== undefined && ['all', 'whitelist', 'blacklist'].includes(fields.accessMode)) {
    sets.push('access_mode = ?'); vals.push(fields.accessMode);
  }
  if (fields.characterIds !== undefined) {
    const cids = Array.isArray(fields.characterIds) ? JSON.stringify(fields.characterIds) : String(fields.characterIds);
    sets.push('character_ids = ?'); vals.push(cids);
  }
  if (fields.characterVariables !== undefined || fields.character_variables !== undefined) {
    const rawVars = fields.characterVariables !== undefined ? fields.characterVariables : fields.character_variables;
    const cvars = (rawVars && typeof rawVars === 'object') ? JSON.stringify(rawVars) : (typeof rawVars === 'string' ? rawVars : '{}');
    sets.push('character_variables = ?'); vals.push(cvars);
  }
  if (sets.length) {
    sets.push('updated_at = ?');
    vals.push(Date.now());
    vals.push(id);
    db.prepare(`UPDATE scenarios SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getScenario(id);
}

function deleteScenario(id) {
  snapshotBeforeDestructive();
  db.prepare('UPDATE chats SET scenario_id = NULL WHERE scenario_id = ?').run(id);
  db.prepare('DELETE FROM scenarios WHERE id = ?').run(id);
  return { ok: true };
}

function getCharacters() {
  return db.prepare('SELECT * FROM characters ORDER BY created_at').all().map((r) => shapeCharacter(r, true));
}

function createCharacter({ id, name, description, note, scenario, emoji, avatar, image, posesEnabled, variables, responses }) {
  const charId = (id && typeof id === 'string') ? id : uid();
  const pe = posesEnabled ? 1 : 0;
  const vars = (variables && typeof variables === 'object') ? JSON.stringify(variables) : (typeof variables === 'string' ? variables : '{}');
  const resps = JSON.stringify(Array.isArray(responses) ? responses.filter((r) => r && String(r).trim()).slice(0, 12) : []);
  db.prepare('INSERT INTO characters (id, name, description, note, scenario, emoji, avatar, image, poses_enabled, variables, responses, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(charId, String(name).slice(0, 120), String(description || ''), String(note || ''), String(scenario || ''), String(emoji || '🎭'), avatar || null, image || null, pe, vars, resps, Date.now());
  ensureDefaultPoses(charId);
  const allowed = getScenarios({ characterId: charId });
  createChatInternal(charId, allowed.length > 0 ? allowed[0].id : null);
  return getCharacter(charId);
}

function updateCharacter(id, fields) {
  const c = characterRow(id);
  if (!c) return null;
  const sets = [];
  const vals = [];
  for (const k of ['name', 'description', 'note', 'scenario', 'emoji']) {
    if (fields[k] !== undefined) { sets.push(`${k} = ?`); vals.push(String(fields[k])); }
  }
  if ('variables' in fields) {
    sets.push('variables = ?');
    vals.push(typeof fields.variables === 'string' ? fields.variables : JSON.stringify(fields.variables || {}));
  }
  if ('responses' in fields) {
    let resps = fields.responses;
    if (!Array.isArray(resps)) resps = safeParse(resps, []);
    resps = resps.filter((r) => r && String(r).trim()).slice(0, 12).map((r) => String(r));
    sets.push('responses = ?');
    vals.push(JSON.stringify(resps));
  }
  if ('avatar' in fields) { sets.push('avatar = ?'); vals.push(fields.avatar || null); }
  if ('image' in fields) { sets.push('image = ?'); vals.push(fields.image || null); }
  if ('posesEnabled' in fields) { sets.push('poses_enabled = ?'); vals.push(fields.posesEnabled ? 1 : 0); }
  if (sets.length) {
    vals.push(id);
    db.prepare(`UPDATE characters SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getCharacter(id);
}

function deleteCharacter(id) {
  snapshotBeforeDestructive();
  db.prepare('DELETE FROM characters WHERE id = ?').run(id);
  return { ok: true };
}

function createChatInternal(characterId, scenarioId = null) {
  const c = characterRow(characterId);
  if (!c) throw new Error('Character not found');
  let sc = null;
  let scenarioContent = '';
  let initialTitle = 'New chat';
  if (scenarioId) {
    sc = getScenario(scenarioId);
    if (sc) {
      if (!isCharacterAllowedForScenario(sc, characterId)) {
        throw new Error('This character is not permitted to enter this scenario');
      }
      scenarioContent = sc.content;
      initialTitle = sc.title || 'New chat';
    }
  }
  if (!scenarioContent && c.scenario) {
    scenarioContent = c.scenario;
  }
  if (!scenarioContent) {
    scenarioContent = '*They look at you, waiting for you to speak first.*';
  }
  const id = uid();
  const t = Date.now();
  const tree = emptyTree();
  const sid = 's' + uid();
  tree.nodes[sid] = { id: sid, role: 'scenario', content: scenarioContent, parent: 'root', children: [], active: 0, createdAt: t };
  tree.nodes.root.children.push(sid);
  const defPose = c.poses_enabled ? getDefaultPose(characterId) : null;
  const initialPoseId = defPose ? defPose.id : null;
  db.prepare('INSERT INTO chats (id, character_id, scenario_id, title, pose_id, tree, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, characterId, scenarioId || null, initialTitle, initialPoseId, JSON.stringify(tree), t, t);
  return shapeChat(db.prepare('SELECT * FROM chats WHERE id = ?').get(id));
}

function createChat(characterId, scenarioId = null) {
  return createChatInternal(characterId, scenarioId);
}

function getChat(id) {
  const ch = db.prepare('SELECT * FROM chats WHERE id = ?').get(id);
  return ch ? shapeChat(ch) : null;
}

function deleteChat(id) {
  snapshotBeforeDestructive();
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
  let cur = tree?.nodes?.root;
  while (cur && cur.children && cur.children.length) {
    const next = tree.nodes[childOnActivePath(cur)];
    if (!next) break;
    cur = next;
  }
  return cur ? cur.id : null;
}

function pathNodes(tree, uptoId) {
  const out = [];
  let cur = tree?.nodes?.root;
  let guard = 0;
  while (cur && cur.children && cur.children.length && guard++ < 1000) {
    const n = tree.nodes[childOnActivePath(cur)];
    if (!n) break;
    out.push(n);
    if (uptoId && n.id === uptoId) break;
    cur = n;
  }
  return out;
}

/* The variant a re-generation from `parentId` will replace: whichever child of
   that parent is currently on the active path. */
function activeChildId(tree, parentId) {
  const p = tree.nodes[parentId];
  return p ? childOnActivePath(p) || null : null;
}

/* The shot the message history says belongs on screen for the active branch:
   the last character message on the active path carrying a pose stamp. Stamps
   are only written when the director actually swaps, so an unstamped message
   means "unchanged" and the search walks past it.

   `uptoId` stops the walk early so the answer can be the shot that was showing
   *before* a given message — what a discarded message must fall back to. */
function poseOnPath(chatId, uptoId = null) {
  const tree = getTree(chatId);
  let cur = tree.nodes.root;
  let poseId = null;
  let guard = 0;
  while (cur.children.length && guard++ < 1000) {
    const n = tree.nodes[childOnActivePath(cur)];
    if (!n || n.id === uptoId) break;
    if (n.poseId) poseId = n.poseId;
    cur = n;
  }
  return poseId;
}

/* The shot on screen before `nodeId` was written — used when a message is being
   re-generated, i.e. while the old branch is still the active one. */
function poseBefore(chatId, nodeId) {
  return poseOnPath(chatId, nodeId);
}

/* The shot for whatever branch is on screen right now. Recomputed after a
   delete, edit or version switch so no image is left over from the branch the
   user just navigated away from. */
function poseAtTip(chatId) {
  return poseOnPath(chatId);
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

function addReply(chatId, parentId, content, extra = null) {
  const tree = getTree(chatId);
  const parent = tree.nodes[parentId];
  if (!parent) throw new Error('Parent message not found');
  for (const n of pathNodes(tree, parentId)) {
    if (n.role === 'injection' && n.state === 'pending') n.state = 'delivered';
  }
  const node = { id: uid(), role: 'char', content: String(content), parent: parentId, children: [], active: 0, createdAt: Date.now() };
  if (extra && extra.poseId) node.poseId = extra.poseId;
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
  snapshotBeforeDestructive();
  const parent = tree.nodes[node.parent];
  // Delete all messages you can switch to in this box (all sibling variants) and their entire subtrees
  const siblingIds = parent ? [...parent.children] : [nodeId];
  const ids = [...siblingIds];
  for (let i = 0; i < ids.length; i++) {
    for (const c of tree.nodes[ids[i]]?.children || []) ids.push(c);
  }
  for (const id of ids) delete tree.nodes[id];
  if (parent) {
    parent.children = [];
    parent.active = 0;
  }
  saveTree(chatId, tree);
  return { ok: true, removed: ids.length };
}

function insertOocNode(chatId, charNodeId, content = '') {
  const tree = getTree(chatId);
  const charNode = tree.nodes[charNodeId];
  if (!charNode) throw new Error('Message not found');
  snapshotBeforeDestructive();
  const oocNode = {
    id: uid(),
    role: 'injection',
    content: String(content),
    parent: charNode.id,
    children: (charNode.children || []).slice(),
    active: charNode.active || 0,
    state: (charNode.children && charNode.children.length) ? 'delivered' : 'pending',
    createdAt: Date.now(),
  };
  tree.nodes[oocNode.id] = oocNode;
  for (const c of oocNode.children) {
    if (tree.nodes[c]) tree.nodes[c].parent = oocNode.id;
  }
  charNode.children = [oocNode.id];
  charNode.active = 0;
  saveTree(chatId, tree);
  return oocNode;
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
  snapshotBeforeDestructive();
  db.prepare('DELETE FROM presets WHERE id = ?').run(id);
  return { ok: true };
}

function shapePose(row, withImages) {
  return {
    id: row.id,
    characterId: row.character_id,
    name: row.name,
    description: row.description || '',
    image: withImages === false ? null : (row.image || null),
    thumb: withImages === false ? null : (row.thumb || null),
    width: row.width || 0,
    height: row.height || 0,
    isDefault: !!row.is_default,
    position: row.position || 0,
    hasImage: !!row.image,
    hasThumb: !!row.thumb,
  };
}

function getPoses(characterId, { withImages = true } = {}) {
  return db.prepare('SELECT * FROM poses WHERE character_id = ? ORDER BY position ASC, created_at ASC')
    .all(characterId)
    .map((r) => shapePose(r, withImages));
}

function getPose(id) {
  const row = db.prepare('SELECT * FROM poses WHERE id = ?').get(id);
  return row ? shapePose(row, true) : null;
}

function createPose(characterId, fields = {}) {
  if (!characterRow(characterId)) return null;
  const name = String(fields.name || '').trim();
  if (!name) throw new Error('Pose name is required');
  const p = {
    id: uid(),
    characterId,
    name: name.slice(0, 80),
    description: String(fields.description || '').slice(0, 2000),
    image: typeof fields.image === 'string' ? fields.image : null,
    crop: 'free',
    width: 0,
    height: 0,
    isDefault: fields.isDefault ? 1 : 0,
    position: db.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS p FROM poses WHERE character_id = ?').get(characterId).p,
  };
  db.prepare('INSERT INTO poses (id, character_id, name, description, image, crop, width, height, is_default, position, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(p.id, p.characterId, p.name, p.description, p.image, p.crop, p.width, p.height, p.isDefault, p.position, Date.now());
  return getPose(p.id);
}

function getDefaultPose(characterId) {
  const poses = getPoses(characterId, { withImages: true });
  if (!poses.length) return null;
  const defWithImg = poses.find((p) => p.isDefault && (p.hasImage || p.image));
  if (defWithImg) return defWithImg;
  const def = poses.find((p) => p.isDefault);
  if (def) return def;
  const withImg = poses.find((p) => p.hasImage || p.image);
  if (withImg) return withImg;
  return poses[0];
}

function setDefaultPose(characterId, poseId) {
  const row = db.prepare('SELECT id, character_id, name, image, thumb FROM poses WHERE id = ? AND character_id = ?').get(poseId, characterId);
  if (!row) return null;
  db.prepare('UPDATE poses SET is_default = 0 WHERE character_id = ?').run(characterId);
  db.prepare('UPDATE poses SET is_default = 1 WHERE character_id = ? AND id = ?').run(characterId, poseId);
  if (row.thumb || row.image) {
    db.prepare('UPDATE characters SET avatar = COALESCE(?, avatar), image = COALESCE(?, image) WHERE id = ?')
      .run(row.thumb || row.image, row.image || row.thumb, characterId);
  }
  return getPose(poseId);
}

function updatePose(id, fields = {}) {
  const row = db.prepare('SELECT id, character_id FROM poses WHERE id = ?').get(id);
  if (!row) return null;
  const sets = [];
  const vals = [];
  const push = (col, val) => { sets.push(`${col} = ?`); vals.push(val); };
  if ('name' in fields) {
    const n = String(fields.name || '').trim().slice(0, 80);
    if (n) push('name', n);
  }
  if ('description' in fields) push('description', String(fields.description || '').slice(0, 2000));
  if ('image' in fields) push('image', typeof fields.image === 'string' ? fields.image : null);
  if ('thumb' in fields) push('thumb', typeof fields.thumb === 'string' ? fields.thumb : null);
  if ('width' in fields && Number.isFinite(Number(fields.width))) push('width', Math.round(Number(fields.width)));
  if ('height' in fields && Number.isFinite(Number(fields.height))) push('height', Math.round(Number(fields.height)));
  if ('isDefault' in fields) {
    if (fields.isDefault) {
      const charId = row.character_id;
      db.prepare('UPDATE poses SET is_default = 0 WHERE character_id = ?').run(charId);
      push('is_default', 1);
      const curPose = db.prepare('SELECT image, thumb FROM poses WHERE id = ?').get(id);
      const img = ('image' in fields ? fields.image : curPose?.image) || null;
      const th = ('thumb' in fields ? fields.thumb : curPose?.thumb) || null;
      if (th || img) {
        db.prepare('UPDATE characters SET avatar = COALESCE(?, avatar), image = COALESCE(?, image) WHERE id = ?')
          .run(th || img, img || th, charId);
      }
    } else {
      push('is_default', 0);
    }
  }
  if (sets.length) {
    vals.push(id);
    db.prepare(`UPDATE poses SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getPose(id);
}

function deletePose(id) {
  const row = db.prepare('SELECT id, character_id, is_default FROM poses WHERE id = ?').get(id);
  if (!row) return false;
  snapshotBeforeDestructive();
  db.prepare('DELETE FROM poses WHERE id = ?').run(id);
  db.prepare('UPDATE chats SET pose_id = NULL WHERE pose_id = ?').run(id);
  if (row.is_default) {
    const next = db.prepare('SELECT id FROM poses WHERE character_id = ? ORDER BY (CASE WHEN image IS NOT NULL THEN 0 ELSE 1 END), position ASC LIMIT 1').get(row.character_id);
    if (next) {
      db.prepare('UPDATE poses SET is_default = 1 WHERE id = ?').run(next.id);
    }
  }
  return true;
}

function setChatPose(chatId, poseId) {
  const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
  if (!chat) return null;
  if (poseId == null || poseId === '') {
    db.prepare('UPDATE chats SET pose_id = NULL WHERE id = ?').run(chatId);
    return getChat(chatId);
  }
  // A pose that does not exist, or belongs to another character, is refused:
  // the chat keeps the pose it already had rather than being blanked.
  if (typeof poseId !== 'string') return getChat(chatId);
  const pose = getPose(poseId);
  if (!pose || pose.characterId !== chat.character_id) return getChat(chatId);
  db.prepare('UPDATE chats SET pose_id = ? WHERE id = ?').run(pose.id, chatId);
  return getChat(chatId);
}

function ensurePosesIntegrity() {
  // Default poses are seeded exactly once, on the upgrade that introduced them.
  // Without the marker a character whose poses the user deleted would get the
  // six defaults back on every restart.
  const seeded = db.prepare('SELECT value FROM settings WHERE key = ?').get(POSES_SEED_FLAG);
  if (!seeded) {
    const chars = db.prepare('SELECT id FROM characters').all();
    let n = 0;
    for (const c of chars) {
      if (db.prepare('SELECT COUNT(*) AS n FROM poses WHERE character_id = ?').get(c.id).n > 0) continue;
      ensureDefaultPoses(c.id);
      n += 1;
    }
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(POSES_SEED_FLAG, '1');
    if (n > 0) console.log(`[poses] default poses ensured for ${n} characters`);
  }
  try {
    db.prepare("UPDATE characters SET responses = '[]' WHERE responses = ?").run(JSON.stringify(GENERIC_RESPONSES));
  } catch {}
  db.prepare('UPDATE chats SET pose_id = NULL WHERE pose_id IS NOT NULL AND pose_id NOT IN (SELECT id FROM poses)').run();
}

ensurePosesIntegrity();

function exportData({ type = 'all', id = null } = {}) {
  const result = {
    $schema: 'https://aichat.local/schema/export-v1.json',
    version: 1,
    generator: 'aichat',
    exportedAt: new Date().toISOString(),
  };

  if (type === 'characters' && id) {
    const c = getCharacter(id);
    if (!c) throw new Error(`Character ${id} not found`);
    const poses = getPoses(id, { withImages: true });
    result.character = { ...c, poses };
    return result;
  }

  if (type === 'scenarios' && id) {
    const s = getScenario(id);
    if (!s) throw new Error(`Scenario ${id} not found`);
    result.scenario = s;
    return result;
  }

  if ((type === 'personas' || type === 'personalities') && id) {
    const p = getPersona(id);
    if (!p) throw new Error(`Persona ${id} not found`);
    result.persona = p;
    return result;
  }

  if (type === 'characters' || type === 'all') {
    const chars = db.prepare('SELECT * FROM characters ORDER BY created_at ASC').all();
    result.characters = chars.map((row) => {
      const c = shapeCharacter(row, false);
      c.poses = getPoses(row.id, { withImages: true });
      return c;
    });
  }

  if (type === 'scenarios' || type === 'all') {
    result.scenarios = getScenarios();
  }

  if (type === 'personas' || type === 'personalities' || type === 'all') {
    result.personas = getPersonalities();
  }

  if (type === 'variables' || type === 'all') {
    const chars = db.prepare('SELECT id, name, variables FROM characters').all();
    const charVars = {};
    for (const c of chars) {
      const v = safeParse(c.variables, {});
      if (v && typeof v === 'object' && Object.keys(v).length > 0) {
        charVars[c.id] = v;
      }
    }
    const scens = db.prepare('SELECT id, title, character_variables FROM scenarios').all();
    const scenVars = {};
    for (const s of scens) {
      const cv = safeParse(s.character_variables, {});
      if (cv && typeof cv === 'object' && Object.keys(cv).length > 0) {
        scenVars[s.id] = cv;
      }
    }
    result.variables = {
      characters: charVars,
      scenarios: scenVars,
    };
  }

  return result;
}

function importData(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid JSON format: expected an object or array');
  }

  snapshotBeforeDestructive();

  const counts = { characters: 0, scenarios: 0, personas: 0, variables: 0, poses: 0 };

  let data = raw;
  if (data.spec === 'chara_card_v2' && data.data) {
    data = { character: data.data };
  }

  db.exec('BEGIN');
  try {
    // 1. Process characters
    let charsToImport = [];
    if (Array.isArray(data.characters)) {
      charsToImport = data.characters;
    } else if (data.character && typeof data.character === 'object') {
      charsToImport = [data.character];
    } else if (Array.isArray(data) && data.length > 0 && data[0] && (data[0].name || data[0].char_persona)) {
      charsToImport = data;
    } else if (data.name && (data.description !== undefined || data.personality || data.scenario || data.poses || data.variables)) {
      charsToImport = [data];
    }

    for (const item of charsToImport) {
      if (!item || typeof item !== 'object') continue;
      const name = String(item.name || item.char_name || 'Unnamed').trim().slice(0, 120);
      if (!name) continue;

      let charId = (item.id && typeof item.id === 'string') ? item.id.trim() : null;
      const desc = String(item.description || item.personality || item.char_persona || '');
      const note = String(item.note || '');
      const scenario = String(item.scenario || item.mes_example || '');
      const emoji = String(item.emoji || '🎭');
      const avatar = typeof item.avatar === 'string' ? item.avatar : null;
      const image = typeof item.image === 'string' ? item.image : null;
      const posesEnabled = item.posesEnabled != null ? (item.posesEnabled ? 1 : 0) : (item.poses_enabled ? 1 : 0);
      const vars = (item.variables && typeof item.variables === 'object') ? item.variables : safeParse(item.variables, {});
      const responses = Array.isArray(item.responses) ? item.responses : safeParse(item.responses, []);

      let existing = charId ? characterRow(charId) : null;
      if (!existing) {
        const byName = db.prepare('SELECT id FROM characters WHERE LOWER(name) = LOWER(?)').get(name);
        if (byName && !charId) {
          charId = byName.id;
          existing = characterRow(charId);
        }
      }

      if (existing) {
        db.prepare(`
          UPDATE characters
          SET name = ?, description = ?, note = ?, scenario = ?, emoji = ?,
              avatar = COALESCE(?, avatar), image = COALESCE(?, image),
              poses_enabled = ?, variables = ?, responses = ?
          WHERE id = ?
        `).run(
          name, desc, note, scenario, emoji,
          avatar, image,
          posesEnabled, JSON.stringify(vars), JSON.stringify(responses),
          charId
        );
      } else {
        if (!charId) charId = 'c-' + uid();
        db.prepare(`
          INSERT INTO characters (id, name, description, note, scenario, emoji, avatar, image, poses_enabled, variables, responses, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          charId, name, desc, note, scenario, emoji,
          avatar, image,
          posesEnabled, JSON.stringify(vars), JSON.stringify(responses),
          Date.now()
        );
        const allowed = getScenarios({ characterId: charId });
        createChatInternal(charId, allowed.length > 0 ? allowed[0].id : null);
      }

      counts.characters++;
      if (vars && typeof vars === 'object') {
        counts.variables += Object.keys(vars).length;
      }

      if (Array.isArray(item.poses) && item.poses.length > 0) {
        for (let i = 0; i < item.poses.length; i++) {
          const p = item.poses[i];
          if (!p || typeof p !== 'object') continue;
          const pName = String(p.name || `Pose ${i + 1}`).trim().slice(0, 80);
          const pDesc = String(p.description || '').slice(0, 2000);
          const pImg = typeof p.image === 'string' ? p.image : null;
          const pThumb = typeof p.thumb === 'string' ? p.thumb : null;
          const pCrop = String(p.crop || 'square');
          const pWidth = Number(p.width) || 0;
          const pHeight = Number(p.height) || 0;
          const pDef = p.isDefault ? 1 : 0;
          const pPos = Number.isInteger(p.position) ? p.position : i;

          let poseId = (p.id && typeof p.id === 'string') ? p.id.trim() : null;
          let existPose = poseId ? db.prepare('SELECT id FROM poses WHERE id = ?').get(poseId) : null;
          if (!existPose) {
            existPose = db.prepare('SELECT id FROM poses WHERE character_id = ? AND LOWER(name) = LOWER(?)').get(charId, pName);
            if (existPose) poseId = existPose.id;
          }

          if (existPose) {
            db.prepare(`
              UPDATE poses
              SET name = ?, description = ?, image = COALESCE(?, image), thumb = COALESCE(?, thumb),
                  crop = ?, width = ?, height = ?, is_default = ?, position = ?
              WHERE id = ?
            `).run(pName, pDesc, pImg, pThumb, pCrop, pWidth, pHeight, pDef, pPos, poseId);
          } else {
            if (!poseId) poseId = uid();
            db.prepare(`
              INSERT INTO poses (id, character_id, name, description, image, thumb, crop, width, height, is_default, position, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(poseId, charId, pName, pDesc, pImg, pThumb, pCrop, pWidth, pHeight, pDef, pPos, Date.now());
          }
          counts.poses++;
        }
      } else {
        ensureDefaultPoses(charId);
      }
    }

    // 2. Process scenarios
    let scensToImport = [];
    if (Array.isArray(data.scenarios)) {
      scensToImport = data.scenarios;
    } else if (data.scenario && typeof data.scenario === 'object') {
      scensToImport = [data.scenario];
    } else if (Array.isArray(data) && data.length > 0 && data[0] && data[0].title && data[0].content) {
      scensToImport = data;
    } else if (data.title && data.content) {
      scensToImport = [data];
    }

    for (const item of scensToImport) {
      if (!item || typeof item !== 'object') continue;
      const title = String(item.title || 'Untitled scenario').trim().slice(0, 120);
      const desc = String(item.description || '');
      const content = String(item.content || item.scenario || '');
      const sNotes = String(item.specialNotes || item.special_notes || '');
      if (!content && !title) continue;

      let scenId = (item.id && typeof item.id === 'string') ? item.id.trim() : null;
      const mode = ['all', 'whitelist', 'blacklist'].includes(item.accessMode || item.access_mode) ? (item.accessMode || item.access_mode) : 'all';
      const cids = Array.isArray(item.characterIds || item.character_ids) ? JSON.stringify(item.characterIds || item.character_ids) : '[]';
      const rawVars = item.characterVariables !== undefined ? item.characterVariables : item.character_variables;
      const cvars = (rawVars && typeof rawVars === 'object') ? rawVars : safeParse(rawVars, {});

      let existing = scenId ? db.prepare('SELECT id, character_variables FROM scenarios WHERE id = ?').get(scenId) : null;
      if (!existing) {
        const byTitle = db.prepare('SELECT id, character_variables FROM scenarios WHERE LOWER(title) = LOWER(?)').get(title);
        if (byTitle && !scenId) {
          scenId = byTitle.id;
          existing = byTitle;
        }
      }

      const now = Date.now();
      if (existing) {
        const prevCv = safeParse(existing.character_variables, {});
        const mergedCv = { ...prevCv };
        if (cvars && typeof cvars === 'object') {
          for (const [k, v] of Object.entries(cvars)) {
            mergedCv[k] = { ...(mergedCv[k] || {}), ...v };
          }
        }
        db.prepare(`
          UPDATE scenarios
          SET title = ?, description = ?, content = ?, special_notes = COALESCE(?, special_notes), access_mode = ?, character_ids = ?, character_variables = ?, updated_at = ?
          WHERE id = ?
        `).run(title, desc, content, sNotes || null, mode, cids, JSON.stringify(mergedCv), now, scenId);
      } else {
        if (!scenId) scenId = 'sc-' + uid();
        db.prepare(`
          INSERT INTO scenarios (id, title, description, content, special_notes, access_mode, character_ids, character_variables, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(scenId, title, desc, content, sNotes, mode, cids, JSON.stringify(cvars), now, now);
      }

      counts.scenarios++;
      if (cvars && typeof cvars === 'object') {
        for (const v of Object.values(cvars)) {
          if (v && typeof v === 'object') counts.variables += Object.keys(v).length;
        }
      }
    }

    // 3. Process personas / personalities
    let personasToImport = [];
    if (Array.isArray(data.personas)) {
      personasToImport = data.personas;
    } else if (Array.isArray(data.personalities)) {
      personasToImport = data.personalities;
    } else if (data.persona && typeof data.persona === 'object') {
      personasToImport = [data.persona];
    } else if (data.personality && typeof data.personality === 'object') {
      personasToImport = [data.personality];
    }

    for (const item of personasToImport) {
      if (!item || typeof item !== 'object') continue;
      const name = String(item.name || 'Unnamed Persona').trim().slice(0, 80);
      if (!name) continue;
      const desc = String(item.description || '');
      const note = String(item.note || '');
      const avatar = typeof item.avatar === 'string' ? item.avatar : null;
      const image = typeof item.image === 'string' ? item.image : null;

      let pid = (item.id && typeof item.id === 'string') ? item.id.trim() : null;
      let existing = pid ? getPersona(pid) : null;
      if (!existing) {
        existing = db.prepare('SELECT id FROM personalities WHERE LOWER(name) = LOWER(?)').get(name);
        if (existing && !pid) pid = existing.id;
      }

      if (existing) {
        db.prepare('UPDATE personalities SET name = ?, description = ?, note = ?, avatar = COALESCE(?, avatar), image = COALESCE(?, image) WHERE id = ?')
          .run(name, desc, note, avatar, image, pid || existing.id);
      } else {
        if (!pid) pid = uid();
        db.prepare('INSERT INTO personalities (id, name, description, note, avatar, image) VALUES (?, ?, ?, ?, ?, ?)')
          .run(pid, name, desc, note, avatar, image);
      }
      counts.personas++;
    }

    // 4. Process standalone variables if provided
    const varsData = data.variables !== undefined ? data.variables : data.characterVariables;
    if (varsData && typeof varsData === 'object') {
      if (Array.isArray(varsData)) {
        for (const item of varsData) {
          if (!item || typeof item !== 'object') continue;
          const cid = item.characterId || item.character_id || item.character;
          const k = item.key || item.name;
          const v = item.value;
          if (!cid || !k) continue;
          let char = characterRow(cid) || db.prepare('SELECT * FROM characters WHERE LOWER(name) = LOWER(?)').get(cid);
          if (char) {
            const current = safeParse(char.variables, {});
            current[k] = String(v == null ? '' : v);
            db.prepare('UPDATE characters SET variables = ? WHERE id = ?').run(JSON.stringify(current), char.id);
            counts.variables++;
          }
        }
      } else {
        const charVars = varsData.characters || (!varsData.scenarios ? varsData : null);
        if (charVars && typeof charVars === 'object') {
          for (const [charIdOrName, vMap] of Object.entries(charVars)) {
            if (!vMap || typeof vMap !== 'object') continue;
            let char = characterRow(charIdOrName);
            if (!char) {
              char = db.prepare('SELECT * FROM characters WHERE LOWER(name) = LOWER(?)').get(charIdOrName);
            }
            if (char) {
              const current = safeParse(char.variables, {});
              const merged = { ...current, ...vMap };
              db.prepare('UPDATE characters SET variables = ? WHERE id = ?').run(JSON.stringify(merged), char.id);
              counts.variables += Object.keys(vMap).length;
            }
          }
        }

        const scenVars = varsData.scenarios;
        if (scenVars && typeof scenVars === 'object') {
          for (const [scenIdOrTitle, charMap] of Object.entries(scenVars)) {
            if (!charMap || typeof charMap !== 'object') continue;
            let sc = db.prepare('SELECT id, character_variables FROM scenarios WHERE id = ?').get(scenIdOrTitle);
            if (!sc) {
              sc = db.prepare('SELECT id, character_variables FROM scenarios WHERE LOWER(title) = LOWER(?)').get(scenIdOrTitle);
            }
            if (sc) {
              const current = safeParse(sc.character_variables, {});
              const merged = { ...current };
              for (const [cid, v] of Object.entries(charMap)) {
                merged[cid] = { ...(merged[cid] || {}), ...v };
                if (v && typeof v === 'object') counts.variables += Object.keys(v).length;
              }
              db.prepare('UPDATE scenarios SET character_variables = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(merged), Date.now(), sc.id);
            }
          }
        }
      }
    } else if (!data.characters && !data.character && !data.scenarios && !data.scenario && typeof data === 'object') {
      for (const [charIdOrName, vMap] of Object.entries(data)) {
        if (!vMap || typeof vMap !== 'object') continue;
        let char = characterRow(charIdOrName) || db.prepare('SELECT * FROM characters WHERE LOWER(name) = LOWER(?)').get(charIdOrName);
        if (char) {
          const current = safeParse(char.variables, {});
          const merged = { ...current, ...vMap };
          db.prepare('UPDATE characters SET variables = ? WHERE id = ?').run(JSON.stringify(merged), char.id);
          counts.variables += Object.keys(vMap).length;
        }
      }
    }

    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return { ok: true, imported: counts };
}

/* ---- Agent conversation log ---------------------------------------------- */
/* The built-in AI Agent keeps one global conversation. Assistant rows may carry
   native tool_calls JSON; each executed call stores its result in a separate
   'tool' row linked by call_id so history can be replayed provider-side. */function shapeAgentMessage(row) {
  return {
    id: row.id,
    role: row.role,
    content: row.content || '',
    callId: row.call_id || null,
    toolCalls: row.tool_calls ? safeParse(row.tool_calls, null) : null,
    toolName: row.tool_name || null,
    toolArgs: row.tool_args ? safeParse(row.tool_args, null) : null,
    toolResult: row.tool_result ? safeParse(row.tool_result, null) : null,
    /* Raw stored JSON — lets history replay fall back to the (possibly
       truncated) string rather than silently sending the model "" when a
       legacy row fails to parse. */
    toolResultRaw: typeof row.tool_result === 'string' ? row.tool_result : '',
    toolError: !!row.tool_error,
    createdAt: row.created_at,
  };
}

function getAgentMessages() {
  return db.prepare('SELECT * FROM agent_messages ORDER BY id').all().map(shapeAgentMessage);
}

function addAgentMessage(m) {
  const info = db.prepare(`INSERT INTO agent_messages (role, content, call_id, tool_calls, tool_name, tool_args, tool_result, tool_error, created_at)
    VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(
      m.role,
      m.content || '',
      m.callId || null,
      m.toolCalls ? JSON.stringify(m.toolCalls) : null,
      m.toolName || null,
      m.toolArgs ? JSON.stringify(m.toolArgs) : null,
      typeof m.toolResult === 'string' ? m.toolResult : (m.toolResult ? JSON.stringify(m.toolResult) : null),
      m.toolError ? 1 : 0,
      Date.now(),
    );
  const row = db.prepare('SELECT * FROM agent_messages WHERE id = ?').get(info.lastInsertRowid);
  return shapeAgentMessage(row);
}

function clearAgentMessages() {
  snapshotBeforeDestructive();
  db.prepare('DELETE FROM agent_messages').run();
  db.prepare('DELETE FROM agent_attachments').run();
  clearAgentChanges();
  return { ok: true };
}

function agentMessageCount() {
  return db.prepare('SELECT COUNT(*) AS n FROM agent_messages').get().n;
}

/* ---- Agent attachments (images the user gives the Agent) ------------------- */

const ATTACH_MIMES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];

function addAgentAttachment({ name, dataUrl }) {
  const s = String(dataUrl || '');
  const mm = s.match(/^data:(image\/(?:png|jpe?g|webp|gif|avif));base64,/i);
  if (!mm) throw new Error('Only PNG, JPEG, WebP, AVIF or GIF images can be attached');
  if (s.length > 12 * 1024 * 1024) throw new Error('Image too large (max ~9 MB encoded)');
  const rawMime = mm[1].toLowerCase();
  const mime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
  const a = {
    id: 'att-' + uid(),
    name: String(name || '').slice(0, 120) || 'image',
    mime,
    dataUrl: s,
    createdAt: Date.now(),
  };
  db.prepare('INSERT INTO agent_attachments (id, name, mime, data_url, created_at) VALUES (?,?,?,?,?)')
    .run(a.id, a.name, a.mime, a.dataUrl, a.createdAt);
  return { id: a.id, name: a.name, mime: a.mime };
}

function getAgentAttachment(id) {
  const row = db.prepare('SELECT * FROM agent_attachments WHERE id = ?').get(id);
  return row ? { id: row.id, name: row.name, mime: row.mime, dataUrl: row.data_url, createdAt: row.created_at } : null;
}

function countAgentAttachments() {
  return db.prepare('SELECT COUNT(*) AS n FROM agent_attachments').get().n;
}

/* ---- Agent Session Checkpoint & Changes Tracking -------------------------- */

const AGENT_CHECKPOINT_PATH = path.join(BACKUP_DIR, 'agent-session-checkpoint.db');

function createAgentCheckpoint(force = false) {
  if (!force && fs.existsSync(AGENT_CHECKPOINT_PATH)) return false;
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    if (fs.existsSync(AGENT_CHECKPOINT_PATH)) {
      try { fs.unlinkSync(AGENT_CHECKPOINT_PATH); } catch {}
    }
    db.exec(`VACUUM INTO '${AGENT_CHECKPOINT_PATH.replace(/'/g, "''")}'`);
    return true;
  } catch (e) {
    console.error('Failed to create agent checkpoint:', e.message);
    return false;
  }
}

function revertAgentCheckpoint() {
  if (!fs.existsSync(AGENT_CHECKPOINT_PATH)) {
    throw new Error('No agent session checkpoint found to revert to');
  }
  snapshotBeforeDestructive();
  const tables = ['characters', 'poses', 'scenarios', 'personalities', 'presets', 'chats', 'settings'];
  try {
    db.exec(`ATTACH DATABASE '${AGENT_CHECKPOINT_PATH.replace(/'/g, "''")}' AS snap`);
    db.exec('PRAGMA foreign_keys = OFF; BEGIN TRANSACTION;');
    for (const t of tables) {
      db.exec(`DELETE FROM ${t}; INSERT INTO ${t} SELECT * FROM snap.${t};`);
    }
    db.exec('COMMIT; PRAGMA foreign_keys = ON; DETACH DATABASE snap;');
    clearAgentChanges();
    return { ok: true };
  } catch (e) {
    try { db.exec('ROLLBACK;'); } catch {}
    try { db.exec('PRAGMA foreign_keys = ON; DETACH DATABASE snap;'); } catch {}
    throw new Error('Failed to revert agent checkpoint: ' + e.message);
  }
}

function addAgentChange({ action, entityType = '', entityId = '' }) {
  createAgentCheckpoint(false);
  db.prepare('INSERT INTO agent_session_changes (action, entity_type, entity_id, created_at) VALUES (?, ?, ?, ?)')
    .run(String(action), String(entityType), String(entityId), Date.now());
}

function getAgentChanges() {
  return db.prepare('SELECT * FROM agent_session_changes ORDER BY created_at ASC').all();
}

function clearAgentChanges() {
  db.exec('DELETE FROM agent_session_changes');
  if (fs.existsSync(AGENT_CHECKPOINT_PATH)) {
    try { fs.unlinkSync(AGENT_CHECKPOINT_PATH); } catch {}
  }
}

module.exports = {
  bootstrap: () => ({ characters: getCharacters(), personalities: getPersonalities(), settings: getSettings(), presets: getPresets(), scenarios: getScenarios() }),
  getCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter,
  getScenarios, getScenario, createScenario, updateScenario, deleteScenario, isCharacterAllowedForScenario,
  createChat, getChat, deleteChat, renameChat,
  getTree, treeTip, pathNodes, addNode, addReply, editNode, deleteNode, switchNode, poseBefore, poseAtTip, activeChildId, insertOocNode,
  getPersonalities, getPersona, createPersona, updatePersona, deletePersona,
  getPresets, getPreset, createPreset, updatePreset, deletePreset,
  getPoses, getPose, createPose, updatePose, deletePose, setChatPose, ensureDefaultPoses, getDefaultPose, setDefaultPose,
  getSettings, updateSettings,
  exportData, importData,
  getAgentMessages, addAgentMessage, clearAgentMessages, agentMessageCount,
  addAgentAttachment, getAgentAttachment, countAgentAttachments,
  createAgentCheckpoint, revertAgentCheckpoint, addAgentChange, getAgentChanges, clearAgentChanges,
};