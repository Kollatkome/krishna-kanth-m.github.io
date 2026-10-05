# 📁 ProtoSem Portfolio Content (`portfolio-content`)

This directory houses the structured weekly sprint journals, technical dossiers, CAD models, and evidence attachments for the portfolio website.

---

## 📁 Directory Structure

```text
portfolio-content/
├── Week_00/
│   ├── 01_Monday/             # Monday markdown notes, CAD files & media
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

## ⚡ How to Write Weekly & Daily Notes

Create a markdown file (e.g. `01_exploring_innovation.md` or `Monday_Sprint.md`) inside the specific Day folder (e.g., `portfolio-content/Week_00/01_Monday/`).

### Recommended Note Template

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

![System Architecture Diagram](workflow_diagram.png)

![Microcontroller Sensor Telemetry](sensor_test.png)

## 💡 Key Learnings & Reflections
- Customer interviews reveal edge cases that lab simulations miss.
- Hardware latency must be addressed in Phase 02 firmware design.
```

---

## 🖼️ Media, CAD & Attachment Handling

1. **Standard Markdown & Embeds**: Reference images, PDFs, CAD models, or project files directly:
   - `![Architecture Diagram](my_diagram.png)` or `![[my_diagram.png|Architecture Diagram]]`
   - `[Download STL Model](krishnakanth.stl)` or `[[krishnakanth.stl|Download STL Model]]`
2. **Automatic Media & Document Sync**:
   - Dropping images, PDFs, STL, 3MF, or AI files into day folders automatically syncs them to `public/assets/weekly/`, attaches them to the day's workspace, and indexes them in the portfolio's **Evidence Vault** and **Source Files** download sections.

---

## 🔄 Content Compilation

To compile content, parse notes, and sync assets locally:

```bash
npm run build:content
```
or full build:
```bash
npm run build
```
