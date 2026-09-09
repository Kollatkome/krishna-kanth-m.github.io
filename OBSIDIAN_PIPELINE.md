# Automated Obsidian-to-GitHub Portfolio Content Pipeline

A production-ready **"Dump and Compile"** workflow that synchronizes daily markdown notes, technical diagrams, and media attachments directly from your Obsidian vault to your live portfolio website via GitHub Actions.

---

## 🏗️ Architecture Overview

```text
       Obsidian Vault (portfolio-content/)
             │
             │ (Git Commit & Push)
             ▼
       GitHub Repository
             │
             │ (GitHub Actions Trigger)
             ▼
  .github/workflows/auto-publish.yml
             │
             │ (node scripts/build-templates.js)
             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. Media copied to public/assets/weekly/<Week>/<Day>/       │
  │ 2. Obsidian links ![[image.png]] converted to web paths     │
  │ 3. Markdown parsed & compiled to src/content/blogs/Week_XX  │
  │ 4. Structured JSON written to src/data/compiledProtoSem.json│
  │ 5. Unlinked media added to Evidence Vault & Gallery         │
  └─────────────────────────────────────────────────────────────┘
             │
             │ (Commit back [skip ci] & Deploy)
             ▼
  Portfolio Website (ProtoSem Journal & Evidence Vault)
```

---

## 📂 Vault Organization

The vault is located at the root of the repository in the `portfolio-content/` folder:

```text
portfolio-content/
├── .obsidian/
│   └── app.json               # Configured for folder-relative attachments
├── Week_00/
│   ├── 01_Monday/
│   ├── 02_Tuesday/
│   ├── 03_Wednesday/
│   ├── 04_Thursday/
│   ├── 05_Friday/
│   └── 06_Saturday/
├── Week_01/
...
└── Week_19/
```

---

## ✍️ Writing Notes in Obsidian

### Note Location
Place your daily notes directly in their respective day folder:
`portfolio-content/Week_<XX>/<01-06>_<DayName>/<NoteName>.md`

Example: `portfolio-content/Week_00/01_Monday/problem_discovery.md`

### Markdown Frontmatter & Structure
Notes support YAML frontmatter and standard markdown formatting:

```markdown
---
title: "Autonomous Agent Architecture"
date: "2026-08-24"
status: "PUBLISHED"
weekName: "Phase 01 - Agent Systems"
---

# Autonomous Agent Architecture

## 🎯 Topics Covered
- Multi-agent orchestration
- Tool calling mechanisms
- Real-time DOM tree inspection

## 🛠️ Activities & Implementation
Constructed our custom parser and testing pipeline. Verified integration with AST analyzers.

## 📸 System Diagram & Evidence
![[agent_diagram.png|Agent Flow Diagram]]

## 💡 Reflection
Building modular subagents keeps memory footprint low and prevents hallucination loops.
```

---

## 🖼️ Media & Image Handling

- **Pasting / Drag & Drop**: Paste or drag images (`.png`, `.jpg`, `.webp`, `.svg`, `.gif`) or documents (`.pdf`, `.ppt`, `.docx`) into Obsidian. Because `.obsidian/app.json` is pre-configured with `"attachmentFolderPath": "./"`, files are automatically placed right next to your note in the current Day folder.
- **Wikilinks**: Write `![[my_image.png]]` or `![[my_image.png|Caption]]`. The compiler converts them into `![Caption](/assets/weekly/<Week>/<Day>/my_image.png)`.
- **Automatic Unlinked Media Discovery**: Any images or PDF documents placed in a day folder that aren't explicitly linked in the text are automatically detected, grouped into a **Media & Evidence Gallery** section, and indexed in the **Evidence Vault**.

---

## 🚀 8-Step Student Workflow

1. **Open Obsidian**: Launch Obsidian on your workstation.
2. **Open Vault**: Click **Open folder as vault** and select `portfolio-content`.
3. **Select Sprint Day**: Navigate to the folder for the current week and day (e.g. `Week_00/01_Monday`).
4. **Create / Edit Note**: Create your daily markdown note.
5. **Add Media**: Paste screenshots or drag & drop files into the folder.
6. **Commit & Push**: Open **GitHub Desktop** (or terminal), write a commit message (e.g., `Update Week 00 Day 1 notes`), and click **Push origin**.
7. **GitHub Action Compiles**: The GitHub Actions runner executes `scripts/build-templates.js` on Ubuntu.
8. **Live Portfolio Updates**: Your portfolio website receives the new compiled notes, media gallery, and evidence entries automatically.

---

## 🛠️ Local Testing & Commands

You can test the compiler locally at any time:

```bash
# Run compiler only
npm run build:content

# Or run full build (compiles content + verifies TypeScript + builds Vite app)
npm run build
```

---

## 🔍 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Image not showing on website** | Image file name in `![[...]]` has a typo or wrong extension | Ensure the image file exists in the same day folder and matches the link filename exactly. |
| **Note not appearing on website** | Status set to `DRAFT` | Change `status: "PUBLISHED"` in the note's frontmatter or log into the Admin CMS. |
| **GitHub Action failed on push** | Workflow lacks write permissions | Ensure repository Settings -> Actions -> General -> Workflow permissions is set to **Read and write permissions**. |
| **Old cached data shown** | Browser localStorage retained prior session | Click **Reset System** in Admin Settings or test in an Incognito window. |
