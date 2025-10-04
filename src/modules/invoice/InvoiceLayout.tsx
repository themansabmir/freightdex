import React from 'react';
import { IFinanceDocument, ILineItem } from '@api/endpoints/finance.endpoint';
import './invoice-layout.scss';

interface InvoiceLayoutProps {
  invoice: IFinanceDocument;
}

const InvoiceLayout: React.FC<InvoiceLayoutProps> = ({ invoice }) => {
  if (!invoice) {
    return <div className="invoice-loading">Loading invoice...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="invoice-container">
      {/* Header */}
      <div className="invoice-header">
        <div className="company-info">
          <h1 className="company-name">GCCI</h1>
          <p className="company-address">
            123 Business Street<br />
            City, State - 123456<br />
            Phone: +91 12345 67890<br />
            Email: info@company.com
          </p>
        </div>
        <div className="invoice-title">
          <h2 className="document-type">{invoice.type.toUpperCase()}</h2>
          <p className="document-number">#{invoice.documentNumber}</p>
          <div className="invoice-status">
            <span className={`status-badge status-${invoice.status}`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="invoice-details">
        <div className="billing-info">
          <h3>Bill To:</h3>
          <div className="customer-details">
            <strong>{invoice.customerId?.vendor_name || 'Customer Name'}</strong>
            <p>Customer Address Line 1<br />
               Customer Address Line 2<br />
               City, State - PIN Code
            </p>
          </div>
        </div>
        
        <div className="invoice-meta">
          <div className="meta-row">
            <span className="meta-label">Shipment:</span>
            <span className="meta-value">{invoice.shipmentId?.shipment_name || 'N/A'}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Issue Date:</span>
            <span className="meta-value">{formatDate(invoice.issueDate)}</span>
          </div>
          {invoice.dueDate && (
            <div className="meta-row">
              <span className="meta-label">Due Date:</span>
              <span className="meta-value">{formatDate(invoice.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="invoice-table">
        <table>
          <thead>
            <tr>
              <th>Service Item</th>
              <th>HSN</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price/Unit</th>
              <th>Discount</th>
              <th>Taxable</th>
              <th>GST%</th>
              <th>GST Amt</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems?.map((item: ILineItem, index: number) => (
              <tr key={index}>
                <td className="item-name">{item.serviceItem}</td>
                <td>{item.hsn || '-'}</td>
                <td className="amount">{formatCurrency(item.rate)}</td>
                <td className="quantity">{item.quantity}</td>
                <td>{item.unit || '-'}</td>
                <td className="amount">{formatCurrency(item.pricePerUnit)}</td>
                <td className="amount">{formatCurrency(item.discount)}</td>
                <td className="amount">{formatCurrency(item.taxableAmount)}</td>
                <td className="tax-rate">{item.gstPercent}%</td>
                <td className="amount">{formatCurrency(item.gstAmount)}</td>
                <td className="amount total-cell">{formatCurrency(item.totalWithGst)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="invoice-totals">
        <div className="totals-grid">
          <div className="total-row">
            <span className="total-label">Net Discount:</span>
            <span className="total-value">{formatCurrency(invoice.net_discount || 0)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Net Taxable:</span>
            <span className="total-value">{formatCurrency(invoice.net_taxable || 0)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Net GST:</span>
            <span className="total-value">{formatCurrency(invoice.net_gst || 0)}</span>
          </div>
          <div className="total-row grand-total">
            <span className="total-label">Grand Total:</span>
            <span className="total-value">{formatCurrency(invoice.grand_total || 0)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <div className="terms">
          <h4>Terms & Conditions:</h4>
          <ul>
            <li>Payment is due within 30 days of invoice date</li>
            <li>Late payments may incur additional charges</li>
            <li>All disputes must be reported within 7 days</li>
          </ul>
        </div>
        
        <div className="signature-section">
          <div className="signature">
            <p>Authorized Signature</p>
            <div className="signature-line"></div>
          </div>
        </div>
      </div>

      {/* Print Actions */}
      <div className="print-actions">
        <button className="print-btn" onClick={() => window.print()}>
          Print Invoice
        </button>
        <button className="download-btn">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceLayout;
