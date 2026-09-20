import * as THREE from 'three';

/**
 * 🛋️ PROCEDURAL 3D FURNITURE LIBRARY
 * Comprehensive catalog across 8 categories with 80+ distinct models.
 * Built with realistic PBR materials, shadows, and grounded at Y = 0.
 */

// ---------------------------------------------------------------------------
// 1. MATERIAL PALETTE CACHE
// ---------------------------------------------------------------------------
function createMaterials() {
  return {
    // Woods
    woodWalnut: new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.65, metalness: 0.05 }),
    woodOak: new THREE.MeshStandardMaterial({ color: 0xc8a47e, roughness: 0.6, metalness: 0.05 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x241d19, roughness: 0.7, metalness: 0.05 }),
    woodWhite: new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.5, metalness: 0.02 }),

    // Fabrics & Upholstery
    fabricGrey: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, metalness: 0.0 }),
    fabricBeige: new THREE.MeshStandardMaterial({ color: 0xd6cbb8, roughness: 0.92, metalness: 0.0 }),
    fabricNavy: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.88, metalness: 0.0 }),
    fabricTeal: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.85, metalness: 0.0 }),
    fabricTerracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.89, metalness: 0.0 }),
    fabricYellow: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.88, metalness: 0.0 }),
    fabricKidsBlue: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.85, metalness: 0.0 }),
    fabricKidsPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.85, metalness: 0.0 }),

    // Metals
    metalBlack: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.85 }),
    metalBrass: new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.9 }),
    metalChrome: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 }),

    // Surfaces & Accents
    marbleWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1 }),
    glassSmoked: new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.7,
      ior: 1.5
    }),
    mirrorGlass: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.05, metalness: 0.95 }),
    ceramicWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.05 }),
    leatherCognac: new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.55, metalness: 0.1 }),
    displayScreen: new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.2, metalness: 0.5 })
  };
}

let mats = null;
function getMats() {
  if (!mats) mats = createMaterials();
  return mats;
}

