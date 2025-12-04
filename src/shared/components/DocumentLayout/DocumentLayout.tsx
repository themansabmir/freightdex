import React from 'react';
import './document-layout.scss';

// Generic line item interface that works for both invoices and quotations
export interface IDocumentLineItem {
  id?: string;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  rate?: number;
  pricePerUnit?: number;
  discount?: number;
  taxableAmount?: number;
  gstPercent?: number;
  gstAmount?: number;
  totalAmount: number;
  currency: string;
}

// Generic document interface
export interface IDocumentData {
  // Document metadata
  documentType: 'QUOTATION' | 'INVOICE' | 'PROFORMA' | 'CREDIT_NOTE';
  documentNumber: string;
  status: string;

  // Company info (can be customized)
  companyName?: string;
  companyAddress?: string[];
  companyLogo?: string;

  // Customer/Billing info
  billToName: string;
  billToEmail?: string;
  billToAddress?: string[];
  billToId?: string;

  // Dates
  issueDate: string;
  dueDate?: string;
  validFrom?: string;
  validTo?: string;

  // Additional metadata (flexible for different document types)
  metadata?: Array<{
    label: string;
    value: string;
  }>;

  // Shipment/Route info (optional)
  shipmentInfo?: {
    label: string;
    items: Array<{ label: string; value: string }>;
  };

  // Line items
  lineItems: IDocumentLineItem[];

  // Totals
  subtotal?: number;
  discount?: number;
  taxable?: number;
  gst?: number;
  grandTotal: number;
  currency: string;

  // Footer
  termsAndConditions?: string[];
  notes?: string;
}

