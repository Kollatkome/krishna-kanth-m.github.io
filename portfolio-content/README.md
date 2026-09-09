# 📓 Obsidian Portfolio Vault (`portfolio-content`)

This directory is an Obsidian vault designed for the **"Dump and Compile"** portfolio workflow.

---

## 📁 Vault Structure

```text
portfolio-content/
├── .obsidian/
│   └── app.json               # Configured to save pasted images & new files in current folder
├── Week_00/
│   ├── 01_Monday/             # Place Monday markdown notes & images here
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

## ⚡ How to Write Daily Notes

Create a markdown file (e.g. `2026-08-24.md` or `Monday_Sprint.md`) inside the specific Day folder (e.g., `portfolio-content/Week_00/01_Monday/`).

### Recommended Daily Note Template

```markdown
---
title: "Problem Discovery & Field Investigation"
date: "2026-08-24"
status: "PUBLISHED"
weekName: "Foundation & Problem Discovery"
---

# Problem Discovery & Field Investigation

## 🎯 Topics Covered
- Stakeholder interview methodology
- Problem statement formulation
- Field data logging protocols

## 🛠️ Activities & Implementation
Conducted on-site surveys with warehouse floor staff. Identified key bottleneck in manual barcode scanning latency.

## 📸 Evidence & Deliverables
Here is our initial workflow diagram and circuit test:

![[workflow_diagram.png|System Architecture Diagram]]

![[sensor_test.png|Microcontroller Sensor Telemetry]]

## 💡 Key Learnings & Reflections
- Customer interviews reveal edge cases that lab simulations miss.
- Hardware latency must be addressed in Phase 02 firmware design.
```

---

## 🖼️ How Images and Media Work

1. **Obsidian Wikilinks**: Drop an image directly into the folder and reference it:
   - `![[my_diagram.png]]` or `![[my_diagram.png|Architecture Diagram]]`
2. **Standard Markdown**:
   - `![Architecture Diagram](my_diagram.png)`
3. **Unlinked Images / Media**:
   - If you drop image or PDF files into the day folder without linking them in Markdown, the compiler **automatically discovers them**, appends a **Media & Evidence Gallery** section to the day's notes, and adds them to the global **Evidence Vault**!

---

## 🔄 The 8-Step Student Workflow

1. **Open Obsidian**: Launch Obsidian on your computer.
2. **Open Vault**: Click *Open folder as vault* and choose the `portfolio-content` folder in this repository.
3. **Navigate to Sprint Day**: Open the target sprint folder (e.g., `Week_00/01_Monday`).
4. **Write Notes**: Write your markdown reflections.
5. **Paste/Drop Images**: Paste screenshots or drag images/PDFs directly into the note or folder.
6. **Commit & Push**: Open **GitHub Desktop**, write a commit message (e.g. `Update Week 00 Monday sprint notes`), and click **Push origin**.
7. **Automated Pipeline**: GitHub Actions automatically runs the compiler (`scripts/build-templates.js`), generates compiled blogs, extracts assets, and updates `compiledProtoSem.json`.
8. **Live Portfolio**: Your website updates automatically with your latest notes, images, and evidence!

---

## 🧪 Local Testing

To test compiling your notes locally before pushing:

```bash
npm run build:content
```
or
```bash
npm run build
```
