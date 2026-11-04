import React from 'react';
import { formatINR } from '../utils/units';
import { FURNITURE_CATEGORIES } from '../data/furnitureCatalog';

export default function EstimatePrintModal({
  isOpen,
  onClose,
  project,
  stagedItems = []
}) {
  if (!isOpen) return null;

  const quoteRef = 'EST-' + String(Math.abs(((project?.name || 'EST') + (project?.id || '')).split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0) || 104256)).slice(0, 6);

  // Aggregate items
  const map = new Map();
  stagedItems.forEach((item) => {
    const key = item.productId || item.name;
    if (!map.has(key)) {
      map.set(key, {
        productId: item.productId,
        name: item.name,
        category: item.category || 'living',
        unitPrice: item.price || 0,
        quantity: 1
      });
    } else {
      const existing = map.get(key);
      existing.quantity += 1;
    }
  });

  const items = Array.from(map.values());
  const furnitureSubtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const installationCharge = furnitureSubtotal * 0.05; // 5%
  const taxable = furnitureSubtotal + installationCharge;
  const taxCharge = taxable * 0.18; // 18% GST
  const grandTotal = taxable + taxCharge;

  const quoteDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop print-modal-backdrop">
      <div className="print-modal-container">
        {/* Modal Controls (Hidden when printing) */}
        <div className="print-modal-top-bar no-print">
          <div className="top-bar-info">
            <span>📄 Print / Export Quotation View</span>
          </div>
          <div className="top-bar-actions">
            <button type="button" className="btn-primary print-now-btn" onClick={handlePrint}>
              🖨️ Print / Save as PDF
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Printable Invoice / Quotation Sheet */}
        <div className="printable-quotation-sheet" id="printable-quotation">
          {/* Header */}
          <div className="quote-header">
            <div className="quote-brand">
              <h2 className="quote-company-name">ARCHITECTURAL INTERIOR STUDIO</h2>
              <p className="quote-tagline">3D Virtual Space Planning & Interior Design Estimation</p>
            </div>
            <div className="quote-meta-box">
              <div className="quote-ref-badge">{quoteRef}</div>
              <div className="quote-date-label">Date: {quoteDate}</div>
            </div>
          </div>

          <div className="quote-divider" />

          {/* Project Details */}
          <div className="quote-details-grid">
            <div className="details-col">
              <span className="details-label">PROJECT NAME</span>
              <h3 className="details-val">{project?.name || 'Architectural Residence'}</h3>
              <p className="details-sub">
                Rooms: {project?.rooms?.length || 0} | Total Area:{' '}
                {project?.rooms?.reduce((acc, r) => acc + r.width * r.length, 0).toFixed(1)} m²
              </p>
            </div>
            <div className="details-col align-right">
              <span className="details-label">ESTIMATE TYPE</span>
              <h3 className="details-val">Furnishing & Staging Spec</h3>
              <p className="details-sub">Currency: INR (₹) | Pricing Basis: MRP</p>
            </div>
          </div>

          {/* Itemised Table */}
          <table className="quote-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price (₹)</th>
                <th style={{ textAlign: 'right' }}>Line Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    {FURNITURE_CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatINR(item.unitPrice)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <strong>{formatINR(item.unitPrice * item.quantity)}</strong>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No furniture items staged in this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals & Terms */}
          <div className="quote-bottom-section">
            <div className="quote-terms-box">
              <h4>Terms & Specification Notes</h4>
              <ul>
                <li>Prices are inclusive of standard manufacturer warranty on modular assemblies.</li>
                <li>Delivery timeline: 3 to 4 weeks from order finalization and site measurement verification.</li>
                <li>All 3D dimensional plans are generated canonically in metres with precision tolerances.</li>
              </ul>
            </div>

            <div className="quote-totals-box">
              <div className="totals-row">
                <span>Furniture Subtotal:</span>
                <span>{formatINR(furnitureSubtotal)}</span>
              </div>
              <div className="totals-row">
                <span>Installation & White-Glove Assembly (5%):</span>
                <span>+{formatINR(installationCharge)}</span>
              </div>
              <div className="totals-row">
                <span>Goods & Services Tax (GST 18%):</span>
                <span>+{formatINR(taxCharge)}</span>
              </div>
              <div className="totals-row grand-total-row">
                <span>Estimated Grand Total:</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="quote-footer">
            <span>Generated via Virtual 3D Real Estate & Interior Design Studio</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
