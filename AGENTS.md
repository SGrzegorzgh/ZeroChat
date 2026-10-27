# AGENTS.md

Instructions, architecture guide, and operational conventions for AI agents and developers working in `ZeroChat`.

---

## 1. Project Overview & Philosophy

`ZeroChat` is a lightweight, zero-dependency, self-hosted web application for roleplaying with AI characters. It provides multi-character chat threads, persona switching, branching conversation trees, an AI-driven dynamic visual pose/expression director, signature scenarios, and universal JSON backup/export/import.

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
4. **Monochrome Design System**:
   - UI navigation, tabs, action buttons, and modal dialogs use clean, monochrome SVG icons matching the design aesthetic rather than colored emoji glyphs.

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
  - Built-in AI Build Agent: `runAgentChat` tool-calling loop, `agentToolDefs`/`runAgentTool` tool set, `buildAgentSystem` live-context system prompt, and `/api/agent/*` routes.
- **`db.js`**:
  - `DatabaseSync` initialization, WAL configuration, and graceful checkpointing on shutdown.
  - Database snapshot backup engine: automated backups to `backups/` on startup and prior to destructive actions.
  - Chat tree data structures, tree path algorithms (`pathNodes`, `treeTip`, `poseOnPath`, `activeChildId`).
  - Universal Export/Import engine (`exportData`, `importData`) supporting JSON card backups.
  - Agent conversation log (`agent_messages` table + `getAgentMessages`/`addAgentMessage`/`clearAgentMessages`).
  - Idempotent database seeder (`seedIfEmpty`) providing demo characters and conversations without collision.
- **`index.html`**:
  - Semantic SPA layout: `#sidebar` (Characters, Scenarios, Personas), `#welcome`, `#chat-view`, `#chat-header`, `#composer`.
  - Consolidated header with character details, chats drawer pill, active persona badge, AI preset pill, and settings button.
  - Tabbed modal dialogs: `#modal-settings` (AI Connection, Visuals & Poses, Presets, Backup & Data, Features), `#modal-persona`, `#modal-char`, `#modal-poses`, `#modal-crop`, `#modal-preset`, `#modal-scenario`, `#modal-pick-scenario`, `#modal-pick-char`.
- **`app.js`**:
  - Client state store (`state = { characters, personalities, presets, settings, poses }`).
  - Auto-growing textareas with touch-friendly drag resize handles.
  - Steer Scene (OOC) directive flow, "Respond as me", and the interactive response banner.
  - Branch navigation controls (`< x / y >`) for editing and regenerating message trees.
  - Dynamic background pose renderer and canvas-based avatar/pose image cropper.
  - AI Agent drawer (`#agent-drawer`): SSE tool-card feed, busy/status bar, clear-with-confirm, and site-state refresh.
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
- **Node Roles**: `root`, `scenario`, `user`, `char`, `injection` (OOC directive), `summary` (compacted narrative overview).
- **Branch Operations**:
  - **Edit**: Creates a new sibling node, re-parents downstream subtree to the new variant, and updates `parent.active`.
  - **Regenerate**: Attaches a new child variant to the parent prompt and sets it as active.
  - **Delete**: Prunes the target node and its entire subtree, re-adjusting parent active bounds.
  - **Directives Exception**: Directives (`injection` nodes) are spliced out instead of pruning downstream nodes; their children re-attach to the parent, preserving the subsequent conversation.
  - **Switch**: Changes `parent.active` index between alternative variants.

### 4.2 Dynamic Pose Director & Background Display
Characters support multiple poses (`poses` table) containing an image and descriptive guidance (e.g., *Sitting*, *Close-up*, *Leaning in*).
- **Trigger**: During reply streaming, `runPoseAgent(...)` runs asynchronously to select the matching pose.
- **Decision Engine**: Uses **Jev**, a fast, low-cost System One decision model specializing in selecting options based on text input.
- **Pose Stamps on Nodes**: When a pose changes, `node.poseId` is saved on the character's reply node for branch-accurate visual reverts.
- **Background Modes**: Group chats can split the backdrop between characters (`split-tb` = top/bottom, `split-lr` = left/right) with `bgFit` controlling `cover` vs `contain`. One-character views render un-cropped. Controls live in the header quick-menu (`#bg-wrap`/`#bg-menu`).

