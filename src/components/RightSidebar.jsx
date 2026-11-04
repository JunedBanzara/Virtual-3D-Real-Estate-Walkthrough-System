import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/units';
import { FURNITURE_CATEGORIES } from '../data/furnitureCatalog';

const INSTALLATION_PERCENT = 5;
const TAX_PERCENT = 18; // 18% GST

export default function RightSidebar({
  stagedItems = [],
  onUpdateStagedItems,
  selectedFurnitureId,
  onSelectFurniture,
  selectedWall,
  onSelectWall,
  catalog = [],
  onOpenEstimateModal
}) {
  const [activeTab, setActiveTab] = useState('cost'); // 'inspector' | 'cost'
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [includeTax, setIncludeTax] = useState(true);

  // Selected furniture item
  const selectedFurniture = stagedItems.find((i) => i.instanceId === selectedFurnitureId);

  // Group staged items by product for aggregated itemized quotation
  const aggregatedItems = useMemo(() => {
    const map = new Map();
    stagedItems.forEach((item) => {
      const key = item.productId || item.name;
      if (!map.has(key)) {
        map.set(key, {
          productId: item.productId,
          name: item.name,
          category: item.category || 'living',
          unitPrice: item.price || 0,
          quantity: 1,
          instanceIds: [item.instanceId]
        });
      } else {
        const existing = map.get(key);
        existing.quantity += 1;
        existing.instanceIds.push(item.instanceId);
      }
    });
    return Array.from(map.values());
  }, [stagedItems]);

  // Subtotal grouped by category
  const categorySubtotals = useMemo(() => {
    const map = {};
    aggregatedItems.forEach((item) => {
      const cat = item.category || 'other';
      const lineTotal = item.unitPrice * item.quantity;
      map[cat] = (map[cat] || 0) + lineTotal;
    });
    return map;
  }, [aggregatedItems]);

  // Calculations
  const furnitureSubtotal = useMemo(() => {
    return aggregatedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [aggregatedItems]);

  const installationCharge = includeInstallation ? (furnitureSubtotal * INSTALLATION_PERCENT) / 100 : 0;
  const taxableAmount = furnitureSubtotal + installationCharge;
  const taxCharge = includeTax ? (taxableAmount * TAX_PERCENT) / 100 : 0;
  const grandTotal = taxableAmount + taxCharge;

  // Staged item quantity modification
  const handleIncreaseQty = (item) => {
    // Add duplicate of this product
    const source = stagedItems.find((s) => s.productId === item.productId) || item;
    const newId = 'furn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newItem = {
      ...source,
      instanceId: newId,
      position: {
        x: (source.position?.x || 0) + 0.3,
        y: 0,
        z: (source.position?.z || 0) + 0.3
      }
    };
    onUpdateStagedItems((prev) => [...prev, newItem]);
  };

  const handleDecreaseQty = (item) => {
    if (item.instanceIds.length <= 0) return;
    const toRemoveId = item.instanceIds[item.instanceIds.length - 1];
    onUpdateStagedItems((prev) => prev.filter((s) => s.instanceId !== toRemoveId));
    if (selectedFurnitureId === toRemoveId) {
      onSelectFurniture(null);
    }
  };

  const handleRemoveProductCompletely = (item) => {
    onUpdateStagedItems((prev) => prev.filter((s) => !item.instanceIds.includes(s.instanceId)));
    if (item.instanceIds.includes(selectedFurnitureId)) {
      onSelectFurniture(null);
    }
  };

  // Sync staged items with current catalogue prices
  const handleSyncWithCataloguePrices = () => {
    onUpdateStagedItems((prev) =>
      prev.map((item) => {
        const catItem = catalog.find((c) => c.id === item.productId);
        if (catItem && catItem.price) {
          return { ...item, price: catItem.price };
        }
        return item;
      })
    );
  };

  return (
    <aside className="right-sidebar-panel">
      {/* Top Tabs */}
      <div className="right-sidebar-tabs">
        <button
          className={`right-tab-btn ${activeTab === 'cost' ? 'active' : ''}`}
          onClick={() => setActiveTab('cost')}
        >
          <span className="tab-icon">💰</span>
          <span>Live Quotation ({stagedItems.length})</span>
        </button>
        <button
          className={`right-tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspector')}
        >
          <span className="tab-icon">🔍</span>
          <span>Inspector</span>
          {(selectedFurniture || selectedWall) && <span className="selection-active-dot" />}
        </button>
      </div>

      <div className="right-sidebar-content">
        {/* ===================================================================
            TAB 1: LIVE COST ESTIMATION PANEL
        =================================================================== */}
        {activeTab === 'cost' && (
          <div className="cost-estimation-panel">
            {/* Header */}
            <div className="cost-panel-header">
              <div>
                <h3 className="cost-panel-title">Cost Estimation Engine</h3>
                <span className="cost-panel-subtitle">Real-time dynamic staging quote</span>
              </div>
              <button
                type="button"
                className="btn-sync-prices"
                onClick={handleSyncWithCataloguePrices}
                title="Refresh staged item prices from latest catalog"
              >
                🔄 Sync Prices
              </button>
            </div>

            {/* Empty State */}
            {stagedItems.length === 0 ? (
              <div className="empty-staging-card">
                <span className="empty-staging-icon">🛋️</span>
                <h4>No Furniture Staged</h4>
                <p>Add items from the Catalogue drawer or drag onto the 3D floor to build your estimate.</p>
              </div>
            ) : (
              <>
                {/* Itemised List Grouped by Category */}
                <div className="itemised-catalog-scroll">
                  {FURNITURE_CATEGORIES.map((cat) => {
                    const itemsInCat = aggregatedItems.filter((i) => i.category === cat.id);
                    if (itemsInCat.length === 0) return null;
                    const catSubtotal = categorySubtotals[cat.id] || 0;

                    return (
                      <div key={cat.id} className="category-cost-group">
                        <div className="category-group-header">
                          <span className="category-title">
                            {cat.icon} {cat.name}
                          </span>
                          <span className="category-subtotal">{formatINR(catSubtotal)}</span>
                        </div>

                        <div className="category-items-list">
                          {itemsInCat.map((item) => (
                            <div key={item.productId} className="cost-line-item-row">
                              <div className="line-item-main">
                                <span className="item-name">{item.name}</span>
                                <span className="item-rate">
                                  {formatINR(item.unitPrice)} each
                                </span>
                              </div>

                              <div className="line-item-qty-controls">
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleDecreaseQty(item)}
                                  title="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="qty-number">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleIncreaseQty(item)}
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <div className="line-item-total">
                                <span>{formatINR(item.unitPrice * item.quantity)}</span>
                              </div>

                              <button
                                type="button"
                                className="line-item-delete"
                                onClick={() => handleRemoveProductCompletely(item)}
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Charges: Installation & Tax */}
                <div className="additional-charges-box">
                  <div className="charge-toggle-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={includeInstallation}
                        onChange={(e) => setIncludeInstallation(e.target.checked)}
                      />
                      <span>Assembly & Installation ({INSTALLATION_PERCENT}%)</span>
                    </label>
                    <span className="charge-amount">{formatINR(installationCharge)}</span>
                  </div>

                  <div className="charge-toggle-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={(e) => setIncludeTax(e.target.checked)}
                      />
                      <span>GST / Tax ({TAX_PERCENT}%)</span>
                    </label>
                    <span className="charge-amount">{formatINR(taxCharge)}</span>
                  </div>
                </div>

                {/* Final Cost Summary Card */}
                <div className="grand-total-card">
                  <div className="total-row subtotal">
                    <span>Furniture Subtotal:</span>
                    <span>{formatINR(furnitureSubtotal)}</span>
                  </div>
                  {includeInstallation && (
                    <div className="total-row fee">
                      <span>Installation (5%):</span>
                      <span>+{formatINR(installationCharge)}</span>
                    </div>
                  )}
                  {includeTax && (
                    <div className="total-row fee">
                      <span>GST (18%):</span>
                      <span>+{formatINR(taxCharge)}</span>
                    </div>
                  )}
                  <div className="total-row grand">
                    <span>Grand Total:</span>
                    <span className="grand-amount">{formatINR(grandTotal)}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-export-quote-full"
                    onClick={onOpenEstimateModal}
                  >
                    📄 Export / Print Quotation
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: CONTEXT-SENSITIVE INSPECTOR
        =================================================================== */}
        {activeTab === 'inspector' && (
          <div className="inspector-panel">
            {selectedFurniture ? (
              <div className="inspector-section">
                <div className="inspector-header">
                  <span className="inspector-icon">🪑</span>
                  <div>
                    <h4 className="inspector-title">{selectedFurniture.name}</h4>
                    <span className="inspector-sku">
                      {selectedFurniture.category?.toUpperCase()} · {selectedFurniture.instanceId}
                    </span>
                  </div>
                </div>

                <div className="inspector-props-card">
                  <div className="prop-row">
                    <span className="prop-label">Unit Selling Price:</span>
                    <span className="prop-val highlight">{formatINR(selectedFurniture.price)}</span>
                  </div>
                  <div className="prop-row">
                    <span className="prop-label">World Position X:</span>
                    <span className="prop-val">{selectedFurniture.position?.x?.toFixed(2)}m</span>
                  </div>
                  <div className="prop-row">
                    <span className="prop-label">World Position Z:</span>
                    <span className="prop-val">{selectedFurniture.position?.z?.toFixed(2)}m</span>
                  </div>
                  <div className="prop-row">
                    <span className="prop-label">Rotation Angle:</span>
                    <span className="prop-val">
                      {Math.round(((selectedFurniture.rotation?.y || 0) * 180) / Math.PI)}°
                    </span>
                  </div>
                </div>

                <div className="inspector-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const newPos = {
                        x: (selectedFurniture.position?.x || 0) + 0.3,
                        y: 0,
                        z: (selectedFurniture.position?.z || 0) + 0.3
                      };
                      const newId = 'furn_' + Date.now();
                      onUpdateStagedItems((prev) => [
                        ...prev,
                        { ...selectedFurniture, instanceId: newId, position: newPos }
                      ]);
                      onSelectFurniture(newId);
                    }}
                  >
                    📋 Duplicate Item
                  </button>
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => {
                      onUpdateStagedItems((prev) =>
                        prev.filter((i) => i.instanceId !== selectedFurniture.instanceId)
                      );
                      onSelectFurniture(null);
                    }}
                  >
                    🗑️ Delete Item
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onSelectFurniture(null)}
                  >
                    ✕ Deselect
                  </button>
                </div>
              </div>
            ) : selectedWall ? (
              <div className="inspector-section">
                <div className="inspector-header">
                  <span className="inspector-icon">🧱</span>
                  <div>
                    <h4 className="inspector-title">
                      {selectedWall.roomName} · {selectedWall.wallSide.toUpperCase()} WALL
                    </h4>
                    <span className="inspector-sku">Room: {selectedWall.roomId}</span>
                  </div>
                </div>

                <div className="inspector-props-card">
                  <p className="inspector-tip">
                    Wall selected in 3D scene. You can change its colour and finish directly from the Walls & Finishes tab.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onSelectWall(null)}
                  >
                    Clear Wall Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-inspector-card">
                <span className="empty-inspector-icon">👆</span>
                <h4>Nothing Selected</h4>
                <p>Click on any furniture piece or wall in the 3D scene to inspect and modify properties.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
