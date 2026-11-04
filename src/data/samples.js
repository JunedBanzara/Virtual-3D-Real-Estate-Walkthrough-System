/**
 * Predefined Ready-Made Room Samples & Sample Apartment
 * Complete with physical room dimensions, materials, false ceilings,
 * and staged furniture linked to the catalog and pricing engine.
 */

export const SAMPLE_DESIGNS = [
  {
    id: 'sample_contemporary_living',
    name: 'Contemporary Living Room',
    category: 'living',
    badge: 'Popular',
    description: 'Warm scandinavian styling with an open layout, tray false ceiling with cove lighting, and walnut furniture.',
    dimensionsSummary: '5.4m × 4.4m × 3.0m',
    areaM2: 23.76,
    estimatedCost: 172900,
    rooms: [
      {
        id: 'room_living_contemporary',
        name: 'Living Room',
        type: 'living',
        width: 5.4,
        length: 4.4,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_main', wall: 'south', width: 1.0, height: 2.2, position: -1.2, open: true }
        ],
        windows: [
          { id: 'win_balcony', wall: 'north', width: 2.4, height: 1.8, sillHeight: 0.6, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#e2e8f0', material: 'matte' },
          south: { color: '#f1f5f9', material: 'matte' },
          east: { color: '#334155', material: 'matte' }, // Accent wall
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'tray',
          dropHeight: 0.25,
          color: '#f8fafc',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#fef08a',
          recessedSpots: true,
          spotCount: 6,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_c_sofa',
        productId: 'sofa_3seater',
        name: '3-Seater Architect Sofa',
        category: 'living',
        position: { x: 0, y: 0, z: 0.5 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 38500
      },
      {
        instanceId: 'inst_c_coffee_table',
        productId: 'coffee_table',
        name: 'Modern Slate Coffee Table',
        category: 'living',
        position: { x: 0, y: 0, z: -0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 14500
      },
      {
        instanceId: 'inst_c_tv_unit',
        productId: 'tv_unit',
        name: 'Media Console & TV Unit',
        category: 'living',
        position: { x: 0, y: 0, z: -1.85 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 29500
      },
      {
        instanceId: 'inst_c_armchair',
        productId: 'armchair',
        name: 'Nordic Lounge Armchair',
        category: 'living',
        position: { x: -1.6, y: 0, z: -0.2 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 16800
      },
      {
        instanceId: 'inst_c_rug',
        productId: 'persian_area_rug',
        name: 'Large Hand-Knotted Area Rug',
        category: 'decor',
        position: { x: 0, y: 0, z: -0.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 22000
      },
      {
        instanceId: 'inst_c_floor_lamp',
        productId: 'floor_lamp_arc',
        name: 'Arched Brass Floor Lamp',
        category: 'decor',
        position: { x: 1.8, y: 0, z: 1.1 },
        rotation: { x: 0, y: -Math.PI / 3, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 14500
      },
      {
        instanceId: 'inst_c_bookshelf',
        productId: 'bookshelf_living',
        name: 'Open Architectural Bookshelf',
        category: 'living',
        position: { x: 2.1, y: 0, z: -1.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 22000
      },
      {
        instanceId: 'inst_c_plant',
        productId: 'potted_monstera',
        name: 'Indoor Potted Monstera Plant',
        category: 'decor',
        position: { x: -1.9, y: 0, z: -1.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 4200
      }
    ]
  },

  {
    id: 'sample_luxury_living',
    name: 'Luxury Living Room',
    category: 'living',
    badge: 'Premium',
    description: 'High-end formal salon with grand sectional sofa, Italian marble flooring, and stepped false ceiling.',
    dimensionsSummary: '6.5m × 5.0m × 3.2m',
    areaM2: 32.5,
    estimatedCost: 243900,
    rooms: [
      {
        id: 'room_luxury_living',
        name: 'Grand Salon',
        type: 'living',
        width: 6.5,
        length: 5.0,
        wallHeight: 3.2,
        wallThickness: 0.18,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'tile',
        doors: [
          { id: 'door_l_main', wall: 'south', width: 1.2, height: 2.3, position: -1.5, open: true }
        ],
        windows: [
          { id: 'win_l_panoramic', wall: 'north', width: 3.2, height: 2.0, sillHeight: 0.5, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#e2e8f0', material: 'matte' },
          east: { color: '#1e293b', material: 'matte' },
          west: { color: '#0f172a', material: 'concrete' }
        },
        falseCeiling: {
          enabled: true,
          style: 'stepped',
          dropHeight: 0.3,
          color: '#f8fafc',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 8,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_l_sofa_sec',
        productId: 'sofa_sectional',
        name: 'Sectional L-Sofa Lounge',
        category: 'living',
        position: { x: 0.2, y: 0, z: 0.8 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 64900
      },
      {
        instanceId: 'inst_l_nesting',
        productId: 'nesting_tables',
        name: 'Duo Nesting Coffee Tables',
        category: 'living',
        position: { x: 0, y: 0, z: -0.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 18200
      },
      {
        instanceId: 'inst_l_tv',
        productId: 'tv_unit',
        name: 'Media Console & TV Unit',
        category: 'living',
        position: { x: 0, y: 0, z: -2.1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 29500
      },
      {
        instanceId: 'inst_l_recliner',
        productId: 'recliner',
        name: 'Cognac Leather Recliner',
        category: 'living',
        position: { x: -2.2, y: 0, z: -0.2 },
        rotation: { x: 0, y: Math.PI / 3, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 32000
      },
      {
        instanceId: 'inst_l_rug',
        productId: 'persian_area_rug',
        name: 'Large Hand-Knotted Area Rug',
        category: 'decor',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1, z: 1.1 },
        price: 22000
      },
      {
        instanceId: 'inst_l_lamp',
        productId: 'floor_lamp_arc',
        name: 'Arched Brass Floor Lamp',
        category: 'decor',
        position: { x: 2.2, y: 0, z: 1.5 },
        rotation: { x: 0, y: -Math.PI / 4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 14500
      },
      {
        instanceId: 'inst_l_sideboard',
        productId: 'sideboard_dining',
        name: 'Dining Sideboard Credenza',
        category: 'dining',
        position: { x: -2.7, y: 0, z: 1.2 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 34000
      },
      {
        instanceId: 'inst_l_art',
        productId: 'abstract_canvas_art',
        name: 'Framed Gallery Canvas Art',
        category: 'decor',
        position: { x: -2.8, y: 0.8, z: 1.2 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 7800
      }
    ]
  },

  {
    id: 'sample_master_bedroom',
    name: 'Master Bedroom Suite',
    category: 'bedroom',
    badge: 'Popular',
    description: 'Serene retreat featuring king bed with upholstered headboard, sliding wardrobe, and perimeter drop false ceiling.',
    dimensionsSummary: '4.5m × 4.0m × 3.0m',
    areaM2: 18.0,
    estimatedCost: 198000,
    rooms: [
      {
        id: 'room_master_bed',
        name: 'Master Suite',
        type: 'bedroom',
        width: 4.5,
        length: 4.0,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_mbr', wall: 'south', width: 0.9, height: 2.1, position: -1.2, open: true }
        ],
        windows: [
          { id: 'win_mbr', wall: 'north', width: 1.8, height: 1.4, sillHeight: 0.8, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f1f5f9', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#3f3f46', material: 'matte' }, // Headboard wall
          west: { color: '#f1f5f9', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'perimeter_drop',
          dropHeight: 0.22,
          color: '#f8fafc',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_mbr_bed',
        productId: 'bed_queen',
        name: 'King Luxury Upholstered Bed',
        category: 'bedroom',
        position: { x: 0.8, y: 0, z: 0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 52000
      },
      {
        instanceId: 'inst_mbr_nst_1',
        productId: 'bedside_table',
        name: 'Nightstand with Luminaire',
        category: 'bedroom',
        position: { x: 0.8, y: 0, z: -1.3 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 8500
      },
      {
        instanceId: 'inst_mbr_nst_2',
        productId: 'bedside_table',
        name: 'Nightstand with Luminaire',
        category: 'bedroom',
        position: { x: 0.8, y: 0, z: 1.3 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 8500
      },
      {
        instanceId: 'inst_mbr_wdb',
        productId: 'sliding_wardrobe',
        name: 'Sliding Mirror Wardrobe',
        category: 'bedroom',
        position: { x: -1.4, y: 0, z: 1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 68000
      },
      {
        instanceId: 'inst_mbr_dresser',
        productId: 'dressing_table',
        name: 'Vanity Dressing Console',
        category: 'bedroom',
        position: { x: -1.3, y: 0, z: -1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 26500
      },
      {
        instanceId: 'inst_mbr_chest',
        productId: 'chest_drawers',
        name: '4-Drawer Bureau Chest',
        category: 'bedroom',
        position: { x: -1.8, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 19500
      }
    ]
  },

  {
    id: 'sample_compact_bedroom',
    name: 'Compact Bedroom',
    category: 'bedroom',
    badge: 'Efficient',
    description: 'Space-optimised guest or secondary bedroom with platform bed, wardrobe, and sleek flat false ceiling.',
    dimensionsSummary: '3.5m × 3.0m × 2.8m',
    areaM2: 10.5,
    estimatedCost: 112000,
    rooms: [
      {
        id: 'room_compact_bed',
        name: 'Guest Bedroom',
        type: 'bedroom',
        width: 3.5,
        length: 3.0,
        wallHeight: 2.8,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_cbr', wall: 'south', width: 0.85, height: 2.1, position: -0.9, open: true }
        ],
        windows: [
          { id: 'win_cbr', wall: 'north', width: 1.4, height: 1.2, sillHeight: 0.9, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#64748b', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'flat',
          dropHeight: 0.18,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: false,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: false
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_cbr_bed',
        productId: 'platform_bed',
        name: 'Minimalist Platform Bed',
        category: 'bedroom',
        position: { x: 0.6, y: 0, z: -0.2 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 36000
      },
      {
        instanceId: 'inst_cbr_nst',
        productId: 'bedside_table',
        name: 'Nightstand with Luminaire',
        category: 'bedroom',
        position: { x: 0.6, y: 0, z: 1.1 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 8500
      },
      {
        instanceId: 'inst_cbr_wdb',
        productId: 'wardrobe_3door',
        name: '3-Door Premium Wardrobe',
        category: 'bedroom',
        position: { x: -0.9, y: 0, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 48000
      },
      {
        instanceId: 'inst_cbr_chest',
        productId: 'chest_drawers',
        name: '4-Drawer Bureau Chest',
        category: 'bedroom',
        position: { x: -1.0, y: 0, z: -0.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 19500
      }
    ]
  },

  {
    id: 'sample_modular_kitchen',
    name: 'Modular Chef Kitchen',
    category: 'kitchen',
    badge: 'Popular',
    description: 'Ergonomic kitchen with high-gloss base & wall cabinets, tall pantry larder, and breakfast counter.',
    dimensionsSummary: '3.6m × 2.8m × 2.9m',
    areaM2: 10.08,
    estimatedCost: 117500,
    rooms: [
      {
        id: 'room_modular_kitchen',
        name: 'Modular Kitchen',
        type: 'kitchen',
        width: 3.6,
        length: 2.8,
        wallHeight: 2.9,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'tile',
        doors: [
          { id: 'door_kit', wall: 'south', width: 0.9, height: 2.1, position: 0.8, open: true }
        ],
        windows: [
          { id: 'win_kit', wall: 'north', width: 1.5, height: 1.0, sillHeight: 1.1, position: -0.4 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#e2e8f0', material: 'matte' },
          west: { color: '#e2e8f0', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'flat',
          dropHeight: 0.2,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: false,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 6,
          centralFixture: false
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_mk_base',
        productId: 'base_cabinets',
        name: 'Modular Base Cabinet Unit (1.2m)',
        category: 'kitchen',
        position: { x: -0.5, y: 0, z: -0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 24000
      },
      {
        instanceId: 'inst_mk_wall',
        productId: 'wall_cabinets',
        name: 'Upper Wall Hanging Cabinets',
        category: 'kitchen',
        position: { x: -0.5, y: 1.4, z: -0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 18500
      },
      {
        instanceId: 'inst_mk_tall',
        productId: 'tall_storage_kitchen',
        name: 'Tall Pantry Larder Unit',
        category: 'kitchen',
        position: { x: -1.3, y: 0, z: -0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 36000
      },
      {
        instanceId: 'inst_mk_bar',
        productId: 'breakfast_counter',
        name: 'Floating Breakfast Counter',
        category: 'kitchen',
        position: { x: 0.8, y: 0, z: 0.2 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 21000
      },
      {
        instanceId: 'inst_mk_stool_1',
        productId: 'bar_stool',
        name: 'Swivel Kitchen Island Stool',
        category: 'dining',
        position: { x: 1.3, y: 0, z: 0.5 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 5900
      },
      {
        instanceId: 'inst_mk_stool_2',
        productId: 'bar_stool',
        name: 'Swivel Kitchen Island Stool',
        category: 'dining',
        position: { x: 1.3, y: 0, z: -0.2 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 5900
      }
    ]
  },

  {
    id: 'sample_premium_kitchen',
    name: 'Premium Island Kitchen',
    category: 'kitchen',
    badge: 'Luxury',
    description: 'Expansive open kitchen layout with waterfall island, tall pantry, and bar seating.',
    dimensionsSummary: '4.5m × 3.6m × 3.0m',
    areaM2: 16.2,
    estimatedCost: 154800,
    rooms: [
      {
        id: 'room_island_kitchen',
        name: 'Chef Kitchen',
        type: 'kitchen',
        width: 4.5,
        length: 3.6,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'tile',
        doors: [
          { id: 'door_pk', wall: 'south', width: 1.1, height: 2.2, position: 1.2, open: true }
        ],
        windows: [
          { id: 'win_pk', wall: 'north', width: 2.2, height: 1.2, sillHeight: 1.0, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#1e293b', material: 'concrete' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'tray',
          dropHeight: 0.25,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 6,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_pk_island',
        productId: 'kitchen_island',
        name: 'Central Kitchen Island',
        category: 'kitchen',
        position: { x: 0, y: 0, z: 0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 48000
      },
      {
        instanceId: 'inst_pk_base',
        productId: 'base_cabinets',
        name: 'Modular Base Cabinet Unit (1.2m)',
        category: 'kitchen',
        position: { x: 0, y: 0, z: -1.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1, z: 1 },
        price: 24000
      },
      {
        instanceId: 'inst_pk_wall',
        productId: 'wall_cabinets',
        name: 'Upper Wall Hanging Cabinets',
        category: 'kitchen',
        position: { x: 0, y: 1.4, z: -1.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1, z: 1 },
        price: 18500
      },
      {
        instanceId: 'inst_pk_tall',
        productId: 'tall_storage_kitchen',
        name: 'Tall Pantry Larder Unit',
        category: 'kitchen',
        position: { x: -1.7, y: 0, z: -1.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 36000
      },
      {
        instanceId: 'inst_pk_stool_1',
        productId: 'bar_stool',
        name: 'Swivel Kitchen Island Stool',
        category: 'dining',
        position: { x: -0.6, y: 0, z: 0.9 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 5900
      },
      {
        instanceId: 'inst_pk_stool_2',
        productId: 'bar_stool',
        name: 'Swivel Kitchen Island Stool',
        category: 'dining',
        position: { x: 0.6, y: 0, z: 0.9 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 5900
      },
      {
        instanceId: 'inst_pk_pendant',
        productId: 'pendant_light_cluster',
        name: 'Smoked Glass Pendant Chandelier',
        category: 'decor',
        position: { x: 0, y: 1.6, z: 0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 18500
      }
    ]
  },

  {
    id: 'sample_dining_room',
    name: 'Executive Dining Room',
    category: 'dining',
    badge: 'Popular',
    description: 'Chic dining space with 6-seater walnut dining table, upholstered chairs, credenza, and glass showcase.',
    dimensionsSummary: '4.0m × 3.5m × 3.0m',
    areaM2: 14.0,
    estimatedCost: 154500,
    rooms: [
      {
        id: 'room_dining',
        name: 'Dining Room',
        type: 'dining',
        width: 4.0,
        length: 3.5,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_dr', wall: 'south', width: 1.0, height: 2.1, position: 0.8, open: true }
        ],
        windows: [
          { id: 'win_dr', wall: 'north', width: 1.8, height: 1.4, sillHeight: 0.8, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#27272a', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'tray',
          dropHeight: 0.22,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_dr_table',
        productId: 'dining_table_6',
        name: '6-Seater Walnut Dining Table',
        category: 'dining',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 42000
      },
      {
        instanceId: 'inst_dr_chair_1',
        productId: 'dining_chair',
        name: 'Velvet Dining Chair (Single)',
        category: 'dining',
        position: { x: -0.6, y: 0, z: 0.65 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 6500
      },
      {
        instanceId: 'inst_dr_chair_2',
        productId: 'dining_chair',
        name: 'Velvet Dining Chair (Single)',
        category: 'dining',
        position: { x: 0.6, y: 0, z: 0.65 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 6500
      },
      {
        instanceId: 'inst_dr_chair_3',
        productId: 'dining_chair',
        name: 'Velvet Dining Chair (Single)',
        category: 'dining',
        position: { x: -0.6, y: 0, z: -0.65 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 6500
      },
      {
        instanceId: 'inst_dr_chair_4',
        productId: 'dining_chair',
        name: 'Velvet Dining Chair (Single)',
        category: 'dining',
        position: { x: 0.6, y: 0, z: -0.65 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 6500
      },
      {
        instanceId: 'inst_dr_sideboard',
        productId: 'sideboard_dining',
        name: 'Dining Sideboard Credenza',
        category: 'dining',
        position: { x: 0, y: 0, z: -1.35 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 34000
      },
      {
        instanceId: 'inst_dr_cabinet',
        productId: 'crockery_cabinet',
        name: 'Glass Crockery Display Cabinet',
        category: 'dining',
        position: { x: -1.5, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 39000
      }
    ]
  },

  {
    id: 'sample_home_office',
    name: 'Modern Home Office',
    category: 'office',
    badge: 'Trending',
    description: 'Productive ergonomic workplace with executive study desk, mesh chair, full bookshelf, and filing cabinet.',
    dimensionsSummary: '3.8m × 3.2m × 2.9m',
    areaM2: 12.16,
    estimatedCost: 89300,
    rooms: [
      {
        id: 'room_office',
        name: 'Home Office / Studio',
        type: 'office',
        width: 3.8,
        length: 3.2,
        wallHeight: 2.9,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_of', wall: 'south', width: 0.9, height: 2.1, position: 0.9, open: true }
        ],
        windows: [
          { id: 'win_of', wall: 'north', width: 1.6, height: 1.3, sillHeight: 0.85, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#047857', material: 'matte' }, // Deep emerald accent wall
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'perimeter_drop',
          dropHeight: 0.2,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_of_desk',
        productId: 'study_desk',
        name: 'Executive Walnut Study Desk',
        category: 'office',
        position: { x: 0, y: 0, z: -0.3 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 28000
      },
      {
        instanceId: 'inst_of_chair',
        productId: 'office_chair',
        name: 'Ergonomic High-Back Task Chair',
        category: 'office',
        position: { x: 0, y: 0, z: -0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 18500
      },
      {
        instanceId: 'inst_of_bookshelf',
        productId: 'bookshelf_office',
        name: '5-Tier Library Office Bookshelf',
        category: 'office',
        position: { x: 1.4, y: 0, z: 0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 21500
      },
      {
        instanceId: 'inst_of_pedestal',
        productId: 'filing_cabinet',
        name: 'Mobile 3-Drawer Underdesk Pedestal',
        category: 'office',
        position: { x: 0.9, y: 0, z: -0.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 9800
      },
      {
        instanceId: 'inst_of_plant',
        productId: 'potted_monstera',
        name: 'Indoor Potted Monstera Plant',
        category: 'decor',
        position: { x: -1.3, y: 0, z: -1.1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 4200
      },
      {
        instanceId: 'inst_of_art',
        productId: 'abstract_canvas_art',
        name: 'Framed Gallery Canvas Art',
        category: 'decor',
        position: { x: 1.4, y: 0.7, z: 0.9 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 1 },
        price: 7800
      }
    ]
  },

  {
    id: 'sample_spa_bathroom',
    name: 'Luxury Spa Bathroom',
    category: 'bathroom',
    badge: 'Wellness',
    description: 'Contemporary bathroom retreat with wall-hung vanity, LED illuminated mirror cabinet, and linen storage tower.',
    dimensionsSummary: '2.6m × 2.4m × 2.8m',
    areaM2: 6.24,
    estimatedCost: 56200,
    rooms: [
      {
        id: 'room_bathroom',
        name: 'Master En-Suite Bathroom',
        type: 'bathroom',
        width: 2.6,
        length: 2.4,
        wallHeight: 2.8,
        wallThickness: 0.15,
        position: { x: 0, z: 0 },
        rotation: 0,
        flooring: 'tile',
        doors: [
          { id: 'door_bath', wall: 'south', width: 0.8, height: 2.1, position: 0.4, open: true }
        ],
        windows: [
          { id: 'win_bath', wall: 'north', width: 0.8, height: 0.8, sillHeight: 1.6, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#e2e8f0', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#0f172a', material: 'concrete' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'flat',
          dropHeight: 0.2,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: false,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: false
        }
      }
    ],
    stagedFurniture: [
      {
        instanceId: 'inst_ba_vanity',
        productId: 'vanity_unit',
        name: 'Wall-Hung Vanity & Basin',
        category: 'bathroom',
        position: { x: 0, y: 0, z: -0.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 22500
      },
      {
        instanceId: 'inst_ba_mirror',
        productId: 'mirror_cabinet_bath',
        name: 'LED Illuminated Mirror Cabinet',
        category: 'bathroom',
        position: { x: 0, y: 1.1, z: -0.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 11500
      },
      {
        instanceId: 'inst_ba_tower',
        productId: 'tall_cabinet_bath',
        name: 'Tall Linen Bathroom Tower',
        category: 'bathroom',
        position: { x: -0.9, y: 0, z: -0.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 15800
      },
      {
        instanceId: 'inst_ba_ladder',
        productId: 'open_shelves_bath',
        name: 'Teak Ladder Towel Stand',
        category: 'bathroom',
        position: { x: 0.9, y: 0, z: 0.3 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 6400
      }
    ]
  },

  {
    id: 'sample_complete_apartment',
    name: 'Complete 2BHK Executive Apartment',
    category: 'apartment',
    badge: 'Full Home',
    description: 'Fully integrated multi-room residence featuring Living/Dining, Master Bedroom Suite, Study/Guest Bedroom, Modular Kitchen, and 2 Bathrooms.',
    dimensionsSummary: '11.0m × 8.5m Multi-Room Layout',
    areaM2: 78.8,
    estimatedCost: 462500,
    rooms: [
      {
        id: 'room_apt_living',
        name: 'Living & Dining Area',
        type: 'living',
        width: 6.2,
        length: 4.8,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: -1.0, z: 2.5 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_apt_main', wall: 'south', width: 1.1, height: 2.2, position: -1.2, open: true }
        ],
        windows: [
          { id: 'win_apt_living', wall: 'west', width: 2.4, height: 1.8, sillHeight: 0.7, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f1f5f9', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#1e293b', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'tray',
          dropHeight: 0.25,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 6,
          centralFixture: true
        }
      },
      {
        id: 'room_apt_master',
        name: 'Master Suite',
        type: 'bedroom',
        width: 4.5,
        length: 4.0,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: -1.8, z: -2.2 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_apt_mbr', wall: 'south', width: 0.9, height: 2.1, position: 0.8, open: true }
        ],
        windows: [
          { id: 'win_apt_mbr', wall: 'north', width: 1.8, height: 1.4, sillHeight: 0.8, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#334155', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'perimeter_drop',
          dropHeight: 0.22,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: true
        }
      },
      {
        id: 'room_apt_kitchen',
        name: 'Gourmet Kitchen',
        type: 'kitchen',
        width: 3.6,
        length: 2.8,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 3.1, z: 0.8 },
        rotation: 0,
        flooring: 'tile',
        doors: [
          { id: 'door_apt_kit', wall: 'west', width: 0.9, height: 2.1, position: 0, open: true }
        ],
        windows: [
          { id: 'win_apt_kit', wall: 'east', width: 1.6, height: 1.1, sillHeight: 1.0, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#e2e8f0', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'flat',
          dropHeight: 0.2,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: false,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: false
        }
      },
      {
        id: 'room_apt_second_bed',
        name: 'Study / Guest Bedroom',
        type: 'office',
        width: 3.8,
        length: 3.4,
        wallHeight: 3.0,
        wallThickness: 0.15,
        position: { x: 2.8, z: -2.2 },
        rotation: 0,
        flooring: 'hardwood',
        doors: [
          { id: 'door_apt_gbr', wall: 'south', width: 0.9, height: 2.1, position: -0.6, open: true }
        ],
        windows: [
          { id: 'win_apt_gbr', wall: 'north', width: 1.6, height: 1.3, sillHeight: 0.8, position: 0 }
        ],
        wallFinishes: {
          north: { color: '#f8fafc', material: 'matte' },
          south: { color: '#f8fafc', material: 'matte' },
          east: { color: '#047857', material: 'matte' },
          west: { color: '#f8fafc', material: 'matte' }
        },
        falseCeiling: {
          enabled: true,
          style: 'perimeter_drop',
          dropHeight: 0.2,
          color: '#ffffff',
          material: 'gypsum',
          coveLights: true,
          coveLightColor: '#ffedd5',
          recessedSpots: true,
          spotCount: 4,
          centralFixture: true
        }
      }
    ],
    stagedFurniture: [
      // Living Area
      {
        instanceId: 'inst_apt_sofa',
        productId: 'sofa_sectional',
        name: 'Sectional L-Sofa Lounge',
        category: 'living',
        position: { x: -1.0, y: 0, z: 3.2 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 64900
      },
      {
        instanceId: 'inst_apt_ct',
        productId: 'coffee_table',
        name: 'Modern Slate Coffee Table',
        category: 'living',
        position: { x: -1.0, y: 0, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 14500
      },
      {
        instanceId: 'inst_apt_tv',
        productId: 'tv_unit',
        name: 'Media Console & TV Unit',
        category: 'living',
        position: { x: -1.0, y: 0, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 29500
      },
      {
        instanceId: 'inst_apt_dining',
        productId: 'dining_table_6',
        name: '6-Seater Walnut Dining Table',
        category: 'dining',
        position: { x: 1.0, y: 0, z: 3.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 42000
      },
      // Master Bedroom
      {
        instanceId: 'inst_apt_bed',
        productId: 'bed_queen',
        name: 'King Luxury Upholstered Bed',
        category: 'bedroom',
        position: { x: -1.2, y: 0, z: -2.2 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 52000
      },
      {
        instanceId: 'inst_apt_wdb',
        productId: 'sliding_wardrobe',
        name: 'Sliding Mirror Wardrobe',
        category: 'bedroom',
        position: { x: -3.0, y: 0, z: -1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 68000
      },
      // Kitchen
      {
        instanceId: 'inst_apt_kit_base',
        productId: 'base_cabinets',
        name: 'Modular Base Cabinet Unit (1.2m)',
        category: 'kitchen',
        position: { x: 3.1, y: 0, z: -0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1, z: 1 },
        price: 24000
      },
      {
        instanceId: 'inst_apt_kit_tall',
        productId: 'tall_storage_kitchen',
        name: 'Tall Pantry Larder Unit',
        category: 'kitchen',
        position: { x: 2.0, y: 0, z: -0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 36000
      },
      // Second Room / Study
      {
        instanceId: 'inst_apt_desk',
        productId: 'study_desk',
        name: 'Executive Walnut Study Desk',
        category: 'office',
        position: { x: 2.8, y: 0, z: -2.6 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 28000
      },
      {
        instanceId: 'inst_apt_mesh_chair',
        productId: 'office_chair',
        name: 'Ergonomic High-Back Task Chair',
        category: 'office',
        position: { x: 2.8, y: 0, z: -3.1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        price: 18500
      }
    ]
  }
];
