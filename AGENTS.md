# AGENTS.md

Instructions, architecture guide, and operational conventions for AI agents and developers working in `ZeroChat`.

---

## 1. Project Overview & Philosophy

`ZeroChat` is a lightweight, zero-dependency, self-hosted web application for roleplaying with AI characters. It provides multi-character chat threads, persona switching, branching conversation trees, an AI-driven dynamic visual pose/expression director, and common JSON backup/export/import.

### Core Architectural Principles
1. **Zero External Dependencies**:
   - The backend runs entirely on modern Node.js built-ins (`node:sqlite`, `http`, `fs`, `os`, `path`).
   - There are **no npm dependencies** in `package.json` (no Express, no ORMs, no external SQLite wrappers).
   - Never add third-party npm packages unless explicitly instructed by the user.
2. **Vanilla Web Frontend**:
   - Built with standard ES6+ JavaScript, semantic HTML5, and modern CSS3.
   - No frontend framework (no React, Vue, Svelte), no bundler, no transpiler (no Webpack, Vite, Babel, Tailwind).
   - Edits take effect immediately upon browser refresh.
3. **Local-First & Data Durability**:
   - Conversations, characters, presets, settings, and image assets are stored locally in an embedded SQLite database (`aichat.db`).
   - WAL (Write-Ahead Logging) mode and automatic snapshot backups protect user data against corruption and accidental deletion.

---

## 2. Tech Stack & Runtime Requirements

- **Runtime**: Node.js **>= 22.5.0** (required for the native `node:sqlite.DatabaseSync` module).
- **Environment**: Linux / macOS / Windows with standard POSIX or Node runtime.
- **Port & Networking**:
  - Default port: `3000` (configurable via `PORT` environment variable).
  - Default bind: `0.0.0.0` (all network interfaces, accessible across local network).
  - Bind loopback only: Set `HOST=127.0.0.1`.
- **Scripts**:
  - Start server: `npm start` or `node server.js`
  - Syntax check: `node -c server.js db.js app.js`

---

## 3. Repository Structure & File Map

```text
~/ZeroChat
├── package.json     # Project metadata and start script (0 dependencies)
├── .gitignore       # Ignores aichat.db*, backups/, and node_modules/
├── README.md        # User documentation, feature overview, and quickstart
├── migrate-scenarios.js # Database migration script: backups DB & splits characters and scenarios
├── server.js        # Native HTTP server, REST/SSE routing, LLM streaming & pose agent
├── db.js            # SQLite database schema, tree management, backups, export/import
├── index.html       # Single-page application markup and tabbed modal dialogs
├── app.js           # Client-side state, UI rendering, branch navigation, SSE stream consumer
├── styles.css       # Complete dark-mode design system, glassmorphism, responsive styles
└── AGENTS.md        # Agent and developer guidelines (this document)
```

### Detailed Component Roles
- **`server.js`**:
  - Custom HTTP router with MIME handling and path traversal protection for static files.
  - REST API endpoints for characters, chats, tree nodes, poses, personalities, presets, settings, export, and import.
  - Server-Sent Events (SSE) streaming endpoints (`/api/chats/:id/messages`, `/api/chats/:id/generate`).
  - LLM client integrations for OpenAI-compatible APIs (`/v1/chat/completions`) and Anthropic (`/v1/messages`).
  - Dynamic Pose Director Agent (`runPoseAgent`) using Jev (a fast, low-cost decision model via OpenRouter Decisions API or custom OpenAI-compatible provider) to select matching character poses.
- **`db.js`**:
  - `DatabaseSync` initialization, WAL configuration, and graceful checkpointing on shutdown.
  - Database snapshot backup engine: automated backups to `backups/` on startup and prior to destructive actions.
  - Chat tree data structures, tree path algorithms (`pathNodes`, `treeTip`, `poseOnPath`, `activeChildId`).
  - Universal Export/Import engine (`exportData`, `importData`) supporting JSON card backups.
  - Idempotent database seeder (`seedIfEmpty`) providing demo characters and conversations without collision.
- **`index.html`**:
  - Semantic SPA layout: `#sidebar` (Characters, Scenarios, Personas), `#welcome`, `#chat-view`, `#chat-header`, `#composer`.
  - Consolidated header with character details, chats drawer pill, active persona badge, and settings button.
  - Tabbed modal dialogs: `#modal-settings` (AI Connection, Visuals & Poses, Presets, Backup & Data), `#modal-persona`, `#modal-char`, `#modal-poses`, `#modal-crop`, `#modal-preset`, `#modal-scenario`, `#modal-pick-scenario`, `#modal-pick-char`.
