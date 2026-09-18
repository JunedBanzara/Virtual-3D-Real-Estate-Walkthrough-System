import React, { useState } from 'react';
import DimensionForm from './components/DimensionForm';
import Viewer3D from './components/Viewer3D';
import './styles/app.css';

const DEFAULT_ROOM = {
  width: 5000,
  length: 4000,
  wallHeight: 3000,
  wallThickness: 150
};

export default function App() {
  const [roomData, setRoomData] = useState(DEFAULT_ROOM);

  const handleGenerate3D = (newDimensions) => {
    setRoomData(newDimensions);
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Floor Plan to 3D Visualizer</h1>
            <span className="brand-subtitle">CGIP Project · Version 1 (Dimensions → 3D Pipeline)</span>
          </div>
        </div>

        <div className="header-meta">
          <div className="status-chip">
            <span className="dot"></span>
            Pipeline: <strong>Manual Dimensions Active</strong>
          </div>
          <div className="future-chip">
            <span className="tag">Next:</span> OpenCV Image Parser
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="workspace-layout">
        {/* Left: Input Form Panel */}
        <aside className="sidebar-pane">
          <DimensionForm
            initialValues={DEFAULT_ROOM}
            onGenerate={handleGenerate3D}
          />
        </aside>

        {/* Right / Center: 3D Interactive Viewport */}
        <section className="viewport-pane">
          <Viewer3D roomData={roomData} />
        </section>
      </main>
    </div>
  );
}
