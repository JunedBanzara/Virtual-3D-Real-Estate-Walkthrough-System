import React, { useState } from 'react';
import { FURNITURE_CATEGORIES, PRICING_UNITS } from '../data/furnitureCatalog';
import { formatINR } from '../utils/units';

export default function AdminCatalogModal({
  isOpen,
  onClose,
  catalog = [],
  onUpdateCatalog,
  onResetCatalog
}) {
  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Table filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Product Editor Modal / Drawer state
  const [editingProduct, setEditingProduct] = useState(null); // null when not editing
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  // PIN Authentication Verification
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Admin PIN. (Default development PIN: admin123)');
    }
  };

  // Filtered Products List
  const filteredProducts = catalog.filter((item) => {
    if (selectedCatFilter !== 'all' && item.category !== selectedCatFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Toggle Enable/Disable
  const handleToggleEnable = (productId) => {
    onUpdateCatalog((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this catalogue product?')) {
      onUpdateCatalog((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  // Open Form for Adding New Product
  const handleOpenAddForm = () => {
    setIsNewProduct(true);
    setFormErrors({});
    setEditingProduct({
      id: 'prod_' + Date.now(),
      name: '',
      category: 'living',
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      price: 15000,
      unit: 'piece',
      dim: '1.5 × 0.8 × 0.75 m',
      description: '',
      enabled: true,
      modelId: 'sofa_3seater'
    });
  };

  // Open Form for Editing Existing Product
  const handleOpenEditForm = (product) => {
    setIsNewProduct(false);
    setFormErrors({});
    setEditingProduct({ ...product });
  };

  // Form validation & submit
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const errors = {};
    if (!editingProduct.name.trim()) errors.name = 'Product name is required';
    if (!editingProduct.sku.trim()) errors.sku = 'SKU is required';
    if (Number(editingProduct.price) <= 0 || isNaN(Number(editingProduct.price))) {
      errors.price = 'Price must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...editingProduct,
      price: Number(editingProduct.price)
    };

    if (isNewProduct) {
      onUpdateCatalog((prev) => [payload, ...prev]);
    } else {
      onUpdateCatalog((prev) =>
        prev.map((item) => (item.id === payload.id ? payload : item))
      );
    }

    setEditingProduct(null);
  };

  return (
    <div className="modal-backdrop">
      <div className="admin-modal-window">
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="admin-title-row">
            <span className="admin-shield-icon">🛡️</span>
            <div>
              <h2 className="admin-heading">Catalogue & Pricing Control Administration</h2>
              <span className="admin-subheading">
                Enterprise Furniture Catalogue CMS · Real-time Price Propagation
              </span>
            </div>
          </div>
          <button type="button" className="admin-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="admin-auth-card">
            <div className="auth-icon-wrap">🔒</div>
            <h3>Protected Administrator Interface</h3>
            <p>Please enter the administrative PIN code to manage catalogue products and pricing.</p>
            <form onSubmit={handleVerifyPin} className="auth-form">
              <input
                type="password"
                className="form-input auth-pin-input"
                placeholder="Enter PIN (Default: admin123)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
              {authError && <div className="auth-error-msg">{authError}</div>}
              <button type="submit" className="btn-primary auth-btn">
                Authorize & Continue
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-body-layout">
            {/* Control Toolbar */}
            <div className="admin-toolbar-row">
              <div className="admin-search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products, SKUs, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="form-select admin-cat-select"
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
              >
                <option value="all">All Categories ({catalog.length})</option>
                {FURNITURE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <button type="button" className="btn-add-primary" onClick={handleOpenAddForm}>
                + Add Product
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (window.confirm('Reset catalogue to factory defaults? All manual changes will be reverted.')) {
                    onResetCatalog();
                  }
                }}
                title="Reset to original default catalog"
              >
                🔄 Reset Factory Defaults
              </button>
            </div>

            {/* Products CMS Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Dimensions</th>
                    <th>Selling Price (INR)</th>
                    <th>Pricing Unit</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className={!p.enabled ? 'row-disabled' : ''}>
                      <td>
                        <button
                          type="button"
                          className={`status-toggle-pill ${p.enabled ? 'active' : 'disabled'}`}
                          onClick={() => handleToggleEnable(p.id)}
                          title="Click to toggle visibility in customer catalogue"
                        >
                          {p.enabled ? '● Active' : '○ Hidden'}
                        </button>
                      </td>
                      <td className="product-col-name">
                        <strong>{p.name}</strong>
                      </td>
                      <td className="product-col-sku">
                        <span className="sku-code">{p.sku}</span>
                      </td>
                      <td>
                        <span className="cat-tag">
                          {FURNITURE_CATEGORIES.find((c) => c.id === p.category)?.name || p.category}
                        </span>
                      </td>
                      <td className="product-col-dim">{p.dim}</td>
                      <td className="product-col-price">
                        <strong>{formatINR(p.price)}</strong>
                      </td>
                      <td className="product-col-unit">/{p.unit || 'piece'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-tbl-action edit"
                          onClick={() => handleOpenEditForm(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-tbl-action delete"
                          onClick={() => handleDeleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                        No catalogue records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Product Edit / Add Drawer Modal */}
            {editingProduct && (
              <div className="product-editor-overlay">
                <div className="product-editor-card">
                  <div className="editor-card-header">
                    <h3>{isNewProduct ? 'Add New Product' : 'Edit Product & Pricing'}</h3>
                    <button
                      type="button"
                      className="editor-close"
                      onClick={() => setEditingProduct(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="editor-form">
                    <div className="form-row">
                      <div className="form-group flex-2">
                        <label className="form-label">Product Name *</label>
                        <input
                          type="text"
                          className={`form-input ${formErrors.name ? 'error' : ''}`}
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                        />
                        {formErrors.name && (
                          <span className="form-field-error">{formErrors.name}</span>
                        )}
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">SKU Code *</label>
                        <input
                          type="text"
                          className={`form-input ${formErrors.sku ? 'error' : ''}`}
                          value={editingProduct.sku}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, sku: e.target.value })
                          }
                        />
                        {formErrors.sku && (
                          <span className="form-field-error">{formErrors.sku}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, category: e.target.value })
                          }
                        >
                          {FURNITURE_CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.icon} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">Selling Price (INR ₹) *</label>
                        <input
                          type="number"
                          step="100"
                          min="1"
                          className={`form-input ${formErrors.price ? 'error' : ''}`}
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, price: e.target.value })
                          }
                        />
                        {formErrors.price && (
                          <span className="form-field-error">{formErrors.price}</span>
                        )}
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">Pricing Basis Unit</label>
                        <select
                          className="form-select"
                          value={editingProduct.unit || 'piece'}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, unit: e.target.value })
                          }
                        >
                          {PRICING_UNITS.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-2">
                        <label className="form-label">Dimensions Text (e.g. 2.2 × 0.9 × 0.85 m)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editingProduct.dim || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, dim: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">3D Procedural Model ID</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editingProduct.modelId || editingProduct.id}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, modelId: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Product Description</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={editingProduct.description || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group checkbox-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editingProduct.enabled !== false}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, enabled: e.target.checked })
                          }
                        />
                        <span>Enable product in customer catalogue</span>
                      </label>
                    </div>

                    <div className="editor-form-actions">
                      <button type="submit" className="btn-primary">
                        Save & Publish
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
