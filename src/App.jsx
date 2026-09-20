import React, { useState } from 'react';
import DimensionForm from './components/DimensionForm';
import Viewer3D from './components/Viewer3D';
import './styles/app.css';

const DEFAULT_PROPERTY = {
  layoutType: '1bhk',
  width: 5000,
  length: 4000,
  wallHeight: 3000,
  wallThickness: 150,
  door: { enabled: true, width: 900, height: 2100 },
  window: { enabled: true, width: 1500, height: 1200, sillHeight: 900 },
  flooring: 'hardwood',
  timeOfDay: 12.0
};

export default function App() {
  const [propertyData, setPropertyData] = useState(DEFAULT_PROPERTY);
  const [isStagingOpen, setIsStagingOpen] = useState(false);

  const handleUpdateProperty = (newData) => {
    setPropertyData(newData);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Virtual 3D Real Estate Walkthrough System</h1>
            <span className="brand-subtitle">Phase 5 · 3D Drag & Drop Furniture Staging & Solar Engine</span>
          </div>
        </div>

        <div className="header-meta">
          <button
            type="button"
            className={`btn-furniture-staging ${isStagingOpen ? 'active' : ''}`}
            onClick={() => setIsStagingOpen((prev) => !prev)}
            style={{ pointerEvents: 'auto' }}
          >
            <span className="staging-icon">🛋️</span>
            <span>Furniture Staging</span>
            <span className="staging-count-pill">80+ Models</span>
          </button>
          <div className="status-chip">
            <span className="dot"></span>
            Engine: <strong>3D Staging & Solar Active</strong>
          </div>
          <div className="future-chip">
            <span className="tag">Next:</span> WebXR VR/AR Immersion
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="workspace-layout">
        {/* Left Configurator Pane */}
        <aside className="sidebar-pane">
          <DimensionForm
            initialValues={DEFAULT_PROPERTY}
            onGenerate={handleUpdateProperty}
            onOpenStaging={() => setIsStagingOpen(true)}
          />
        </aside>

        {/* Right 3D Interactive Viewport */}
        <section className="viewport-pane">
          <Viewer3D
            roomData={propertyData}
            isStagingOpen={isStagingOpen}
            onToggleStaging={setIsStagingOpen}
          />
        </section>
      </main>
    </div>
  );
}
