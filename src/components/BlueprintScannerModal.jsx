import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateSampleBlueprint, extractWallsFromBlueprint } from '../geometry/blueprintScanner';

export default function BlueprintScannerModal({ isOpen, onClose, onApply3D }) {
  const [sampleType, setSampleType] = useState('studio'); // 'studio' | '1bhk' | 'loft'
  const [threshold, setThreshold] = useState(120);
  const [scale, setScale] = useState(0.035);
  const [wallHeight, setWallHeight] = useState(3.0);
  const [detectedData, setDetectedData] = useState(null);

  const canvasRef = useRef(null);
  const currentImageRef = useRef(null);

  // Draw original image with detected cyan wall vector overlay
  const drawOverlay = useCallback((result) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImageRef.current) return;
    const ctx = canvas.getContext('2d');

    const w = currentImageRef.current.width || 600;
    const h = currentImageRef.current.height || 500;
    canvas.width = w;
    canvas.height = h;

    // Draw source blueprint
    ctx.drawImage(currentImageRef.current, 0, 0, w, h);

    // Overlay detected wall segments in cyan
    if (result && result.walls) {
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.85)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';

      result.walls.forEach((wall) => {
        const { x1, y1, x2, y2 } = wall.pixelCoords;
        ctx.beginPath();
        if (wall.isVertical) {
          ctx.strokeRect(x1 - 6, y1, 12, y2 - y1);
          ctx.fillRect(x1 - 6, y1, 12, y2 - y1);
        } else {
          ctx.strokeRect(x1, y1 - 6, x2 - x1, 12);
          ctx.fillRect(x1, y1 - 6, x2 - x1, 12);
        }
      });
    }
  }, []);

  // Re-run detection when threshold, scale, or wallHeight change
  const runDetection = useCallback(() => {
    if (!currentImageRef.current) return;
    const result = extractWallsFromBlueprint(currentImageRef.current, {
      threshold,
      scale,
      wallHeight
    });
    setDetectedData(result);
    drawOverlay(result);
  }, [threshold, scale, wallHeight, drawOverlay]);

  // Load sample blueprint initially or when calibration/sampleType changes
  useEffect(() => {
    if (!isOpen) return;
    if (!currentImageRef.current || sampleType) {
      const sampleCanvas = generateSampleBlueprint(sampleType);
      currentImageRef.current = sampleCanvas;
    }
    runDetection();
  }, [isOpen, sampleType, runDetection]);

  // Handle custom image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImageRef.current = img;
        runDetection();
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!detectedData) return;
    onApply3D(detectedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="blueprint-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="badge">Computer Vision Engine · Phase 4</div>
            <h2>2D Blueprint to 3D Extrusion Parser</h2>
            <p className="modal-subtitle">
              Upload a floor plan image or select a sample to automatically detect walls, doorways, and dimensions.
            </p>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-layout">
          {/* Left Canvas Preview */}
          <div className="preview-pane">
            <div className="preview-canvas-box">
              <canvas ref={canvasRef} className="cv-overlay-canvas" />
            </div>
            <div className="preview-legend">
              <span className="legend-dot cyan"></span>
              <span>Detected Wall Vectors (Binarized CV Run-Lengths)</span>
            </div>
          </div>

          {/* Right Controls Sidebar */}
          <div className="modal-controls-pane">
            {/* Sample Selector */}
            <div className="control-group">
              <label className="section-label">Select Sample Blueprint</label>
              <div className="sample-btn-row">
                <button
                  type="button"
                  className={`btn-sample ${sampleType === 'studio' ? 'active' : ''}`}
                  onClick={() => setSampleType('studio')}
                >
                  Studio Suite
                </button>
                <button
                  type="button"
                  className={`btn-sample ${sampleType === '1bhk' ? 'active' : ''}`}
                  onClick={() => setSampleType('1bhk')}
                >
                  1BHK Flat
                </button>
                <button
                  type="button"
                  className={`btn-sample ${sampleType === 'loft' ? 'active' : ''}`}
                  onClick={() => setSampleType('loft')}
                >
                  Modern Loft
                </button>
              </div>
            </div>

            {/* Custom Upload */}
            <div className="control-group">
              <label className="section-label">Or Upload Blueprint Scan (PNG/JPG)</label>
              <div className="file-upload-box">
                <input
                  type="file"
                  id="blueprint-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden-file-input"
                />
                <label htmlFor="blueprint-file-input" className="file-upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Choose Blueprint Image File</span>
                </label>
              </div>
            </div>

            {/* Calibration Sliders */}
            <div className="control-group">
              <label className="section-label">CV Calibration Controls</label>
              
              <div className="slider-row">
                <div className="slider-label">
                  <span>Wall Sensitivity (Threshold)</span>
                  <span className="slider-val">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="220"
                  step="5"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <span>Scale Factor</span>
                  <span className="slider-val">{(scale * 100).toFixed(1)} cm/pixel</span>
                </div>
                <input
                  type="range"
                  min="0.015"
                  max="0.075"
                  step="0.005"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <span>Extruded Wall Height</span>
                  <span className="slider-val">{wallHeight} m</span>
                </div>
                <input
                  type="range"
                  min="2.4"
                  max="4.5"
                  step="0.1"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Detection Summary Card */}
            {detectedData && (
              <div className="detection-stats-card">
                <div className="stat-line">
                  <span>Detected Wall Segments:</span>
                  <strong>{detectedData.walls.length} Walls</strong>
                </div>
                <div className="stat-line">
                  <span>Estimated Envelope:</span>
                  <strong>{detectedData.blueprintDimensions.totalWidthM}m × {detectedData.blueprintDimensions.totalLengthM}m</strong>
                </div>
                <div className="stat-line">
                  <span>Estimated Floor Area:</span>
                  <strong className="text-cyan">{detectedData.carpetAreaM2} m² ({(detectedData.carpetAreaM2 * 10.7639).toFixed(0)} sq ft)</strong>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-generate-scanned"
                onClick={handleApply}
                disabled={!detectedData || detectedData.walls.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                Generate 3D Model from Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
