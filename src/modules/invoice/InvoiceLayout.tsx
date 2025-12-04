import React from 'react';
import { IFinanceDocument } from '@api/endpoints/finance.endpoint';
import { useNavigate } from 'react-router-dom';
import DocumentLayout from '@shared/components/DocumentLayout';
import { financeDocumentToDocumentData } from '@shared/components/DocumentLayout/adapters';

interface InvoiceLayoutProps {
  invoice: IFinanceDocument;
}

const InvoiceLayout: React.FC<InvoiceLayoutProps> = ({ invoice }) => {
  const navigate = useNavigate();

  if (!invoice) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading invoice...</div>;
  }

  const handleEdit = () => {
    navigate(`/finance_form?id=${invoice?._id}&type=${invoice?.type}`);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Download PDF for invoice:', invoice._id);
  };

  const handlePrint = () => {
    window.print();
  };

  // Transform finance document to generic document format
  const documentData = financeDocumentToDocumentData(invoice);

  return <DocumentLayout document={documentData} onEdit={handleEdit} onDownload={handleDownload} onPrint={handlePrint} showActions={true} />;
};

export default InvoiceLayout;
