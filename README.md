# ZeroChat 🎭

> **Lightweight, zero-dependency, self-hosted web application for roleplaying with AI characters.**

ZeroChat combines branching conversation trees, multi-persona management, decoupled scenario scenes, and an AI-driven dynamic visual pose/expression director—all running locally with zero external npm dependencies.

---

## ✨ Features

- **Zero External Dependencies**:
  Runs purely on modern Node.js built-ins (`node:sqlite`, `http`, `crypto`, `fs`). No `node_modules`, no bundlers, no external ORMs.
- **Dynamic Visual Pose Director**:
  Characters change visual poses and expressions automatically based on the conversation, powered by the fast, low-cost **Jev** decision model. Visual poses revert accurately when switching or deleting branches.
- **Branching Conversation Trees**:
  Non-linear dialogue trees allow you to edit previous messages, regenerate replies, and seamlessly flip through alternative branch versions (`< 1 / 3 >`).
- **Clean, Modern & Responsive UI**:
  - **Consolidated Navigation**: Character profile and chat history drawer on the left; active persona switcher and settings on the right.
  - **Tabbed Progressive Settings**: Clean tabs for AI Connection, Visuals & Poses, Presets, and Data Backup. Advanced settings stay neatly tucked behind friendly disclosures.
  - **Personas in Sidebar**: Quickly switch identities or create new personas directly from the sidebar.
  - **Plain-Language Steer Mode (OOC)**: Easily direct the scene out-of-character with a single toggle and clear directive alerts.
  - **Touch-Friendly Auto-Expanding Textareas**: Input boxes automatically adjust to text length and provide smooth drag handles on mobile touchscreens.
- **Universal JSON Export & Import**:
  Export or import complete backups, individual character cards (including artwork poses), scenarios, and custom variables in a clean, standard JSON format.
- **Local-First & Data Durability**:
  All conversations, characters, and assets are stored in an embedded SQLite database (`aichat.db`) with Write-Ahead Logging (WAL) and automated snapshot backups in `backups/`.

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
   Navigate to [http://localhost:3000](http://localhost:3000) (or accessible across your local network via your machine's IP).

---

## ⚙️ Configuration & AI Providers

ZeroChat works right out of the box with sample characters and simulated responses. When you are ready for live AI roleplay, open **Settings** (⚙️) to connect your favorite provider:

- **OpenRouter** (Recommended): Access 400+ models with a single API key.
- **OpenAI**: Compatible with `gpt-4o` and other OpenAI models.
- **Anthropic**: Compatible with Claude models (`claude-3-5-sonnet`, etc.).
- **Ollama**: Connect to local models running on your machine without an API key.
- **Custom / Local**: Compatible with any OpenAI-compatible `/v1` endpoint (LM Studio, vLLM, text-generation-webui).

---

## 📁 Project Structure

```text
ZeroChat/
├── package.json         # Scripts and project metadata (0 npm dependencies)
├── server.js            # Native HTTP server, REST & SSE streaming, pose director
├── db.js                # SQLite database, tree operations, backups, export/import
├── index.html           # SPA semantic layout, responsive drawers, tabbed modals
├── app.js               # Client state, dynamic rendering, branch navigation
├── styles.css           # Dark theme design system, glassmorphism, responsive styles
├── AGENTS.md            # Architecture notes and guidelines for developers & agents
└── README.md            # This documentation
```

---

## 🛠️ Development

- **Syntax check**:
  ```bash
  node -c server.js db.js app.js
  ```
- **Custom port or host**:
  ```bash
  PORT=8080 HOST=127.0.0.1 node server.js
  ```

---

## 📄 License

MIT License. Free and open source for personal and community use.
