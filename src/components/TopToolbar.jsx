import React from 'react';
import { SUPPORTED_UNITS } from '../utils/units';

export default function TopToolbar({
  projectName,
  onUpdateProjectName,
  currentUnit,
  onChangeUnit,
  navMode,
  onChangeNavMode,
  showCeiling,
  onToggleCeiling,
  onSaveProject,
  onOpenEstimateModal,
  onOpenAdminModal
}) {
  return (
    <header className="app-header">
      {/* Brand & Project Name */}
      <div className="header-brand">
        <div className="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="brand-text-block">
          <div className="brand-title-row">
            <h1 className="brand-title">Virtual 3D Home Builder</h1>
            <span className="brand-badge-v2">Studio Pro</span>
          </div>
          <div className="project-name-input-wrap">
            <input
              type="text"
              className="project-name-input"
              value={projectName || 'My Dream Residence'}
              onChange={(e) => onUpdateProjectName(e.target.value)}
              title="Click to rename project"
            />
          </div>
        </div>
      </div>

      {/* Center Tool Group */}
      <div className="header-center-tools">
        {/* Unit Selector */}
        <div className="unit-selector-pill-group">
          <span className="tool-label">Units:</span>
          {SUPPORTED_UNITS.map((u) => (
            <button
              key={u}
              type="button"
              className={`unit-pill ${currentUnit === u ? 'active' : ''}`}
              onClick={() => onChangeUnit(u)}
              title={`Switch display unit to ${u.toUpperCase()}`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="toolbar-divider-v" />

        {/* Ceiling Toggle */}
        <button
          type="button"
          className={`toolbar-btn ceiling-btn ${showCeiling ? 'active' : ''}`}
          onClick={onToggleCeiling}
          title={showCeiling ? 'Hide False Ceiling (Inspect Interior from Above)' : 'Show False Ceiling in 3D'}
        >
          <span className="btn-icon">{showCeiling ? '🏛️' : '👁️'}</span>
          <span>{showCeiling ? 'Ceiling: Visible' : 'Ceiling: Hidden'}</span>
        </button>

        <div className="toolbar-divider-v" />

        {/* Camera Walkthrough Switch */}
        <div className="cam-mode-toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${navMode === 'orbit' ? 'active' : ''}`}
            onClick={() => onChangeNavMode('orbit')}
            title="Bird's-Eye CAD Orbit View"
          >
            <span className="btn-icon">🦅</span>
            <span>Bird's-Eye</span>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${navMode === 'fps' ? 'active' : ''}`}
            onClick={() => onChangeNavMode('fps')}
            title="First-Person Walkthrough (Eye-Level 1.65m)"
          >
            <span className="btn-icon">🚶</span>
            <span>1st-Person</span>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="header-meta">
        <button
          type="button"
          className="btn-action-top save"
          onClick={onSaveProject}
          title="Save project to local storage"
        >
          <span className="btn-icon">💾</span>
          <span>Save</span>
        </button>

        <button
          type="button"
          className="btn-action-top quote"
          onClick={onOpenEstimateModal}
          title="Export / Print itemised cost estimate"
        >
          <span className="btn-icon">📄</span>
          <span>Quotation</span>
        </button>

        <button
          type="button"
          className="btn-action-top admin"
          onClick={onOpenAdminModal}
          title="Open protected Furniture Catalogue & Pricing Admin"
        >
          <span className="btn-icon">🔒</span>
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
