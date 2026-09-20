# Virtual 3D Real Estate Walkthrough System 🏠🚶‍♂️👤📷☀️🛋️📐

> **Computer Graphics & Image Processing (CGIP) Project**  
> **5th Semester — Navrachana University**  
> *Version 5: Drag & Drop 3D Furniture Staging, 2D Blueprint AI Parser, Solar Daylight Simulation & Multi-Room Walkthroughs*

An interactive, real-time 3D architectural visualization and walkthrough web application built with **React 19** and **Three.js**. It bridges the gap between 2D architectural blueprints and interactive first-person / third-person spatial walkthroughs with dynamic real-world sunlight simulation, automated blueprint scanning, and complete drag-and-drop interior design furniture staging.

---

## 🚀 Key Features

### 🛋️ 1. Interactive 3D Drag & Drop Furniture Staging System (`furnitureLibrary.js`)
- **8 Comprehensive Categories & 80+ Distinct 3D Models**:
  - **🛋️ Living Room (15 items)**: 3-Seater Sofa, Sectional L-Sofa, Loveseat, Armchair, Recliner, Ottoman, Coffee Table, Side Table, TV Media Console with mounted screen, Bookshelf, Display Showcase, Console Table, Nesting Tables, Knitted Pouf, Room Divider.
  - **🛏️ Bedroom (15 items)**: Queen Bed with upholstered headboard & pillows, Platform Bed, Storage Bed, Double Bunk Bed, Nightstand with Table Lamp, 3-Door Wardrobe, Sliding Wardrobe with mirror, Walk-in Closet module, 4-Drawer Chest, Wide 6-Drawer Dresser, Vanity Dressing Table, Full-Length Floor Mirror, Bed Bench, Headboard Wall Panel, Linen Storage Cabinet.
  - **🍽️ Dining Room (10 items)**: 6-Seater Dining Table, Upholstered Dining Chairs, Long Dining Bench, High Bar Bistro Table, Swivel Bar Stools, Dining Sideboard Credenza, Buffet Server, Glass Crockery Cabinet, China Showcase, 2-Tier Bar Cart Trolley with wheels.
  - **🍳 Kitchen (12 items)**: Modular Base Cabinets, Upper Wall Cabinets, Tall Kitchen Larder, Pull-Out Pantry, Central Kitchen Island with marble waterfall countertop and undermount sink/faucet, Breakfast Bar Counter, Pub Bar Counter with footrest, Floating Spice Shelves, Deep Pan Drawers, Pull-Out Spice Rack, Corner Base, Built-in Oven/Microwave Tower.
  - **💻 Home Office / Study (12 items)**: Executive Study Desk, L-Shape Computer Desk with PC monitor, Pedestal Desk, Scandinavian Writing Desk, Ergonomic Mesh Rolling Swivel Chair, 5-Tier Bookshelf, 2-Drawer Filing Cabinet, Office Credenza, Floating Wall Desk, Geometric Wall Shelf, Printer Stand, Mobile 3-Drawer Pedestal.
  - **🚪 Entrance / Foyer (10 items)**: Entryway Console Table, Tilt-Out Shoe Cabinet, Shoe Rack Seating Bench, Standing Tree Coat Rack, Full Foyer Wardrobe, Round Hallway Mirror, Wall Key Holder, Brass Umbrella Stand, Foyer Storage Trunk Bench, Slatted Privacy Screen.
  - **🛁 Bathroom (8 items)**: Vanity Sink Cabinet with porcelain basin & chrome faucet, Compact Under-Sink Unit, Tall Linen Tower, Illuminated Medicine Mirror Cabinet, Ladder Towel Shelves, Laundry Hamper Unit, Corner Caddy Tower, Teak Spa Stool.
  - **🧸 Kids' Room (11 items)**: Kids Platform Bed, 2-Tier Bunk Bed with safety rail, Loft Bed with play desk under, Junior Study Desk, Colorful Kids Task Chair, 9-Bin Toy Organizer, Low Book Display, Junior Wardrobe, Pastel Chest of Drawers, Toy Storage Bench, Round Activity Table & Stools.
- **Fluid Drag-and-Drop & Floor Raycasting**:
  - Drag items directly from the catalog onto the 3D floor with real-time floor plane intersection at $(X, 0, Z)$.
  - Quick `+ Add to Room` button for instant center placement.
  - Auto-grounding at $Y = 0$ with realistic PBR materials (walnut/oak woods, fabrics, brass/metal, marble, glass, ceramic) and shadow casting/receiving.
