import React from 'react';

export default function FurnitureGizmoToolbar({
  selectedItem,
  gizmoMode,
  onChangeMode,
  onRotate90,
  onDuplicate,
  onDelete,
  onDeselect,
  snapEnabled,
  onToggleSnap
}) {
  if (!selectedItem) return null;

  return (
    <div className="furniture-gizmo-hud">
      {/* Item badge */}
      <div className="gizmo-item-info">
        <span className="gizmo-badge-icon">🪑</span>
        <div className="gizmo-badge-text">
          <span className="gizmo-item-name">{selectedItem.name}</span>
          <span className="gizmo-item-sub">Selected for Staging</span>
        </div>
      </div>

      <div className="gizmo-divider" />

      {/* Transform Modes */}
      <div className="gizmo-modes-group">
        <button
          className={`gizmo-btn ${gizmoMode === 'translate' ? 'active' : ''}`}
          onClick={() => onChangeMode('translate')}
          title="Move on Floor (Shortcut: G)"
        >
          <span className="gizmo-btn-icon">✥</span>
          <span>Move</span>
        </button>

        <button
          className={`gizmo-btn ${gizmoMode === 'rotate' ? 'active' : ''}`}
          onClick={() => onChangeMode('rotate')}
          title="Rotate around Y-axis (Shortcut: R)"
        >
          <span className="gizmo-btn-icon">🔄</span>
          <span>Rotate</span>
        </button>

        <button
          className={`gizmo-btn ${gizmoMode === 'scale' ? 'active' : ''}`}
          onClick={() => onChangeMode('scale')}
          title="Scale Dimensions (Shortcut: S)"
        >
          <span className="gizmo-btn-icon">⤢</span>
          <span>Scale</span>
        </button>
      </div>

      <div className="gizmo-divider" />

      {/* Quick Actions */}
      <div className="gizmo-actions-group">
        <button
          className="gizmo-btn action"
          onClick={onRotate90}
          title="Rotate 90 degrees clockwise"
        >
          <span className="gizmo-btn-icon">↪️</span>
          <span>+90°</span>
        </button>

        <button
          className="gizmo-btn action"
          onClick={onDuplicate}
          title="Duplicate this furniture item"
        >
          <span className="gizmo-btn-icon">📋</span>
          <span>Duplicate</span>
        </button>

        <button
          className={`gizmo-btn snap ${snapEnabled ? 'active' : ''}`}
          onClick={onToggleSnap}
          title={snapEnabled ? 'Grid Snapping ON (0.25m / 15°)' : 'Grid Snapping OFF'}
        >
          <span className="gizmo-btn-icon">🧲</span>
          <span>{snapEnabled ? 'Snap: On' : 'Snap: Off'}</span>
        </button>

        <button
          className="gizmo-btn danger"
          onClick={onDelete}
          title="Delete selected item (Shortcut: Delete / Backspace)"
        >
          <span className="gizmo-btn-icon">🗑️</span>
          <span>Delete</span>
        </button>

        <button
          className="gizmo-btn close"
          onClick={onDeselect}
          title="Deselect (Shortcut: Esc)"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
