# Week_06 - Digital Fabrication — Laser Cutting & 3D Printing
*Sprint Week 06 Journal and Innovation Dossier*

### Designing in 3D & Clay Modelling (2026-09-26)

# Designing in 3D & Hands-On Clay Modelling

> *There is something exciting about watching an idea leave the screen and become something you can actually touch, hold, and use. Week 6 of PRICE Protosem was exactly that kind of experience under the guidance of Sabareesh at Forge.*

---

## 🎯 Focus Areas & Tools
- **Autodesk Fusion 360**: 3D Parametric Modeling, Primitive Geometries, Extrusions, Mirroring & Fill Operations
- **Design Thinking**: Translating conceptual ideas into dimensioned digital models
- **Clay Prototyping**: Tactile form exploration without constraints

---

## 🛠️ CAD Foundations: Autodesk Fusion 360

We started with the fundamentals of Autodesk Fusion 360, learning how simple geometric elements form the bedrock of complex physical designs.

- **Geometric Primitives**: Creating lines, rectangles, and foundational sketches.
- **Parametric Operations**: Extruding 2D sketches into 3D solid bodies, mirroring symmetrical elements, and applying fill/fillet operations.
- **Design Thinking Integration**: Learning how simple digital tools gain immense power when combined with systematic design thinking.

![Autodesk Fusion 360 3D Parametric Modeling Session](assets/weekly/Week_06/06_Saturday/fusion_360_cylindrical_cad.png)

---

## 🖐️ Hands-On Exploration: Clay Modelling

The afternoon took us away from computer screens into tactile, hands-on creativity with clay and dough modelling:

- **Freeform Creation**: Exploring forms with nothing more than dough and imagination.
- **Unconstrained Iteration**: No strict dimensions, no rigid measurements, and no "undo" button—pure intuitive creativity.
- **Tactile Learning**: A powerful reminder that engineering and creativity don't always have to begin with a computer. Sometimes, the best way to explore an idea is simply to make something with your hands.

---

## 💡 Key Takeaway
Innovation begins with the freedom to shape ideas tactilely before locking them into digital CAD constraints.


## Media & Evidence Gallery

![fusion_360_design.png](assets/weekly/Week_06/06_Saturday/fusion_360_design.png)

---

### Laser Cutting & Scanning Workflow (2026-09-28)

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

![RDWorks V8 Laser Cutting & Scanning Toolpath Preview](assets/weekly/Week_06/01_Monday/rdworks_laser_preview.png)

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

![Observing the Laser Cutting Machine in Operation at Forge](assets/weekly/Week_06/01_Monday/laser_cutting_operation.jpg)

---

## 10. Final Result — Hero Shot

The completed acrylic workpiece yielded crisp, frosty raster definition and glass-smooth flame-polished edges:

![Final 50 × 50 mm transparent acrylic piece with the engraved Transformers symbol](assets/weekly/Week_06/01_Monday/laser_engraved_output.jpg)

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

- 📦 **Vector Artwork (Adobe Illustrator)**: [Download krishnakanth.ai (54.8 KB)](assets/weekly/Week_06/01_Monday/krishnakanth.ai)
- 📐 **Vector CAD / Layout**: `krishnakanth.ai` / `krishnakanth.dxf`
- ⚙️ **RDWorks Machine File**: `transformers_acrylic_50x50.rld`
- 🏆 **Physical Output**: Finished 50 × 50 mm laser engraved & cut acrylic badge


---

### 3D Printing & Slicing Optimization (2026-09-29)

# 3D Printing & Slicing Optimization

> 🔵 **The Blue Pill Choice (Additive Matrix)**: *You enter the additive matrix, heating the Bambu Lab H2S nozzle to 220°C and watching molten White PLA lay down 0.20mm layers until a foldable phone stand materializes.*

---

## 1. Printer Specifications

The 3D printing activity was carried out using the **Bambu Lab H2S** industrial-grade high-speed printer in the Forge Prototyping Lab.

| Parameter | Specification Details |
| :--- | :--- |
| **Printer Make & Model** | Bambu Lab H2S |
| **Printing Technology** | Fused Deposition Modeling (FDM) |
| **Build Volume** | 340 × 320 × 340 mm |
| **Nozzle Diameter** | 0.4 mm Hardened Steel |
| **Material Used** | PLA Basic (White) |
| **Max Toolhead Speed** | Up to 1000 mm/s |
| **Max Nozzle Temp** | 350°C |

![Monitoring Print Precision and Layer Adhesion on the Bambu Lab 3D Printer](assets/weekly/Week_06/02_Tuesday/bambu_lab_printing_session.jpg)

---

## 2. Slicer & Material Setup

The 3D model was sliced and configured using **Bambu Studio**:

| Parameter | Configuration |
| :--- | :--- |
| **Slicing Software** | Bambu Studio |
| **Printer Profile** | Bambu Lab H2S 0.4 Nozzle |
| **Filament Type** | PLA Basic |
| **Filament Color** | White |
| **Layer Profile** | 0.20 mm Standard |

PLA (Polylactic Acid) was chosen for its high dimensional stability, low shrinkage, excellent layer adhesion, and suitability for functional articulating mechanisms.

---

## 3. Printer Capabilities & Mechanical Performance

During the print run, the Bambu Lab H2S demonstrated exceptional precision on complex multi-linkage geometry:
- **Complex Geometry as a Single Assembly**: Articulating multi-segment legs and hinges printed in place with tight clearances.
- **Dimensional Accuracy**: Tight tolerances around pivot pins allowed smooth rotation without slop or binding.
- **Functional Integrity**: Sturdy mechanical strength capable of supporting mobile devices in multiple orientations.
- **Zero Print Failures**: 100% first-pass yield with zero spaghetti, warping, or layer shifts.