interface DocumentLayoutProps {
  document: IDocumentData;
  onEdit?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  showActions?: boolean;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ document, onEdit, onDownload, onPrint, showActions = true }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = document.currency) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  };

  return (
    <div className="document-layout">
      {/* Action Buttons */}
      {showActions && (
        <div className="document-actions">
          {onEdit && (
            <button className="action-btn action-btn--edit" onClick={onEdit}>
              Edit
            </button>
          )}
          {onDownload && (
            <button className="action-btn action-btn--download" onClick={onDownload}>
              Download PDF
            </button>
          )}
          {onPrint && (
            <button className="action-btn action-btn--print" onClick={onPrint}>
              Print
            </button>
          )}
        </div>
      )}

      {/* Document Container */}
      <div className="document-container">
        {/* Header */}
        <div className="document-header">
          <div className="company-info">
            {document.companyLogo ? (
              <img src={document.companyLogo} alt="Company Logo" className="company-logo" />
            ) : (
              <div className="company-logo-placeholder">{(document.companyName || 'GCCI').charAt(0)}</div>
            )}
            <h1 className="company-name">{document.companyName || 'GCCI'}</h1>
            {document.companyAddress && (
              <div className="company-address">
                {document.companyAddress.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
          </div>

          <div className="document-title">
            <h2 className="document-type">{document.documentType}</h2>
            <p className="document-number">#{document.documentNumber}</p>
            <span className={`status-badge ${getStatusClass(document.status)}`}>{document.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Document Details */}
        <div className="document-details">
          {/* Bill To */}
          <div className="billing-info">
            <h3>Bill To</h3>
            <div className="customer-details">
              <strong>{document.billToName}</strong>
              {document.billToEmail && <p>{document.billToEmail}</p>}
              {document.billToAddress && (
                <div className="customer-address">
                  {document.billToAddress.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
              {document.billToId && <p className="customer-id">ID: {document.billToId}</p>}
            </div>
          </div>

          {/* Document Meta */}
          <div className="document-meta">
            <div className="meta-row">
              <span className="meta-label">Date Issued:</span>
              <span className="meta-value">{formatDate(document.issueDate)}</span>
            </div>
            {document.dueDate && (
              <div className="meta-row">
                <span className="meta-label">Due Date:</span>
                <span className="meta-value">{formatDate(document.dueDate)}</span>
              </div>
            )}
            {document.validFrom && (
              <div className="meta-row">
                <span className="meta-label">Valid From:</span>
                <span className="meta-value">{formatDate(document.validFrom)}</span>
              </div>
            )}
            {document.validTo && (
              <div className="meta-row">
                <span className="meta-label">Valid Until:</span>
                <span className="meta-value">{formatDate(document.validTo)}</span>
              </div>
            )}
            {document.metadata?.map((item, idx) => (
              <div className="meta-row" key={idx}>
                <span className="meta-label">{item.label}:</span>
                <span className="meta-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipment/Additional Info */}
        {document.shipmentInfo && (
          <div className="shipment-info">
            <h4>{document.shipmentInfo.label}</h4>
            <div className="shipment-grid">
              {document.shipmentInfo.items.map((item, idx) => (
                <div className="shipment-item" key={idx}>
                  <span className="shipment-label">{item.label}</span>
                  <span className="shipment-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Line Items Table */}
        <div className="document-table">
          <h3>Items & Charges</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                {document.lineItems.some((item) => item.unit) && <th>Unit</th>}
                <th>Price</th>
                {document.lineItems.some((item) => item.discount !== undefined) && <th>Discount</th>}
                {document.lineItems.some((item) => item.taxableAmount !== undefined) && <th>Taxable</th>}
                {document.lineItems.some((item) => item.gstPercent !== undefined) && <th>GST %</th>}
                {document.lineItems.some((item) => item.gstAmount !== undefined) && <th>GST Amt</th>}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {document.lineItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="item-description">{item.description}</td>
                  <td>{item.hsnCode || '-'}</td>
                  <td className="quantity">{item.quantity}</td>
                  {document.lineItems.some((i) => i.unit) && <td>{item.unit || '-'}</td>}
                  <td className="amount">{formatCurrency(item.rate || item.pricePerUnit || 0, item.currency)}</td>
                  {document.lineItems.some((i) => i.discount !== undefined) && (
                    <td className="amount">{item.discount !== undefined ? formatCurrency(item.discount, item.currency) : '-'}</td>
                  )}
                  {document.lineItems.some((i) => i.taxableAmount !== undefined) && (
                    <td className="amount">{item.taxableAmount !== undefined ? formatCurrency(item.taxableAmount, item.currency) : '-'}</td>
                  )}
                  {document.lineItems.some((i) => i.gstPercent !== undefined) && (
                    <td className="tax-rate">{item.gstPercent !== undefined ? `${item.gstPercent}%` : '-'}</td>
                  )}
                  {document.lineItems.some((i) => i.gstAmount !== undefined) && (
                    <td className="amount">{item.gstAmount !== undefined ? formatCurrency(item.gstAmount, item.currency) : '-'}</td>
                  )}
                  <td className="amount total-cell">{formatCurrency(item.totalAmount, item.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="document-totals">
          <div className="totals-grid">
            {document.subtotal !== undefined && (
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">{formatCurrency(document.subtotal, document.currency)}</span>
              </div>
            )}
            {document.discount !== undefined && document.discount > 0 && (
              <div className="total-row">
                <span className="total-label">Discount:</span>
                <span className="total-value">{formatCurrency(document.discount, document.currency)}</span>
              </div>
            )}
            {document.taxable !== undefined && (
              <div className="total-row">
                <span className="total-label">Taxable Amount:</span>
                <span className="total-value">{formatCurrency(document.taxable, document.currency)}</span>
              </div>
            )}
            {document.gst !== undefined && (
              <div className="total-row">
                <span className="total-label">GST:</span>
                <span className="total-value">{formatCurrency(document.gst, document.currency)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span className="total-label">Grand Total:</span>
              <span className="total-value">{formatCurrency(document.grandTotal, document.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="document-footer">
          {document.termsAndConditions && document.termsAndConditions.length > 0 && (
            <div className="terms">
              <h4>Terms & Conditions</h4>
              <ul>
                {document.termsAndConditions.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>
          )}

          {document.notes && (
            <div className="notes">
              <h4>Notes</h4>
              <p>{document.notes}</p>
            </div>
          )}

          <div className="signature-section">
            <div className="signature">
              <p>Authorized Signature</p>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
