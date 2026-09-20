import React, { useState } from 'react';
import BlueprintScannerModal from './BlueprintScannerModal';

const PRESETS = [
  {
    name: 'Default Standard (5m × 4m)',
    layoutType: 'custom',
    width: 5000,
    length: 4000,
    wallHeight: 3000,
    wallThickness: 150,
    door: { enabled: true, width: 900, height: 2100 },
    window: { enabled: true, width: 1500, height: 1200, sillHeight: 900 },
    flooring: 'hardwood',
    timeOfDay: 12.0
  },
  {
    name: 'Small Bedroom (3.5m × 3m)',
    layoutType: 'custom',
    width: 3500,
    length: 3000,
    wallHeight: 2800,
    wallThickness: 150,
    door: { enabled: true, width: 850, height: 2050 },
    window: { enabled: true, width: 1200, height: 1100, sillHeight: 900 },
    flooring: 'hardwood',
    timeOfDay: 12.0
  },
  {
    name: 'Spacious Hall (7m × 5.5m)',
    layoutType: 'custom',
    width: 7000,
    length: 5500,
    wallHeight: 3200,
    wallThickness: 200,
    door: { enabled: true, width: 1000, height: 2200 },
    window: { enabled: true, width: 2200, height: 1400, sillHeight: 800 },
    flooring: 'tile',
    timeOfDay: 12.0
  },
  {
    name: 'Square Studio (4.5m × 4.5m)',
    layoutType: 'custom',
    width: 4500,
    length: 4500,
    wallHeight: 3000,
    wallThickness: 150,
    door: { enabled: true, width: 900, height: 2100 },
    window: { enabled: true, width: 1600, height: 1200, sillHeight: 900 },
    flooring: 'slate',
    timeOfDay: 12.0
  }
];

const MULTI_ROOM_CONFIGS = {
  '1bhk': {
    title: '1BHK Contemporary Flat',
    carpetArea: 53.1,
    rooms: [
      { id: 'living', name: 'Living & Dining Area', dims: '5.4m × 4.4m', area: 23.8, flooring: 'Natural Hardwood', coords: [-0.8, 1.65, 2.0] },
      { id: 'bedroom', name: 'Master Bedroom', dims: '4.4m × 3.6m', area: 15.8, flooring: 'Natural Hardwood', coords: [-1.3, 1.65, -2.0] },
      { id: 'kitchen', name: 'Modular Kitchen', dims: '3.4m × 2.5m', area: 8.5, flooring: 'Vitrified Tile', coords: [2.7, 1.65, 2.5] },
      { id: 'bathroom', name: 'En-Suite Bathroom', dims: '2.4m × 2.1m', area: 5.0, flooring: 'Ceramic Tile', coords: [2.2, 1.65, -2.8] }
    ]
  },
  '2bhk': {
    title: '2BHK Executive Flat',
    carpetArea: 78.8,
    rooms: [
      { id: 'living', name: 'Grand Living & Dining', dims: '6.2m × 4.8m', area: 29.8, flooring: 'Natural Hardwood', coords: [-1.0, 1.65, 2.5] },
      { id: 'master_bed', name: 'Master Suite', dims: '4.5m × 4.0m', area: 18.0, flooring: 'Natural Hardwood', coords: [-1.8, 1.65, -2.2] },
      { id: 'second_bed', name: 'Guest Bedroom / Study', dims: '3.8m × 3.4m', area: 12.9, flooring: 'Natural Hardwood', coords: [2.8, 1.65, -2.2] },
      { id: 'kitchen', name: 'Gourmet Kitchen', dims: '3.6m × 2.8m', area: 10.1, flooring: 'Vitrified Tile', coords: [3.1, 1.65, 0.8] },
      { id: 'master_bath', name: 'Master En-Suite', dims: '2.2m × 2.0m', area: 4.4, flooring: 'Ceramic Tile', coords: [-4.3, 1.65, -2.4] },
      { id: 'guest_bath', name: 'Common Powder Room', dims: '2.0m × 1.8m', area: 3.6, flooring: 'Ceramic Tile', coords: [3.1, 1.65, 3.2] }
    ]
  }
};

