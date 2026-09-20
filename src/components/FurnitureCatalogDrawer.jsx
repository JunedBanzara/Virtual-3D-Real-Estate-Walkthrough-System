import React, { useState, useMemo } from 'react';
import { FURNITURE_CATEGORIES, FURNITURE_CATALOG } from '../geometry/furnitureLibrary';

export default function FurnitureCatalogDrawer({
  isOpen,
  onClose,
  onAddFurniture,
  stagedItems = [],
  selectedFurnitureId = null,
  onSelectFurniture,
  onDeleteFurniture,
  onClearAllFurniture,
  onExportLayout,
  onImportLayout
}) {
  const [activeTab, setActiveTab] = useState('living');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' | 'staged'

  // Filter items based on active category and search input
  const filteredItems = useMemo(() => {
    let list = FURNITURE_CATALOG;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.dim.toLowerCase().includes(q)
      );
    } else {
      list = list.filter((item) => item.category === activeTab);
    }
    return list;
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <aside className="furniture-drawer-panel">
        {/* Header */}
        <div className="furniture-drawer-header">
          <div className="furniture-drawer-title-group">
            <span className="furniture-drawer-icon">🛋️</span>
            <div>
              <h2 className="furniture-drawer-title">Furniture Staging Catalog</h2>
              <span className="furniture-drawer-subtitle">
                Drag items into the 3D viewport or click "+ Add to Room"
              </span>
            </div>
          </div>
          <div className="furniture-drawer-actions">
            <button
              className={`furniture-view-pill ${viewMode === 'catalog' ? 'active' : ''}`}
              onClick={() => setViewMode('catalog')}
            >
              Catalog ({FURNITURE_CATALOG.length})
            </button>
            <button
              className={`furniture-view-pill ${viewMode === 'staged' ? 'active' : ''}`}
              onClick={() => setViewMode('staged')}
            >
              Staged in Room ({stagedItems.length})
            </button>
            <button className="furniture-close-btn" onClick={onClose} title="Close Catalog">
              ✕
            </button>
          </div>
        </div>

        {viewMode === 'catalog' ? (
          <>
            {/* Search Bar & Category Pills */}
            <div className="furniture-search-bar-row">
              <div className="furniture-search-input-wrap">
                <span className="furniture-search-icon">🔍</span>
                <input
                  type="text"
                  className="furniture-search-input"
                  placeholder="Search 80+ furniture models (e.g., sofa, bed, desk, island, mirror)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="furniture-search-clear" onClick={() => setSearchQuery('')}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            {!searchQuery && (
              <div className="furniture-category-tabs">
                {FURNITURE_CATEGORIES.map((cat) => {
                  const count = FURNITURE_CATALOG.filter((i) => i.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      className={`furniture-cat-tab ${activeTab === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(cat.id)}
                    >
                      <span className="cat-tab-icon">{cat.icon}</span>
                      <span className="cat-tab-name">{cat.name}</span>
                      <span className="cat-tab-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Items Grid */}
            <div className="furniture-grid-scroll">
              {filteredItems.length === 0 ? (
                <div className="furniture-empty-search">
                  <span className="empty-icon">🔎</span>
                  <p>No furniture items matching "{searchQuery}"</p>
                  <button className="btn-secondary" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="furniture-cards-grid">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="furniture-card"
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                        e.dataTransfer.setData('application/json', JSON.stringify({ typeId: item.id }));
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      <div className="furniture-card-header">
                        <span className="furniture-card-category">
                          {FURNITURE_CATEGORIES.find((c) => c.id === item.category)?.icon || '🛋️'}{' '}
                          {item.category}
                        </span>
                        <span className="furniture-drag-badge" title="Drag onto 3D floor">
                          ⋮⋮ Drag
                        </span>
                      </div>
                      <h4 className="furniture-card-name">{item.name}</h4>
                      <span className="furniture-card-dim">{item.dim}</span>
                      <div className="furniture-card-footer">
                        <button
                          className="furniture-add-btn"
                          onClick={() => onAddFurniture(item.id)}
                        >
                          + Add to Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Staged Items Inspector */
          <div className="staged-inspector-view">
            <div className="staged-inspector-header">
              <div className="staged-stats">
                <span className="staged-count-badge">{stagedItems.length}</span>
                <span>Furniture Items Staged in Current Property</span>
              </div>
              <div className="staged-actions-row">
                <button className="btn-secondary" onClick={onExportLayout} title="Save Layout JSON">
                  💾 Export JSON
                </button>
                <label className="btn-secondary" title="Load Layout JSON">
                  📂 Import JSON
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={onImportLayout}
                  />
                </label>
                {stagedItems.length > 0 && (
                  <button className="btn-danger-outline" onClick={onClearAllFurniture}>
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>

            {stagedItems.length === 0 ? (
              <div className="staged-empty-state">
                <span className="staged-empty-icon">🪑</span>
                <h3>No Furniture Staged Yet</h3>
                <p>Switch to the Catalog tab and drag furniture pieces into the room, or click "+ Add to Room".</p>
                <button className="btn-primary" onClick={() => setViewMode('catalog')}>
                  Browse Furniture Catalog
                </button>
              </div>
            ) : (
              <div className="staged-items-list">
                {stagedItems.map((item, idx) => {
                  const isSelected = selectedFurnitureId === item.instanceId;
                  return (
                    <div
                      key={item.instanceId}
                      className={`staged-item-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectFurniture(item.instanceId)}
                    >
                      <div className="staged-item-info">
                        <span className="staged-item-index">#{idx + 1}</span>
                        <div>
                          <span className="staged-item-title">{item.name}</span>
                          <span className="staged-item-pos">
                            X: {item.position.x.toFixed(2)}m · Z: {item.position.z.toFixed(2)}m · Rot:{' '}
                            {Math.round((item.rotation.y * 180) / Math.PI)}°
                          </span>
                        </div>
                      </div>
                      <div className="staged-item-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`staged-select-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => onSelectFurniture(item.instanceId)}
                        >
                          {isSelected ? '✓ Selected' : 'Select'}
                        </button>
                        <button
                          className="staged-delete-btn"
                          title="Delete Item"
                          onClick={() => onDeleteFurniture(item.instanceId)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer Hint */}
        <div className="furniture-drawer-footer">
          <div className="footer-shortcut-hint">
            <span>💡 <strong>Tip:</strong> In CAD Orbit view, click any placed furniture to attach the 3D Transform Gizmo.</span>
            <span>Keys: <code>G</code> (Move), <code>R</code> (Rotate), <code>S</code> (Scale), <code>Del</code> (Delete), <code>Esc</code> (Deselect).</span>
          </div>
        </div>
      </aside>
    );
}
