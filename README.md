# ZeroChat 🎭

> **A self-hosted AI roleplay app with zero npm dependencies — branch your story, direct the visuals, and let a built-in AI agent build the rest.**

ZeroChat is a single lightweight web application for roleplaying with AI characters. Everything runs locally in one Node.js process: an embedded SQL database, a streaming server, and a vanilla-JS frontend. No `node_modules`, no build step, no tracking — clone and run.

---

## ✨ Features

### Roleplay core
- **Branching conversation trees** — edit any previous message, regenerate replies, and flip through alternative branches (`< 1 / 3 >`). Every message node can fork; downstream replies fork with it. Trimming or switching branches is always reversible and re-parents safely.
- **Shift the scene without leaving character (Steer / OOC)** — a dedicated OOC mode tints the composer and sends a waiting directive that the character's next reply incorporates, either automatically or on demand.
- **Personas** — play as multiple identities of *yourself*; switch instantly from the header pill or the sidebar. Personas have their own avatar artwork, private notes and (optionally) an image standing next to your messages.
- **Scenarios with `{{variables}}`** — scenarios are standalone scene texts you can attach to any chat. Concrete details (outfits, places, moods, numbers) become `{{tags}}`; every character can fill them with its own values (per-character values override character-wide defaults). Tags without a value stay visible so you never silently miss one.
- **Reactive replies & memories** — characters can define up to 12 example lines that tell the model how they speak, plus a private note the roleplay model never sees.
- **Markdown & safe rendering** — chat replies render markdown (bold, italics, quotes, code) with all input escaped; the agent drawer uses a richer renderer (tables, lists, code fences).

### Visuals
- **Dynamic pose director** — give a character multiple poses/images and a low-cost decision model (**Jev**) picks the matching shot live as the conversation moves: standing, sitting, close-up, leaning in... The background painterly view swaps along with it (adjustable opacity/blur/action dimming). Poses revert correctly when you walk branches back — each message stores the pose that was active.
- **Built-in image cropper** — portraits and pose images are cropped, rotated and thumbnailed right in the browser (square avatar + full artwork with one flow, touch friendly).
- **Composited backgrounds** — the active pose image becomes the chat backdrop with soft dimming for readability.

### Built-in AI Build Agent (side drawer)
A pocket product manager that sees your whole site and can *actually do the work*:
- **Full-set workflow** — proposes a character → waits for approval → creates it → iterates with you → drafts the scenario as plain prose → splits it into a scaffold + `{{variables}}` and shows the table → creates everything and wires the values. Every step needs your OK.
- **Runs everything with tools** — character/scenario/persona/preset CRUD, variable merging, live site overview. It never invents ids and never mutates without approval.
- **Images end-to-end** — generate portraits and pose images (`generate_image`), edit them with instructions ("make it evening, warmer light") via `edit_image`, attach your own reference images with the paperclip and have the Agent apply them as portrait or poses (`apply_image`), or build a whole multi-pose character including art. Images show as cards in the drawer; oversized tool payloads degrade gracefully instead of corrupting model context.
- **Its own model, if you want** — point the Agent at a separate provider/model (a fast, cheap one for tool calls), configurable per-field in Settings, while images can use their own generation/edit models.
- **Markdown tool cards** — every action appears as an expandable card with shortcuts ("Open chat", "Poses", "Edit scenario").

### Configuration & data
- **AI presets** — bundle provider + model + temperature + system prompt into switchable presets and flip them live from the header (or the phone's ⋯ menu). Perfect for A/B-testing roleplay models.
- **Providers** — OpenRouter, OpenAI, Anthropic, Ollama and any OpenAI-compatible `/v1` endpoint (LM Studio, vLLM, ...). Streaming replies, tool calling, image endpoints.
- **Everything stays local** — conversations, trees, images and settings live in an embedded SQLite database (`aichat.db`) with WAL journaling. Automated snapshot backups (on startup and before every destructive action) go to `backups/`.
- **Universal export & import** — one JSON format covers full backups, single character cards (including poses and artwork) and scenarios; imports run inside a transaction with a snapshot taken first.
- **Responsive, dependency-free UI** — dark glassmorphism design that works equally well on a desktop and a phone: the mobile header folds persona, presets and editing into one ⋯ menu, drawers replace popups, textareas auto-grow with touch-friendly drag handles, and modals are always custom (no browser dialogs anywhere).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js >= 22.5.0** (required for the built-in `node:sqlite` module).

### Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SGrzegorzgh/ZeroChat.git
   cd ZeroChat
   ```

2. **Start the server** (no `npm install` needed!):
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) (or across your local network via your machine's IP).

4. **Connect an AI (optional)** — open **Settings → AI Connection** and enter a key for your provider. Until then the app runs in simulated sample mode. For the Agent's image powers, an OpenAI-compatible provider with image support is needed (see below).

---

## ⚙️ Configuration & AI Providers

| Provider | Chat | Agent | Images (generate / edit) |
|---|---|---|---|
| OpenRouter | ✅ | ✅ | ✅ via compatible image endpoints |
| OpenAI | ✅ | ✅ | ✅ (`dall-e-3` / `gpt-image-1`) |
| Anthropic | ✅ | ✅ | portrait/pose application only |
| Ollama | ✅ | ✅ | depends on your models |
| Custom OpenAI-compatible | ✅ | ✅ | ✅ if the endpoint implements it |

- **Roleplay preset**: Settings → AI Connection (or create/edit presets in the AI Presets tab; switch them from the header pill).
- **Agent connection**: Settings → AI Connection → *Give the Agent its own model & provider*.
- **Agent image models**: Settings → AI Connection → *Agent images* — `Agent image model` (generation, default `dall-e-3`) and `Agent image-edit model` (editing, default `gpt-image-1`). Editing uses the standard `POST /images/edits` multipart endpoint.
- **Visual director**: Settings → Visuals & Poses — enable it, tune the swap sensitivity, context window and (optionally) a dedicated Jev decision provider.

---

## 📁 Project Structure

```text
ZeroChat/
├── package.json         # Scripts and project metadata (0 npm dependencies)
├── server.js            # Native HTTP server, REST & SSE streaming, pose director, agent tool loop
├── db.js                # SQLite database, tree operations, backups, export/import, agent log
├── index.html           # SPA semantic layout, responsive drawers, tabbed modals
├── app.js               # Client state, dynamic rendering, branch navigation, agent drawer
├── styles.css           # Dark theme design system, glassmorphism, responsive styles
├── AGENTS.md            # Architecture notes and guidelines for developers & agents
└── README.md            # This documentation
```

---

## 🛠️ Development

- **Syntax check** (no build step — files run directly):
  ```bash
  node -c server.js db.js app.js
  ```
- **Custom port or host**:
  ```bash
  PORT=8080 HOST=127.0.0.1 node server.js
  ```
- **Conventions**: see `AGENTS.md` — zero-dependency rule, SQLite tree invariants, backup-before-destructive and custom-dialog rules.

---

## 📄 License

MIT License. Free and open source for personal and community use.