### 4.3 Composer, Steer Scene (OOC), & "Respond as Me"
- **Normal Input**: Typing sends messages directly to the character (`sendUser`).
- **Composer Actions Menu (⚡)**: Opens a popover (`renderComposerActionsMenu`) with:
  - **Steer scene (OOC)**: Arms directive mode (`setSteerMode`, tinted input, `sendInjection`).
  - **Respond as me**: Generates a first-person user response (`respondAsMe`, input text serves as guidance). Prompts strictly enforce first-person narration ("I", "me", "my"), never third-person narration ("*{{user}} smiles*").
- **Interactive Response Banner (`#composer-directive-bar`)**:
  - Appears whenever the active conversation branch ends with an unreplied node:
    - **Directive waiting** (amber bar): Shows `I.zap` icon, directive status, and `Generate reply now ➔`.
    - **Response ready** (blue bar): Shows `I.user` icon, response readiness, a **Regenerate** button to regenerate an alternative user message variant, and `Generate reply now ➔` to prompt the character (or group) response.
  - Automatically hides once generation starts or a character reply is added.
- **Sidebar & Textarea Resizing**:
  - Left sidebar resizes on desktop via drag handle (`#sidebar-resize-handle`, width persisted in `localStorage`).
  - Textareas auto-grow and provide touch-drag handles (`.touch-resize-handle`).

### 4.4 Signature Scenarios & Scenario Management
- **Signature Scenarios**:
  - Configurable directly within Character Edit (`#modal-char`) with Edit and Preview tabs and touch-resize handles.
  - Bound exclusively to that specific character (`characters.scenario`).
  - Does **not** appear in the global Scenarios tab (`#panel-scenarios`), keeping it private to the character.
  - Strictly limited to `{{char}}` and `{{user}}` variables; custom variables are ignored and not evaluated.
  - Selected by default in the scenario picker modal (`#modal-pick-scenario`).
- **Global Scenarios**:
  - Shared across characters, supporting custom `{{tag}}` variable substitution matrices and special notes.
- **Variable Expansion**:
  - Handled via `expandPromptMacros` across all generation routes (`/messages`, `/generate`, `/generate-scenario`, `/generate-group-scenario`, `/assist-scenario`, `/ai-edit`).
  - Supports common aliases: `{{char}}`, `{{character}}`, `{{bot}}`, `{{char_name}}`, `{{user}}`, `{{persona}}`, `{{user_name}}`.

### 4.5 Built-in AI Build Agent
Long-running assistant conversation stored in `agent_messages` (persisted thread; clearing snapshots the DB first).
- **Endpoint**: `POST /api/agent/chat` (SSE). Delivers events: `delta`, `status`, `tool_call`, `tool_result`, `done`, `error`.
- **Live Context Injection**: Every turn calls `buildAgentSystem(settings)`, injecting persona, active preset writing rules, presets library overview, and characters/scenarios rosters.
- **Tool-Calling Loop**: Supports up to 8 iterations with live delta streaming (`agentCallOpenAI` / `agentCallAnthropic`), graceful fallback to non-streaming retries, and JSON-aware result capping (`capToolResultJson`).
- **Tools**:
  - `site_overview`, `list_characters`, `get_character`, `create_character`, `update_character`, `set_character_variables`, `delete_character`.
  - `set_signature_scenario`: Dedicated tool for managing character signature opening scenes.
  - `list_scenarios`, `get_scenario`, `create_scenario`, `update_scenario`, `set_scenario_character_variables`, `delete_scenario`.
  - `list_personas`, `create_persona`, `update_persona`, `set_active_persona`.
  - `list_presets`, `get_preset`.
  - `read_chat`: Reads open chat or specified `chat_id` in `linear` (transcript) or `tree` (branches) modes with pagination (`start`/`limit`).
  - `generate_image`, `edit_image`, `apply_image`: Image generation, editing, and portrait/pose application.