- **Interactive 3D Transform Gizmo (`TransformControls`)**:
  - Click any placed furniture in CAD Orbit view to attach the interactive 3D gizmo.
  - Modes: **Move** (`G`), **Rotate** around Y-axis (`R`), **Scale** (`S`).
  - Quick Actions: **↪️ +90° Rotation**, **📋 Duplicate**, **🧲 Grid Snapping** ($0.25\text{m} / 15^\circ$), **🗑️ Delete** (`Del` / `Backspace`), **✖ Deselect** (`Esc`).
- **Scene Inspector & Layout Persistence**:
  - Browse all staged items with coordinates, select/delete individual items, clear all.
  - **Export / Import Layout**: Save and restore furniture configurations via JSON files.
  - **Auto-Save**: Staged items automatically persist in browser `localStorage`.
- **Physical Collision & Solar Integration**:
  - Placed furniture creates solid 3D bounding boxes preventing avatar clipping during walkthroughs.
  - Casts soft, realistic moving shadows from the solar and moonlight engines.

### 📷 1. Automated 2D Blueprint to 3D Extrusion Parser (`blueprintScanner.js`)
- **Computer Vision Pipeline**:
  - High-speed client-side image processing executed on HTML5 Canvas.
  - Grayscale luminance normalization & adaptive binarization ($Y = 0.299R + 0.587G + 0.114B$).
  - Horizontal and vertical run-length wall tracking with noise filtering.
  - Collinear cluster merging to combine adjacent segments into unified wall vectors.
- **Interactive Calibration Modal (`BlueprintScannerModal.jsx`)**:
  - **Sample Blueprint Library**: Built-in procedural CAD blueprints (*Studio Suite*, *1BHK Flat*, *Modern Loft*) for instant testing.
  - **Custom Image Upload**: Upload any PNG, JPG, or WEBP blueprint drawing.
  - **Live Calibration Controls**: Sliders for sensitivity threshold ($50 - 220$), scale factor ($1.5 - 7.5\text{ cm/pixel}$), and extruded wall height ($2.4 - 4.5\text{m}$).
  - **Live Vector Overlay**: Visualizes original blueprint drawing with detected cyan wall bounding boxes in real-time.
  - **Instant 3D Extrusion**: One-click generation of 3D walls, floor, ceiling, and colliders for immediate walkthrough exploration!

### ☀️ 2. Architectural Solar & Daylight Simulation Engine (`Viewer3D.jsx`)
- **Interactive Time-of-Day Slider**:
  - Real-time slider from **`06:00 AM`** to **`10:00 PM`** with preset chips:
    - 🌅 **Dawn (6:30 AM)**: Warm golden-amber low-angle sunlight ($3000\text{K}$), dramatic long shadows.
    - ☀️ **Noon (12:00 PM)**: Crisp high-intensity white daylight ($6500\text{K}$), sharp vertical shadows.
    - 🌇 **Sunset / Golden Hour (5:30 PM)**: Rich warm orange illumination with lengthening horizontal shadows.
    - 🌙 **Night Mode (9:00 PM)**: Deep navy skybox, subtle cool moonlight, with interior ceiling luminaires automatically intensifying to cast cozy warm ambient pools of light!
- **Dynamic Solar Mathematics**:
  - Automatically calculates sun elevation and azimuth coordinates to accurately cast rotating and lengthening shadows.

### 👤 3. Third-Person (TPS) & First-Person (FPS) Walkthrough Modes
- **Tri-Mode Viewport Navigation**:
  - **📐 CAD Orbit View**: Exterior inspection with 360° rotation, zoom, pan, and perspective/orthographic presets (Top, Front, Side).
  - **🚶 1st Person (FPS)**: Human eye-level interior tour ($1.65\text{ m}$).
  - **👤 3rd Person (TPS)**: Over-the-shoulder chase camera tracking an interactive 3D visitor avatar.
- **Procedural 3D Visitor Avatar (`avatarGenerator.js`)**:
  - Articulated humanoid model with walking limb oscillations and smooth body rotation.
- **Anti-Wall-Clip Spring-Arm Camera**:
  - Raycasts against solid wall bounding boxes to dynamically pull the camera closer when backing into a wall (from $2.2\text{ m}$ down to $0.4\text{ m}$), preventing the camera from clipping into the void.
- **Instant Hotkey `[V]`**:
  - Press **`V`** to seamlessly toggle between 1st Person and 3rd Person view on the fly!

