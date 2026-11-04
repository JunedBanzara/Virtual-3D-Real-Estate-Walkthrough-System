import React, { useState } from 'react';
import { fromCanonicalMeters, toCanonicalMeters, formatMeasurement, formatINR } from '../utils/units';
import { FURNITURE_CATEGORIES } from '../data/furnitureCatalog';
import { SAMPLE_DESIGNS } from '../data/samples';
import { WALL_MATERIAL_PRESETS, DESIGNER_WALL_PALETTE } from '../geometry/homeGenerator';

const ROOM_TYPES = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'dining', name: 'Dining Room', icon: '🍽️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
  { id: 'office', name: 'Home Office', icon: '💻' },
  { id: 'foyer', name: 'Entrance & Foyer', icon: '🚪' },
  { id: 'kids', name: "Kids' Room", icon: '🧸' },
  { id: 'hallway', name: 'Hallway / Corridor', icon: '🚶' },
  { id: 'other', name: 'Custom Space', icon: '📐' }
];

const FLOORING_OPTIONS = [
  { id: 'hardwood', name: 'Natural Hardwood Oak', preview: '#b47846' },
  { id: 'tile', name: 'Porcelain Vitrified Tile', preview: '#e2e8f0' },
  { id: 'slate', name: 'Contemporary Slate', preview: '#334155' }
];

const CEILING_STYLES = [
  { id: 'tray', name: 'Simple Tray Ceiling', icon: '◻️' },
  { id: 'perimeter_drop', name: 'Perimeter Drop Soffit', icon: '🔲' },
  { id: 'stepped', name: 'Two-Tier Stepped Luxury', icon: '🪜' },
  { id: 'flat', name: 'Flat Minimalist Soffit', icon: '▬' }
];