![Bambu Lab H2S 3D Printer with AMS 2 and Printed Phone Holder Parts on Build Plate](assets/weekly/Week_06/02_Tuesday/bambu_h2s_print_plate.jpg)

---

## 4. Why This Geometry Cannot Be Made Subtractively

The selected phone stand features interlocking rotational joints, curved resting brackets, and nested collapsible legs.

### Limitations of Subtractive Manufacturing (CNC Milling / Turning):
- **Tool Access Obstruction**: End mills cannot reach internal enclosed cavities and undercut hinges without requiring multi-axis complex setups and substantial material waste.
- **Assembly Overhead**: Subtractive methods would require milling 6+ separate components followed by manual hardware pin assembly.
- **Additive Advantage**: FDM builds layer-by-layer (additive), enabling pre-assembled internal voids, functional hinges, and integrated pivot brackets directly on the build plate.

---

## 5. STL File Architecture

**STL (Stereolithography)** represents 3D surfaces as triangulated polygon meshes:
- Triangles define exterior and interior surfaces via vertex coordinates and surface normal vectors.
- Bambu Studio translates the STL mesh into discrete horizontal slices (G-code toolpaths) determining wall perimeters, infill density, and travel acceleration.

$$\text{3D CAD Model} \longrightarrow \text{STL Mesh} \longrightarrow \text{Bambu Studio Slicing} \longrightarrow \text{G-Code Layers} \longrightarrow \text{Physical Part}$$

---

## 6. Selected Component: Foldable & Adjustable Phone Stand

I selected a **foldable/adjustable multi-position phone stand** from the Bambu Lab ecosystem for its strong practical utility:
- **Everyday Usability**: Hands-free viewing for video lectures, coding tutorials, YouTube, movies, and documentation review.
- **Mechanical Elegance**: Articulated hinges allow folding flat for pocket portability or extending into a stable tripod workstation dock.

---

## 7. Slicer Parameters in Bambu Studio

| Setting | Value | Engineering Rationale |
| :--- | :---: | :--- |
| **Nozzle Diameter** | 0.4 mm | Standard balance of detail resolution and throughput |
| **Nozzle Temperature** | 220°C | Optimal melt flow for PLA Basic at high acceleration |
| **Bed Temperature** | 55°C | Textured PEI plate adhesion without warping |
| **Layer Height** | 0.20 mm | Smooth vertical surface finish and rapid build time |
| **Infill Density** | 15% | Sufficient structural strength with minimal weight |
| **Infill Pattern** | Grid | Balanced bidirectional load distribution |
| **Wall / Shell Count** | 2 Perimeters | Rigid external shell and hinge durability |
| **Support Type** | Enabled | Supports overhangs on bridge brackets |
| **Bed Adhesion** | Outer Brim (5 mm) | Prevents corner lifting on narrow contact points |

---

## 8. Slicing Metrics & Material Budget

| Parameter | Bambu Studio Slicer Estimate | Status |
| :--- | :---: | :---: |
| **Total Print Duration** | **59 min 08 sec** | Completed Successfully |
| **Model Filament Usage** | **20.00 g** | Verified within `< 50g` constraint |
| **Support Filament Usage** | **0.68 g** | Minimal sacrificial material |
| **Total Material Consumed** | **20.68 g** | High material efficiency |

---

## 9. Final Results & Hardware Showcase

The phone stand printed flawlessly in white PLA Basic:

### Folded Compact State
The entire assembly collapses into an ultra-slim pocket profile:

![Final 3D-printed white PLA phone stand after successful printing (folded state)](assets/weekly/Week_06/02_Tuesday/phone_stand_folded.jpg)

### Extended Articulating Tripod Stand
The legs extend outward smoothly to provide a stable, weighted base for mobile devices:

![Adjustable sections and tripod base of the completed phone stand](assets/weekly/Week_06/02_Tuesday/phone_stand_adjustable.jpg)

---

## 10. Deliverables & Source Files

- 📦 **STL 3D Geometry Model (Download)**: [Download krishnakanth.stl (2.07 MB)](assets/weekly/Week_06/02_Tuesday/krishnakanth.stl)
- 🖨️ **Bambu Studio Sliced Project & G-code (Download)**: [Download krishnakanth.gcode.3mf (2.51 MB)](assets/weekly/Week_06/02_Tuesday/krishnakanth.gcode.3mf)
- 🏆 **Fabricated Physical Artifact**: Fully articulated White PLA Phone Stand

---

## 11. Comprehensive Digital Fabrication Reflection

Comparing laser cutting and 3D printing highlighted two essential pillars of modern prototyping:

1. **Laser Cutting (2D Vector/Subtractive)**: Unmatched speed (~10 seconds) for flat sheet profiling, crisp surface rastering, and optical acrylic parts.
2. **3D Printing (3D Mesh/Additive)**: Unmatched geometric freedom for multi-piece interlocking mechanisms, nested joints, and custom ergonomic fixtures without tooling molds.

### Unified Prototyping Pipeline:
$$\text{Digital Concept} \longrightarrow \text{File Vectorization / Slicing} \longrightarrow \text{Machine Calibration} \longrightarrow \text{Physical Fabrication} \longrightarrow \text{Real-World Validation}$$

---

## References & Lab Equipment
- **Bambu Lab H2S**: Industrial FDM High-Speed 3D Printer
- **Bambu Studio**: Advanced Multi-Material Slicing Engine
- **HW Junction 1490 CO₂ Laser**: 150W Laser Cutting & Engraving System
- **RDWorks V8**: Laser Vector Control Suite
- **ReaConverter**: Image-to-DXF Vectorizer
- **Forge Prototyping Lab**: Equipment, materials, and mentor guidance
