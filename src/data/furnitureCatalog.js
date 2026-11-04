/**
 * Central Furniture Catalog Data Layer & Persistence Store
 * Separates catalog data and pricing rules from 3D rendering.
 */

export const FURNITURE_CATEGORIES = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'dining', name: 'Dining Room', icon: '🍽️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
  { id: 'office', name: 'Home Office', icon: '💻' },
  { id: 'foyer', name: 'Entrance & Foyer', icon: '🚪' },
  { id: 'kids', name: "Kids' Room", icon: '🧸' },
  { id: 'decor', name: 'Lighting & Decor', icon: '✨' }
];

export const PRICING_UNITS = [
  { id: 'piece', label: 'Per Piece' },
  { id: 'sqft', label: 'Per Sq Ft' },
  { id: 'rft', label: 'Per Running Ft' }
];

export const DEFAULT_FURNITURE_CATALOG = [
  // 1. 🛋️ LIVING ROOM
  {
    id: 'sofa_3seater',
    name: '3-Seater Architect Sofa',
    category: 'living',
    sku: 'LR-SOF-001',
    price: 38500,
    unit: 'piece',
    dim: '2.2 × 0.9 × 0.85 m',
    dimensions: { width: 2.2, depth: 0.9, height: 0.85 },
    description: 'Deep-seat Scandinavian 3-seater sofa with dark walnut frame and high-density performance fabric.',
    enabled: true,
    modelId: 'sofa_3seater'
  },
  {
    id: 'sofa_sectional',
    name: 'Sectional L-Sofa Lounge',
    category: 'living',
    sku: 'LR-SOF-002',
    price: 64900,
    unit: 'piece',
    dim: '2.6 × 1.8 × 0.85 m',
    dimensions: { width: 2.6, depth: 1.8, height: 0.85 },
    description: 'Spacious L-shaped modular sectional sofa in navy upholstery with brass tipped legs.',
    enabled: true,
    modelId: 'sofa_sectional'
  },
  {
    id: 'loveseat',
    name: 'Urban Loveseat (2-Seater)',
    category: 'living',
    sku: 'LR-SOF-003',
    price: 24500,
    unit: 'piece',
    dim: '1.6 × 0.85 × 0.82 m',
    dimensions: { width: 1.6, depth: 0.85, height: 0.82 },
    description: 'Compact 2-seater loveseat ideal for modern urban living and apartment balconies.',
    enabled: true,
    modelId: 'loveseat'
  },
  {
    id: 'armchair',
    name: 'Nordic Lounge Armchair',
    category: 'living',
    sku: 'LR-CHR-001',
    price: 16800,
    unit: 'piece',
    dim: '0.85 × 0.85 × 0.85 m',
    dimensions: { width: 0.85, depth: 0.85, height: 0.85 },
    description: 'Accent lounge armchair with plush curved backrest and solid oak tapered legs.',
    enabled: true,
    modelId: 'armchair'
  },
  {
    id: 'recliner',
    name: 'Cognac Leather Recliner',
    category: 'living',
    sku: 'LR-REC-001',
    price: 32000,
    unit: 'piece',
    dim: '0.9 × 1.0 × 1.0 m',
    dimensions: { width: 0.9, depth: 1.0, height: 1.0 },
    description: 'Ergonomic manual reclining armchair upholstered in supple cognac leather.',
    enabled: true,
    modelId: 'recliner'
  },
  {
    id: 'coffee_table',
    name: 'Modern Slate Coffee Table',
    category: 'living',
    sku: 'LR-TBL-001',
    price: 14500,
    unit: 'piece',
    dim: '1.2 × 0.6 × 0.45 m',
    dimensions: { width: 1.2, depth: 0.6, height: 0.45 },
    description: 'Minimalist low-profile coffee table with black steel frame and natural wood top.',
    enabled: true,
    modelId: 'coffee_table'
  },
  {
    id: 'side_table',
    name: 'Aura Side / End Table',
    category: 'living',
    sku: 'LR-TBL-002',
    price: 6800,
    unit: 'piece',
    dim: '0.5 × 0.5 × 0.55 m',
    dimensions: { width: 0.5, depth: 0.5, height: 0.55 },
    description: 'Cylindrical brass and smoked glass accent side table for reading corners.',
    enabled: true,
    modelId: 'side_table'
  },
  {
    id: 'tv_unit',
    name: 'Media Console & TV Unit',
    category: 'living',
    sku: 'LR-ENT-001',
    price: 29500,
    unit: 'piece',
    dim: '2.0 × 0.45 × 0.5 m',
    dimensions: { width: 2.0, depth: 0.45, height: 0.5 },
    description: 'Floating-look entertainment console with fluted sliding panels and cable routing.',
    enabled: true,
    modelId: 'tv_unit'
  },
  {
    id: 'bookshelf_living',
    name: 'Open Architectural Bookshelf',
    category: 'living',
    sku: 'LR-SHF-001',
    price: 22000,
    unit: 'piece',
    dim: '1.0 × 0.35 × 1.8 m',
    dimensions: { width: 1.0, depth: 0.35, height: 1.8 },
    description: '5-shelf modular display bookshelf with matte black frame and walnut shelves.',
    enabled: true,
    modelId: 'bookshelf_living'
  },
  {
    id: 'nesting_tables',
    name: 'Duo Nesting Coffee Tables',
    category: 'living',
    sku: 'LR-TBL-003',
    price: 18200,
    unit: 'piece',
    dim: '0.8 × 0.8 × 0.48 m',
    dimensions: { width: 0.8, depth: 0.8, height: 0.48 },
    description: 'Set of two circular nesting tables with Italian Carrara marble finish.',
    enabled: true,
    modelId: 'nesting_tables'
  },

  // 2. 🛏️ BEDROOM
  {
    id: 'bed_queen',
    name: 'King Luxury Upholstered Bed',
    category: 'bedroom',
    sku: 'BR-BED-001',
    price: 52000,
    unit: 'piece',
    dim: '2.1 × 1.8 × 1.1 m',
    dimensions: { width: 1.8, depth: 2.1, height: 1.1 },
    description: 'King size architectural platform bed with tufted headboard and walnut base.',
    enabled: true,
    modelId: 'bed_queen'
  },
  {
    id: 'platform_bed',
    name: 'Minimalist Platform Bed',
    category: 'bedroom',
    sku: 'BR-BED-002',
    price: 36000,
    unit: 'piece',
    dim: '2.1 × 1.6 × 0.8 m',
    dimensions: { width: 1.6, depth: 2.1, height: 0.8 },
    description: 'Low-slung Japanese inspired platform bed frame in natural oak.',
    enabled: true,
    modelId: 'platform_bed'
  },
  {
    id: 'storage_bed',
    name: 'Hydraulic Storage Bed',
    category: 'bedroom',
    sku: 'BR-BED-003',
    price: 58000,
    unit: 'piece',
    dim: '2.1 × 1.7 × 1.05 m',
    dimensions: { width: 1.7, depth: 2.1, height: 1.05 },
    description: 'Easy-lift gas hydraulic under-bed storage unit with plush linen upholstery.',
    enabled: true,
    modelId: 'storage_bed'
  },
  {
    id: 'bedside_table',
    name: 'Nightstand with Luminaire',
    category: 'bedroom',
    sku: 'BR-NST-001',
    price: 8500,
    unit: 'piece',
    dim: '0.45 × 0.4 × 0.52 m',
    dimensions: { width: 0.45, depth: 0.4, height: 0.52 },
    description: 'Floating style nightstand with soft-close drawer and brushed brass handle.',
    enabled: true,
    modelId: 'bedside_table'
  },
  {
    id: 'wardrobe_3door',
    name: '3-Door Premium Wardrobe',
    category: 'bedroom',
    sku: 'BR-WDB-001',
    price: 48000,
    unit: 'piece',
    dim: '1.6 × 0.6 × 2.2 m',
    dimensions: { width: 1.6, depth: 0.6, height: 2.2 },
    description: 'Full height triple-door wardrobe with integrated hanger rods and drawer towers.',
    enabled: true,
    modelId: 'wardrobe_3door'
  },
  {
    id: 'sliding_wardrobe',
    name: 'Sliding Mirror Wardrobe',
    category: 'bedroom',
    sku: 'BR-WDB-002',
    price: 68000,
    unit: 'piece',
    dim: '2.0 × 0.65 × 2.2 m',
    dimensions: { width: 2.0, depth: 0.65, height: 2.2 },
    description: 'Luxury floor-to-ceiling sliding wardrobe with tinted mirror front panels.',
    enabled: true,
    modelId: 'sliding_wardrobe'
  },
  {
    id: 'dressing_table',
    name: 'Vanity Dressing Console',
    category: 'bedroom',
    sku: 'BR-DRS-001',
    price: 26500,
    unit: 'piece',
    dim: '1.1 × 0.45 × 1.4 m',
    dimensions: { width: 1.1, depth: 0.45, height: 1.4 },
    description: 'Modern vanity table with integrated LED illuminated arch mirror and dual organizer.',
    enabled: true,
    modelId: 'dressing_table'
  },
  {
    id: 'chest_drawers',
    name: '4-Drawer Bureau Chest',
    category: 'bedroom',
    sku: 'BR-CST-001',
    price: 19500,
    unit: 'piece',
    dim: '0.9 × 0.45 × 1.05 m',
    dimensions: { width: 0.9, depth: 0.45, height: 1.05 },
    description: 'Solid wood drawer chest with four deep compartments and recessed pulls.',
    enabled: true,
    modelId: 'chest_drawers'
  },

  // 3. 🍽️ DINING ROOM
  {
    id: 'dining_table_6',
    name: '6-Seater Walnut Dining Table',
    category: 'dining',
    sku: 'DR-TBL-001',
    price: 42000,
    unit: 'piece',
    dim: '1.8 × 0.9 × 0.76 m',
    dimensions: { width: 1.8, depth: 0.9, height: 0.76 },
    description: 'Chamfered edge solid walnut dining table seating 6 to 8 guests comfortably.',
    enabled: true,
    modelId: 'dining_table_6'
  },
  {
    id: 'dining_chair',
    name: 'Velvet Dining Chair (Single)',
    category: 'dining',
    sku: 'DR-CHR-001',
    price: 6500,
    unit: 'piece',
    dim: '0.48 × 0.5 × 0.85 m',
    dimensions: { width: 0.48, depth: 0.5, height: 0.85 },
    description: 'Curved shell dining chair upholstered in stain-resistant velvet with matte black legs.',
    enabled: true,
    modelId: 'dining_chair'
  },
  {
    id: 'bench_dining',
    name: 'Architectural Dining Bench',
    category: 'dining',
    sku: 'DR-BNC-001',
    price: 12500,
    unit: 'piece',
    dim: '1.4 × 0.4 × 0.46 m',
    dimensions: { width: 1.4, depth: 0.4, height: 0.46 },
    description: 'Solid oak dining bench pairing seamlessly with modern dining tables.',
    enabled: true,
    modelId: 'bench_dining'
  },
  {
    id: 'sideboard_dining',
    name: 'Dining Sideboard Credenza',
    category: 'dining',
    sku: 'DR-SBD-001',
    price: 34000,
    unit: 'piece',
    dim: '1.6 × 0.45 × 0.8 m',
    dimensions: { width: 1.6, depth: 0.45, height: 0.8 },
    description: 'Buffet credenza with slatted wooden doors and internal cutlery storage.',
    enabled: true,
    modelId: 'sideboard_dining'
  },
  {
    id: 'crockery_cabinet',
    name: 'Glass Crockery Display Cabinet',
    category: 'dining',
    sku: 'DR-CAB-001',
    price: 39000,
    unit: 'piece',
    dim: '1.0 × 0.42 × 1.85 m',
    dimensions: { width: 1.0, depth: 0.42, height: 1.85 },
    description: 'Tempered glass illuminated crockery showcase with brass hardware.',
    enabled: true,
    modelId: 'crockery_cabinet'
  },
  {
    id: 'bar_stool',
    name: 'Swivel Kitchen Island Stool',
    category: 'dining',
    sku: 'DR-STL-001',
    price: 5900,
    unit: 'piece',
    dim: '0.42 × 0.42 × 0.95 m',
    dimensions: { width: 0.42, depth: 0.42, height: 0.95 },
    description: 'Height-adjustable hydraulic counter stool with leather seat and footrest.',
    enabled: true,
    modelId: 'bar_stool'
  },

  // 4. 🍳 KITCHEN
  {
    id: 'base_cabinets',
    name: 'Modular Base Cabinet Unit (1.2m)',
    category: 'kitchen',
    sku: 'KT-CAB-001',
    price: 24000,
    unit: 'rft',
    dim: '1.2 × 0.6 × 0.88 m',
    dimensions: { width: 1.2, depth: 0.6, height: 0.88 },
    description: 'High-gloss acrylic waterproof base cabinets with quartz countertop.',
    enabled: true,
    modelId: 'base_cabinets'
  },
  {
    id: 'wall_cabinets',
    name: 'Upper Wall Hanging Cabinets',
    category: 'kitchen',
    sku: 'KT-CAB-002',
    price: 18500,
    unit: 'rft',
    dim: '1.2 × 0.35 × 0.7 m',
    dimensions: { width: 1.2, depth: 0.35, height: 0.7 },
    description: 'Handleless push-to-open overhead wall cabinets with bottom LED strip channel.',
    enabled: true,
    modelId: 'wall_cabinets'
  },
  {
    id: 'kitchen_island',
    name: 'Central Kitchen Island',
    category: 'kitchen',
    sku: 'KT-ISL-001',
    price: 48000,
    unit: 'piece',
    dim: '1.8 × 0.9 × 0.9 m',
    dimensions: { width: 1.8, depth: 0.9, height: 0.9 },
    description: 'Freestanding kitchen island with waterfall marble top and storage drawers.',
    enabled: true,
    modelId: 'kitchen_island'
  },
  {
    id: 'tall_storage_kitchen',
    name: 'Tall Pantry Larder Unit',
    category: 'kitchen',
    sku: 'KT-PAN-001',
    price: 36000,
    unit: 'piece',
    dim: '0.6 × 0.6 × 2.1 m',
    dimensions: { width: 0.6, depth: 0.6, height: 2.1 },
    description: 'Full-height floor to ceiling pantry unit with 6 wire baskets.',
    enabled: true,
    modelId: 'tall_storage_kitchen'
  },
  {
    id: 'breakfast_counter',
    name: 'Floating Breakfast Counter',
    category: 'kitchen',
    sku: 'KT-BAR-001',
    price: 21000,
    unit: 'piece',
    dim: '1.5 × 0.5 × 1.05 m',
    dimensions: { width: 1.5, depth: 0.5, height: 1.05 },
    description: 'Cantilevered bar counter for quick morning dining and meal prep.',
    enabled: true,
    modelId: 'breakfast_counter'
  },

  // 5. 🛁 BATHROOM
  {
    id: 'vanity_unit',
    name: 'Wall-Hung Vanity & Basin',
    category: 'bathroom',
    sku: 'BA-VAN-001',
    price: 22500,
    unit: 'piece',
    dim: '0.9 × 0.5 × 0.85 m',
    dimensions: { width: 0.9, depth: 0.5, height: 0.85 },
    description: 'Floating moisture-resistant vanity with integrated white ceramic sink and drawer.',
    enabled: true,
    modelId: 'vanity_unit'
  },
  {
    id: 'mirror_cabinet_bath',
    name: 'LED Illuminated Mirror Cabinet',
    category: 'bathroom',
    sku: 'BA-MIR-001',
    price: 11500,
    unit: 'piece',
    dim: '0.8 × 0.16 × 0.75 m',
    dimensions: { width: 0.8, depth: 0.16, height: 0.75 },
    description: 'Smart anti-fog medicine cabinet with ambient backlit LED and razor socket.',
    enabled: true,
    modelId: 'mirror_cabinet_bath'
  },
  {
    id: 'tall_cabinet_bath',
    name: 'Tall Linen Bathroom Tower',
    category: 'bathroom',
    sku: 'BA-CAB-001',
    price: 15800,
    unit: 'piece',
    dim: '0.42 × 0.35 × 1.8 m',
    dimensions: { width: 0.42, depth: 0.35, height: 1.8 },
    description: 'Slimline waterproof bathroom storage column for towels and toiletries.',
    enabled: true,
    modelId: 'tall_cabinet_bath'
  },
  {
    id: 'open_shelves_bath',
    name: 'Teak Ladder Towel Stand',
    category: 'bathroom',
    sku: 'BA-LAD-001',
    price: 6400,
    unit: 'piece',
    dim: '0.5 × 0.3 × 1.4 m',
    dimensions: { width: 0.5, depth: 0.3, height: 1.4 },
    description: 'Natural oiled teak leaning ladder rack for plush bath towels.',
    enabled: true,
    modelId: 'open_shelves_bath'
  },

  // 6. 💻 HOME OFFICE
  {
    id: 'study_desk',
    name: 'Executive Walnut Study Desk',
    category: 'office',
    sku: 'OF-DSK-001',
    price: 28000,
    unit: 'piece',
    dim: '1.4 × 0.7 × 0.75 m',
    dimensions: { width: 1.4, depth: 0.7, height: 0.75 },
    description: 'Spacious work desk with chamfered edges, modesty panel, and wire grommets.',
    enabled: true,
    modelId: 'study_desk'
  },
  {
    id: 'office_chair',
    name: 'Ergonomic High-Back Task Chair',
    category: 'office',
    sku: 'OF-CHR-001',
    price: 18500,
    unit: 'piece',
    dim: '0.65 × 0.65 × 1.1 m',
    dimensions: { width: 0.65, depth: 0.65, height: 1.1 },
    description: 'Breathable mesh ergonomic chair with dynamic lumbar support and 3D armrests.',
    enabled: true,
    modelId: 'office_chair'
  },
  {
    id: 'bookshelf_office',
    name: '5-Tier Library Office Bookshelf',
    category: 'office',
    sku: 'OF-SHF-001',
    price: 21500,
    unit: 'piece',
    dim: '1.0 × 0.32 × 1.9 m',
    dimensions: { width: 1.0, depth: 0.32, height: 1.9 },
    description: 'Heavy-duty steel and walnut bookshelf designed for legal folders and books.',
    enabled: true,
    modelId: 'bookshelf_office'
  },
  {
    id: 'filing_cabinet',
    name: 'Mobile 3-Drawer Underdesk Pedestal',
    category: 'office',
    sku: 'OF-CAB-001',
    price: 9800,
    unit: 'piece',
    dim: '0.42 × 0.5 × 0.62 m',
    dimensions: { width: 0.42, depth: 0.5, height: 0.62 },
    description: 'Lockable steel drawer pedestal on casters with stationery organizer tray.',
    enabled: true,
    modelId: 'filing_cabinet'
  },
  {
    id: 'computer_desk',
    name: 'Corner L-Desk Workstation',
    category: 'office',
    sku: 'OF-DSK-002',
    price: 36500,
    unit: 'piece',
    dim: '1.6 × 1.2 × 0.75 m',
    dimensions: { width: 1.6, depth: 1.2, height: 0.75 },
    description: 'Dual monitor L-shape corner desk with built-in power strip integration.',
    enabled: true,
    modelId: 'computer_desk'
  },

  // 7. 🚪 ENTRANCE & FOYER
  {
    id: 'console_table_foyer',
    name: 'Marble & Brass Foyer Console',
    category: 'foyer',
    sku: 'FY-CNS-001',
    price: 19800,
    unit: 'piece',
    dim: '1.1 × 0.32 × 0.82 m',
    dimensions: { width: 1.1, depth: 0.32, height: 0.82 },
    description: 'Slim entryway console table with Spanish marble top and sculptural brass base.',
    enabled: true,
    modelId: 'console_table_foyer'
  },
  {
    id: 'shoe_cabinet',
    name: 'Slim Tilt-Out Shoe Cabinet',
    category: 'foyer',
    sku: 'FY-SHO-001',
    price: 15400,
    unit: 'piece',
    dim: '0.9 × 0.28 × 1.1 m',
    dimensions: { width: 0.9, depth: 0.28, height: 1.1 },
    description: 'Space-saving entryway shoe cabinet storing up to 18 pairs in three tilt-out drawers.',
    enabled: true,
    modelId: 'shoe_cabinet'
  },
  {
    id: 'coat_rack',
    name: 'Minimalist Tree Coat Rack',
    category: 'foyer',
    sku: 'FY-COA-001',
    price: 4900,
    unit: 'piece',
    dim: '0.45 × 0.45 × 1.8 m',
    dimensions: { width: 0.45, depth: 0.45, height: 1.8 },
    description: 'Freestanding solid beechwood coat and umbrella stand with 8 staggered hooks.',
    enabled: true,
    modelId: 'coat_rack'
  },
  {
    id: 'mirror_foyer',
    name: 'Grand Circular Entry Mirror',
    category: 'foyer',
    sku: 'FY-MIR-001',
    price: 8800,
    unit: 'piece',
    dim: '0.8 × 0.05 × 0.8 m',
    dimensions: { width: 0.8, depth: 0.05, height: 0.8 },
    description: 'Brushed metal rimmed circular statement mirror for foyer welcoming walls.',
    enabled: true,
    modelId: 'mirror_foyer'
  },

  // 8. 🧸 KIDS' ROOM
  {
    id: 'single_bed_kids',
    name: 'Junior Single Platform Bed',
    category: 'kids',
    sku: 'KD-BED-001',
    price: 23500,
    unit: 'piece',
    dim: '1.95 × 1.0 × 0.85 m',
    dimensions: { width: 1.0, depth: 1.95, height: 0.85 },
    description: 'Playful rounded solid pine bed with pastel blue headboard panel.',
    enabled: true,
    modelId: 'single_bed_kids'
  },
  {
    id: 'bunk_bed_kids',
    name: 'Twin Safety Bunk Bed with Ladder',
    category: 'kids',
    sku: 'KD-BED-002',
    price: 44000,
    unit: 'piece',
    dim: '2.0 × 1.05 × 1.65 m',
    dimensions: { width: 1.05, depth: 2.0, height: 1.65 },
    description: 'Sturdy twin bunk bed with rounded guardrails and ergonomic climb ladder.',
    enabled: true,
    modelId: 'bunk_bed_kids'
  },
  {
    id: 'study_desk_kids',
    name: 'Adjustable Kids Study Desk',
    category: 'kids',
    sku: 'KD-DSK-001',
    price: 14200,
    unit: 'piece',
    dim: '1.0 × 0.55 × 0.7 m',
    dimensions: { width: 1.0, depth: 0.55, height: 0.7 },
    description: 'Ergonomic study desk with tiltable top and stationery organizer trough.',
    enabled: true,
    modelId: 'study_desk_kids'
  },
  {
    id: 'toy_storage_kids',
    name: 'Toy Organizer & Bin Unit',
    category: 'kids',
    sku: 'KD-TOY-001',
    price: 8900,
    unit: 'piece',
    dim: '0.95 × 0.38 × 0.78 m',
    dimensions: { width: 0.95, depth: 0.38, height: 0.78 },
    description: 'Low child-accessible storage shelf with 9 removable pastel colored storage bins.',
    enabled: true,
    modelId: 'toy_storage_kids'
  },

  // 9. ✨ LIGHTING & DECOR
  {
    id: 'floor_lamp_arc',
    name: 'Arched Brass Floor Lamp',
    category: 'decor',
    sku: 'DC-LMP-001',
    price: 14500,
    unit: 'piece',
    dim: '0.6 × 0.6 × 1.9 m',
    dimensions: { width: 0.6, depth: 0.6, height: 1.9 },
    description: 'Iconic curved overhanging floor lamp with heavy marble base and warm globe shade.',
    enabled: true,
    modelId: 'floor_lamp_arc'
  },
  {
    id: 'potted_monstera',
    name: 'Indoor Potted Monstera Plant',
    category: 'decor',
    sku: 'DC-PLN-001',
    price: 4200,
    unit: 'piece',
    dim: '0.5 × 0.5 × 1.2 m',
    dimensions: { width: 0.5, depth: 0.5, height: 1.2 },
    description: 'Large ceramic fluted planter with thriving architectural Swiss Cheese Monstera.',
    enabled: true,
    modelId: 'potted_monstera'
  },
  {
    id: 'abstract_canvas_art',
    name: 'Framed Gallery Canvas Art',
    category: 'decor',
    sku: 'DC-ART-001',
    price: 7800,
    unit: 'piece',
    dim: '1.2 × 0.05 × 0.9 m',
    dimensions: { width: 1.2, depth: 0.05, height: 0.9 },
    description: 'Contemporary minimalist acrylic abstract painting in slim oak floating frame.',
    enabled: true,
    modelId: 'abstract_canvas_art'
  },
  {
    id: 'pendant_light_cluster',
    name: 'Smoked Glass Pendant Chandelier',
    category: 'decor',
    sku: 'DC-LGT-001',
    price: 18500,
    unit: 'piece',
    dim: '0.8 × 0.8 × 1.1 m',
    dimensions: { width: 0.8, depth: 0.8, height: 1.1 },
    description: 'Trio of blown amber glass hanging pendants for dining rooms and kitchen counters.',
    enabled: true,
    modelId: 'pendant_light_cluster'
  },
  {
    id: 'persian_area_rug',
    name: 'Large Hand-Knotted Area Rug',
    category: 'decor',
    sku: 'DC-RUG-001',
    price: 22000,
    unit: 'piece',
    dim: '2.5 × 1.8 × 0.02 m',
    dimensions: { width: 2.5, depth: 1.8, height: 0.02 },
    description: 'Plush low-pile textured area rug in neutral distressed ivory and charcoal tones.',
    enabled: true,
    modelId: 'persian_area_rug'
  }
];

const STORAGE_KEY = 'interior_studio_furniture_catalog_v2';

/**
 * Loads the active catalog from localStorage or initial defaults
 */
export function loadCatalogFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load catalog from storage:', err);
  }
  return DEFAULT_FURNITURE_CATALOG;
}

/**
 * Saves catalog to localStorage
 */
export function saveCatalogToStorage(catalog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    return true;
  } catch (err) {
    console.error('Failed to save catalog to storage:', err);
    return false;
  }
}

/**
 * Resets catalog to initial factory defaults
 */
export function resetCatalogToDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_FURNITURE_CATALOG;
}