- **`app.js`**:
  - Client state store (`state = { characters, personalities, presets, settings, poses }`).
  - Auto-growing textareas with mobile touch-friendly drag resize handles.
  - Steer Scene (OOC) directive flow and waiting directive banner.
  - Branch navigation controls (`< x / y >`) for editing and regenerating message trees.
  - Dynamic background pose renderer and canvas-based avatar/pose image cropper.
- **`styles.css`**:
  - Modern dark aesthetic with CSS variables (`--bg`, `--accent`, `--act-dim`, etc.).
  - Responsive layout for desktop and mobile with non-overflowing tab bars.

---

## 4. Key Subsystems & Architecture

### 4.1 Chat Tree Branching System
Chats are not flat message lists; each chat contains a tree represented as JSON in `chats.tree`:
```json
{
  "nodes": {
    "root": { "id": "root", "role": "root", "children": ["node-1"], "active": 0 },
    "node-1": {
      "id": "node-1",
      "role": "user",
      "content": "Hello",
      "parent": "root",
      "children": ["node-2", "node-3"],
      "active": 1,
      "createdAt": 1700000000000
    }
  }
}
```
- **Node Roles**: `root`, `scenario`, `user`, `char`, `injection` (OOC directive).
- **Branch Operations**:
  - **Edit**: Creates a new sibling node, re-parents downstream subtree to the new variant, and updates `parent.active`.
  - **Regenerate**: Attaches a new child variant to the parent prompt and sets it as active.
  - **Delete**: Prunes the target node and its entire subtree, re-adjusting parent active bounds.
  - **Switch**: Changes `parent.active` index between alternative variants.

### 4.2 Dynamic Pose Director Agent (Jev Decision Model)
Characters have multiple poses (`poses` table) containing an image and descriptive guidance (e.g., *Sitting*, *Close-up*, *Leaning in*).
- **Trigger**: During reply streaming, `runPoseAgent(...)` runs asynchronously to select the matching shot.
- **Decision Engine**: Instead of an expensive, slow full-blown LLM with tool calling, the agent uses **Jev**, a fast, low-cost System One decision model specializing in choosing an option based on text input.
- **Pose Stamps on Nodes**: When a pose changes, `node.poseId` is saved on the character's reply node.
- **Branch-Accurate Reverts**: Visual poses revert accurately when navigating branches or deleting messages.

### 4.3 Clean Composer & Steer Scene (OOC)
- Normal chat input sends messages directly to the character (`sendUser`).
- Clicking the Steer button toggles OOC mode (`setSteerMode(true)`), tinting the input and sending a directive (`sendInjection`).
- When a directive is pending, a clear banner alerts the user with a direct button to trigger the reply (`generateReplyAt`).
- Textareas automatically grow to fit text up to a threshold, and provide a dedicated touch-drag handle for effortless resizing on mobile touchscreens.

### 4.4 Universal JSON Export & Import
- Endpoints: `GET /api/export` and `POST /api/import`.
- Exports characters, poses (with images), scenarios, and scenario variable configurations.
- Compatible with single character cards and full backups.
- Imports execute inside SQLite database transactions with automatic snapshot protection.

---

## 5. Development Guidelines & Rules for Agents

When contributing to this codebase, adhere to the following rules:

1. **Maintain Zero Dependencies**:
   - Do NOT run `npm install <package>`.
   - Use Node.js built-ins (`crypto`, `http`, `fs`, `path`, `node:sqlite`).
2. **Schema Alterations**:
   - Never drop tables or make destructive schema migrations.
   - Use `ensureColumn(table, col, ddl)` in `db.js` for adding non-breaking columns with sensible defaults.
3. **Data Protection Invariants**:
   - Any new destructive operation (such as batch deletes or resets) MUST call `snapshotBeforeDestructive()` before executing SQL.
4. **Chat Tree Invariants**:
   - The `root` node must never be removed.
   - Every node must have a valid `parent` (except `root`).
   - `parent.children` must contain valid node IDs.
   - `parent.active` must stay within `0 <= active < parent.children.length`.
5. **Code Style**:
   - JavaScript: Modern ES6+ standard syntax.
   - Avoid build steps; all files must run directly in Node or evergreen browsers.
6. **Verification Checklist**:
   - Check JavaScript syntax: `node -c server.js db.js app.js`.
   - Verify server startup and cleanly shut down without WAL lock issues.
