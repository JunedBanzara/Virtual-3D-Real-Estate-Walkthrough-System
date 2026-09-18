import React, { useState } from 'react';

const PRESETS = [
  { name: 'Default Standard (5m × 4m)', width: 5000, length: 4000, wallHeight: 3000, wallThickness: 150 },
  { name: 'Small Bedroom (3.5m × 3m)', width: 3500, length: 3000, wallHeight: 2800, wallThickness: 150 },
  { name: 'Spacious Hall (7m × 5.5m)', width: 7000, length: 5500, wallHeight: 3200, wallThickness: 200 },
  { name: 'Square Studio (4.5m × 4.5m)', width: 4500, length: 4500, wallHeight: 3000, wallThickness: 150 }
];

export default function DimensionForm({ initialValues, onGenerate }) {
  const [formState, setFormState] = useState(initialValues);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleApplyPreset = (preset) => {
    setFormState({
      width: preset.width,
      length: preset.length,
      wallHeight: preset.wallHeight,
      wallThickness: preset.wallThickness
    });
    setError(null);
    onGenerate({
      width: preset.width,
      length: preset.length,
      wallHeight: preset.wallHeight,
      wallThickness: preset.wallThickness
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { width, length, wallHeight, wallThickness } = formState;

    if (!width || !length || !wallHeight || !wallThickness) {
      setError('Please fill in all dimension fields.');
      return;
    }

    if (width <= 500 || length <= 500 || wallHeight <= 1000 || wallThickness <= 50) {
      setError('Dimensions must be realistic (min width/length: 500mm, min height: 1000mm, min thickness: 50mm).');
      return;
    }

    if (wallThickness * 2 >= width || wallThickness * 2 >= length) {
      setError('Wall thickness is too large for the specified room width/length.');
      return;
    }

    setError(null);
    onGenerate({
      width: Number(width),
      length: Number(length),
      wallHeight: Number(wallHeight),
      wallThickness: Number(wallThickness)
    });
  };

  const widthM = (formState.width / 1000).toFixed(2);
  const lengthM = (formState.length / 1000).toFixed(2);
  const heightM = (formState.wallHeight / 1000).toFixed(2);
  const areaM2 = (widthM * lengthM).toFixed(2);

  return (
    <div className="dimension-panel">
      <div className="panel-header">
        <div className="badge">Input Stage · Step 1</div>
        <h2>Room Dimensions</h2>
        <p className="panel-subtitle">
          Define geometric boundaries. Dimensions are converted into 3D world coordinates.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="preset-section">
        <label className="section-label">Quick Presets</label>
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

      <form onSubmit={handleSubmit} className="dimension-form">
        <div className="form-group">
          <label htmlFor="input-width">
            <span>Room Width</span>
            <span className="unit-tag">mm ({widthM} m)</span>
          </label>
          <div className="input-wrapper">
            <input
              id="input-width"
              type="number"
              name="width"
              min="500"
              max="50000"
              step="50"
              value={formState.width}
              onChange={handleChange}
              required
            />
            <span className="input-suffix">mm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input-length">
            <span>Room Length</span>
            <span className="unit-tag">mm ({lengthM} m)</span>
          </label>
          <div className="input-wrapper">
            <input
              id="input-length"
              type="number"
              name="length"
              min="500"
              max="50000"
              step="50"
              value={formState.length}
              onChange={handleChange}
              required
            />
            <span className="input-suffix">mm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input-height">
            <span>Wall Height</span>
            <span className="unit-tag">mm ({heightM} m)</span>
          </label>
          <div className="input-wrapper">
            <input
              id="input-height"
              type="number"
              name="wallHeight"
              min="1000"
              max="15000"
              step="50"
              value={formState.wallHeight}
              onChange={handleChange}
              required
            />
            <span className="input-suffix">mm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="input-thickness">
            <span>Wall Thickness</span>
            <span className="unit-tag">mm ({(formState.wallThickness / 1000).toFixed(2)} m)</span>
          </label>
          <div className="input-wrapper">
            <input
              id="input-thickness"
              type="number"
              name="wallThickness"
              min="50"
              max="1000"
              step="10"
              value={formState.wallThickness}
              onChange={handleChange}
              required
            />
            <span className="input-suffix">mm</span>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" id="btn-generate-3d" className="btn-generate">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          Generate 3D
        </button>
      </form>

      {/* Geometry Stats Card */}
      <div className="stats-card">
        <h3>Calculated Geometry Data</h3>
        <div className="stat-row">
          <span className="stat-label">Floor Area:</span>
          <span className="stat-val">{areaM2} m²</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">3D Bounding Box:</span>
          <span className="stat-val">{widthM}m × {heightM}m × {lengthM}m</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Coordinate Range:</span>
          <span className="stat-val">X: [-{(widthM / 2).toFixed(2)}, {(widthM / 2).toFixed(2)}]</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Data Format:</span>
          <span className="stat-val code-tag">JSON Schema (Decoupled)</span>
        </div>
      </div>
    </div>
  );
}