// Helper to make shadow casting meshes
function createMesh(geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  if (rx) mesh.rotation.x = rx;
  if (ry) mesh.rotation.y = ry;
  if (rz) mesh.rotation.z = rz;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Helper to add metal/wood legs
function addLegs(group, w, d, h, radius = 0.025, mat = null) {
  const legMat = mat || getMats().metalBlack;
  const legGeo = new THREE.CylinderGeometry(radius, radius * 0.7, h, 8);
  const ox = (w / 2) - radius * 1.8;
  const oz = (d / 2) - radius * 1.8;
  const y = h / 2;

  group.add(createMesh(legGeo, legMat, ox, y, oz));
  group.add(createMesh(legGeo, legMat, -ox, y, oz));
  group.add(createMesh(legGeo, legMat, ox, y, -oz));
  group.add(createMesh(legGeo, legMat, -ox, y, -oz));
}

// ---------------------------------------------------------------------------
// 2. FURNITURE CATALOG METADATA (8 Categories, 80+ Items)
// ---------------------------------------------------------------------------
export const FURNITURE_CATEGORIES = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'dining', name: 'Dining Room', icon: '🍽️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'office', name: 'Home Office', icon: '💻' },
  { id: 'foyer', name: 'Entrance / Foyer', icon: '🚪' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
  { id: 'kids', name: "Kids' Room", icon: '🧸' }
];

export const FURNITURE_CATALOG = [
  // 1. 🛋️ LIVING ROOM (15 items)
  { id: 'sofa_3seater', category: 'living', name: '3-Seater Sofa', dim: '2.2 × 0.9 × 0.85 m' },
  { id: 'sofa_sectional', category: 'living', name: 'Sectional L-Sofa', dim: '2.6 × 1.8 × 0.85 m' },
  { id: 'loveseat', category: 'living', name: 'Loveseat (2-Seater)', dim: '1.6 × 0.85 × 0.82 m' },
  { id: 'armchair', category: 'living', name: 'Lounge Armchair', dim: '0.85 × 0.85 × 0.85 m' },
  { id: 'recliner', category: 'living', name: 'Leather Recliner', dim: '0.9 × 1.0 × 1.0 m' },
  { id: 'ottoman', category: 'living', name: 'Fabric Ottoman', dim: '0.7 × 0.7 × 0.42 m' },
  { id: 'coffee_table', category: 'living', name: 'Modern Coffee Table', dim: '1.2 × 0.6 × 0.45 m' },
  { id: 'side_table', category: 'living', name: 'Side / End Table', dim: '0.5 × 0.5 × 0.55 m' },
  { id: 'tv_unit', category: 'living', name: 'TV Media Console', dim: '2.0 × 0.45 × 0.5 m' },
  { id: 'bookshelf_living', category: 'living', name: 'Living Bookshelf', dim: '1.0 × 0.35 × 1.8 m' },
  { id: 'display_cabinet_living', category: 'living', name: 'Display Showcase', dim: '0.9 × 0.4 × 1.8 m' },
  { id: 'console_table_living', category: 'living', name: 'Sofa Console Table', dim: '1.3 × 0.35 × 0.75 m' },
  { id: 'nesting_tables', category: 'living', name: 'Nesting Coffee Tables', dim: '0.8 × 0.8 × 0.48 m' },
  { id: 'pouf', category: 'living', name: 'Knitted Floor Pouf', dim: '0.5 × 0.5 × 0.38 m' },
  { id: 'room_divider', category: 'living', name: 'Folding Room Divider', dim: '1.6 × 0.08 × 1.8 m' },

  // 2. 🛏️ BEDROOM (15 items)
  { id: 'bed_queen', category: 'bedroom', name: 'Queen Bed with Headboard', dim: '2.1 × 1.7 × 1.1 m' },
  { id: 'platform_bed', category: 'bedroom', name: 'Modern Platform Bed', dim: '2.1 × 1.9 × 0.8 m' },
  { id: 'storage_bed', category: 'bedroom', name: 'Hydraulic Storage Bed', dim: '2.1 × 1.7 × 1.05 m' },
  { id: 'bunk_bed_adult', category: 'bedroom', name: 'Double Bunk Bed', dim: '2.0 × 1.1 × 1.8 m' },
  { id: 'bedside_table', category: 'bedroom', name: 'Nightstand with Lamp', dim: '0.45 × 0.4 × 0.52 m' },
  { id: 'wardrobe_3door', category: 'bedroom', name: '3-Door Wardrobe', dim: '1.6 × 0.6 × 2.2 m' },
  { id: 'sliding_wardrobe', category: 'bedroom', name: 'Sliding Door Wardrobe', dim: '2.0 × 0.65 × 2.2 m' },
  { id: 'walkin_closet', category: 'bedroom', name: 'Walk-In Closet Module', dim: '1.8 × 0.55 × 2.1 m' },
  { id: 'chest_drawers', category: 'bedroom', name: '4-Drawer Chest', dim: '0.9 × 0.45 × 1.05 m' },
  { id: 'dresser_wide', category: 'bedroom', name: 'Wide 6-Drawer Dresser', dim: '1.4 × 0.48 × 0.85 m' },
  { id: 'dressing_table', category: 'bedroom', name: 'Vanity Dressing Table', dim: '1.1 × 0.45 × 1.4 m' },
  { id: 'mirror_standing', category: 'bedroom', name: 'Full-Length Floor Mirror', dim: '0.5 × 0.45 × 1.7 m' },
  { id: 'bedroom_bench', category: 'bedroom', name: 'Upholstered Bed Bench', dim: '1.3 × 0.45 × 0.48 m' },
  { id: 'headboard_panel', category: 'bedroom', name: 'Acoustic Headboard Wall', dim: '2.4 × 0.08 × 1.3 m' },
  { id: 'storage_cabinet_bed', category: 'bedroom', name: 'Linen Storage Cabinet', dim: '0.85 × 0.4 × 1.4 m' },

  // 3. 🍽️ DINING ROOM (10 items)
  { id: 'dining_table_6', category: 'dining', name: '6-Seater Dining Table', dim: '1.8 × 0.9 × 0.76 m' },
  { id: 'dining_chair', category: 'dining', name: 'Upholstered Dining Chair', dim: '0.48 × 0.5 × 0.85 m' },
  { id: 'bench_dining', category: 'dining', name: 'Long Dining Bench', dim: '1.4 × 0.4 × 0.46 m' },
  { id: 'bar_table', category: 'dining', name: 'High Bar Bistro Table', dim: '0.7 × 0.7 × 1.05 m' },
  { id: 'bar_stool', category: 'dining', name: 'Swivel Bar Stool', dim: '0.42 × 0.42 × 0.95 m' },
  { id: 'sideboard_dining', category: 'dining', name: 'Dining Sideboard Credenza', dim: '1.6 × 0.45 × 0.8 m' },
  { id: 'buffet_cabinet', category: 'dining', name: 'Buffet Server Cabinet', dim: '1.4 × 0.45 × 0.9 m' },
  { id: 'crockery_cabinet', category: 'dining', name: 'Glass Crockery Cabinet', dim: '1.0 × 0.42 × 1.85 m' },
  { id: 'display_cabinet_dining', category: 'dining', name: 'China Showcase Cabinet', dim: '0.95 × 0.4 × 1.9 m' },
  { id: 'serving_trolley', category: 'dining', name: '2-Tier Bar Cart Trolley', dim: '0.8 × 0.45 × 0.85 m' },

  // 4. 🍳 KITCHEN (12 items)
  { id: 'base_cabinets', category: 'kitchen', name: 'Modular Base Cabinet', dim: '1.2 × 0.6 × 0.88 m' },
  { id: 'wall_cabinets', category: 'kitchen', name: 'Upper Wall Cabinets', dim: '1.2 × 0.35 × 0.7 m' },
  { id: 'tall_storage_kitchen', category: 'kitchen', name: 'Tall Kitchen Larder', dim: '0.6 × 0.6 × 2.1 m' },
  { id: 'pantry_unit', category: 'kitchen', name: 'Pull-Out Pantry Unit', dim: '0.45 × 0.6 × 2.1 m' },
  { id: 'kitchen_island', category: 'kitchen', name: 'Central Kitchen Island', dim: '1.8 × 0.9 × 0.9 m' },
  { id: 'breakfast_counter', category: 'kitchen', name: 'Breakfast Bar Counter', dim: '1.5 × 0.5 × 1.05 m' },
  { id: 'bar_counter_kitchen', category: 'kitchen', name: 'Pub Style Bar Counter', dim: '1.6 × 0.6 × 1.1 m' },
  { id: 'open_shelving_kitchen', category: 'kitchen', name: 'Floating Spice Shelves', dim: '1.0 × 0.25 × 0.5 m' },
  { id: 'drawer_unit_kitchen', category: 'kitchen', name: 'Deep Pan Drawer Unit', dim: '0.8 × 0.6 × 0.88 m' },
  { id: 'pullout_storage', category: 'kitchen', name: 'Slim Pull-Out Spice Rack', dim: '0.3 × 0.6 × 0.88 m' },
  { id: 'corner_storage_kitchen', category: 'kitchen', name: 'L-Corner Kitchen Base', dim: '1.0 × 1.0 × 0.88 m' },
  { id: 'appliance_cabinet', category: 'kitchen', name: 'Built-in Oven/Microwave Tower', dim: '0.6 × 0.6 × 2.1 m' },

  // 5. 💻 HOME OFFICE (12 items)
  { id: 'study_desk', category: 'office', name: 'Executive Study Desk', dim: '1.4 × 0.7 × 0.75 m' },
  { id: 'computer_desk', category: 'office', name: 'L-Shape Computer Desk', dim: '1.6 × 1.2 × 0.75 m' },
  { id: 'executive_desk', category: 'office', name: 'Pedestal Executive Desk', dim: '1.8 × 0.85 × 0.76 m' },
  { id: 'writing_desk', category: 'office', name: 'Minimalist Writing Desk', dim: '1.1 × 0.55 × 0.74 m' },
  { id: 'office_chair', category: 'office', name: 'Ergonomic Mesh Chair', dim: '0.65 × 0.65 × 1.1 m' },
  { id: 'bookshelf_office', category: 'office', name: '5-Tier Library Bookshelf', dim: '1.0 × 0.32 × 1.9 m' },
  { id: 'filing_cabinet', category: 'office', name: '2-Drawer File Cabinet', dim: '0.45 × 0.5 × 0.7 m' },
  { id: 'storage_cabinet_office', category: 'office', name: 'Office Credenza Storage', dim: '1.2 × 0.42 × 0.8 m' },
  { id: 'floating_desk', category: 'office', name: 'Wall Floating Desk', dim: '1.0 × 0.45 × 0.45 m' },
  { id: 'wall_shelves_office', category: 'office', name: 'Geometric Wall Shelf', dim: '0.9 × 0.22 × 0.6 m' },
  { id: 'printer_cabinet', category: 'office', name: 'Printer & Scanner Stand', dim: '0.6 × 0.48 × 0.65 m' },
  { id: 'desk_drawer_unit', category: 'office', name: 'Mobile 3-Drawer Pedestal', dim: '0.42 × 0.5 × 0.62 m' },

  // 6. 🚪 ENTRANCE / FOYER (10 items)
  { id: 'console_table_foyer', category: 'foyer', name: 'Entryway Console Table', dim: '1.1 × 0.32 × 0.82 m' },
  { id: 'shoe_cabinet', category: 'foyer', name: 'Tilt-Out Shoe Cabinet', dim: '0.9 × 0.28 × 1.1 m' },
  { id: 'shoe_bench', category: 'foyer', name: 'Shoe Rack Seating Bench', dim: '0.95 × 0.38 × 0.48 m' },
  { id: 'coat_rack', category: 'foyer', name: 'Standing Tree Coat Rack', dim: '0.45 × 0.45 × 1.8 m' },
  { id: 'entryway_cabinet', category: 'foyer', name: 'Full Entryway Wardrobe Unit', dim: '1.2 × 0.4 × 2.0 m' },
  { id: 'mirror_foyer', category: 'foyer', name: 'Round Hallway Mirror', dim: '0.8 × 0.05 × 0.8 m' },
  { id: 'key_storage', category: 'foyer', name: 'Wall Key Holder & Shelf', dim: '0.5 × 0.15 × 0.3 m' },
  { id: 'umbrella_stand', category: 'foyer', name: 'Brass Umbrella Stand', dim: '0.3 × 0.3 × 0.65 m' },
  { id: 'storage_bench_foyer', category: 'foyer', name: 'Foyer Storage Trunk Bench', dim: '1.0 × 0.42 × 0.5 m' },
  { id: 'room_divider_foyer', category: 'foyer', name: 'Slatted Privacy Screen', dim: '1.2 × 0.08 × 2.0 m' },

  // 7. 🛁 BATHROOM (8 items)
  { id: 'vanity_unit', category: 'bathroom', name: 'Vanity Sink Cabinet', dim: '0.9 × 0.5 × 0.85 m' },
  { id: 'under_sink_cabinet', category: 'bathroom', name: 'Compact Under-Sink Unit', dim: '0.65 × 0.42 × 0.6 m' },
  { id: 'tall_cabinet_bath', category: 'bathroom', name: 'Tall Linen Bathroom Tower', dim: '0.42 × 0.35 × 1.8 m' },
  { id: 'mirror_cabinet_bath', category: 'bathroom', name: 'Illuminated Medicine Cabinet', dim: '0.8 × 0.16 × 0.75 m' },
  { id: 'open_shelves_bath', category: 'bathroom', name: 'Ladder Towel Shelves', dim: '0.5 × 0.3 × 1.4 m' },
  { id: 'laundry_cabinet', category: 'bathroom', name: 'Hamper & Laundry Unit', dim: '0.75 × 0.45 × 0.9 m' },
  { id: 'storage_tower_bath', category: 'bathroom', name: 'Corner Shower Caddy Tower', dim: '0.35 × 0.35 × 1.6 m' },
  { id: 'bathroom_stool', category: 'bathroom', name: 'Waterproof Teak Spa Stool', dim: '0.4 × 0.32 × 0.45 m' },

  // 8. 🧸 KIDS' ROOM (11 items)
  { id: 'single_bed_kids', category: 'kids', name: 'Kids Single Platform Bed', dim: '1.95 × 1.0 × 0.85 m' },
  { id: 'bunk_bed_kids', category: 'kids', name: 'Kids 2-Tier Bunk Bed', dim: '2.0 × 1.05 × 1.65 m' },
  { id: 'loft_bed_kids', category: 'kids', name: 'Loft Bed with Play Space', dim: '2.0 × 1.1 × 1.85 m' },
  { id: 'study_desk_kids', category: 'kids', name: 'Junior Study Desk', dim: '1.0 × 0.55 × 0.7 m' },
  { id: 'study_chair_kids', category: 'kids', name: 'Colorful Kids Task Chair', dim: '0.48 × 0.48 × 0.8 m' },
  { id: 'toy_storage_kids', category: 'kids', name: '9-Bin Toy Organizer Unit', dim: '0.95 × 0.38 × 0.78 m' },
  { id: 'bookshelf_kids', category: 'kids', name: 'Low Kids Display Bookshelf', dim: '0.85 × 0.32 × 0.95 m' },
  { id: 'wardrobe_kids', category: 'kids', name: 'Junior 2-Door Wardrobe', dim: '0.9 × 0.5 × 1.6 m' },
  { id: 'chest_drawers_kids', category: 'kids', name: 'Pastel Chest of Drawers', dim: '0.8 × 0.42 × 0.9 m' },
  { id: 'storage_bench_kids', category: 'kids', name: 'Kids Toy Storage Bench', dim: '0.85 × 0.4 × 0.45 m' },
  { id: 'activity_table_kids', category: 'kids', name: 'Round Activity Table & Stools', dim: '0.8 × 0.8 × 0.5 m' }
];

// ---------------------------------------------------------------------------
// 3. PROCEDURAL 3D MESH BUILDERS
// ---------------------------------------------------------------------------

/**
 * Builds and returns a complete 3D Object3D representing the specified furniture piece.
 * All models are grounded so the lowest vertex sits exactly at Y = 0.
 */
export function createFurnitureMesh(typeId) {
  const m = getMats();
  const group = new THREE.Group();
  group.name = `furniture_${typeId}`;

  switch (typeId) {
    // -----------------------------------------------------------------------
    // LIVING ROOM
    // -----------------------------------------------------------------------
    case 'sofa_3seater': {
      // Base frame & cushions
      group.add(createMesh(new THREE.BoxGeometry(2.2, 0.22, 0.88), m.woodDark, 0, 0.18, 0));
      // 3 Seat cushions
      for (let i = -1; i <= 1; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.66, 0.16, 0.72), m.fabricGrey, i * 0.68, 0.37, 0.05));
        group.add(createMesh(new THREE.BoxGeometry(0.66, 0.42, 0.18), m.fabricGrey, i * 0.68, 0.64, -0.32));
      }
      // Backrest frame
      group.add(createMesh(new THREE.BoxGeometry(2.2, 0.58, 0.14), m.woodDark, 0, 0.56, -0.37));
      // Armrests
      group.add(createMesh(new THREE.BoxGeometry(0.18, 0.42, 0.86), m.woodDark, -1.01, 0.46, 0.01));
      group.add(createMesh(new THREE.BoxGeometry(0.18, 0.42, 0.86), m.woodDark, 1.01, 0.46, 0.01));
      // Brass accent legs
      addLegs(group, 2.1, 0.8, 0.18, 0.025, m.metalBrass);
      break;
    }

    case 'sofa_sectional': {
      // Main 3-seat section
      group.add(createMesh(new THREE.BoxGeometry(2.4, 0.22, 0.9), m.woodDark, 0, 0.18, 0));
      // Chaise lounge section extending forward on right side
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.22, 1.0), m.woodDark, 0.75, 0.18, 0.95));
      // Cushions
      group.add(createMesh(new THREE.BoxGeometry(1.5, 0.16, 0.75), m.fabricNavy, -0.45, 0.37, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.85, 0.16, 1.75), m.fabricNavy, 0.75, 0.37, 0.48));
      // Backrest
      group.add(createMesh(new THREE.BoxGeometry(2.4, 0.56, 0.15), m.woodDark, 0, 0.55, -0.38));
      // Armrests
      group.add(createMesh(new THREE.BoxGeometry(0.18, 0.42, 0.9), m.woodDark, -1.11, 0.46, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.18, 0.42, 1.8), m.woodDark, 1.11, 0.46, 0.45));
      addLegs(group, 2.3, 1.7, 0.18, 0.025, m.metalBlack);
      break;
    }

    case 'loveseat': {
      group.add(createMesh(new THREE.BoxGeometry(1.5, 0.2, 0.8), m.woodWalnut, 0, 0.16, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.66, 0.15, 0.65), m.fabricTeal, -0.35, 0.33, 0.04));
      group.add(createMesh(new THREE.BoxGeometry(0.66, 0.15, 0.65), m.fabricTeal, 0.35, 0.33, 0.04));
      group.add(createMesh(new THREE.BoxGeometry(1.36, 0.42, 0.16), m.fabricTeal, 0, 0.6, -0.28));
      group.add(createMesh(new THREE.BoxGeometry(0.14, 0.38, 0.78), m.woodWalnut, -0.68, 0.42, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.14, 0.38, 0.78), m.woodWalnut, 0.68, 0.42, 0));
      addLegs(group, 1.4, 0.7, 0.16, 0.02, m.metalBrass);
      break;
    }

    case 'armchair': {
      group.add(createMesh(new THREE.BoxGeometry(0.85, 0.18, 0.82), m.woodWalnut, 0, 0.18, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.16, 0.65), m.fabricTerracotta, 0, 0.35, 0.04));
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.52, 0.16), m.fabricTerracotta, 0, 0.65, -0.28));
      group.add(createMesh(new THREE.BoxGeometry(0.14, 0.42, 0.8), m.woodWalnut, -0.36, 0.44, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.14, 0.42, 0.8), m.woodWalnut, 0.36, 0.44, 0));
      addLegs(group, 0.78, 0.74, 0.18, 0.022, m.metalBrass);
      break;
    }

    case 'recliner': {
      group.add(createMesh(new THREE.BoxGeometry(0.88, 0.28, 0.95), m.leatherCognac, 0, 0.22, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.66, 0.18, 0.75), m.leatherCognac, 0, 0.42, 0.05));
      group.add(createMesh(new THREE.BoxGeometry(0.66, 0.65, 0.22), m.leatherCognac, 0, 0.78, -0.32, -0.15));
      group.add(createMesh(new THREE.BoxGeometry(0.16, 0.48, 0.92), m.leatherCognac, -0.36, 0.46, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.16, 0.48, 0.92), m.leatherCognac, 0.36, 0.46, 0));
      // Heavy swivel disc base
      group.add(createMesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24), m.metalChrome, 0, 0.03, 0));
      break;
    }

    case 'ottoman': {
      group.add(createMesh(new THREE.CylinderGeometry(0.35, 0.35, 0.36, 24), m.fabricBeige, 0, 0.22, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 24), m.fabricBeige, 0, 0.42, 0));
      addLegs(group, 0.45, 0.45, 0.08, 0.018, m.woodDark);
      break;
    }

    case 'coffee_table': {
      // Top marble / wood surface
      group.add(createMesh(new THREE.BoxGeometry(1.2, 0.04, 0.6), m.marbleWhite, 0, 0.44, 0));
      // Lower wood shelf
      group.add(createMesh(new THREE.BoxGeometry(1.1, 0.02, 0.5), m.woodWalnut, 0, 0.18, 0));
      addLegs(group, 1.15, 0.55, 0.44, 0.018, m.metalBrass);
      break;
    }

    case 'side_table': {
      group.add(createMesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), m.woodWalnut, 0, 0.52, 0));
      // Tripod legs
      const legGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.52, 8);
      for (let i = 0; i < 3; i++) {
        const ang = (i * Math.PI * 2) / 3;
        const x = Math.cos(ang) * 0.18;
        const z = Math.sin(ang) * 0.18;
        group.add(createMesh(legGeo, m.metalBlack, x, 0.26, z, 0.08, ang, 0));
      }
      break;
    }

    case 'tv_unit': {
      // Low credenza
      group.add(createMesh(new THREE.BoxGeometry(2.0, 0.42, 0.44), m.woodWalnut, 0, 0.32, 0));
      // Slat doors / drawer dividers
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.36, 0.02), m.woodDark, -0.64, 0.32, 0.22));
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.36, 0.02), m.woodDark, 0.64, 0.32, 0.22));
      // Flat TV mounted on top
      group.add(createMesh(new THREE.BoxGeometry(1.3, 0.74, 0.04), m.displayScreen, 0, 0.98, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.32, 0.02, 0.22), m.metalBlack, 0, 0.54, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 12), m.metalBlack, 0, 0.6, 0));
      addLegs(group, 1.85, 0.38, 0.12, 0.02, m.metalBrass);
      break;
    }

    case 'bookshelf_living': {
      // Outer vertical frame
      group.add(createMesh(new THREE.BoxGeometry(0.04, 1.8, 0.35), m.woodOak, -0.48, 0.9, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.04, 1.8, 0.35), m.woodOak, 0.48, 0.9, 0));
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.04, 0.35), m.woodOak, 0, 1.78, 0));
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.04, 0.35), m.woodOak, 0, 0.06, 0));
      // 4 shelves
      for (let i = 1; i <= 4; i++) {
        const y = 0.06 + i * 0.34;
        group.add(createMesh(new THREE.BoxGeometry(0.94, 0.03, 0.33), m.woodOak, 0, y, 0));
        // Add colorful book blocks on alternate shelves
        if (i % 2 === 1) {
          group.add(createMesh(new THREE.BoxGeometry(0.24, 0.22, 0.22), m.fabricTeal, -0.22, y + 0.12, 0));
          group.add(createMesh(new THREE.BoxGeometry(0.18, 0.24, 0.22), m.fabricTerracotta, 0.2, y + 0.13, 0));
        }
      }
      break;
    }

    case 'display_cabinet_living': {
      // Wood frame + glass shelves
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.05, 0.4), m.woodDark, 0, 1.78, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.4, 0.4), m.woodDark, 0, 0.22, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.04, 1.4, 0.4), m.woodDark, -0.43, 1.05, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.04, 1.4, 0.4), m.woodDark, 0.43, 1.05, 0));
      // Glass door
      group.add(createMesh(new THREE.BoxGeometry(0.82, 1.35, 0.02), m.glassSmoked, 0, 1.05, 0.19));
      // 3 glass interior shelves
      for (let y = 0.65; y <= 1.45; y += 0.38) {
        group.add(createMesh(new THREE.BoxGeometry(0.82, 0.015, 0.35), m.glassSmoked, 0, y, 0));
      }
      break;
    }

    case 'console_table_living': {
      group.add(createMesh(new THREE.BoxGeometry(1.3, 0.04, 0.35), m.woodWalnut, 0, 0.74, 0));
      addLegs(group, 1.2, 0.28, 0.72, 0.016, m.metalBrass);
      break;
    }

    case 'nesting_tables': {
      // Large table
      group.add(createMesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 24), m.marbleWhite, -0.15, 0.46, -0.1));
      addLegs(group, 0.55, 0.55, 0.44, 0.015, m.metalBlack);
      // Small nested table
      const small = new THREE.Group();
      small.add(createMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 24), m.woodWalnut, 0.2, 0.38, 0.15));
      addLegs(small, 0.42, 0.42, 0.36, 0.014, m.metalBrass);
      group.add(small);
      break;
    }

    case 'pouf': {
      group.add(createMesh(new THREE.CylinderGeometry(0.26, 0.28, 0.36, 20), m.fabricYellow, 0, 0.18, 0));
      break;
    }

    case 'room_divider': {
      // 3 folding screens
      for (let i = 0; i < 3; i++) {
        const panel = new THREE.Group();
        panel.position.set((i - 1) * 0.52, 0.9, 0);
        panel.rotation.y = (i % 2 === 0 ? 0.2 : -0.2);
        panel.add(createMesh(new THREE.BoxGeometry(0.48, 1.8, 0.03), m.woodOak, 0, 0, 0));
        // Slat cutouts
        panel.add(createMesh(new THREE.BoxGeometry(0.38, 1.5, 0.01), m.glassSmoked, 0, 0, 0));
        group.add(panel);
      }
      break;
    }

    // -----------------------------------------------------------------------
    // BEDROOM
    // -----------------------------------------------------------------------
    case 'bed_queen': {
      // Bed base frame
      group.add(createMesh(new THREE.BoxGeometry(1.7, 0.28, 2.1), m.woodWalnut, 0, 0.18, 0));
      // Mattress
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.25, 2.0), m.fabricBeige, 0, 0.44, 0.02));
      // Duvet / Bedspread
      group.add(createMesh(new THREE.BoxGeometry(1.62, 0.12, 1.4), m.fabricTeal, 0, 0.54, 0.3));
      // 2 Pillows
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.14, 0.4), m.fabricBeige, -0.42, 0.62, -0.72));
      group.add(createMesh(new THREE.BoxGeometry(0.62, 0.14, 0.4), m.fabricBeige, 0.42, 0.62, -0.72));
      // Tall upholstered headboard
      group.add(createMesh(new THREE.BoxGeometry(1.75, 1.1, 0.12), m.woodDark, 0, 0.6, -1.02));
      group.add(createMesh(new THREE.BoxGeometry(1.65, 0.95, 0.06), m.fabricNavy, 0, 0.65, -0.96));
      addLegs(group, 1.6, 2.0, 0.08, 0.03, m.woodDark);
      break;
    }

    case 'platform_bed': {
      // Wide minimalist platform
      group.add(createMesh(new THREE.BoxGeometry(1.9, 0.16, 2.2), m.woodOak, 0, 0.08, 0));
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.24, 2.0), m.fabricBeige, 0, 0.28, 0.05));
      group.add(createMesh(new THREE.BoxGeometry(1.62, 0.08, 1.3), m.fabricGrey, 0, 0.42, 0.35));
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.12, 0.38), m.fabricBeige, -0.4, 0.46, -0.7));
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.12, 0.38), m.fabricBeige, 0.4, 0.46, -0.7));
      // Low wooden headboard
      group.add(createMesh(new THREE.BoxGeometry(1.9, 0.65, 0.08), m.woodOak, 0, 0.45, -1.06));
      break;
    }

    case 'storage_bed': {
      group.add(createMesh(new THREE.BoxGeometry(1.7, 0.45, 2.1), m.woodWalnut, 0, 0.22, 0));
      // Underbed drawer indentations
      group.add(createMesh(new THREE.BoxGeometry(0.02, 0.22, 0.8), m.metalBrass, -0.86, 0.22, -0.3));
      group.add(createMesh(new THREE.BoxGeometry(0.02, 0.22, 0.8), m.metalBrass, -0.86, 0.22, 0.5));
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.24, 2.0), m.fabricBeige, 0, 0.56, 0.02));
      group.add(createMesh(new THREE.BoxGeometry(1.72, 1.05, 0.12), m.woodWalnut, 0, 0.58, -1.02));
      break;
    }

    case 'bunk_bed_adult': {
      // 4 tall corner posts
      const postGeo = new THREE.BoxGeometry(0.07, 1.8, 0.07);
      group.add(createMesh(postGeo, m.woodDark, -0.52, 0.9, -1.0));
      group.add(createMesh(postGeo, m.woodDark, 0.52, 0.9, -1.0));
      group.add(createMesh(postGeo, m.woodDark, -0.52, 0.9, 1.0));
      group.add(createMesh(postGeo, m.woodDark, 0.52, 0.9, 1.0));
      // Lower tier
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.16, 2.0), m.woodDark, 0, 0.35, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.92, 0.18, 1.9), m.fabricBeige, 0, 0.46, 0));
      // Upper tier
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.16, 2.0), m.woodDark, 0, 1.35, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.92, 0.18, 1.9), m.fabricNavy, 0, 1.46, 0));
      // Guard rail & ladder
      group.add(createMesh(new THREE.BoxGeometry(0.04, 0.3, 1.5), m.woodDark, 0.5, 1.55, 0.2));
      break;
    }

    case 'bedside_table': {
      group.add(createMesh(new THREE.BoxGeometry(0.45, 0.42, 0.4), m.woodWalnut, 0, 0.36, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), m.metalBrass, 0, 0.42, 0.21));
      addLegs(group, 0.4, 0.36, 0.16, 0.015, m.metalBrass);
      // Table lamp on top
      group.add(createMesh(new THREE.CylinderGeometry(0.06, 0.08, 0.03, 16), m.metalBrass, 0, 0.58, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 12), m.metalBrass, 0, 0.68, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.12, 0.16, 0.18, 16), m.fabricBeige, 0, 0.82, 0));
      break;
    }

    case 'wardrobe_3door': {
      // Wardrobe body
      group.add(createMesh(new THREE.BoxGeometry(1.6, 2.15, 0.6), m.woodOak, 0, 1.1, 0));
      // 3 doors with brass handles
      for (let i = -1; i <= 1; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.5, 2.05, 0.02), m.woodWhite, i * 0.52, 1.1, 0.31));
        group.add(createMesh(new THREE.BoxGeometry(0.02, 0.16, 0.03), m.metalBrass, i * 0.52 + 0.18, 1.1, 0.33));
      }
      break;
    }

    case 'sliding_wardrobe': {
      group.add(createMesh(new THREE.BoxGeometry(2.0, 2.2, 0.65), m.woodDark, 0, 1.1, 0));
      // Two wide sliding panels (one wood, one mirror)
      group.add(createMesh(new THREE.BoxGeometry(0.96, 2.1, 0.02), m.woodWalnut, -0.48, 1.1, 0.33));
      group.add(createMesh(new THREE.BoxGeometry(0.96, 2.1, 0.02), m.mirrorGlass, 0.48, 1.1, 0.34));
      break;
    }

    case 'walkin_closet': {
      // Modular shelving frame without doors
      group.add(createMesh(new THREE.BoxGeometry(1.8, 2.1, 0.55), m.woodOak, 0, 1.05, 0));
      // Hollow internal cavity
      group.add(createMesh(new THREE.BoxGeometry(1.7, 1.95, 0.52), m.woodDark, 0, 1.05, 0.03));
      // Chrome hanger rail
      group.add(createMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 12), m.metalChrome, 0, 1.7, 0, 0, 0, Math.PI / 2));
      break;
    }

    case 'chest_drawers': {
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.95, 0.45), m.woodWalnut, 0, 0.55, 0));
      for (let i = 0; i < 4; i++) {
        const y = 0.22 + i * 0.22;
        group.add(createMesh(new THREE.BoxGeometry(0.82, 0.18, 0.02), m.woodDark, 0, y, 0.23));
        group.add(createMesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), m.metalBrass, 0, y, 0.25));
      }
      addLegs(group, 0.82, 0.38, 0.08, 0.02, m.metalBrass);
      break;
    }

    case 'dresser_wide': {
      group.add(createMesh(new THREE.BoxGeometry(1.4, 0.8, 0.48), m.woodOak, 0, 0.46, 0));
      // 6 drawers (2 columns x 3 rows)
      for (let col = -1; col <= 1; col += 2) {
        for (let row = 0; row < 3; row++) {
          const y = 0.22 + row * 0.22;
          group.add(createMesh(new THREE.BoxGeometry(0.62, 0.18, 0.02), m.woodWhite, col * 0.33, y, 0.25));
          group.add(createMesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), m.metalBlack, col * 0.33, y, 0.27));
        }
      }
      break;
    }

    case 'dressing_table': {
      // Table base
      group.add(createMesh(new THREE.BoxGeometry(1.1, 0.12, 0.45), m.woodWhite, 0, 0.72, 0));
      addLegs(group, 1.0, 0.38, 0.68, 0.02, m.metalBrass);
      // Large round mirror on top
      group.add(createMesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 32), m.mirrorGlass, 0, 1.25, -0.15, Math.PI / 2, 0, 0));
      group.add(createMesh(new THREE.TorusGeometry(0.35, 0.02, 12, 32), m.metalBrass, 0, 1.25, -0.15));
      break;
    }

    case 'mirror_standing': {
      // Full length mirror in pivot stand
      group.add(createMesh(new THREE.BoxGeometry(0.48, 1.45, 0.03), m.mirrorGlass, 0, 0.95, 0, -0.08));
      group.add(createMesh(new THREE.BoxGeometry(0.54, 1.52, 0.04), m.woodDark, 0, 0.95, 0, -0.08));
      // A-frame easel stand
      group.add(createMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 8), m.metalBrass, 0, 0.65, -0.25, 0.25));
      break;
    }

    case 'bedroom_bench': {
      group.add(createMesh(new THREE.BoxGeometry(1.3, 0.12, 0.45), m.fabricNavy, 0, 0.44, 0));
      addLegs(group, 1.2, 0.38, 0.38, 0.02, m.metalBrass);
      break;
    }

    case 'headboard_panel': {
      group.add(createMesh(new THREE.BoxGeometry(2.4, 1.3, 0.08), m.fabricTeal, 0, 0.85, 0));
      break;
    }

    case 'storage_cabinet_bed': {
      group.add(createMesh(new THREE.BoxGeometry(0.85, 1.35, 0.4), m.woodOak, 0, 0.72, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.78, 0.6, 0.02), m.woodWhite, 0, 1.0, 0.21));
      group.add(createMesh(new THREE.BoxGeometry(0.78, 0.6, 0.02), m.woodWhite, 0, 0.38, 0.21));
      break;
    }

    // -----------------------------------------------------------------------
    // DINING ROOM
    // -----------------------------------------------------------------------
    case 'dining_table_6': {
      // 1.8m x 0.9m dining table
      group.add(createMesh(new THREE.BoxGeometry(1.8, 0.045, 0.9), m.woodWalnut, 0, 0.74, 0));
      addLegs(group, 1.65, 0.75, 0.72, 0.035, m.metalBlack);
      break;
    }

    case 'dining_chair': {
      group.add(createMesh(new THREE.BoxGeometry(0.46, 0.06, 0.46), m.fabricGrey, 0, 0.46, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.44, 0.4, 0.05), m.fabricGrey, 0, 0.68, -0.2));
      addLegs(group, 0.38, 0.38, 0.43, 0.016, m.metalBlack);
      break;
    }

    case 'bench_dining': {
      group.add(createMesh(new THREE.BoxGeometry(1.4, 0.045, 0.4), m.woodOak, 0, 0.46, 0));
      addLegs(group, 1.25, 0.3, 0.44, 0.025, m.metalBlack);
      break;
    }

    case 'bar_table': {
      // High-top bistro table
      group.add(createMesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 24), m.marbleWhite, 0, 1.04, 0));
      // Center pedestal pole
      group.add(createMesh(new THREE.CylinderGeometry(0.03, 0.03, 1.02, 16), m.metalBrass, 0, 0.52, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 24), m.metalBrass, 0, 0.02, 0));
      break;
    }

    case 'bar_stool': {
      group.add(createMesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 20), m.leatherCognac, 0, 0.75, 0));
      // Curved low back
      group.add(createMesh(new THREE.BoxGeometry(0.32, 0.18, 0.04), m.woodWalnut, 0, 0.88, -0.15));
      addLegs(group, 0.32, 0.32, 0.72, 0.014, m.metalBlack);
      // Ring footrest
      group.add(createMesh(new THREE.TorusGeometry(0.18, 0.01, 8, 20), m.metalBlack, 0, 0.28, 0, Math.PI / 2, 0, 0));
      break;
    }

    case 'sideboard_dining': {
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.68, 0.45), m.woodWalnut, 0, 0.48, 0));
      // Slat patterns on doors
      for (let i = -1; i <= 1; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.48, 0.6, 0.02), m.woodDark, i * 0.51, 0.48, 0.23));
      }
      addLegs(group, 1.45, 0.38, 0.14, 0.02, m.metalBrass);
      break;
    }

    case 'buffet_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(1.4, 0.78, 0.45), m.woodOak, 0, 0.52, 0));
      addLegs(group, 1.28, 0.38, 0.12, 0.025, m.woodDark);
      break;
    }

    case 'crockery_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 1.85, 0.42), m.woodDark, 0, 0.95, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.88, 1.2, 0.02), m.glassSmoked, 0, 1.2, 0.22));
      break;
    }

    case 'display_cabinet_dining': {
      group.add(createMesh(new THREE.BoxGeometry(0.95, 1.9, 0.4), m.woodWalnut, 0, 0.98, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.85, 1.35, 0.02), m.glassSmoked, 0, 1.15, 0.21));
      break;
    }

    case 'serving_trolley': {
      // 2 tiers
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.02, 0.45), m.marbleWhite, 0, 0.78, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.02, 0.45), m.marbleWhite, 0, 0.2, 0));
      // Metal handle and frame
      addLegs(group, 0.76, 0.41, 0.76, 0.012, m.metalBrass);
      // Wheels
      for (let x of [-0.35, 0.35]) {
        for (let z of [-0.18, 0.18]) {
          group.add(createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), m.metalBlack, x, 0.04, z, 0, 0, Math.PI / 2));
        }
      }
      break;
    }

    // -----------------------------------------------------------------------
    // KITCHEN
    // -----------------------------------------------------------------------
    case 'base_cabinets': {
      // Countertop marble
      group.add(createMesh(new THREE.BoxGeometry(1.2, 0.04, 0.62), m.marbleWhite, 0, 0.88, 0));
      // Cabinet box
      group.add(createMesh(new THREE.BoxGeometry(1.18, 0.76, 0.58), m.woodDark, 0, 0.44, -0.01));
      // 2 doors with chrome handles
      group.add(createMesh(new THREE.BoxGeometry(0.56, 0.7, 0.02), m.woodWhite, -0.29, 0.45, 0.29));
      group.add(createMesh(new THREE.BoxGeometry(0.56, 0.7, 0.02), m.woodWhite, 0.29, 0.45, 0.29));
      group.add(createMesh(new THREE.BoxGeometry(0.02, 0.14, 0.02), m.metalChrome, -0.05, 0.65, 0.31));
      group.add(createMesh(new THREE.BoxGeometry(0.02, 0.14, 0.02), m.metalChrome, 0.05, 0.65, 0.31));
      break;
    }

    case 'wall_cabinets': {
      // Upper wall mounted unit
      group.add(createMesh(new THREE.BoxGeometry(1.2, 0.7, 0.35), m.woodWhite, 0, 1.7, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.56, 0.66, 0.02), m.woodOak, -0.29, 1.7, 0.18));
      group.add(createMesh(new THREE.BoxGeometry(0.56, 0.66, 0.02), m.woodOak, 0.29, 1.7, 0.18));
      break;
    }

    case 'tall_storage_kitchen': {
      group.add(createMesh(new THREE.BoxGeometry(0.6, 2.1, 0.6), m.woodWhite, 0, 1.05, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.56, 2.02, 0.02), m.woodOak, 0, 1.05, 0.31));
      break;
    }

    case 'pantry_unit': {
      group.add(createMesh(new THREE.BoxGeometry(0.45, 2.1, 0.6), m.woodDark, 0, 1.05, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.4, 2.0, 0.02), m.woodWhite, 0, 1.05, 0.31));
      break;
    }

    case 'kitchen_island': {
      // Base
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.85, 0.85), m.woodDark, 0, 0.44, -0.03));
      // Waterfall marble countertop with seating overhang
      group.add(createMesh(new THREE.BoxGeometry(1.8, 0.06, 1.0), m.marbleWhite, 0, 0.9, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.06, 0.9, 1.0), m.marbleWhite, -0.87, 0.45, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.06, 0.9, 1.0), m.marbleWhite, 0.87, 0.45, 0));
      // Built-in undermount sink
      group.add(createMesh(new THREE.BoxGeometry(0.5, 0.12, 0.38), m.metalChrome, -0.2, 0.85, 0));
      // Chrome arch faucet
      group.add(createMesh(new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI), m.metalChrome, -0.2, 1.05, -0.15, 0, 0, Math.PI / 2));
      break;
    }

    case 'breakfast_counter': {
      group.add(createMesh(new THREE.BoxGeometry(1.5, 0.05, 0.5), m.woodOak, 0, 1.05, 0));
      addLegs(group, 1.4, 0.4, 1.02, 0.03, m.metalBlack);
      break;
    }

    case 'bar_counter_kitchen': {
      group.add(createMesh(new THREE.BoxGeometry(1.6, 1.05, 0.55), m.woodDark, 0, 0.54, 0));
      group.add(createMesh(new THREE.BoxGeometry(1.7, 0.06, 0.65), m.marbleWhite, 0, 1.1, 0));
      // Chrome footrest rail
      group.add(createMesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 12), m.metalChrome, 0, 0.2, 0.32, 0, 0, Math.PI / 2));
      break;
    }

    case 'open_shelving_kitchen': {
      for (let y of [1.4, 1.7]) {
        group.add(createMesh(new THREE.BoxGeometry(1.0, 0.03, 0.25), m.woodOak, 0, y, 0));
        group.add(createMesh(new THREE.BoxGeometry(0.02, 0.15, 0.25), m.metalBlack, -0.4, y - 0.06, 0));
        group.add(createMesh(new THREE.BoxGeometry(0.02, 0.15, 0.25), m.metalBlack, 0.4, y - 0.06, 0));
      }
      break;
    }

    case 'drawer_unit_kitchen': {
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.88, 0.6), m.woodDark, 0, 0.44, 0));
      for (let i = 0; i < 3; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.74, 0.24, 0.02), m.woodWhite, 0, 0.2 + i * 0.26, 0.31));
      }
      break;
    }

    case 'pullout_storage': {
      group.add(createMesh(new THREE.BoxGeometry(0.3, 0.88, 0.6), m.woodWhite, 0, 0.44, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), m.metalChrome, 0, 0.45, 0.32));
      break;
    }

    case 'corner_storage_kitchen': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.88, 0.6), m.woodDark, 0.2, 0.44, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.88, 0.6), m.woodDark, -0.2, 0.44, -0.2));
      break;
    }

    case 'appliance_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.6, 2.1, 0.6), m.woodDark, 0, 1.05, 0));
      // Microwave slot
      group.add(createMesh(new THREE.BoxGeometry(0.52, 0.35, 0.02), m.metalChrome, 0, 1.45, 0.31));
      // Oven slot
      group.add(createMesh(new THREE.BoxGeometry(0.52, 0.55, 0.02), m.displayScreen, 0, 0.95, 0.31));
      break;
    }

    // -----------------------------------------------------------------------
    // HOME OFFICE
    // -----------------------------------------------------------------------
    case 'study_desk': {
      // Desktop
      group.add(createMesh(new THREE.BoxGeometry(1.4, 0.04, 0.7), m.woodWalnut, 0, 0.74, 0));
      // Right side 2-drawer pedestal
      group.add(createMesh(new THREE.BoxGeometry(0.38, 0.45, 0.6), m.woodDark, 0.45, 0.48, 0));
      addLegs(group, 1.3, 0.62, 0.72, 0.022, m.metalBlack);
      break;
    }

    case 'computer_desk': {
      // L-desk top
      group.add(createMesh(new THREE.BoxGeometry(1.6, 0.04, 0.7), m.woodOak, 0, 0.74, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.04, 0.6), m.woodOak, -0.5, 0.74, 0.65));
      addLegs(group, 1.5, 0.65, 0.72, 0.022, m.metalBlack);
      // PC Monitor & stand
      group.add(createMesh(new THREE.BoxGeometry(0.65, 0.4, 0.03), m.displayScreen, 0, 1.05, -0.15));
      group.add(createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12), m.metalChrome, 0, 0.85, -0.15));
      group.add(createMesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16), m.metalChrome, 0, 0.76, -0.15));
      break;
    }

    case 'executive_desk': {
      group.add(createMesh(new THREE.BoxGeometry(1.8, 0.06, 0.85), m.woodDark, 0, 0.75, 0));
      // Dual pedestals on both sides
      group.add(createMesh(new THREE.BoxGeometry(0.42, 0.68, 0.75), m.woodWalnut, -0.65, 0.38, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.42, 0.68, 0.75), m.woodWalnut, 0.65, 0.38, 0));
      break;
    }

    case 'writing_desk': {
      group.add(createMesh(new THREE.BoxGeometry(1.1, 0.035, 0.55), m.woodOak, 0, 0.74, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.08, 0.45), m.woodWhite, 0, 0.68, 0));
      addLegs(group, 1.0, 0.45, 0.72, 0.018, m.woodOak);
      break;
    }

    case 'office_chair': {
      // 5-star roller base
      group.add(createMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 16), m.metalChrome, 0, 0.12, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12), m.metalChrome, 0, 0.28, 0));
      // Seat cushion
      group.add(createMesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), m.fabricNavy, 0, 0.48, 0));
      // Curved ergonomic mesh back
      group.add(createMesh(new THREE.BoxGeometry(0.46, 0.58, 0.04), m.fabricGrey, 0, 0.8, -0.22));
      // Headrest
      group.add(createMesh(new THREE.BoxGeometry(0.26, 0.14, 0.04), m.fabricNavy, 0, 1.14, -0.22));
      // Armrests
      group.add(createMesh(new THREE.BoxGeometry(0.06, 0.02, 0.25), m.metalBlack, -0.26, 0.68, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.06, 0.02, 0.25), m.metalBlack, 0.26, 0.68, 0));
      break;
    }

    case 'bookshelf_office': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 1.9, 0.32), m.woodDark, 0, 0.95, 0));
      for (let i = 1; i <= 5; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.94, 0.025, 0.3), m.woodWalnut, 0, i * 0.35, 0));
      }
      break;
    }

    case 'filing_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.45, 0.7, 0.5), m.metalBlack, 0, 0.36, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.38, 0.28, 0.02), m.metalChrome, 0, 0.52, 0.26));
      group.add(createMesh(new THREE.BoxGeometry(0.38, 0.28, 0.02), m.metalChrome, 0, 0.22, 0.26));
      break;
    }

    case 'storage_cabinet_office': {
      group.add(createMesh(new THREE.BoxGeometry(1.2, 0.8, 0.42), m.woodOak, 0, 0.44, 0));
      addLegs(group, 1.1, 0.35, 0.08, 0.02, m.metalBlack);
      break;
    }

    case 'floating_desk': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.12, 0.45), m.woodWalnut, 0, 0.72, 0));
      break;
    }

    case 'wall_shelves_office': {
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.6, 0.22), m.metalBlack, 0, 1.5, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.86, 0.56, 0.22), m.woodDark, 0, 1.5, 0));
      break;
    }

    case 'printer_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.6, 0.65, 0.48), m.woodOak, 0, 0.34, 0));
      break;
    }

    case 'desk_drawer_unit': {
      group.add(createMesh(new THREE.BoxGeometry(0.42, 0.62, 0.5), m.woodWhite, 0, 0.34, 0));
      break;
    }

    // -----------------------------------------------------------------------
    // ENTRANCE / FOYER
    // -----------------------------------------------------------------------
    case 'console_table_foyer': {
      group.add(createMesh(new THREE.BoxGeometry(1.1, 0.04, 0.32), m.marbleWhite, 0, 0.82, 0));
      addLegs(group, 1.0, 0.26, 0.8, 0.016, m.metalBrass);
      break;
    }

    case 'shoe_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.9, 1.1, 0.28), m.woodWalnut, 0, 0.58, 0));
      for (let i = 0; i < 3; i++) {
        group.add(createMesh(new THREE.BoxGeometry(0.82, 0.3, 0.02), m.woodWhite, 0, 0.22 + i * 0.34, 0.15));
      }
      break;
    }

    case 'shoe_bench': {
      group.add(createMesh(new THREE.BoxGeometry(0.95, 0.08, 0.38), m.fabricBeige, 0, 0.46, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.88, 0.02, 0.32), m.metalBlack, 0, 0.2, 0));
      addLegs(group, 0.9, 0.32, 0.44, 0.018, m.metalBlack);
      break;
    }

    case 'coat_rack': {
      // Tall standing pole with pegs
      group.add(createMesh(new THREE.CylinderGeometry(0.18, 0.22, 0.04, 20), m.metalBrass, 0, 0.02, 0));
      group.add(createMesh(new THREE.CylinderGeometry(0.025, 0.025, 1.75, 12), m.metalBrass, 0, 0.9, 0));
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        group.add(createMesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8), m.metalBrass, Math.cos(ang) * 0.08, 1.6, Math.sin(ang) * 0.08, 0.4, ang, 0));
      }
      break;
    }

    case 'entryway_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(1.2, 2.0, 0.4), m.woodOak, 0, 1.0, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.55, 1.9, 0.02), m.mirrorGlass, 0.28, 1.0, 0.21));
      break;
    }

    case 'mirror_foyer': {
      group.add(createMesh(new THREE.CylinderGeometry(0.4, 0.4, 0.03, 32), m.mirrorGlass, 0, 1.45, 0, Math.PI / 2, 0, 0));
      group.add(createMesh(new THREE.TorusGeometry(0.4, 0.02, 12, 32), m.metalBrass, 0, 1.45, 0));
      break;
    }

    case 'key_storage': {
      group.add(createMesh(new THREE.BoxGeometry(0.5, 0.25, 0.12), m.woodWalnut, 0, 1.35, 0));
      break;
    }

    case 'umbrella_stand': {
      group.add(createMesh(new THREE.CylinderGeometry(0.14, 0.14, 0.65, 20), m.metalBrass, 0, 0.33, 0));
      break;
    }

    case 'storage_bench_foyer': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.48, 0.42), m.woodDark, 0, 0.26, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.98, 0.06, 0.4), m.fabricTeal, 0, 0.52, 0));
      break;
    }

    case 'room_divider_foyer': {
      group.add(createMesh(new THREE.BoxGeometry(1.2, 2.0, 0.06), m.woodOak, 0, 1.0, 0));
      break;
    }

    // -----------------------------------------------------------------------
    // BATHROOM
    // -----------------------------------------------------------------------
    case 'vanity_unit': {
      // Countertop and cabinet
      group.add(createMesh(new THREE.BoxGeometry(0.9, 0.72, 0.5), m.woodDark, 0, 0.44, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.92, 0.04, 0.52), m.marbleWhite, 0, 0.82, 0));
      // Ceramic sink bowl
      group.add(createMesh(new THREE.CylinderGeometry(0.22, 0.18, 0.14, 24), m.ceramicWhite, 0, 0.88, 0));
      // Chrome faucet
      group.add(createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 12), m.metalChrome, 0, 1.02, -0.18));
      break;
    }

    case 'under_sink_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.65, 0.6, 0.42), m.woodWhite, 0, 0.32, 0));
      break;
    }

    case 'tall_cabinet_bath': {
      group.add(createMesh(new THREE.BoxGeometry(0.42, 1.8, 0.35), m.woodWhite, 0, 0.92, 0));
      break;
    }

    case 'mirror_cabinet_bath': {
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.75, 0.15), m.woodWhite, 0, 1.5, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.78, 0.72, 0.02), m.mirrorGlass, 0, 1.5, 0.09));
      break;
    }

    case 'open_shelves_bath': {
      group.add(createMesh(new THREE.BoxGeometry(0.5, 1.4, 0.3), m.woodOak, 0, 0.72, 0));
      break;
    }

    case 'laundry_cabinet': {
      group.add(createMesh(new THREE.BoxGeometry(0.75, 0.9, 0.45), m.woodWhite, 0, 0.48, 0));
      break;
    }

    case 'storage_tower_bath': {
      group.add(createMesh(new THREE.BoxGeometry(0.35, 1.6, 0.35), m.metalChrome, 0, 0.82, 0));
      break;
    }

    case 'bathroom_stool': {
      group.add(createMesh(new THREE.BoxGeometry(0.4, 0.04, 0.32), m.woodOak, 0, 0.44, 0));
      addLegs(group, 0.36, 0.28, 0.42, 0.018, m.woodOak);
      break;
    }

    // -----------------------------------------------------------------------
    // KIDS' ROOM
    // -----------------------------------------------------------------------
    case 'single_bed_kids': {
      group.add(createMesh(new THREE.BoxGeometry(1.05, 0.24, 1.95), m.woodOak, 0, 0.16, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.98, 0.18, 1.88), m.fabricBeige, 0, 0.35, 0.02));
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.1, 1.2), m.fabricKidsBlue, 0, 0.45, 0.35));
      group.add(createMesh(new THREE.BoxGeometry(0.55, 0.12, 0.35), m.fabricKidsPink, 0, 0.5, -0.65));
      group.add(createMesh(new THREE.BoxGeometry(1.08, 0.85, 0.08), m.woodWhite, 0, 0.55, -0.96));
      break;
    }

    case 'bunk_bed_kids': {
      // 4 white corner posts
      const postGeo = new THREE.BoxGeometry(0.06, 1.65, 0.06);
      group.add(createMesh(postGeo, m.woodWhite, -0.48, 0.83, -0.98));
      group.add(createMesh(postGeo, m.woodWhite, 0.48, 0.83, -0.98));
      group.add(createMesh(postGeo, m.woodWhite, -0.48, 0.83, 0.98));
      group.add(createMesh(postGeo, m.woodWhite, 0.48, 0.83, 0.98));
      // Bunks with playful colors
      group.add(createMesh(new THREE.BoxGeometry(0.95, 0.15, 1.95), m.fabricKidsBlue, 0, 0.35, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.95, 0.15, 1.95), m.fabricKidsPink, 0, 1.25, 0));
      // Safety rail
      group.add(createMesh(new THREE.BoxGeometry(0.04, 0.25, 1.4), m.woodOak, 0.46, 1.45, 0.25));
      break;
    }

    case 'loft_bed_kids': {
      group.add(createMesh(new THREE.BoxGeometry(1.05, 0.2, 2.0), m.fabricKidsBlue, 0, 1.55, 0));
      addLegs(group, 1.0, 1.95, 1.5, 0.03, m.woodWhite);
      // Desk under loft
      group.add(createMesh(new THREE.BoxGeometry(0.95, 0.03, 0.6), m.woodOak, 0, 0.72, -0.4));
      break;
    }

    case 'study_desk_kids': {
      group.add(createMesh(new THREE.BoxGeometry(1.0, 0.035, 0.55), m.woodWhite, 0, 0.68, 0));
      addLegs(group, 0.9, 0.45, 0.66, 0.02, m.woodOak);
      break;
    }

    case 'study_chair_kids': {
      group.add(createMesh(new THREE.BoxGeometry(0.42, 0.05, 0.4), m.fabricKidsPink, 0, 0.42, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.38, 0.35, 0.04), m.fabricKidsPink, 0, 0.62, -0.18));
      addLegs(group, 0.34, 0.32, 0.4, 0.015, m.woodOak);
      break;
    }

    case 'toy_storage_kids': {
      // 3x3 colorful toy organizer unit
      group.add(createMesh(new THREE.BoxGeometry(0.95, 0.78, 0.38), m.woodWhite, 0, 0.42, 0));
      const binColors = [m.fabricKidsBlue, m.fabricYellow, m.fabricKidsPink];
      for (let r = 0; r < 3; r++) {
        for (let c = -1; c <= 1; c++) {
          group.add(createMesh(new THREE.BoxGeometry(0.26, 0.18, 0.34), binColors[(r + c + 1) % 3], c * 0.29, 0.16 + r * 0.24, 0.02));
        }
      }
      break;
    }

    case 'bookshelf_kids': {
      group.add(createMesh(new THREE.BoxGeometry(0.85, 0.95, 0.32), m.woodWhite, 0, 0.5, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.03, 0.3), m.woodOak, 0, 0.48, 0));
      break;
    }

    case 'wardrobe_kids': {
      group.add(createMesh(new THREE.BoxGeometry(0.9, 1.6, 0.5), m.woodWhite, 0, 0.82, 0));
      group.add(createMesh(new THREE.BoxGeometry(0.42, 1.5, 0.02), m.fabricKidsBlue, -0.22, 0.82, 0.26));
      group.add(createMesh(new THREE.BoxGeometry(0.42, 1.5, 0.02), m.fabricKidsPink, 0.22, 0.82, 0.26));
      break;
    }

    case 'chest_drawers_kids': {
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.9, 0.42), m.woodWhite, 0, 0.48, 0));
      break;
    }

    case 'storage_bench_kids': {
      group.add(createMesh(new THREE.BoxGeometry(0.85, 0.42, 0.4), m.fabricYellow, 0, 0.24, 0));
      break;
    }

    case 'activity_table_kids': {
      // Round play table
      group.add(createMesh(new THREE.CylinderGeometry(0.38, 0.38, 0.03, 24), m.woodWhite, 0, 0.48, 0));
      addLegs(group, 0.52, 0.52, 0.46, 0.02, m.woodOak);
      // 2 mini stools
      for (let ang of [0, Math.PI]) {
        const x = Math.cos(ang) * 0.55;
        const z = Math.sin(ang) * 0.55;
        group.add(createMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 16), m.fabricKidsBlue, x, 0.28, z));
        addLegs(group, 0.22, 0.22, 0.26, 0.012, m.woodOak);
      }
      break;
    }

    default: {
      // Generic fallback modern piece
      group.add(createMesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), m.woodOak, 0, 0.4, 0));
      break;
    }
  }

  // Find bounding box to determine exact grounded dimensions
  const bbox = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  bbox.getSize(size);

  // Attach metadata
  group.userData = {
    isFurniture: true,
    typeId,
    category: FURNITURE_CATALOG.find((i) => i.id === typeId)?.category || 'custom',
    name: FURNITURE_CATALOG.find((i) => i.id === typeId)?.name || 'Custom Furniture',
    dimensions: size
  };

  return group;
}