export default function DimensionForm({ initialValues, onGenerate }) {
  const [formState, setFormState] = useState(initialValues);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dimensions');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const isMultiRoom = formState.layoutType === '1bhk' || formState.layoutType === '2bhk';
  const isScannedBlueprint = formState.layoutType === 'scanned_blueprint';

  const handleLayoutSelect = (type) => {
    const updated = {
      ...formState,
      layoutType: type,
      scannedData: null
    };
    setFormState(updated);
    setError(null);
    onGenerate(updated);
  };

  const handleApplyScannedBlueprint = (scannedResult) => {
    const updated = {
      ...formState,
      layoutType: 'scanned_blueprint',
      scannedData: scannedResult
    };
    setFormState(updated);
    setError(null);
    onGenerate(updated);
  };

  const handleTimeChange = (newTime) => {
    const updated = {
      ...formState,
      timeOfDay: newTime
    };
    setFormState(updated);
    onGenerate(updated);
  };

  const handleTeleport = (coords) => {
    const updated = {
      ...formState,
      teleportCoords: coords
    };
    setFormState(updated);
    onGenerate(updated);
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleDoorChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      door: {
        ...prev.door,
        [field]: value
      }
    }));
  };

  const handleWindowChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      window: {
        ...prev.window,
        [field]: value
      }
    }));
  };

  const handleFlooringChange = (style) => {
    setFormState((prev) => {
      const updated = { ...prev, flooring: style };
      onGenerate(updated);
      return updated;
    });
  };

  const handleApplyPreset = (preset) => {
    setFormState(preset);
    setError(null);
    onGenerate(preset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMultiRoom || isScannedBlueprint) {
      onGenerate(formState);
      return;
    }

    const { width, length, wallHeight, wallThickness, door, window: win } = formState;

    if (!width || !length || !wallHeight || !wallThickness) {
      setError('Please fill in all room dimension fields.');
      return;
    }

    if (width <= 500 || length <= 500 || wallHeight <= 1000 || wallThickness <= 50) {
      setError('Room dimensions must be realistic.');
      return;
    }

    if (wallThickness * 2 >= width || wallThickness * 2 >= length) {
      setError('Wall thickness is too large.');
      return;
    }

    if (door?.enabled) {
      if (door.width >= width - wallThickness * 2 - 200) {
        setError('Door width is too wide for the South wall.');
        return;
      }
      if (door.height >= wallHeight - 100) {
        setError('Door height exceeds room ceiling height.');
        return;
      }
    }

    if (win?.enabled) {
      if (win.width >= width - wallThickness * 2 - 200) {
        setError('Window width is too wide for the North wall.');
        return;
      }
      if (win.sillHeight + win.height >= wallHeight - 100) {
        setError('Window top exceeds room ceiling height.');
        return;
      }
    }

    setError(null);
    onGenerate(formState);
  };

  // Format Time of Day nicely
  const currentTime = formState.timeOfDay ?? 12.0;
  const hours = Math.floor(currentTime);
  const minutes = Math.round((currentTime - hours) * 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedTimeString = `${displayHours}:${formattedMinutes} ${ampm}`;

  let timePhaseLabel = 'Midday Daylight';
  if (currentTime < 8.0) timePhaseLabel = 'Dawn Sunrise';
  else if (currentTime > 16.5 && currentTime < 19.0) timePhaseLabel = 'Golden Hour Sunset';
  else if (currentTime >= 19.0) timePhaseLabel = 'Night Mode';

  const widthM = ((formState.width || 5000) / 1000).toFixed(2);
  const lengthM = ((formState.length || 4000) / 1000).toFixed(2);
  const heightM = ((formState.wallHeight || 3000) / 1000).toFixed(2);
  const areaM2 = (widthM * lengthM).toFixed(2);

  return (
    <div className="dimension-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="badge">Phase 4 · AI Blueprint & Solar Engine</div>
        <h2>Property Floor Planner</h2>
        <p className="panel-subtitle">
          Scan 2D blueprint drawings, simulate real-world sun angles, or configure multi-room flats in real-time.
        </p>
      </div>

      {/* Primary Action: 2D Blueprint Scan Button */}
      <div className="blueprint-scanner-trigger-box">
        <button
          type="button"
          className="btn-scan-blueprint"
          onClick={() => setIsScannerOpen(true)}
        >
          <div className="scan-icon-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div className="scan-btn-content">
            <strong>Scan 2D Blueprint Image</strong>
            <span>Convert floor plan drawings into 3D spaces</span>
          </div>
        </button>
      </div>

      {/* Solar & Daylight Simulation Section */}
      <div className="solar-simulation-panel">
        <div className="solar-header">
          <div className="solar-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span>Solar & Daylight Simulation</span>
          </div>
          <div className="solar-badge">{formattedTimeString} · {timePhaseLabel}</div>
        </div>

        {/* Time Slider */}
        <div className="solar-slider-wrapper">
          <input
            type="range"
            min="6.0"
            max="22.0"
            step="0.5"
            value={currentTime}
            onChange={(e) => handleTimeChange(Number(e.target.value))}
            className="solar-range-input"
          />
        </div>

        {/* Solar Preset Chips */}
        <div className="solar-chips">
          <button
            type="button"
            className={`solar-chip ${currentTime === 6.5 ? 'active' : ''}`}
            onClick={() => handleTimeChange(6.5)}
          >
            🌅 Dawn (6:30 AM)
          </button>
          <button
            type="button"
            className={`solar-chip ${currentTime === 12.0 ? 'active' : ''}`}
            onClick={() => handleTimeChange(12.0)}
          >
            ☀️ Noon (12:00 PM)
          </button>
          <button
            type="button"
            className={`solar-chip ${currentTime === 17.5 ? 'active' : ''}`}
            onClick={() => handleTimeChange(17.5)}
          >
            🌇 Sunset (5:30 PM)
          </button>
          <button
            type="button"
            className={`solar-chip ${currentTime === 21.0 ? 'active' : ''}`}
            onClick={() => handleTimeChange(21.0)}
          >
            🌙 Night (9:00 PM)
          </button>
        </div>
      </div>

      {/* Property Layout Selector */}
      <div className="property-selector-box">
        <label className="section-label">Property Architecture Layout</label>
        <div className="layout-pills">
          <button
            type="button"
            className={`layout-pill ${formState.layoutType === '1bhk' ? 'selected' : ''}`}
            onClick={() => handleLayoutSelect('1bhk')}
          >
            <span className="pill-title">1BHK Apartment</span>
            <span className="pill-sub">4 Rooms · 53.1 m²</span>
          </button>
          <button
            type="button"
            className={`layout-pill ${formState.layoutType === '2bhk' ? 'selected' : ''}`}
            onClick={() => handleLayoutSelect('2bhk')}
          >
            <span className="pill-title">2BHK Executive</span>
            <span className="pill-sub">6 Rooms · 78.8 m²</span>
          </button>
          <button
            type="button"
            className={`layout-pill ${formState.layoutType === 'custom' || !formState.layoutType ? 'selected' : ''}`}
            onClick={() => handleLayoutSelect('custom')}
          >
            <span className="pill-title">Custom Studio</span>
            <span className="pill-sub">Parametric Box</span>
          </button>
        </div>
      </div>

      {/* SCANNED BLUEPRINT VIEW */}
      {isScannedBlueprint && formState.scannedData && (
        <div className="multi-room-section">
          <div className="section-label-row">
            <span className="section-label">Active Scanned Blueprint 3D Model</span>
            <span className="room-count-badge">CV Generated</span>
          </div>

          <div className="stats-card">
            <h3>Extruded Blueprint Metrics</h3>
            <div className="stat-row">
              <span className="stat-label">Detected Walls:</span>
              <span className="stat-val highlight">{formState.scannedData.walls.length} Wall Meshes</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Floor Envelope:</span>
              <span className="stat-val">
                {formState.scannedData.blueprintDimensions.totalWidthM}m × {formState.scannedData.blueprintDimensions.totalLengthM}m
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Estimated Floor Area:</span>
              <span className="stat-val highlight">
                {formState.scannedData.carpetAreaM2} m² ({(formState.scannedData.carpetAreaM2 * 10.7639).toFixed(0)} sq ft)
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Walkthrough Modes:</span>
              <span className="stat-val code-tag">FPS & TPS Active</span>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-ROOM APARTMENT VIEW */}
      {isMultiRoom && (
        <div className="multi-room-section">
          <div className="section-label-row">
            <span className="section-label">Apartment Rooms & Quick Teleport</span>
            <span className="room-count-badge">
              {MULTI_ROOM_CONFIGS[formState.layoutType].rooms.length} Interconnected Spaces
            </span>
          </div>

          <div className="rooms-teleport-list">
            {MULTI_ROOM_CONFIGS[formState.layoutType].rooms.map((room) => (
              <div key={room.id} className="room-card-item">
                <div className="room-card-info">
                  <div className="room-card-title">{room.name}</div>
                  <div className="room-card-specs">
                    <span>{room.dims}</span>
                    <span>·</span>
                    <span className="area-tag">{room.area} m² ({(room.area * 10.7639).toFixed(0)} sq ft)</span>
                  </div>
                  <div className="room-flooring-tag">Flooring: {room.flooring}</div>
                </div>
                <button
                  type="button"
                  className="btn-teleport-room"
                  title="Teleport visitor avatar to this room"
                  onClick={() => handleTeleport(room.coords)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 8 16 12 12 16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Enter Room
                </button>
              </div>
            ))}
          </div>

          <div className="stats-card">
            <h3>Flat Specification & Metrics</h3>
            <div className="stat-row">
              <span className="stat-label">Total Carpet Area:</span>
              <span className="stat-val highlight">
                {MULTI_ROOM_CONFIGS[formState.layoutType].carpetArea} m² (
                {(MULTI_ROOM_CONFIGS[formState.layoutType].carpetArea * 10.7639).toFixed(0)} sq ft)
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Internal Doorways:</span>
              <span className="stat-val">
                {formState.layoutType === '1bhk' ? '3 Connecting Openings' : '5 Connecting Openings'}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Camera Perspectives:</span>
              <span className="stat-val code-tag">CAD Orbit · FPS (1st) · TPS (3rd)</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Perspective Hotkey:</span>
              <span className="stat-val highlight">[V] Switch 1st / 3rd Person</span>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE CUSTOM ROOM VIEW */}
      {!isMultiRoom && !isScannedBlueprint && (
        <>
          <div className="preset-section">
            <label className="section-label">Quick Single-Room Presets</label>
            <div className="preset-chips">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-chip"
                  onClick={() => handleApplyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'dimensions' ? 'active' : ''}`}
              onClick={() => setActiveTab('dimensions')}
            >
              Dimensions
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'openings' ? 'active' : ''}`}
              onClick={() => setActiveTab('openings')}
            >
              Openings (Doors/Windows)
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              Finishes & Flooring
            </button>
          </div>

          <form onSubmit={handleSubmit} className="dimension-form">
            {activeTab === 'dimensions' && (
              <div className="tab-content">
                <div className="form-group">
                  <label htmlFor="input-width">
                    <span>Room Width (X-axis)</span>
                    <span className="unit-tag">mm ({widthM} m)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="input-width"
                      type="number"
                      name="width"
                      min="1000"
                      max="50000"
                      step="50"
                      value={formState.width || 5000}
                      onChange={handleDimensionChange}
                      required
                    />
                    <span className="input-suffix">mm</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="input-length">
                    <span>Room Length (Z-axis)</span>
                    <span className="unit-tag">mm ({lengthM} m)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="input-length"
                      type="number"
                      name="length"
                      min="1000"
                      max="50000"
                      step="50"
                      value={formState.length || 4000}
                      onChange={handleDimensionChange}
                      required
                    />
                    <span className="input-suffix">mm</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="input-height">
                    <span>Wall Ceiling Height (Y-axis)</span>
                    <span className="unit-tag">mm ({heightM} m)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="input-height"
                      type="number"
                      name="wallHeight"
                      min="1500"
                      max="15000"
                      step="50"
                      value={formState.wallHeight || 3000}
                      onChange={handleDimensionChange}
                      required
                    />
                    <span className="input-suffix">mm</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="input-thickness">
                    <span>Wall Thickness</span>
                    <span className="unit-tag">mm ({((formState.wallThickness || 150) / 1000).toFixed(2)} m)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="input-thickness"
                      type="number"
                      name="wallThickness"
                      min="50"
                      max="1000"
                      step="10"
                      value={formState.wallThickness || 150}
                      onChange={handleDimensionChange}
                      required
                    />
                    <span className="input-suffix">mm</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'openings' && (
              <div className="tab-content">
                <div className="feature-card">
                  <div className="feature-header">
                    <div className="feature-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                        <circle cx="9" cy="12" r="1" />
                      </svg>
                      <span>Entrance Door (South Wall)</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formState.door?.enabled ?? true}
                        onChange={(e) => handleDoorChange('enabled', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {formState.door?.enabled && (
                    <div className="feature-inputs">
                      <div className="form-row">
                        <div className="form-group compact">
                          <label>Door Width</label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              min="600"
                              max="2500"
                              step="50"
                              value={formState.door?.width || 900}
                              onChange={(e) => handleDoorChange('width', Number(e.target.value))}
                            />
                            <span className="input-suffix">mm</span>
                          </div>
                        </div>

                        <div className="form-group compact">
                          <label>Door Height</label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              min="1800"
                              max="3000"
                              step="50"
                              value={formState.door?.height || 2100}
                              onChange={(e) => handleDoorChange('height', Number(e.target.value))}
                            />
                            <span className="input-suffix">mm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="feature-card">
                  <div className="feature-header">
                    <div className="feature-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M12 3v18M3 12h18" />
                      </svg>
                      <span>Exterior Window (North Wall)</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formState.window?.enabled ?? true}
                        onChange={(e) => handleWindowChange('enabled', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {formState.window?.enabled && (
                    <div className="feature-inputs">
                      <div className="form-row">
                        <div className="form-group compact">
                          <label>Window Width</label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              min="600"
                              max="4000"
                              step="50"
                              value={formState.window?.width || 1500}
                              onChange={(e) => handleWindowChange('width', Number(e.target.value))}
                            />
                            <span className="input-suffix">mm</span>
                          </div>
                        </div>

                        <div className="form-group compact">
                          <label>Window Height</label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              min="600"
                              max="2500"
                              step="50"
                              value={formState.window?.height || 1200}
                              onChange={(e) => handleWindowChange('height', Number(e.target.value))}
                            />
                            <span className="input-suffix">mm</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group compact">
                        <label>Sill Height (from floor)</label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            min="300"
                            max="1800"
                            step="50"
                            value={formState.window?.sillHeight || 900}
                            onChange={(e) => handleWindowChange('sillHeight', Number(e.target.value))}
                          />
                          <span className="input-suffix">mm</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="tab-content">
                <div className="material-picker">
                  <label className="section-label">Flooring Style</label>
                  <div className="material-options">
                    <button
                      type="button"
                      className={`material-card ${formState.flooring === 'hardwood' ? 'selected' : ''}`}
                      onClick={() => handleFlooringChange('hardwood')}
                    >
                      <div className="material-preview wood-preview"></div>
                      <div className="material-info">
                        <strong>Natural Hardwood</strong>
                        <span>Warm varnished oak parquet</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`material-card ${formState.flooring === 'tile' ? 'selected' : ''}`}
                      onClick={() => handleFlooringChange('tile')}
                    >
                      <div className="material-preview tile-preview"></div>
                      <div className="material-info">
                        <strong>Polished Vitrified Tile</strong>
                        <span>Glossy white porcelain marble</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`material-card ${formState.flooring === 'slate' ? 'selected' : ''}`}
                      onClick={() => handleFlooringChange('slate')}
                    >
                      <div className="material-preview slate-preview"></div>
                      <div className="material-info">
                        <strong>Architectural Slate</strong>
                        <span>Minimalist matte grey stone</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <button type="submit" id="btn-generate-3d" className="btn-generate">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Update 3D Model
            </button>
          </form>

          <div className="stats-card">
            <h3>Calculated Room Metrics</h3>
            <div className="stat-row">
              <span className="stat-label">Carpet Area:</span>
              <span className="stat-val highlight">{areaM2} m² ({(areaM2 * 10.7639).toFixed(1)} sq ft)</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Bounding Envelope:</span>
              <span className="stat-val">{widthM}m × {heightM}m × {lengthM}m</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Camera Perspectives:</span>
              <span className="stat-val code-tag">CAD Orbit · FPS (1st) · TPS (3rd)</span>
            </div>
          </div>
        </>
      )}

      {/* Blueprint Scanner Modal */}
      <BlueprintScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApply3D={handleApplyScannedBlueprint}
      />
    </div>
  );
}