export default function LeftSidebar({
  project,
  onUpdateProject,
  currentUnit,
  catalog = [],
  onAddFurnitureToScene,
  selectedWall,
  onSelectWall,
  onLoadSampleDesign,
  onAppendSampleRoom,
  onExportProjectJSON,
  onImportProjectJSON
}) {
  const [activeNavTab, setActiveNavTab] = useState('rooms'); // 'rooms' | 'catalog' | 'walls' | 'ceiling' | 'samples' | 'settings'
  const [selectedRoomId, setSelectedRoomId] = useState(project?.rooms?.[0]?.id || null);

  // Catalog search & filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('living');

  // Currently inspected room
  const activeRoom = project?.rooms?.find((r) => r.id === selectedRoomId) || project?.rooms?.[0] || null;

  // -------------------------------------------------------------------------
  // ROOM CRUD ACTIONS
  // -------------------------------------------------------------------------
  const handleAddRoom = () => {
    const newId = 'room_' + Date.now();
    const count = (project?.rooms?.length || 0) + 1;
    const newRoom = {
      id: newId,
      name: `Room ${count}`,
      type: 'living',
      width: 5.0, // 5m
      length: 4.0, // 4m
      wallHeight: 3.0, // 3m
      wallThickness: 0.15, // 150mm
      position: { x: count * 3, z: 0 },
      rotation: 0,
      flooring: 'hardwood',
      doors: [{ id: 'd_' + Date.now(), wall: 'south', width: 0.9, height: 2.1, position: 0, open: true }],
      windows: [{ id: 'w_' + Date.now(), wall: 'north', width: 1.5, height: 1.2, sillHeight: 0.9, position: 0 }],
      wallFinishes: {
        north: { color: '#f8fafc', material: 'matte' },
        south: { color: '#f8fafc', material: 'matte' },
        east: { color: '#f8fafc', material: 'matte' },
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
        spotCount: 4,
        centralFixture: true
      }
    };

    onUpdateProject((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), newRoom]
    }));
    setSelectedRoomId(newId);
  };

  const handleDuplicateRoom = (roomId) => {
    const source = project?.rooms?.find((r) => r.id === roomId);
    if (!source) return;
    const newId = 'room_' + Date.now();
    const duplicated = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      name: `${source.name} (Copy)`,
      position: {
        x: (source.position?.x || 0) + source.width + 1.0,
        z: source.position?.z || 0
      }
    };
    onUpdateProject((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), duplicated]
    }));
    setSelectedRoomId(newId);
  };

  const handleDeleteRoom = (roomId) => {
    if ((project?.rooms?.length || 0) <= 1) {
      alert('A home design must have at least one room.');
      return;
    }
    onUpdateProject((prev) => {
      const filtered = prev.rooms.filter((r) => r.id !== roomId);
      return { ...prev, rooms: filtered };
    });
    const remaining = project.rooms.filter((r) => r.id !== roomId);
    if (remaining.length > 0) setSelectedRoomId(remaining[0].id);
  };

  const handleUpdateActiveRoom = (patch) => {
    if (!activeRoom) return;
    onUpdateProject((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === activeRoom.id ? { ...r, ...patch } : r))
    }));
  };

  // Dimension changes with unit conversion
  const handleDimensionChange = (field, displayVal) => {
    const canonicalVal = toCanonicalMeters(displayVal, currentUnit);
    handleUpdateActiveRoom({ [field]: canonicalVal });
  };

  // Door & Window helpers
  const handleAddDoor = () => {
    if (!activeRoom) return;
    const newDoor = {
      id: 'door_' + Date.now(),
      wall: 'south',
      width: 0.9,
      height: 2.1,
      position: 0,
      open: true
    };
    handleUpdateActiveRoom({
      doors: [...(activeRoom.doors || []), newDoor]
    });
  };

  const handleRemoveDoor = (doorId) => {
    handleUpdateActiveRoom({
      doors: (activeRoom.doors || []).filter((d) => d.id !== doorId)
    });
  };

  const handleUpdateDoor = (doorId, patch) => {
    handleUpdateActiveRoom({
      doors: (activeRoom.doors || []).map((d) => (d.id === doorId ? { ...d, ...patch } : d))
    });
  };

  const handleAddWindow = () => {
    if (!activeRoom) return;
    const newWin = {
      id: 'win_' + Date.now(),
      wall: 'north',
      width: 1.5,
      height: 1.2,
      sillHeight: 0.9,
      position: 0
    };
    handleUpdateActiveRoom({
      windows: [...(activeRoom.windows || []), newWin]
    });
  };

  const handleRemoveWindow = (winId) => {
    handleUpdateActiveRoom({
      windows: (activeRoom.windows || []).filter((w) => w.id !== winId)
    });
  };

  const handleUpdateWindow = (winId, patch) => {
    handleUpdateActiveRoom({
      windows: (activeRoom.windows || []).map((w) => (w.id === winId ? { ...w, ...patch } : w))
    });
  };

  // -------------------------------------------------------------------------
  // WALL FINISHES
  // -------------------------------------------------------------------------
  const currentWallTarget = selectedWall?.roomId === activeRoom?.id
    ? selectedWall.wallSide
    : 'north';

  const currentWallFinish = activeRoom?.wallFinishes?.[currentWallTarget] || {
    color: '#f8fafc',
    material: 'matte'
  };

  const handleSetWallFinish = (scope, patch) => {
    if (!activeRoom) return;
    if (scope === 'single') {
      const updatedFinishes = {
        ...(activeRoom.wallFinishes || {}),
        [currentWallTarget]: { ...currentWallFinish, ...patch }
      };
      handleUpdateActiveRoom({ wallFinishes: updatedFinishes });
    } else if (scope === 'room') {
      const merged = { ...currentWallFinish, ...patch };
      const updatedFinishes = {
        north: merged,
        south: merged,
        east: merged,
        west: merged
      };
      handleUpdateActiveRoom({ wallFinishes: updatedFinishes });
    } else if (scope === 'home') {
      const merged = { ...currentWallFinish, ...patch };
      onUpdateProject((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => ({
          ...r,
          wallFinishes: { north: merged, south: merged, east: merged, west: merged }
        }))
      }));
    }
  };

  // -------------------------------------------------------------------------
  // FALSE CEILING
  // -------------------------------------------------------------------------
  const ceilingConfig = activeRoom?.falseCeiling || {
    enabled: true,
    style: 'tray',
    dropHeight: 0.25,
    color: '#ffffff',
    coveLights: true,
    recessedSpots: true,
    spotCount: 4,
    centralFixture: true
  };

  const handleUpdateCeiling = (patch) => {
    handleUpdateActiveRoom({
      falseCeiling: { ...ceilingConfig, ...patch }
    });
  };

  // -------------------------------------------------------------------------
  // CATALOG FILTERING
  // -------------------------------------------------------------------------
  const filteredCatalog = catalog.filter((item) => {
    if (item.enabled === false) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    }
    return item.category === selectedCategory;
  });

  return (
    <div className="sidebar-container">
      {/* Sidebar Navigation Tabs */}
      <nav className="sidebar-nav-tabs">
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('rooms')}
          title="Build Home & Manage Rooms"
        >
          <span className="tab-icon">🏠</span>
          <span className="tab-label">Home & Rooms</span>
        </button>
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('catalog')}
          title="Furniture Catalogue & Staging"
        >
          <span className="tab-icon">🛋️</span>
          <span className="tab-label">Catalogue</span>
        </button>
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'walls' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('walls')}
          title="Customise Wall Colours & Materials"
        >
          <span className="tab-icon">🎨</span>
          <span className="tab-label">Walls & Finishes</span>
        </button>
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'ceiling' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('ceiling')}
          title="False Ceiling System & Lighting"
        >
          <span className="tab-icon">✨</span>
          <span className="tab-label">False Ceiling</span>
        </button>
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'samples' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('samples')}
          title="Explore Ready-Made Room Samples"
        >
          <span className="tab-icon">📚</span>
          <span className="tab-label">Samples</span>
        </button>
        <button
          className={`sidebar-tab-btn ${activeNavTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveNavTab('settings')}
          title="Project Persistence & Export"
        >
          <span className="tab-icon">⚙️</span>
          <span className="tab-label">Project</span>
        </button>
      </nav>

      {/* Tab Content Panes */}
      <div className="sidebar-scrollable-content">
        {/* ===================================================================
            TAB 1: BUILD HOME & ROOMS
        =================================================================== */}
        {activeNavTab === 'rooms' && (
          <div className="tab-pane-section">
            {/* Header with Room Selector & Add Button */}
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Home Layout Architect</h3>
                <p className="section-subtitle">
                  {project?.rooms?.length || 0} Room(s) · Total Area:{' '}
                  {project?.rooms
                    ?.reduce((acc, r) => acc + (r.width * r.length), 0)
                    .toFixed(1)}{' '}
                  m²
                </p>
              </div>
              <button type="button" className="btn-add-primary" onClick={handleAddRoom}>
                <span>+ Add Room</span>
              </button>
            </div>

            {/* Room Tabs Pills */}
            <div className="room-chips-row">
              {project?.rooms?.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`room-chip ${r.id === activeRoom?.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoomId(r.id)}
                >
                  <span className="room-chip-name">{r.name}</span>
                  <span className="room-chip-dim">
                    {formatMeasurement(r.width, currentUnit)} × {formatMeasurement(r.length, currentUnit)}
                  </span>
                </button>
              ))}
            </div>

            {activeRoom && (
              <div className="room-editor-card">
                {/* Room Name & Type */}
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label className="form-label">Room Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={activeRoom.name}
                      onChange={(e) => handleUpdateActiveRoom({ name: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-2">
                    <label className="form-label">Room Type</label>
                    <select
                      className="form-select"
                      value={activeRoom.type}
                      onChange={(e) => handleUpdateActiveRoom({ type: e.target.value })}
                    >
                      {ROOM_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.icon} {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Physical Dimensions */}
                <div className="dimensions-grid-box">
                  <div className="dim-input-col">
                    <label className="dim-label">Length ({currentUnit})</label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      className="dim-input"
                      value={fromCanonicalMeters(activeRoom.length, currentUnit)}
                      onChange={(e) => handleDimensionChange('length', e.target.value)}
                    />
                  </div>
                  <div className="dim-input-col">
                    <label className="dim-label">Width ({currentUnit})</label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      className="dim-input"
                      value={fromCanonicalMeters(activeRoom.width, currentUnit)}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                    />
                  </div>
                  <div className="dim-input-col">
                    <label className="dim-label">Height ({currentUnit})</label>
                    <input
                      type="number"
                      step="any"
                      min="1.5"
                      className="dim-input"
                      value={fromCanonicalMeters(activeRoom.wallHeight, currentUnit)}
                      onChange={(e) => handleDimensionChange('wallHeight', e.target.value)}
                    />
                  </div>
                  <div className="dim-input-col">
                    <label className="dim-label">Wall Thickness ({currentUnit})</label>
                    <input
                      type="number"
                      step="any"
                      min="0.05"
                      className="dim-input"
                      value={fromCanonicalMeters(activeRoom.wallThickness, currentUnit)}
                      onChange={(e) => handleDimensionChange('wallThickness', e.target.value)}
                    />
                  </div>
                </div>

                {/* Room Arrangement: Position & Rotation */}
                <div className="arrangement-box">
                  <h4 className="sub-box-title">Multi-Room Positioning</h4>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Pos X ({currentUnit})</label>
                      <input
                        type="number"
                        step="any"
                        className="form-input"
                        value={fromCanonicalMeters(activeRoom.position?.x || 0, currentUnit)}
                        onChange={(e) => {
                          const canonicalX = toCanonicalMeters(e.target.value, currentUnit);
                          handleUpdateActiveRoom({
                            position: { ...(activeRoom.position || {}), x: canonicalX }
                          });
                        }}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">Pos Z ({currentUnit})</label>
                      <input
                        type="number"
                        step="any"
                        className="form-input"
                        value={fromCanonicalMeters(activeRoom.position?.z || 0, currentUnit)}
                        onChange={(e) => {
                          const canonicalZ = toCanonicalMeters(e.target.value, currentUnit);
                          handleUpdateActiveRoom({
                            position: { ...(activeRoom.position || {}), z: canonicalZ }
                          });
                        }}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">Rotation</label>
                      <select
                        className="form-select"
                        value={activeRoom.rotation || 0}
                        onChange={(e) => handleUpdateActiveRoom({ rotation: Number(e.target.value) })}
                      >
                        <option value={0}>0°</option>
                        <option value={90}>90°</option>
                        <option value={180}>180°</option>
                        <option value={270}>270°</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Flooring Selector */}
                <div className="form-group">
                  <label className="form-label">Flooring Style</label>
                  <div className="flooring-options-grid">
                    {FLOORING_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={`flooring-card ${activeRoom.flooring === f.id ? 'active' : ''}`}
                        onClick={() => handleUpdateActiveRoom({ flooring: f.id })}
                      >
                        <span className="flooring-color-dot" style={{ backgroundColor: f.preview }} />
                        <span className="flooring-name">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doors & Openings */}
                <div className="openings-section">
                  <div className="openings-header">
                    <h4 className="sub-box-title">Doors ({activeRoom.doors?.length || 0})</h4>
                    <button type="button" className="btn-small-add" onClick={handleAddDoor}>
                      + Add Door
                    </button>
                  </div>
                  {activeRoom.doors?.map((door, idx) => (
                    <div key={door.id || idx} className="opening-item-card">
                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label className="form-label">Wall Side</label>
                          <select
                            className="form-select"
                            value={door.wall}
                            onChange={(e) => handleUpdateDoor(door.id, { wall: e.target.value })}
                          >
                            <option value="north">North (Back)</option>
                            <option value="south">South (Front)</option>
                            <option value="east">East (Right)</option>
                            <option value="west">West (Left)</option>
                          </select>
                        </div>
                        <div className="form-group flex-1">
                          <label className="form-label">Width ({currentUnit})</label>
                          <input
                            type="number"
                            step="any"
                            className="form-input"
                            value={fromCanonicalMeters(door.width, currentUnit)}
                            onChange={(e) =>
                              handleUpdateDoor(door.id, {
                                width: toCanonicalMeters(e.target.value, currentUnit)
                              })
                            }
                          />
                        </div>
                        <div className="form-group flex-1">
                          <label className="form-label">Height ({currentUnit})</label>
                          <input
                            type="number"
                            step="any"
                            className="form-input"
                            value={fromCanonicalMeters(door.height, currentUnit)}
                            onChange={(e) =>
                              handleUpdateDoor(door.id, {
                                height: toCanonicalMeters(e.target.value, currentUnit)
                              })
                            }
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-item-delete"
                          onClick={() => handleRemoveDoor(door.id)}
                          title="Delete Door"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Windows */}
                <div className="openings-section">
                  <div className="openings-header">
                    <h4 className="sub-box-title">Windows ({activeRoom.windows?.length || 0})</h4>
                    <button type="button" className="btn-small-add" onClick={handleAddWindow}>
                      + Add Window
                    </button>
                  </div>
                  {activeRoom.windows?.map((win, idx) => (
                    <div key={win.id || idx} className="opening-item-card">
                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label className="form-label">Wall Side</label>
                          <select
                            className="form-select"
                            value={win.wall}
                            onChange={(e) => handleUpdateWindow(win.id, { wall: e.target.value })}
                          >
                            <option value="north">North (Back)</option>
                            <option value="south">South (Front)</option>
                            <option value="east">East (Right)</option>
                            <option value="west">West (Left)</option>
                          </select>
                        </div>
                        <div className="form-group flex-1">
                          <label className="form-label">Width ({currentUnit})</label>
                          <input
                            type="number"
                            step="any"
                            className="form-input"
                            value={fromCanonicalMeters(win.width, currentUnit)}
                            onChange={(e) =>
                              handleUpdateWindow(win.id, {
                                width: toCanonicalMeters(e.target.value, currentUnit)
                              })
                            }
                          />
                        </div>
                        <div className="form-group flex-1">
                          <label className="form-label">Height ({currentUnit})</label>
                          <input
                            type="number"
                            step="any"
                            className="form-input"
                            value={fromCanonicalMeters(win.height, currentUnit)}
                            onChange={(e) =>
                              handleUpdateWindow(win.id, {
                                height: toCanonicalMeters(e.target.value, currentUnit)
                              })
                            }
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-item-delete"
                          onClick={() => handleRemoveWindow(win.id)}
                          title="Delete Window"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Room Actions */}
                <div className="room-card-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleDuplicateRoom(activeRoom.id)}
                  >
                    📋 Duplicate Room
                  </button>
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => handleDeleteRoom(activeRoom.id)}
                  >
                    🗑️ Delete Room
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: FURNITURE CATALOGUE
        =================================================================== */}
        {activeNavTab === 'catalog' && (
          <div className="tab-pane-section">
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Furniture & Decor Catalogue</h3>
                <p className="section-subtitle">Drag onto 3D floor or click "+ Add to Room"</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search products by name or SKU..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
              />
              {catalogSearch && (
                <button className="search-clear" onClick={() => setCatalogSearch('')}>
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            {!catalogSearch && (
              <div className="category-pills-wrap">
                {FURNITURE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Catalog Grid */}
            <div className="catalog-items-grid">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="catalog-product-card"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', item.id);
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({ productId: item.id, name: item.name })
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                  <div className="product-card-top">
                    <span className="product-category-icon">
                      {FURNITURE_CATEGORIES.find((c) => c.id === item.category)?.icon || '🪑'}
                    </span>
                    <span className="product-sku">{item.sku}</span>
                  </div>

                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-dim">{item.dim}</p>

                  <div className="product-price-row">
                    <span className="product-price">{formatINR(item.price)}</span>
                    <span className="product-unit">/{item.unit || 'piece'}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-add-to-room"
                    onClick={() => {
                      if (onAddFurnitureToScene) {
                        onAddFurnitureToScene(item.id);
                      }
                    }}
                  >
                    + Add to Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: WALLS & FINISHES
        =================================================================== */}
        {activeNavTab === 'walls' && (
          <div className="tab-pane-section">
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Individual Wall Customisation</h3>
                <p className="section-subtitle">
                  Click any wall in the 3D scene to select and colour independently
                </p>
              </div>
            </div>

            {/* Target Wall Indicator */}
            <div className="selected-wall-badge-card">
              <span className="wall-badge-icon">🧱</span>
              <div>
                <div className="wall-badge-title">
                  {activeRoom?.name} · {currentWallTarget.toUpperCase()} WALL
                </div>
                <div className="wall-badge-sub">
                  {selectedWall ? 'Selected via 3D click picking' : 'Defaulting to North Wall'}
                </div>
              </div>
            </div>

            {/* Wall Selector for Active Room */}
            <div className="form-group">
              <label className="form-label">Choose Wall in {activeRoom?.name}</label>
              <div className="wall-sides-btn-group">
                {['north', 'south', 'east', 'west'].map((side) => (
                  <button
                    key={side}
                    type="button"
                    className={`wall-side-btn ${currentWallTarget === side ? 'active' : ''}`}
                    onClick={() => {
                      if (onSelectWall && activeRoom) {
                        onSelectWall({
                          roomId: activeRoom.id,
                          wallSide: side,
                          roomName: activeRoom.name
                        });
                      }
                    }}
                  >
                    {side.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatch & HEX Input */}
            <div className="color-picker-box">
              <label className="form-label">Wall Colour</label>
              <div className="color-input-row">
                <input
                  type="color"
                  className="color-input-native"
                  value={currentWallFinish.color || '#f8fafc'}
                  onChange={(e) => handleSetWallFinish('single', { color: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input color-hex-text"
                  value={currentWallFinish.color || '#f8fafc'}
                  onChange={(e) => handleSetWallFinish('single', { color: e.target.value })}
                />
              </div>
            </div>

            {/* Curated Designer Palette */}
            <div className="form-group">
              <label className="form-label">Designer Architectural Palette</label>
              <div className="palette-grid">
                {DESIGNER_WALL_PALETTE.map((shade) => (
                  <button
                    key={shade.name}
                    type="button"
                    className={`palette-swatch-btn ${currentWallFinish.color === shade.hex ? 'active' : ''}`}
                    style={{ backgroundColor: shade.hex }}
                    onClick={() => handleSetWallFinish('single', { color: shade.hex })}
                    title={`${shade.name} (${shade.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Material Presets */}
            <div className="form-group">
              <label className="form-label">Material Texture Preset</label>
              <div className="material-presets-list">
                {Object.values(WALL_MATERIAL_PRESETS).map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    className={`material-preset-chip ${currentWallFinish.material === mat.id ? 'active' : ''}`}
                    onClick={() => handleSetWallFinish('single', { material: mat.id })}
                  >
                    {mat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Scope Actions */}
            <div className="wall-scope-actions">
              <button
                type="button"
                className="btn-scope apply-room"
                onClick={() => handleSetWallFinish('room', {})}
              >
                Apply to All Walls in {activeRoom?.name}
              </button>
              <button
                type="button"
                className="btn-scope apply-home"
                onClick={() => handleSetWallFinish('home', {})}
              >
                Apply to All Walls Across Entire Home
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleSetWallFinish('single', { color: '#f8fafc', material: 'matte' })}
              >
                Reset Wall to Default White
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: FALSE CEILING
        =================================================================== */}
        {activeNavTab === 'ceiling' && (
          <div className="tab-pane-section">
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Architectural False Ceiling</h3>
                <p className="section-subtitle">
                  Configure 3D soffits, cove lighting, and downlights for {activeRoom?.name}
                </p>
              </div>
            </div>

            {/* Enable / Disable False Ceiling Toggle */}
            <div className="toggle-banner-card">
              <div className="toggle-banner-text">
                <span className="toggle-title">Enable False Ceiling in {activeRoom?.name}</span>
                <span className="toggle-sub">Constructs physical 3D soffits & ambient fixtures</span>
              </div>
              <label className="toggle-switch switch">
                <input
                  type="checkbox"
                  checked={ceilingConfig.enabled !== false}
                  onChange={(e) => handleUpdateCeiling({ enabled: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {ceilingConfig.enabled !== false && (
              <div className="ceiling-controls-wrapper">
                {/* Ceiling Style */}
                <div className="form-group">
                  <label className="form-label">Ceiling Style</label>
                  <div className="ceiling-styles-grid">
                    {CEILING_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className={`ceiling-style-card ${ceilingConfig.style === st.id ? 'active' : ''}`}
                        onClick={() => handleUpdateCeiling({ style: st.id })}
                      >
                        <span className="style-icon">{st.icon}</span>
                        <span className="style-name">{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drop Height */}
                <div className="form-group">
                  <div className="label-with-val">
                    <label className="form-label">Drop Height</label>
                    <span className="val-badge">{formatMeasurement(ceilingConfig.dropHeight || 0.25, currentUnit)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    className="form-range"
                    value={ceilingConfig.dropHeight || 0.25}
                    onChange={(e) => handleUpdateCeiling({ dropHeight: Number(e.target.value) })}
                  />
                </div>

                {/* Ceiling Color */}
                <div className="form-group">
                  <label className="form-label">Ceiling Finish Colour</label>
                  <div className="color-input-row">
                    <input
                      type="color"
                      className="color-input-native"
                      value={ceilingConfig.color || '#ffffff'}
                      onChange={(e) => handleUpdateCeiling({ color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input color-hex-text"
                      value={ceilingConfig.color || '#ffffff'}
                      onChange={(e) => handleUpdateCeiling({ color: e.target.value })}
                    />
                  </div>
                </div>

                {/* Recessed Downlight Spots */}
                <div className="lighting-toggle-row">
                  <div className="toggle-banner-text">
                    <span className="toggle-title">Recessed LED Downlights</span>
                    <span className="toggle-sub">Flush ceiling spot luminaires</span>
                  </div>
                  <label className="toggle-switch switch">
                    <input
                      type="checkbox"
                      checked={ceilingConfig.recessedSpots !== false}
                      onChange={(e) => handleUpdateCeiling({ recessedSpots: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {ceilingConfig.recessedSpots !== false && (
                  <div className="form-group">
                    <label className="form-label">Downlight Spot Count</label>
                    <div className="spot-count-options">
                      {[4, 6, 8].map((count) => (
                        <button
                          key={count}
                          type="button"
                          className={`spot-btn ${(ceilingConfig.spotCount || 4) === count ? 'active' : ''}`}
                          onClick={() => handleUpdateCeiling({ spotCount: count })}
                        >
                          {count} Spots
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LED Cove Lighting */}
                <div className="lighting-toggle-row">
                  <div className="toggle-banner-text">
                    <span className="toggle-title">Perimeter Cove Lighting</span>
                    <span className="toggle-sub">Hidden warm architectural glow</span>
                  </div>
                  <label className="toggle-switch switch">
                    <input
                      type="checkbox"
                      checked={Boolean(ceilingConfig.coveLights)}
                      onChange={(e) => handleUpdateCeiling({ coveLights: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                {/* Central Decorative Luminaire */}
                <div className="lighting-toggle-row">
                  <div className="toggle-banner-text">
                    <span className="toggle-title">Central Fixture</span>
                    <span className="toggle-sub">Ambient luminaire fixture</span>
                  </div>
                  <label className="toggle-switch switch">
                    <input
                      type="checkbox"
                      checked={ceilingConfig.centralFixture !== false}
                      onChange={(e) => handleUpdateCeiling({ centralFixture: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: READY-MADE DESIGN SAMPLES
        =================================================================== */}
        {activeNavTab === 'samples' && (
          <div className="tab-pane-section">
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Ready-Made Design Samples</h3>
                <p className="section-subtitle">Load curated architectural layouts or append to your home</p>
              </div>
            </div>

            <div className="samples-vertical-list">
              {SAMPLE_DESIGNS.map((sample) => (
                <div key={sample.id} className="sample-card-item">
                  <div className="sample-card-header">
                    <div>
                      <span className="sample-badge">{sample.badge}</span>
                      <h4 className="sample-name">{sample.name}</h4>
                    </div>
                    <span className="sample-est-cost">{formatINR(sample.estimatedCost)}</span>
                  </div>

                  <p className="sample-desc">{sample.description}</p>
                  <div className="sample-meta-row">
                    <span>📐 {sample.dimensionsSummary}</span>
                    <span>🛋️ {sample.stagedFurniture?.length || 0} Items</span>
                  </div>

                  <div className="sample-card-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onLoadSampleDesign(sample)}
                    >
                      Load as Project
                    </button>
                    {sample.rooms?.length === 1 && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onAppendSampleRoom(sample)}
                      >
                        + Append Room
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: PROJECT & SETTINGS
        =================================================================== */}
        {activeNavTab === 'settings' && (
          <div className="tab-pane-section">
            <div className="pane-section-header">
              <div>
                <h3 className="section-title">Project Management & Export</h3>
                <p className="section-subtitle">Save, export to JSON, or restore design files</p>
              </div>
            </div>

            <div className="settings-card">
              <h4 className="sub-box-title">Project Data</h4>
              <div className="settings-stat-row">
                <span className="stat-label">Version:</span>
                <span className="stat-val">2.0 Parametric Studio</span>
              </div>
              <div className="settings-stat-row">
                <span className="stat-label">Total Rooms:</span>
                <span className="stat-val">{project?.rooms?.length || 0}</span>
              </div>
              <div className="settings-stat-row">
                <span className="stat-label">Staged Furniture:</span>
                <span className="stat-val">{project?.stagedFurniture?.length || 0} items</span>
              </div>
              <div className="settings-stat-row">
                <span className="stat-label">Internal Canonical Unit:</span>
                <span className="stat-val">Metres (m)</span>
              </div>
            </div>

            <div className="project-file-actions">
              <button type="button" className="btn-primary" onClick={onExportProjectJSON}>
                ⬇️ Export Project to JSON
              </button>

              <label className="btn-secondary file-upload-label">
                ⬆️ Import Project from JSON
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={onImportProjectJSON}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
