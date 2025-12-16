import Drawer from '@shared/components/Drawer';
import { Stack } from '@shared/components/Stack';
import Typography from '@shared/components/Typography';
import { Button } from '@shared/components';
import { Calendar, ChevronDown, ChevronUp, Download, FileText, Mail, MapPin, Package, Ship, User } from 'lucide-react';
import React, { useState } from 'react';
import { EQuotationStatus, IQuotation } from '../index.types';
import { useUpdateQuotationStatus, useDownloadQuotationPDF, useSendQuotationToVendor } from '../hooks/useQuotationApi';

interface QuotationDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  quotation: IQuotation | null;
}

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, icon, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="expandable-section">
      <button className="expandable-section__header" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <div className="expandable-section__header-left">
          <span className="expandable-section__icon">{icon}</span>
          <Typography variant="md" weight="semibold">
            {title}
          </Typography>
        </div>
        <span className="expandable-section__toggle">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
      </button>

      <div className={`expandable-section__content ${isExpanded ? 'expanded' : ''}`}>
        <div className="expandable-section__content-inner">{children}</div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="detail-row">
    <Typography variant="sm" weight="medium" addClass="detail-row__label">
      {label}
    </Typography>
    <Typography variant="sm" addClass="detail-row__value">
      {value || 'N/A'}
    </Typography>
  </div>
);

const StatusBadge: React.FC<{ status: EQuotationStatus }> = ({ status }) => {
  const getStatusColor = (status: EQuotationStatus) => {
    switch (status) {
      case EQuotationStatus.DRAFT:
        return 'status-badge--draft';
      case EQuotationStatus.SENT:
        return 'status-badge--sent';
      case EQuotationStatus.ACCEPTED:
        return 'status-badge--accepted';
      case EQuotationStatus.REJECTED:
        return 'status-badge--rejected';
      case EQuotationStatus.EXPIRED:
        return 'status-badge--expired';
      default:
        return 'status-badge--default';
    }
  };

  return <span className={`status-badge ${getStatusColor(status)}`}>{status}</span>;
};

