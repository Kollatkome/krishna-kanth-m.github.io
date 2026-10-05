---
title: "Laser Cutting & Scanning Workflow"
date: "2026-09-28"
status: "PUBLISHED"
weekName: "Digital Fabrication — Laser Cutting & 3D Printing"
---

# Laser Cutting & Scanning Workflow

> 🔴 **The Red Pill Choice (Subtractive Reality)**: *You stay in the lab, and see how deep the 150W CO₂ laser beam cuts through 2mm acrylic at 100 mm/s to engrave the Transformers Autobot emblem.*

---

## 1. Lab Safety & Safety Rules

Before starting the laser cutting process, I followed the safety instructions provided in the Forge Lab. Since laser cutting involves high temperature, concentrated laser energy, electrical systems, and fumes, proper safety practices were essential throughout the process.

| Safety Area | Safety Practice Followed |
| :--- | :--- |
| **Laser Safety** | Avoid direct exposure to the laser beam and follow required eye and machine-safety precautions. |
| **Exhaust System** | Kept the exhaust system ON to continuously evacuate fumes and maintain proper airflow. |
| **Chiller System** | Verified chiller operating conditions and ensured the closed-loop cooling system was maintained properly. |
| **Electrical Earthing** | Verified proper electrical earthing and adhered strictly to machine electrical safety protocols. |
| **Air Assist** | Kept high-pressure air assist ON during the cutting process to suppress combustion and ensure clean edge kerf. |
| **General Machine Safety** | Maintained a clean working area, followed lab SOPs, and never left the machine unattended during active cutting. |

---

## 2. Machine Specifications

The laser cutting and engraving work was conducted using the **HW Junction CO₂ laser machine** at the Forge Digital Fabrication Lab.

| Parameter | Specification Details |
| :--- | :--- |
| **Make** | HW Junction |
| **Model** | Dfab #2 / 1490 CO₂ Laser |
| **Bed Size** | 1300 × 900 mm |
| **Laser Type** | CO₂ Gas Laser |
| **Laser Tube Power** | 150 W |
| **Control Software** | RDWorks V8 |

The machine provided an expansive working area for the selected workpiece, offering independent vector cutting and raster scanning channels.

---

## 3. Materials Used

Transparent acrylic was selected for this digital fabrication sprint.

| Material | Thickness | Source | Rationale |
| :--- | :---: | :--- | :--- |
| **Transparent Acrylic (PMMA)** | 2 mm | Forge Lab | Provides exceptional optical clarity and allows high-contrast engraved details against smooth cut edges. |

---

## 4. Selected Design: Transformers Autobot Emblem

For the project, I selected the iconic **Transformers Autobot symbol**.

I chose this design to create a high-precision decorative badge that demonstrates both raster surface scanning (engraving) and vector perimeter cutting within a single automated run.

### Design Composition:
- **50 × 50 mm outer boundary**: Processed using high-power **Laser Cut** to excise the square acrylic tile.
- **Transformers emblem interior**: Processed using high-speed raster **Laser Scan** to produce frosted surface engraving.

---

## 5. Image-to-DXF Vectorization Workflow

The original raster Transformers graphic was converted into an editable vector DXF file using **ReaConverter**:

1. Imported high-contrast monochrome Transformers artwork into ReaConverter.
2. Vectorized and traced outlines into AutoCAD DXF format.
3. Loaded the generated DXF file directly into **RDWorks V8**.
4. Scaled overall artwork dimensions to **50 × 50 mm**.
5. Assigned perimeter path to the cutting layer.
6. Assigned internal emblem contours to the raster scan layer.

No manual vector node correction was required post-conversion.

---

## 6. Digital Preparation & Toolpath Inspection in RDWorks

After loading the DXF into RDWorks V8, I verified geometry integrity and configured layer execution order:

- Verified closed contour topology for the 50 × 50 mm outer cut boundary.
- Color-coded layers to ensure engraving precedes outer cutting (preventing workpiece shift during scanning).
- Executed visual simulation preview to estimate process duration and confirm nozzle head pathing.

![[rdworks_laser_preview.png|RDWorks V8 Laser Cutting & Scanning Toolpath Preview]]

---

## 7. Nesting & Layer Configuration

| Layer Color | Operation | Target Feature | Power / Speed Mode |
| :--- | :--- | :--- | :--- |
| **Blue Layer** | **Laser Scan (Raster)** | Transformers Emblem | Surface frosting without cutting through sheet |
| **Black Layer** | **Laser Cut (Vector)** | 50 × 50 mm Outer Square | Full 2 mm acrylic cut-through |

Final workpiece footprint: **50 × 50 mm**. Estimated simulation run time: **9.66 seconds**.

---

## 8. Final Machine Parameter Settings

| Material | Thickness | Operation | Speed | Min Power | Max Power |
| :--- | :---: | :--- | :---: | :---: | :---: |
| Transparent Acrylic | 2 mm | **Laser Scan** | 100 mm/s | 30% | 30% |
| Transparent Acrylic | 2 mm | **Laser Cut** | 100 mm/s | 30% | 30% |

*Note: Power and speed parameters were calibrated during lab setup under mentor guidance.*

---

## 9. Physical Machining & Execution

1. Placed the 2 mm transparent acrylic sheet flat on the honey-comb bed.
2. Set nozzle focal distance to workpiece surface using the focal spacer block.
3. Enabled air assist compressor, water chiller, and fume exhaust duct.
4. Downloaded compiled RDWorks program to machine onboard controller memory.
5. Performed boundary test framing to verify workpiece bounds.
6. Executed job: raster scanned emblem first, followed immediately by vector perimeter cut.
7. Allowed exhaust dwell time before opening enclosure to retrieve finished part.

![[laser_cutting_operation.jpg|Observing the Laser Cutting Machine in Operation at Forge]]

---

## 10. Final Result — Hero Shot

The completed acrylic workpiece yielded crisp, frosty raster definition and glass-smooth flame-polished edges:

![[laser_engraved_output.jpg|Final 50 × 50 mm transparent acrylic piece with the engraved Transformers symbol]]

---

## 11. Troubleshooting & Validation Log

| Stage | Observation | Resolution | Outcome |
| :--- | :--- | :--- | :--- |
| **Vector Prep** | Clean DXF conversion with zero broken lines | Verified path closures in RDWorks | Flawless raster fill |
| **Machining** | Consistent beam power, no scorching | Correct air assist pressure and focal depth | Clean edge kerf, no melted re-deposition |

---

## 12. Engineering Reflection & Learnings

- **File Preparation is 80% of Manufacturing**: Precision DXF conversion and layer assignment dictate cut quality before touching the machine.
- **Cut vs. Scan Differentiation**: Mastering multi-layer jobs where scanning finishes prior to boundary separation prevents part dislocation.
- **Material Behaviour**: Acrylic vaporizes cleanly under CO₂ wavelength (10.6 µm), producing polished edge finishes when paired with proper air assist.

---

## 13. Deliverables & Source Files

- 📦 **Vector Artwork (Adobe Illustrator)**: [[krishnakanth.ai|Download krishnakanth.ai (54.8 KB)]]
- 📐 **Vector CAD / Layout**: `krishnakanth.ai` / `krishnakanth.dxf`
- ⚙️ **RDWorks Machine File**: `transformers_acrylic_50x50.rld`
- 🏆 **Physical Output**: Finished 50 × 50 mm laser engraved & cut acrylic badge