### 🏢 4. Multi-Room Apartment Layouts (`layoutGenerator.js`)
- **1BHK Contemporary Apartment ($53.1\text{ m}^2$)**:
  - Living & Dining ($5.4\text{m} \times 4.4\text{m}$, hardwood floor)
  - Modular Kitchen ($3.4\text{m} \times 2.5\text{m}$, vitrified tile floor)
  - Master Bedroom ($4.4\text{m} \times 3.6\text{m}$, hardwood floor)
  - En-Suite Bathroom ($2.4\text{m} \times 2.1\text{m}$, ceramic tile floor)
  - Interconnecting partition doorways allowing continuous walkthrough.
- **2BHK Executive Flat ($78.8\text{ m}^2$)**:
  - Grand Living & Dining ($6.2\text{m} \times 4.8\text{m}$) with sliding glass balcony window
  - Master Suite ($4.5\text{m} \times 4.0\text{m}$) with private bathroom
  - Second Bedroom / Study ($3.8\text{m} \times 3.4\text{m}$)
  - Gourmet Kitchen & Utility ($3.6\text{m} \times 2.8\text{m}$)
  - Common Guest Powder Room ($2.0\text{m} \times 1.8\text{m}$)
- **3D Floor Badges & Instant Room Teleportation**:
  - Floating 3D floor labels displaying room names and square footage.
  - Sidebar room list with instant **"Enter Room"** teleportation buttons.

---

## 🛠️ Technologies Used

| Technology | Role & Purpose |
| :--- | :--- |
| **React 19** | Tabbed configurator, modal dialogs, solar sliders, and reactive state management. |
| **Three.js (v0.186.0)** | 3D WebGL scene graph, camera transformations, shadow maps, and lighting engine. |
| **HTML5 Canvas** | Computer Vision image binarization, run-length wall tracking, and procedural textures. |
| **Solar Physics Math** | Azimuth & elevation trigonometric tracking for dynamic daylight and shadow angles. |
| **PointerLockControls** | Walkthrough camera navigation, pointer lock API, and mouse look. |
| **OrbitControls** | CAD inspection camera with smooth inertia damping and polar constraints. |
| **Spring-Arm Math** | Raycast-based camera pull-back preventing wall clipping in third-person view. |
| **Vite 8** | High-performance build tool and local dev server with instant HMR. |
| **Vanilla CSS3** | Modern dark-slate theme (`#0b0f17`), glassmorphism, responsive two-column layout. |
| **Oxlint** | High-speed Rust-based linter ensuring clean, error-free JavaScript code. |

---

## 📂 Project Architecture

```
Virtual-3D-Real-Estate-Walkthrough-System/
├── index.html                   # Entry HTML with WebGL canvas mount point
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
├── PROJECT_EXPLANATION.txt      # Comprehensive academic & viva project guide
└── src/
    ├── main.jsx                 # React root bootstrap
    ├── App.jsx                  # Master component coordinating input, layout & solar time
    ├── components/
    │   ├── BlueprintScannerModal.jsx # 2D Blueprint CV scanner, calibration & vector overlay
    │   ├── DimensionForm.jsx    # Apartment selector, solar controls, room list & teleport
    │   └── Viewer3D.jsx         # Tri-Mode camera, solar lighting engine, spring-arm
    ├── geometry/
    │   ├── avatarGenerator.js   # 3D visitor avatar with walking limb oscillations
    │   ├── blueprintScanner.js  # Computer Vision binarization & 3D extrusion engine
    │   ├── layoutGenerator.js   # Multi-room apartment engine (1BHK, 2BHK, doorways)
    │   ├── roomGenerator.js     # Analytical single room engine (segmented walls & frames)
    │   └── textureGenerator.js  # Procedural canvas textures (hardwood parquet, tiles)
    └── styles/
        └── app.css              # Dark-mode styling, HUD overlay, modal & solar slider
```

---

## ⚙️ How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:5173/` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🎮 Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Walk / Strafe** | `W` `A` `S` `D` or Arrow Keys |
| **Sprint** | Hold `Shift` |
| **Look Around** | Mouse (360° rotation) |
| **Toggle 1st / 3rd Person View** | Press `V` |
| **Release Mouse Cursor** | Press `ESC` |
| **Scan 2D Blueprint Image** | Click **Scan 2D Blueprint Image** in the sidebar |
| **Adjust Time of Day** | Drag the **Solar & Daylight Simulation** slider |
| **Switch to CAD Orbit View** | Click **CAD Orbit View** in the top toolbar |
| **Jump to Specific Room** | Click **Enter Room** next to any room in the sidebar |