const QuotationDetailsDrawer: React.FC<QuotationDetailsDrawerProps> = ({ open, onClose, quotation }) => {
  const [selectedStatus, setSelectedStatus] = useState<EQuotationStatus | ''>('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [showVendorInput, setShowVendorInput] = useState(false);

  const updateStatusMutation = useUpdateQuotationStatus();
  const downloadPDFMutation = useDownloadQuotationPDF();
  const sendToVendorMutation = useSendQuotationToVendor();

  if (!quotation) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateTotalAmount = () => {
    if (!quotation.lineItems || quotation.lineItems.length === 0) return 0;
    return quotation.lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const handleStatusChange = (newStatus: EQuotationStatus) => {
    if (newStatus && quotation._id) {
      updateStatusMutation.mutate({ id: quotation._id, status: newStatus });
      setSelectedStatus('');
    }
  };

  const handleDownloadPDF = () => {
    if (quotation._id) {
      downloadPDFMutation.mutate(quotation._id);
    }
  };

  const handleSendToVendor = () => {
    if (quotation._id && vendorEmail) {
      // Using vendorEmail as vendorId for now - you may need to modify this based on your actual vendor structure
      sendToVendorMutation.mutate({ id: quotation._id, vendorId: vendorEmail });
      setVendorEmail('');
      setShowVendorInput(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} side="right">
      <div className="quotation-details">
        {/* Header Section */}
        <div className="quotation-details__header">
          <Stack direction="vertical" gap="8px">
            <Typography variant="xl" weight="bold">
              {quotation.quotationNumber}
            </Typography>
            <StatusBadge status={quotation.status} />
          </Stack>

          {/* Action Buttons */}
          <div className="quotation-details__actions" style={{ marginTop: '16px' }}>
            <Stack direction="vertical" gap="12px">
              {/* Status Update */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Update Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value as EQuotationStatus)}
                  disabled={updateStatusMutation.isPending}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select new status...</option>
                  {Object.values(EQuotationStatus).map((status) => (
                    <option key={status} value={status} disabled={status === quotation.status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Download PDF Button */}
              <Button onClick={handleDownloadPDF} disabled={downloadPDFMutation.isPending} variant="neutral" fullwidth>
                <Download size={18} style={{ marginRight: '8px' }} />
                {downloadPDFMutation.isPending ? 'Downloading...' : 'Download PDF'}
              </Button>

              {/* Send to Vendor */}
              {!showVendorInput ? (
                <Button onClick={() => setShowVendorInput(true)} variant="primary" fullwidth>
                  <Mail size={18} style={{ marginRight: '8px' }} />
                  Send to Vendor
                </Button>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter Vendor ID/Email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '8px',
                    }}
                  />
                  <Stack direction="horizontal" gap="8px">
                    <Button
                      onClick={handleSendToVendor}
                      disabled={!vendorEmail || sendToVendorMutation.isPending}
                      variant="primary"
                      addClass="flex-1"
                    >
                      {sendToVendorMutation.isPending ? 'Sending...' : 'Send'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowVendorInput(false);
                        setVendorEmail('');
                      }}
                      variant="neutral"
                      addClass="flex-1"
                    >
                      Cancel
                    </Button>
                  </Stack>
                </div>
              )}
            </Stack>
          </div>
        </div>

        {/* Customer Information */}
        <ExpandableSection title="Customer Information" icon={<User size={20} />} defaultExpanded={true}>
          <Stack direction="vertical" gap="12px">
            <DetailRow label="Customer Name" value={quotation.customerName} />
            <DetailRow label="Customer Email" value={quotation.customerEmail} />
            <DetailRow label="Customer ID" value={quotation.customerId} />
          </Stack>
        </ExpandableSection>

        {/* Shipment Details */}
        <ExpandableSection title="Shipment Details" icon={<Ship size={20} />} defaultExpanded={true}>
          <Stack direction="vertical" gap="12px">
            <DetailRow label="Trade Type" value={quotation.tradeType} />
            <DetailRow label="Container Type" value={quotation.containerType} />
            <DetailRow label="Container Size" value={quotation.containerSize} />
            <DetailRow label="Shipping Line ID" value={quotation.shippingLineId} />
          </Stack>
        </ExpandableSection>

        {/* Route Information */}
        <ExpandableSection title="Route Information" icon={<MapPin size={20} />} defaultExpanded={false}>
          <Stack direction="vertical" gap="12px">
            <DetailRow label="Start Port ID" value={quotation.startPortId} />
            <DetailRow label="End Port ID" value={quotation.endPortId} />
          </Stack>
        </ExpandableSection>

        {/* Validity Period */}
        <ExpandableSection title="Validity Period" icon={<Calendar size={20} />} defaultExpanded={false}>
          <Stack direction="vertical" gap="12px">
            <DetailRow label="Valid From" value={formatDate(quotation.validFrom)} />
            <DetailRow label="Valid To" value={formatDate(quotation.validTo)} />
            <DetailRow label="Created At" value={formatDate(quotation.createdAt)} />
            <DetailRow label="Updated At" value={formatDate(quotation.updatedAt)} />
          </Stack>
        </ExpandableSection>

        {/* Line Items */}
        <ExpandableSection title="Line Items" icon={<Package size={20} />} defaultExpanded={true}>
          {quotation.lineItems && quotation.lineItems.length > 0 ? (
            <div className="line-items">
              {quotation.lineItems.map((item, index) => (
                <div key={item._id || index} className="line-item">
                  <div className="line-item__header">
                    <Typography variant="sm" weight="semibold">
                      {item.chargeName}
                    </Typography>
                    <Typography variant="sm" weight="bold" addClass="line-item__amount">
                      {item.currency} {item.totalAmount.toFixed(2)}
                    </Typography>
                  </div>
                  <Stack direction="vertical" gap="8px">
                    <DetailRow label="HSN Code" value={item.hsnCode} />
                    <DetailRow label="Price" value={`${item.currency} ${item.price.toFixed(2)}`} />
                    <DetailRow label="Quantity" value={String(item.quantity)} />
                  </Stack>
                </div>
              ))}

              <div className="line-items__total">
                <Typography variant="md" weight="bold">
                  Total Amount
                </Typography>
                <Typography variant="md" weight="bold" addClass="total-amount">
                  {quotation.lineItems[0]?.currency || 'USD'} {calculateTotalAmount().toFixed(2)}
                </Typography>
              </div>
            </div>
          ) : (
            <Typography variant="sm" addClass="no-items">
              No line items available
            </Typography>
          )}
        </ExpandableSection>

        {/* Summary */}
        <ExpandableSection title="Quotation Summary" icon={<FileText size={20} />} defaultExpanded={false}>
          <Stack direction="vertical" gap="12px">
            <DetailRow label="Quotation ID" value={quotation._id} />
            <DetailRow label="Number of Line Items" value={String(quotation.lineItems?.length || 0)} />
            <DetailRow label="Total Value" value={`${quotation.lineItems?.[0]?.currency || 'USD'} ${calculateTotalAmount().toFixed(2)}`} />
          </Stack>
        </ExpandableSection>
      </div>
    </Drawer>
  );
};

export default QuotationDetailsDrawer;
