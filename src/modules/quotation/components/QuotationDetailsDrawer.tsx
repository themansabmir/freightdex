import Drawer from '@shared/components/Drawer';
import { Button } from '@shared/components';
import { Download, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { EQuotationStatus, IQuotation } from '../index.types';
import { useUpdateQuotationStatus, useDownloadQuotationPDF, useSendQuotationToVendor } from '../hooks/useQuotationApi';
import DocumentLayout from '@shared/components/DocumentLayout';
import { quotationToDocumentData } from '@shared/components/DocumentLayout/adapters';

interface QuotationDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  quotation: IQuotation | null;
}

const QuotationDetailsDrawer: React.FC<QuotationDetailsDrawerProps> = ({ open, onClose, quotation }) => {
  const [selectedStatus, setSelectedStatus] = useState<EQuotationStatus | ''>('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [showVendorInput, setShowVendorInput] = useState(false);

  const updateStatusMutation = useUpdateQuotationStatus();
  const downloadPDFMutation = useDownloadQuotationPDF();
  const sendToVendorMutation = useSendQuotationToVendor();

  if (!quotation) return null;

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
      sendToVendorMutation.mutate({ id: quotation._id, vendorId: vendorEmail });
      setVendorEmail('');
      setShowVendorInput(false);
    }
  };

  // Transform quotation data to document format
  const documentData = quotationToDocumentData(quotation);

  return (
    <Drawer open={open} onClose={onClose} side="right">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
        {/* Toolbar / Actions Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>Quotation Details</h2>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as EQuotationStatus)}
              disabled={updateStatusMutation.isPending}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">Change Status...</option>
              {Object.values(EQuotationStatus).map((status) => (
                <option key={status} value={status} disabled={status === quotation.status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Download Button */}
            <Button onClick={handleDownloadPDF} disabled={downloadPDFMutation.isPending} variant="neutral" addClass="!py-2 !px-3">
              <Download size={16} />
            </Button>

            {/* Send Button */}
            {!showVendorInput ? (
              <Button onClick={() => setShowVendorInput(true)} variant="primary" addClass="!py-2 !px-3">
                <Mail size={16} style={{ marginRight: '6px' }} />
                Send
              </Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
                <input
                  type="text"
                  placeholder="Vendor Email"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '13px',
                    width: '180px',
                  }}
                />
                <Button
                  onClick={handleSendToVendor}
                  disabled={!vendorEmail || sendToVendorMutation.isPending}
                  variant="primary"
                  addClass="!py-1 !px-2 !text-xs"
                >
                  Send
                </Button>
                <button
                  onClick={() => setShowVendorInput(false)}
                  style={{ padding: '4px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DocumentLayout document={documentData} onDownload={handleDownloadPDF} onPrint={() => window.print()} showActions={false} />
        </div>
      </div>
    </Drawer>
  );
};

export default QuotationDetailsDrawer;
