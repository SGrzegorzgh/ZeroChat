#!/usr/bin/env node
/**
 * Database Migration Script: Split Characters and Scenarios
 *
 * This script:
 * 1. Safely creates a timestamped snapshot backup of aichat.db in backups/
 * 2. Creates the `scenarios` table if it does not exist
 * 3. Ensures `scenario_id` column exists in the `chats` table
 * 4. Extracts scenarios from existing characters into first-class scenario records
 * 5. Configures scenarios with access_mode = 'all' so every character can access every scenario
 * 6. Associates existing chats with their corresponding scenario
 * 7. Safely clears the legacy character scenario field to complete the decoupling
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'aichat.db');
const BACKUP_DIR = path.join(__dirname, 'backups');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function backupDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('[backup] No existing database found at ' + DB_PATH + '; skipping backup.');
    return null;
  }
  ensureDir(BACKUP_DIR);

  // Checkpoint WAL first so all uncommitted transactions are flushed
  try {
    const tempDb = new DatabaseSync(DB_PATH);
    tempDb.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    tempDb.close();
  } catch (e) {
    console.warn('[backup] WAL checkpoint warning:', e.message);
  }

  const now = new Date();
  const stamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const backupBase = path.join(BACKUP_DIR, `aichat-pre-scenario-migration-${stamp}.db`);

  fs.copyFileSync(DB_PATH, backupBase);
  console.log(`[backup] Database backed up to: ${backupBase}`);

  for (const suffix of ['-wal', '-shm']) {
    const src = DB_PATH + suffix;
    if (fs.existsSync(src)) {
      const stat = fs.statSync(src);
      if (stat.size > 0) {
        fs.copyFileSync(src, backupBase + suffix);
        console.log(`[backup] Copied ${suffix} journal file.`);
      }
    }
  }

  return backupBase;
}

const DEFAULT_TITLES = {
  'c-luna': {
    title: 'Silvermoon Academy Library',
    desc: 'Candlelight, rain against tall windows, and a forbidden grimoire in the west wing library.',
  },
  'c-rex': {
    title: 'Starship Vanguard Bridge',
    desc: 'The hum of hyperspace engines and a scarred captain plotting the dangerous run to Kepler-9.',
  },
  'c-sakura': {
    title: 'Hana Café',
    desc: 'Warm lights, the aroma of cinnamon, and stepping out of a rainy evening into a cozy refuge.',
  },
  'c-marlowe': {
    title: 'Marlowe Investigations',
    desc: 'Rain hammering the frosted office glass, cheap rye on the desk, and a case no one else will touch.',
  },
  'c-ellie': {
    title: 'Robotics Calibration Lab',
    desc: 'Soft pulse of standby lights in the dark lab where an android awakes before scheduled calibration.',
  },
  'c-ember': {
    title: "The Dragon's Hoard",
    desc: 'Heat shimmering off rivers of gold and jewels as an enormous dragon opens one ancient eye.',
  },
};

function deriveTitleAndDesc(c, scenarioText) {
  if (DEFAULT_TITLES[c.id]) {
    return DEFAULT_TITLES[c.id];
  }
  const clean = scenarioText.replace(/^\*+|\*+$/g, '').trim();
  const firstLine = clean.split('\n')[0].trim();
  const desc = firstLine.length > 120 ? firstLine.slice(0, 117) + '...' : firstLine;
  const title = `${c.name}'s Scenario`;
  return { title, desc };
}

function migrate() {
  console.log('=== AI Chat Scenario Decoupling Migration ===\n');

  if (!fs.existsSync(DB_PATH)) {
    console.log(`Database ${DB_PATH} does not exist. Nothing to migrate.`);
    return;
  }

  // Step 1: Backup
  backupDatabase();

  // Step 2: Open DB and ensure schema
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT NOT NULL,
      access_mode TEXT DEFAULT 'all',
      character_ids TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  const chatCols = db.prepare("PRAGMA table_info('chats')").all().map((c) => c.name);
  if (!chatCols.includes('scenario_id')) {
    db.exec('ALTER TABLE chats ADD COLUMN scenario_id TEXT');
    console.log('[schema] Added `scenario_id` column to `chats` table.');
  }

  // Step 3: Extract scenarios from characters
  const charCols = db.prepare("PRAGMA table_info('characters')").all().map((c) => c.name);
  if (!charCols.includes('scenario')) {
    console.log('[migration] Characters table has no scenario column. Schema is already separated.');
    db.close();
    return;
  }

  const chars = db.prepare('SELECT id, name, scenario, created_at FROM characters').all();
  let extractedCount = 0;
  let linkedChatsCount = 0;

  for (const c of chars) {
    const rawScenario = (c.scenario || '').trim();
    if (!rawScenario) continue;

    const { title, desc } = deriveTitleAndDesc(c, rawScenario);
    const scenarioId = 'sc-' + c.id;

    // Check if scenario already exists by ID or title
    const existing = db.prepare('SELECT id FROM scenarios WHERE id = ? OR title = ?').get(scenarioId, title);
    let targetScenarioId = existing ? existing.id : scenarioId;

    if (!existing) {
      db.prepare(`
        INSERT INTO scenarios (id, title, description, content, access_mode, character_ids, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'all', '[]', ?, ?)
      `).run(scenarioId, title, desc, rawScenario, c.created_at || Date.now(), Date.now());
      extractedCount++;
      console.log(`[scenario] Created: "${title}" (${scenarioId})`);
    } else {
      console.log(`[scenario] Found existing scenario: "${title}" (${existing.id})`);
    }

    // Link any chats of this character that don't have scenario_id set
    const updateResult = db.prepare(`
      UPDATE chats SET scenario_id = ?
      WHERE character_id = ? AND (scenario_id IS NULL OR scenario_id = '')
    `).run(targetScenarioId, c.id);

    if (updateResult.changes > 0) {
      linkedChatsCount += updateResult.changes;
      console.log(`[chats] Linked ${updateResult.changes} chat(s) for character "${c.name}" to scenario "${title}"`);
    }

    // Clear scenario from character record to finalize separation
    db.prepare('UPDATE characters SET scenario = ? WHERE id = ?').run('', c.id);
  }

  // Step 4: Finalize & Checkpoint
  db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
  db.close();

  console.log('\n=== Migration Completed Successfully ===');
  console.log(`- Scenarios extracted: ${extractedCount}`);
  console.log(`- Existing chats updated: ${linkedChatsCount}`);
  console.log('- Characters and scenarios are now completely decoupled.');
}

if (require.main === module) {
  try {
    migrate();
  } catch (err) {
    console.error('\n[FATAL] Migration failed:', err);
    process.exit(1);
  }
}

module.exports = { migrate, backupDatabase };
