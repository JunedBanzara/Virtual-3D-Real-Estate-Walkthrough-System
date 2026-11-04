# Virtual 3D Real Estate Walkthrough System & Home Builder Studio Pro 🏠✨🛋️🚶‍♂️📐

> **Computer Graphics & Image Processing (CGIP) Minor Project**  
> **5th Semester — Navrachana University**  
> *Phase 2: Parametric Multi-Room Home Builder, 3D Drag & Drop Furniture Staging, Live Quotation & Commercial Admin CMS*

[![React 19](https://img.shields.io/badge/React-19.2.8-61dafb?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-v0.186.0-black?style=flat&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint%20v1.81-orange?style=flat)](https://oxc.rs/)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat)]()

An interactive, high-performance web-based 3D architectural visualization and interior design staging platform built with **React 19**, **Three.js**, and **Vite**. The system bridges the gap between architectural spatial planning and commercial interior design execution — enabling architects, interior designers, and prospective home buyers to parametrically construct multi-room residences, customize architectural wall/flooring/ceiling finishes, drag-and-drop 80+ procedural 3D furniture models, calculate real-time bill-of-materials quotations with tax & installation, and conduct immersive first-person eye-level walkthroughs.

---

## 📑 Table of Contents

- [🚀 Key Features](#-key-features)
  - [1. Parametric Multi-Room Home Builder](#1-parametric-multi-room-home-builder)
  - [2. Architectural Wall Finishes & Designer Palette](#2-architectural-wall-finishes--designer-palette)
  - [3. False Ceiling & Lighting Designer](#3-false-ceiling--lighting-designer)
  - [4. Interactive 3D Drag & Drop Furniture Staging](#4-interactive-3d-drag--drop-furniture-staging)
  - [5. Live Dynamic Cost Estimation & Bill of Materials](#5-live-dynamic-cost-estimation--bill-of-materials)
  - [6. Printable Client Quotation Generator](#6-printable-client-quotation-generator)
  - [7. Protected Admin Catalogue & Pricing CMS](#7-protected-admin-catalogue--pricing-cms)
  - [8. Ready-Made Designer Samples Library](#8-ready-made-designer-samples-library)
  - [9. Dual-Mode Viewport: Bird's-Eye CAD & 1st-Person Walkthrough](#9-dual-mode-viewport-birds-eye-cad--1st-person-walkthrough)
  - [10. Project Persistence & JSON Portability](#10-project-persistence--json-portability)
- [📐 Computer Graphics & Mathematical Foundations](#-computer-graphics--mathematical-foundations)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Project Architecture](#-project-architecture)
- [⚙️ How to Run Locally](#️-how-to-run-locally)
- [🎮 User Controls & Shortcuts](#-user-controls--shortcuts)
- [🔒 Default Admin Credentials](#-default-admin-credentials)
- [🎓 Academic & Viva Voce Q&A](#-academic--viva-voce-qa)

---

## 🚀 Key Features

### 1. Parametric Multi-Room Home Builder
- **Dynamic Multi-Room Management**: Create custom rooms, duplicate existing layouts with automatic spatial offsets, or delete rooms in real-time.
- **Parametric Geometric Control**: Live manipulation of room dimensions:
  - Width ($X$-axis) & Length ($Z$-axis)
  - Wall Height ($Y$-axis) & Wall Thickness
  - Spatial world positioning $(X, Z)$
- **Parametric Openings (Doors & Windows)**:
  - Place doors and windows on any wall side (**North, South, East, West**).
  - Adjust width, height, sill height, and linear offset position along the wall axis.
  - Interactive door open/close angle toggle.
- **Multi-Unit Measurement System (`units.js`)**:
  - Global real-time unit switching across **Millimetres (`mm`)**, **Centimetres (`cm`)**, **Metres (`m`)**, and **Inches (`in`)**.
  - All values internally normalize to canonical SI metres ($m$) while displaying accurately formatted localized values.

### 2. Architectural Wall Finishes & Designer Palette
- **Curated 15-Color Designer Palette**:
  - *Warm Alabaster*, *Pure Chalk*, *Soft Greige*, *Warm Linen*, *Desert Sand*, *Terracotta Clay*, *Sage Mist*, *Forest Moss*, *Deep Emerald*, *Nordic Sky*, *Slate Blue*, *Royal Navy*, *Midnight Charcoal*, *Dusty Rose*, and *Mustard Ochre*.
- **4 Architectural Material Presets**:
  - **Matte Architectural Paint** (Roughness: 0.88, Metalness: 0.02)
  - **Fine Textured Stucco** (Roughness: 0.95, Metalness: 0.04)
  - **Polished Architectural Concrete** (Roughness: 0.65, Metalness: 0.12)
  - **Contemporary Wood Slat / Paneling** (Roughness: 0.55, Metalness: 0.08)
- **Granular Finish Scope**:
  - Apply colors/materials to a **Single Wall** (clicked in 3D scene), all walls in the **Active Room**, or universally across the **Whole Home**.
- **Procedural Flooring Textures (`textureGenerator.js`)**:
  - Procedurally generated canvas textures with normal map simulation:
    - 🪵 **Natural Hardwood Oak Parquet**
    - 🏢 **Porcelain Vitrified Tile**
    - 🪨 **Contemporary Slate**

### 3. False Ceiling & Lighting Designer
- **4 Architectural Ceiling Profiles**:
  - **Simple Tray Ceiling** with inner perimeter cove recess
  - **Perimeter Drop Soffit**
  - **Two-Tier Stepped Luxury Ceiling**
  - **Flat Minimalist Gypsum Soffit**
- **Parametric Controls**:
  - Drop depth configuration ($0.15\text{m} - 0.40\text{m}$), gypsum color and finish.
  - **Cove Lighting**: Warm amber illumination ($3000\text{K}$) with customizable glow color.
  - **Recessed Downlight Spots**: Configurable LED spotlights ($4$ to $8$ spots) with realistic ceiling fixtures.
- **Top Toolbar Ceiling Toggle**:
  - One-click visibility toggle (`showCeiling`) allowing bird's-eye dollhouse inspection into rooms without ceiling obstruction.

### 4. Interactive 3D Drag & Drop Furniture Staging
- **8 Comprehensive Categories & 80+ Procedural 3D Models (`furnitureLibrary.js`)**:
  - **🛋️ Living Room (15 items)**: 3-Seater Architect Sofa, Sectional L-Sofa Lounge, Loveseat, Armchair, Recliner, Ottoman, Modern Slate Coffee Table, Side Table, TV Console with mounted display, Open Bookshelf, Display Showcase, Console Table, Nesting Tables, Pouf, Room Divider.
  - **🛏️ Bedroom (15 items)**: King Upholstered Bed with headboard & pillows, Minimalist Platform Bed, Storage Bed, Double Bunk Bed, Nightstands with Luminaires, 3-Door Wardrobe, Sliding Mirror Wardrobe, Walk-in Closet, 4-Drawer Chest, 6-Drawer Dresser, Vanity Console, Full-Length Mirror, Bed Bench, Wall Panel.
  - **🍽️ Dining Room (10 items)**: 6-Seater Walnut Dining Table, Velvet Dining Chairs, Dining Bench, Bistro High Table, Swivel Bar Stools, Sideboard Credenza, Buffet Server, Glass Crockery Cabinet, China Showcase, 2-Tier Bar Trolley.
  - **🍳 Kitchen (12 items)**: Modular Base Cabinets, Upper Wall Cabinets, Tall Pantry Larder, Waterfall Kitchen Island with undermount sink & faucet, Breakfast Counter, Pub Bar Counter, Floating Spice Shelves, Deep Pan Drawers, Built-in Oven Tower.
  - **💻 Home Office / Study (12 items)**: Executive Study Desk, L-Shaped Computer Desk, Pedestal Desk, Scandinavian Writing Desk, High-Back Ergonomic Mesh Chair, 5-Tier Bookshelf, Filing Cabinet, Floating Wall Desk, Printer Stand, Underdesk Pedestal.
  - **🚪 Entrance / Foyer (10 items)**: Console Table, Tilt-Out Shoe Cabinet, Shoe Bench, Standing Coat Rack, Full Foyer Wardrobe, Round Hallway Mirror, Key Holder, Brass Umbrella Stand, Foyer Trunk Bench, Privacy Screen.
  - **🛁 Bathroom (8 items)**: Wall-Hung Vanity with porcelain basin & chrome faucet, Under-Sink Unit, Tall Linen Tower, LED Illuminated Mirror Cabinet, Ladder Towel Stand, Laundry Hamper, Corner Caddy.
  - **🧸 Kids' Room (11 items)**: Junior Platform Bed, 2-Tier Bunk Bed with safety rails, Loft Bed with play desk, Junior Study Desk, Task Chair, 9-Bin Toy Organizer, Book Display, Junior Wardrobe, Toy Storage Bench, Round Activity Table.
  - **✨ Lighting & Decor**: Arched Brass Floor Lamps, Smoked Glass Pendant Chandeliers, Potted Monstera Plants, Framed Gallery Canvas Art, Large Hand-Knotted Persian Area Rugs.
- **Physical Drag-and-Drop Floor Raycasting**:
  - Drag directly from the catalog sidebar onto the 3D viewport. Mouse ray intersects the horizontal ground plane at $Y = 0$ to instantiate the model directly under the cursor.
  - Alternative one-click `+ Add to Room` button for instant room centering.
- **Interactive 3D Transform Gizmo (`TransformControls`)**:
  - Click any staged item in Bird's-Eye view to attach the 3D transform gizmo.
  - **Modes**: Translate / Move (`G`), Rotate Y-axis (`R`), Scale (`S`).
  - **Quick Controls**: **+90° Quick Rotate**, **🧲 Grid Snapping** ($0.25\text{m} / 15^\circ$), **📋 Duplicate**, **🗑️ Delete**, and **✖ Deselect**.
  - **Physical Floor Grounding**: Position is automatically clamped at $Y = 0$, guaranteeing furniture never clips through or floats above the floor.

### 5. Live Dynamic Cost Estimation & Bill of Materials
- **Real-Time Dynamic Staging Quote (`RightSidebar.jsx`)**:
  - Automatically calculates real-time bill of materials (BOM) grouped by room category.
  - Displays unit prices, quantity multipliers, and category subtotals.
- **Interactive Quantity Controls**:
  - Increase or decrease staged furniture quantities directly from the quotation panel (+ / - buttons).
- **Price Synchronization**:
  - One-click `🔄 Sync Prices` to update all staged furniture instances with the latest catalog rates.
- **Commercial Add-Ons & Taxes**:
  - **Assembly & Installation Toggle**: Adds $5\%$ commercial installation charge.
  - **GST / Tax Toggle**: Computes $18\%$ Indian Goods and Services Tax (GST) on taxable amount.
  - Formatted in Indian Rupees (**₹ INR**) using Indian numeral grouping (Lakhs / Crores).

### 6. Printable Client Quotation Generator
- **Dedicated Printable Modal (`EstimatePrintModal.jsx`)**:
  - Instant professional client quotation generation.
  - Unique Quote Reference Code (e.g. `EST-104256`), Project Name, and date format.
  - Structured itemized table breakdown (Category, Item Description, Quantity, Unit Rate, Subtotal).
  - Subtotal, 5% Installation, 18% GST, and Grand Total summary.
  - `🖨️ Print / Save as PDF` button with tailored `@media print` CSS rules (clean white background, hidden toolbars, optimized margins).

### 7. Protected Admin Catalogue & Pricing CMS
- **PIN-Protected Admin Portal (`AdminCatalogModal.jsx`)**:
  - Secure PIN authorization (Default development PIN: `admin123` or `admin`).
- **Complete Product CRUD**:
  - **Add New Products**: Assign SKU, Name, Room Category, Dimensions, Pricing Unit (Piece, Sq Ft, Running Ft), Description, and procedural 3D model mapping.
  - **Edit Products**: Update selling rates, dimensions, and descriptions.
  - **Enable / Disable Products**: Toggle visibility of catalog items without deleting them.
  - **Factory Reset**: Restore default catalog pricing and items via `resetCatalogToDefaults()`.
  - Filter by category and real-time live search across name and SKU.

### 8. Ready-Made Designer Samples Library
- **Architect-Curated Ready-Made Rooms (`samples.js`)**:
  - **Contemporary Living Room** ($5.4\text{m} \times 4.4\text{m}$, $23.8\text{ m}^2$, tray ceiling, cove lighting, walnut furniture)
  - **Luxury Living Room / Grand Salon** ($6.5\text{m} \times 5.0\text{m}$, $32.5\text{ m}^2$, stepped ceiling, tile floor, sectional sofa)
  - **Master Bedroom Suite** ($4.5\text{m} \times 4.0\text{m}$, $18.0\text{ m}^2$, king bed, sliding mirror wardrobe, perimeter drop soffit)
  - **Compact Bedroom** ($3.5\text{m} \times 3.0\text{m}$, $10.5\text{ m}^2$, platform bed, flat soffit)
  - **Modular Chef Kitchen** ($3.6\text{m} \times 2.8\text{m}$, $10.1\text{ m}^2$, base/wall cabinets, pantry larder, breakfast counter)
  - **Premium Island Kitchen** ($4.5\text{m} \times 3.6\text{m}$, $16.2\text{ m}^2$, central waterfall island, bar stools)
  - **Executive Dining Room** ($4.0\text{m} \times 3.5\text{m}$, $14.0\text{ m}^2$, 6-seater dining table, credenza, crockery cabinet)
  - **Modern Home Office / Studio** ($3.8\text{m} \times 3.2\text{m}$, $12.2\text{ m}^2$, study desk, ergonomic chair, 5-tier bookshelf)
  - **Luxury Spa Bathroom** ($2.6\text{m} \times 2.4\text{m}$, $6.2\text{ m}^2$, vanity basin, LED mirror cabinet, linen tower)
  - **Complete 2BHK Executive Apartment** ($11.0\text{m} \times 8.5\text{m}$, $78.8\text{ m}^2$, multi-room residence with Living, Master, Kitchen, Study, and 2 Baths)
- **Flexible Loading Options**:
  - **Load Design**: Replaces current layout with the selected design.
  - **Append Room to Home**: Appends the sample room next to existing rooms without overwriting your current layout.

### 9. Dual-Mode Viewport: Bird's-Eye CAD & 1st-Person Walkthrough
- **🦅 Bird's-Eye CAD Orbit Mode**:
  - Exterior inspection with 360° rotation, pan, and zoom via `OrbitControls`.
  - Inertia damping (`dampingFactor: 0.05`), polar angle limits to prevent going beneath the floor plane.
  - Interactive furniture selection and 3D gizmo manipulation.
- **🚶 First-Person Walkthrough (FPS)**:
  - Eye-level interior tour ($1.65\text{m}$ human eye height) using `PointerLockControls`.
  - Smooth keyboard movement physics (WASD / Arrows) with acceleration damping and `Shift` sprint.
  - 360° natural mouse look.
- **Architectural Lighting & Shadow Engine**:
  - Directional sunlight ($1.2\text{ intensity}$) casting soft PCF shadow maps (`2048 x 2048` resolution).
  - Cool sky fill light ($0.35\text{ intensity}$) and balanced ambient interior light ($0.7\text{ intensity}$).

### 10. Project Persistence & JSON Portability
- **Browser LocalStorage**: Auto-saves active project state (rooms, walls, openings, finishes, false ceilings, and staged furniture).
- **Export Project JSON**: Download the complete home layout and staging configuration as a `.json` file.
- **Import Project JSON**: Restore any exported project JSON file with complete room layout and furniture placement intact.

---

## 📐 Computer Graphics & Mathematical Foundations

### 1. Drag & Drop Floor Plane Raycasting
When a user drags a furniture model from the sidebar onto the Three.js canvas:
1. Normalized Device Coordinates (NDC) in $[-1, 1]$ are computed from cursor screen coordinates:
   $$\text{NDC}_x = \left(\frac{x - \text{rect.left}}{\text{rect.width}}\right) \times 2 - 1$$
   $$\text{NDC}_y = -\left(\frac{y - \text{rect.top}}{\text{rect.height}}\right) \times 2 + 1$$
2. A Three.js ray is cast from the camera origin through the unprojected NDC coordinate:
   $$\vec{R}(t) = \vec{O}_{\text{camera}} + t \cdot \vec{D}_{\text{ray}}$$
3. The ray is intersected with the infinite horizontal floor plane at $Y = 0$ with normal $\vec{n} = (0, 1, 0)$:
   $$t = \frac{-(\vec{O}_{\text{camera}} \cdot \vec{n})}{\vec{D}_{\text{ray}} \cdot \vec{n}}$$
4. The intersection point $\vec{P}_{\text{hit}} = (x, 0, z)$ provides the exact ground coordinate to position the 3D model.

### 2. Analytical Wall Geometry & Openings Generation (`homeGenerator.js`)
Instead of heavy CSG (Constructive Solid Geometry) mesh boolean operations that cause WebGL overhead:
- Walls with doors or windows are analytically divided into segmented sub-meshes:
  - **Left Segment**: Solid wall before opening
  - **Right Segment**: Solid wall after opening
  - **Top Lintel Segment**: Solid wall above door/window header
  - **Bottom Sill Segment**: Solid wall beneath window sill
- This analytical approach guarantees $60\text{ FPS}$ instantaneous parametric regeneration when sliders are dragged, without mesh lag or non-manifold topology errors.

### 3. Procedural 3D Modeling vs. External Assets
- Rather than downloading massive multi-megabyte GLTF files that suffer from CORS errors, broken paths, and network latency:
- All 80+ furniture models are generated procedurally in memory using Three.js primitive geometries (`BoxGeometry`, `CylinderGeometry`, `ExtrudeGeometry`).
- Shared cached PBR materials (`MeshStandardMaterial`, `MeshPhysicalMaterial`) ensure high performance, consistent scale, and $100\%$ offline execution.

---

## 🛠️ Technology Stack

| Technology | Version | Purpose in Project |
| :--- | :--- | :--- |
| **React** | `v19.2.8` | Component hierarchy, modal dialogues, unit converters, catalog CMS, and reactive state management. |
| **Three.js** | `v0.186.0` | 3D WebGL scene graph, custom procedural geometry, PBR materials, shadows, and lighting. |
| **OrbitControls** | — | Bird's-Eye CAD camera with smooth inertia damping and polar angle constraints. |
| **PointerLockControls** | — | First-Person Walkthrough (FPS) eye-level mouse look and keyboard navigation. |
| **TransformControls** | — | Interactive 3D transformation gizmo (Translate, Rotate, Scale) with floor clamping. |
| **Vite** | `v8.3.0` | Ultra-fast HMR local development server and optimized production bundler. |
| **Oxlint** | `v1.81.0` | High-speed Rust-based linter ensuring clean, warning-free code. |
| **Vanilla CSS3** | — | Dark architectural aesthetic (`#0b0f17`), glassmorphism, responsive 3-pane layout, and `@media print` styling. |

---

## 📂 Project Architecture

```
Virtual-3D-Real-Estate-Walkthrough-System/
├── index.html                   # HTML entry point with WebGL canvas mount
├── package.json                 # Project dependencies, scripts & metadata
├── vite.config.js               # Vite bundler configuration
├── .oxlintrc.json               # Oxlint linting configuration
├── PROJECT_EXPLANATION.txt      # Comprehensive academic & viva project guide
├── README.md                    # Detailed documentation and architecture guide
└── src/
    ├── main.jsx                 # React root bootstrap
    ├── App.jsx                  # Master component coordinating state, persistence & modals
    ├── App.css                  # Core application styling
    ├── index.css                # Base HTML reset and typography
    ├── components/
    │   ├── TopToolbar.jsx       # Project renaming, units, ceiling toggle, camera & quick actions
    │   ├── LeftSidebar.jsx      # Multi-tab drawer: Rooms, Furniture Catalog, Walls, Ceilings, Samples, File I/O
    │   ├── RightSidebar.jsx     # Context-sensitive 3D Inspector & Live Dynamic Quotation Engine
    │   ├── Viewer3D.jsx         # Three.js WebGL viewport, lighting, raycasting & Walkthrough physics
    │   ├── FurnitureGizmoToolbar.jsx # Floating 3D transform toolbar (Move, Rotate, Scale, +90°, Snap, Delete)
    │   ├── AdminCatalogModal.jsx     # PIN-protected Furniture Catalogue & Pricing CMS
    │   └── EstimatePrintModal.jsx    # Printable / PDF itemized client quotation modal
    ├── data/
    │   ├── furnitureCatalog.js  # 80+ furniture definitions, SKUs, default rates & localStorage sync
    │   └── samples.js           # 10 pre-configured designer rooms & 2BHK apartment layouts
    ├── geometry/
    │   ├── homeGenerator.js     # Parametric multi-room mesh generator (segmented walls, frames, finishes)
    │   ├── furnitureLibrary.js  # 80+ procedural 3D furniture models with realistic PBR materials
    │   ├── layoutGenerator.js   # Multi-room apartment floor plan layout algorithms
    │   ├── roomGenerator.js     # Analytical single room generation engine
    │   └── textureGenerator.js  # HTML5 Canvas procedural flooring textures (hardwood, tile, slate)
    ├── styles/
    │   └── app.css              # Dark-slate theme (#0b0f17), glassmorphism, HUD overlay & print styles
    └── utils/
        └── units.js             # Unit conversions (mm, cm, m, in) and INR currency formatting
```

---

## ⚙️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation Steps

1. **Clone or Navigate to the Project Directory**:
   ```bash
   cd "Virtual-3D-Real-Estate-Walkthrough-System-Phase-2nd-with-drag-N-Drop"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *(Note for Windows PowerShell: If script execution is restricted, run `npm.cmd install`)*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *(or `npm.cmd run dev`)*

4. **Open in Browser**:
   Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Run Linter**:
   ```bash
   npm run lint
   ```

---

## 🎮 User Controls & Shortcuts

### Viewport Navigation

| Action | Control | View Mode |
| :--- | :--- | :--- |
| **Orbit / Rotate Scene** | Left Click + Drag | Bird's-Eye CAD |
| **Pan Camera** | Right Click + Drag | Bird's-Eye CAD |
| **Zoom In / Out** | Mouse Scroll Wheel | Bird's-Eye CAD |
| **Walk (Forward / Back / Strafe)** | `W` `A` `S` `D` or Arrow Keys | 1st-Person Walkthrough |
| **Sprint** | Hold `Shift` | 1st-Person Walkthrough |
| **Look Around** | Mouse movement (360°) | 1st-Person Walkthrough |
| **Release Mouse Pointer** | Press `ESC` | 1st-Person Walkthrough |
| **Toggle Ceiling Visibility** | Click **Ceiling: Visible / Hidden** | Top Toolbar |
| **Switch View Mode** | Click **Bird's-Eye** or **1st-Person** | Top Toolbar |

### 3D Furniture Manipulation

| Action | Shortcut / Control |
| :--- | :--- |
| **Select Furniture** | Left Click on any placed furniture mesh in Bird's-Eye view |
| **Move / Translate** | Press `G` or click **Move** icon on floating gizmo |
| **Rotate (Y-Axis)** | Press `R` or click **Rotate** icon on floating gizmo |
| **Scale** | Press `S` or click **Scale** icon on floating gizmo |
| **+90° Quick Rotate** | Click **↪️ +90°** button on floating gizmo |
| **Toggle Grid Snapping** | Click **🧲 Snap: 0.25m / 15°** button |
| **Duplicate Item** | Click **📋 Duplicate** in floating gizmo or Inspector |
| **Delete Item** | Press `Delete` / `Backspace` or click **🗑️ Delete** |
| **Deselect Item** | Press `ESC` or click **✕ Deselect** |

---

## 🔒 Default Admin Credentials

To access the protected Furniture Catalogue & Pricing CMS:
1. Click the **🔒 Admin** button in the top right corner of the application toolbar.
2. Enter the development PIN:
   - **PIN**: `admin123` *(or `admin`)*
3. Manage catalog items, update prices, add new SKUs, or restore factory defaults.

---

## 🎓 Academic & Viva Voce Q&A

**Q1: What is the main objective of this project?**  
> **A1:** The project provides a real-time, interactive 3D WebGL computer graphics system for architectural space planning and commercial interior design. It enables users to parametrically construct multi-room layouts, customize PBR wall/floor/ceiling finishes, drag-and-drop 80+ procedural furniture items, compute live commercial quotations (with GST and installation), and experience eye-level first-person walkthroughs.

**Q2: How does the 3D Drag & Drop raycasting mechanism work?**  
> **A2:** When an item is dragged from the HTML catalog drawer onto the WebGL canvas, HTML5 drag coordinates are transformed into Three.js Normalized Device Coordinates (NDC) in $[-1, 1]$. A ray is cast from the camera through NDC space and intersected mathematically with the horizontal floor plane at $Y = 0$. The resulting $(X, 0, Z)$ coordinates position the procedural 3D model with zero ground-clipping.

**Q3: Why are procedural 3D geometries utilized instead of external 3D files (GLTF/OBJ)?**  
> **A3:** Procedural generation eliminates reliance on external multi-megabyte 3D files that cause CORS errors, broken server links, and network latency. All 80+ models instantiate instantaneously in memory, share cached PBR materials, run completely offline, and maintain strictly normalized architectural dimensions.

**Q4: How does the system handle wall cutouts for doors and windows?**  
> **A4:** Instead of costly Constructive Solid Geometry (CSG) mesh boolean operations that degrade framerates, the system utilizes analytical wall segmentation (`homeGenerator.js`). Walls with openings are partitioned into left, right, lintel (top), and sill (bottom) sub-meshes, providing instantaneous $60\text{ FPS}$ geometry updates when dimensions change.

**Q5: How is project data persisted and shared?**  
> **A5:** The active project state (rooms, wall finishes, ceiling styles, doors, windows, and staged furniture) automatically serializes to browser `localStorage`. In addition, users can export the entire configuration as a portable JSON file or import previously saved layouts.

---

## 👨‍💻 Author & Credits

- **Course**: Computer Graphics & Image Processing (CGIP)
- **Academic Semester**: 5th Semester, B.Tech / BCA Computer Science
- **Institution**: Navrachana University
- **Academic Year**: 2025 – 2026

*Developed with passion for 3D Computer Graphics, WebGL, and Architectural Visualization.* 🏛️✨
