# Floor Plan to 3D Visualizer 🏠📐

> **Computer Graphics & Image Processing (CGIP) Project**  
> **5th Semester — Navrachana University**  
> *Version 1: Parametric Dimension to 3D Generation Pipeline*

An interactive, real-time 3D architectural visualization web application built with **React 19** and **Three.js**. It bridges the gap between 2D dimensional blueprints and 3D spatial models.

---

## 🚀 Key Features

- **Real-time Parametric 3D Generation**: Enter width, length, wall height, and wall thickness in millimeters to dynamically construct 3D rooms.
- **Architectural Presets**: Instant one-click presets (Standard Room, Small Bedroom, Spacious Hall, Square Studio).
- **Procedural Interlocking Geometry**: Smart corner alignment algorithm to prevent mesh overlap and eliminate Z-fighting artifacts.
- **Interactive 3D Viewport**:
  - **OrbitControls**: 360° rotation (left-click), panning (right-click), and zoom (scroll).
  - **Camera View Presets**: Perspective 3D, Top View (2D), Front View, and Side View.
  - **Adaptive Grid & Lighting**: Ambient + Directional sun lighting with soft PCF shadow maps and architectural edge wireframe overlays.
- **Dynamic Metric Calculations**: Real-time floor area (^2$), 3D bounding box dimensions, and coordinate bounds.

---

## 🛠️ Technologies Used

| Technology | Role & Purpose |
| :--- | :--- |
| **React 19** | Component-based UI, reactive state management, and lifecycle hooks (useState, useEffect, useRef). |
| **Three.js (v0.186.0)** | 3D WebGL scene graph, camera, mesh generation, materials, and lighting engine. |
| **OrbitControls** | Smooth mouse/touch camera navigation with inertia damping and polar angle limits. |
| **Vite 8** | High-performance build tool and local development server with instant Hot Module Replacement (HMR). |
| **Vanilla CSS3** | Custom dark-slate theme (#0f172a), responsive grid/flexbox layout, and glassmorphic cards. |
| **Oxlint** | High-speed Rust-based linter for clean, error-free JavaScript code. |

---

## 📂 Project Architecture

`
floorplan-3d-visualizer/
├── index.html                   # Entry HTML with WebGL canvas mount point
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
├── PROJECT_EXPLANATION.txt      # Comprehensive academic & viva project guide
└── src/
    ├── main.jsx                 # React root bootstrap
    ├── App.jsx                  # Master component coordinating input & 3D view
    ├── components/
    │   ├── DimensionForm.jsx    # Input validation, unit conversion & presets
    │   └── Viewer3D.jsx         # WebGL canvas, lighting, render loop & camera views
    ├── geometry/
    │   └── roomGenerator.js     # Mathematical 3D mesh engine (mm -> meter scale)
    └── styles/
        └── app.css              # Custom UI & dark-mode styling
`

---

## ⚙️ How to Run Locally

1. **Install Dependencies**:
   `ash
   npm install
   `

2. **Start Development Server**:
   `ash
   npm run dev
   `

3. **Open in Browser**:
   Navigate to http://localhost:5173/ in your browser.

4. **Production Build**:
   `ash
   npm run build
   `

---

## 📖 Comprehensive Guide

For an in-depth breakdown of the geometric formulas, anti-z-fighting techniques, Three.js coordinate conversions, and viva Q&A, refer to [PROJECT_EXPLANATION.txt](./PROJECT_EXPLANATION.txt).