- **Session Checkpoints & Rollbacks**:
  - Atomic database checkpoint (`agent-session-checkpoint.db`) taken before the first mutation.
  - Turn checkpoints (`agent-turn-${msgId}.db`) track per-turn mutations for granular rollback on delete or regenerate.
- **Multimodal Attachments & Vision**:
  - Supports image uploads via drawer paperclip, drag-and-drop, and clipboard paste (`POST /api/agent/attach`).
  - Normalized client-side (scaled to ≤1536px, WebP/PNG) and passed to vision-capable models as native vision blocks.

### 4.6 Multi-Character Group Chats & Turn Orchestration
- **Creation (`POST /api/chats`)**:
  - Supports 2 or more characters (`chats.character_ids`).
  - Supports open scenes and AI-generated multi-character opening scenes featuring all participants.
  - AI-generated openings return `{ scenario, messages }` splicing individual character opening turns into the tree.
  - **AI Assisted Scenario Generator** (`🪄` card in scenario picker) provides collaborative draft generation and refinement.
- **Single-Request Whole-Turn Generation (`runGroupTurn`)**:
  - Generates the entire character turn in one LLM request as tagged beats (e.g. `[Luna] *smiles* "Hello"`, `**Rex:** *nods* "Hey"`).
  - Streamed live through `createGroupTurnParser`, which tokenizes character names and respects line boundaries to prevent mid-dialogue splits.
  - Emits `next_char`, `delta`, and `reply_saved` events, persisting each beat as an independent tree node.
  - First beat belongs to the chat's primary character; subsequent speakers dynamically update avatars and badges.
- **Narration Person Convention**:
  - Action/narration between asterisks is written from outside the character (character is "she"/"he"/name, user is "you").
  - Spoken dialogue inside double quotes uses first person "I".
- **Regeneration**:
  - Regenerating rewinds to the turn start (`groupAnchorId`) and re-runs the whole group turn in one call.
  - Manual "Let [Name] speak" retains the single-reply path (`generateReplyStream`).

### 4.7 Long Chat Compaction & Auto-Titling
- **Long Chat Context Limits (`longChatStrategy`)**:
  - `nothing`: Retains full history.
  - `compact`: Summarizes earlier messages into a `summary` node after the opening scene once token threshold is reached.
  - `delete`: Prunes oldest messages following the opening scene node.
- **Auto Title Generation**: Automatically triggers concise title generation after `autoTitleInterval` turns or `autoTitleIdleMinutes` idle period.
- **On-the-Fly AI Editing**: Rewrite character messages with instructions via inline prompt box (`POST /api/chats/:id/nodes/:nodeId/ai-edit`).

### 4.8 Feature Toggles & Settings
Settings include dedicated tabs for:
- **AI Connection**: Provider credentials, model selection, reasoning effort, and Agent connection overrides.
- **Visuals & Poses**: Pose director settings, likelihood, and recheck intervals.
- **AI Presets**: Writing style instructions, temperature, and provider configurations.
- **Backup & Data**: Full JSON export and transaction-protected import with automatic database snapshots.
- **Features**: Individual feature toggles for AI Agent, AI response editing, auto-titling, long chat compaction, and multi-character group turns.

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
   - Keep icons monochrome SVG conforming to the existing UI icon set.
   - Avoid build steps; all files must run directly in Node or evergreen browsers.
6. **Verification Checklist**:
   - Check JavaScript syntax: `node -c server.js db.js app.js`.
   - Verify server startup and cleanly shut down without WAL lock issues.
