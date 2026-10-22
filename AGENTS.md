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
├── server.js       # Native HTTP server, REST/SSE routing, LLM streaming & pose agent & build agent
├── db.js           # SQLite database schema, tree management, backups, export/import
├── index.html       # Single-page application markup and tabbed modal dialogs
├── app.js           # Client-side state, UI rendering, branch navigation, SSE stream consumer & agent drawer
├── styles.css       # Complete dark-mode design system, glassmorphism, responsive styles
└── AGENTS.md        # Agent and developer guidelines (this document)
```

### Detailed Component Roles
- **`server.js`**:
  - Custom HTTP router with MIME handling and path traversal protection for static files.
  - REST API endpoints for characters, chats, tree nodes, poses, personalities, presets, settings, export, and import.
  - Server-Sent Events (SSE) streaming endpoints (`/api/chats/:id/messages`, `/api/chats/:id/generate`, `/api/agent/chat`).
  - LLM client integrations for OpenAI-compatible APIs (`/v1/chat/completions`) and Anthropic (`/v1/messages`).
  - Dynamic Pose Director Agent (`runPoseAgent`) using Jev (a fast, low-cost decision model via OpenRouter Decisions API or custom OpenAI-compatible provider) to select matching character poses.
  - Built-in AI Build Agent: `runAgentChat` tool-calling loop, `agentToolDefs`/`runAgentTool` tool set, `buildAgentSystem` live-context system prompt, and the `/api/agent/*` routes.
- **`db.js`**:
  - `DatabaseSync` initialization, WAL configuration, and graceful checkpointing on shutdown.
  - Database snapshot backup engine: automated backups to `backups/` on startup and prior to destructive actions.
  - Chat tree data structures, tree path algorithms (`pathNodes`, `treeTip`, `poseOnPath`, `activeChildId`).
  - Universal Export/Import engine (`exportData`, `importData`) supporting JSON card backups.
  - Agent conversation log (`agent_messages` table + `getAgentMessages`/`addAgentMessage`/`clearAgentMessages`).
  - Idempotent database seeder (`seedIfEmpty`) providing demo characters and conversations without collision.
- **`index.html`**:
  - Semantic SPA layout: `#sidebar` (Characters, Scenarios, Personas), `#welcome`, `#chat-view`, `#chat-header`, `#composer`.
  - Consolidated header with character details, chats drawer pill, active persona badge, AI preset pill, and settings button; on small phones (≤560px) persona/preset/edit fold into a "⋯" overflow menu (`#more-wrap`) while the preset pill stays visible on desktop.
  - Tabbed modal dialogs: `#modal-settings` (AI Connection, Visuals & Poses, Presets, Backup & Data), `#modal-persona`, `#modal-char`, `#modal-poses`, `#modal-crop`, `#modal-preset`, `#modal-scenario`, `#modal-pick-scenario`, `#modal-pick-char`.
- **`app.js`**:
  - Client state store (`state = { characters, personalities, presets, settings, poses }`).
  - Auto-growing textareas with mobile touch-friendly drag resize handles.
  - Steer Scene (OOC) directive flow and waiting directive banner.
  - Branch navigation controls (`< x / y >`) for editing and regenerating message trees.
  - Dynamic background pose renderer and canvas-based avatar/pose image cropper.
  - AI Agent drawer (`#agent-drawer`): SSE tool-card feed, busy/status bar, clear-with-confirm, and site-state refresh after the agent acts.
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

### 4.5 Built-in AI Build Agent
The Agent is a long-running assistant conversation stored in `agent_messages` (one global thread; clearing it snapshots the DB first).
- **Endpoint**: `POST /api/agent/chat` (SSE). Events: `{type:'status'}` (thinking/tool running), `{type:'tool_call', id, name, args}`, `{type:'tool_result', id, name, ok, error, result}`, `{type:'done', text}`, `{type:'error', error}`. Also `GET /api/agent/messages` (full log) and `POST /api/agent/clear`.
- **Context injection**: every turn rebuilds `buildAgentSystem(settings)` — persona, active preset (name/provider/model + its system prompt as the user's roleplay focus), and brief lists of all characters and scenarios — so the agent always reasons over live site state.
- **Tool loop**: non-streaming LLM calls (up to 8 iterations) with native tool calling; OpenAI-compatible via `agentCallOpenAI`, Anthropic via `agentCallAnthropic`. Tool results are sanitized (`sanitizeForModel`) and stored via `capToolResultJson` — a JSON-aware cap that degrades oversized payloads gracefully (trim long strings → shave all strings → preview stub with a note) instead of slicing the JSON, which used to corrupt it and leave the model with an empty tool result on the next turn. Replay is resilient: `agentToolResultText` uses the parsed object, the raw stored string (`toolResultRaw`) when parsing failed, or `""` only as a last resort.
- **Separate Agent connection**: `resolveAgentConfig(settings)` resolves the Agent's runtime connection — by default it follows the active preset (`resolveAiConfig`), but with `agentOverride` on it uses the dedicated `agentProvider`/`agentBaseUrl`/`agentApiKey`/`agentModel` settings (UI: Settings → AI Connection → AI Agent), falling back per-field to the main connection. Used by `runAgentChat`, `agentToolDefs` (image tool gating), `generate_image` and `edit_image`; the drawer header label mirrors it.
- **Tools**: site overview, character CRUD (`create_character` etc.), character variables (merge/replace), scenario CRUD, per-scenario `set_scenario_character_variables`, personas (create/update/activate), and image tools — `generate_image` (OpenAI-compatible `/images/generations`; applies to a character portrait or a pose: `target="portrait"|"pose"`, pose matching by name against the seeded default pose set), `edit_image` (`/images/edits` multipart via `multipartBody`, source = last generated / character portrait / pose / attachment), and provider-independent `apply_image` (places a user-attached or last-generated image on portrait/pose). Anthropic presets gate `generate_image`/`edit_image` out. Image model defaults: `agentImageModel` ('dall-e-3') and `agentImageEditModel` ('gpt-image-1'); applying a pose auto-enables `posesEnabled`.
- **Attachments**: the drawer paperclip posts to `POST /api/agent/attach` (data URL ≤6 MB body, downscaled client-side to ≤1536 px); rows live in the `agent_attachments` table and are wiped with `clearAgentMessages`. `runAgentChat` replaces ids with `[attached image: <id> — <name>]` markers inside the stored user message (the model re-reads them, bytes never enter context); the client renders markers as chips via `GET /api/agent/:id/file` (raw bytes). `agentToolResultText` replays sanitized results, where image bytes are the placeholder string — tool cards must not render that as `<img>`.
- **Workflow protocol**: the system prompt encodes the full-set pipeline — (1) propose character → approve → create, (2) revision/image round, (3) full scenario draft in plain prose, (4) split into scaffold + {{tag}} table and show the variable values, (5) create the scenario and wire character variables. The agent must never create, update, or delete without explicit user approval and must never invent ids.
- **Client**: an off-canvas right drawer (`body.agent-open`, z-index 90, same scrim pattern as `#sidebar`). Tool calls render as expandable cards with "Open chat / Edit" shortcuts; after each agent turn the client re-bootstraps so sidebars stay in sync. The composer has a paperclip (`agentAttachFiles`) with attachment chips; user rows carry `[attached image: …]` markers rendered as chips by `agentUserHtml`.

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
