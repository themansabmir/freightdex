import { IQuotation } from '@modules/quotation/index.types';
import { IFinanceDocument } from '@api/endpoints/finance.endpoint';
import { IDocumentData, IDocumentLineItem } from './DocumentLayout';

/**
 * Transforms a Quotation object into the generic DocumentData format
 */
export const quotationToDocumentData = (quotation: IQuotation): IDocumentData => {
  // Transform line items
  const lineItems: IDocumentLineItem[] = (quotation.lineItems || []).map((item) => ({
    id: item._id,
    description: item.chargeName,
    hsnCode: item.hsnCode,
    quantity: item.quantity,
    pricePerUnit: item.price,
    totalAmount: item.totalAmount,
    currency: item.currency,
  }));

  // Calculate totals
  const grandTotal = lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const currency = lineItems[0]?.currency || 'USD';

  return {
    documentType: 'QUOTATION',
    documentNumber: quotation.quotationNumber,
    status: quotation.status,

    companyName: 'GCCI',
    companyAddress: ['Global Cargo & Container Inc.', '123 Shipping Lane, Logistics City'],

    billToName: quotation.customerName,
    billToEmail: quotation.customerEmail,
    billToId: quotation.customerId,

    issueDate: quotation.createdAt,
    validFrom: quotation.validFrom,
    validTo: quotation.validTo,

    metadata: [{ label: 'Route', value: `${quotation.startPortId} → ${quotation.endPortId}` }],

    shipmentInfo: {
      label: 'Shipment Details',
      items: [
        { label: 'Trade Type', value: quotation.tradeType },
        { label: 'Container', value: `${quotation.containerType} (${quotation.containerSize})` },
        { label: 'Shipping Line', value: quotation.shippingLineId },
      ],
    },

    lineItems,

    subtotal: grandTotal,
    grandTotal,
    currency,

    termsAndConditions: [
      'Payment is due within 30 days of invoice date.',
      'Please make checks payable to Global Cargo & Container Inc.',
      'For any questions concerning this quotation, please contact support@gcci.com.',
    ],
  };
};

/**
 * Transforms a Finance Document (Invoice/Proforma/Credit Note) into the generic DocumentData format
 */
export const financeDocumentToDocumentData = (finance: IFinanceDocument): IDocumentData => {
  // Transform line items
  const lineItems: IDocumentLineItem[] = (finance.lineItems || []).map((item) => ({
    description: item.serviceItem,
    hsnCode: item.hsn,
    quantity: item.quantity,
    unit: item.unit,
    rate: item.rate,
    pricePerUnit: item.pricePerUnit,
    discount: item.discount,
    taxableAmount: item.taxableAmount,
    gstPercent: item.gstPercent,
    gstAmount: item.gstAmount,
    totalAmount: item.totalWithGst,
    currency: item.currency,
  }));

  // Map document type
  const documentTypeMap: Record<string, 'INVOICE' | 'PROFORMA' | 'CREDIT_NOTE'> = {
    invoice: 'INVOICE',
    proforma: 'PROFORMA',
    credit_note: 'CREDIT_NOTE',
  };

  return {
    documentType: documentTypeMap[finance.type] || 'INVOICE',
    documentNumber: finance.documentNumber,
    status: finance.status.toUpperCase(),

    companyName: 'GCCI',
    companyAddress: [
      'Global Cargo & Container Inc.',
      '123 Business Street',
      'City, State - 123456',
      'Phone: +91 12345 67890',
      'Email: info@company.com',
    ],

    billToName: finance.customerId?.vendor_name || 'Customer Name',
    billToAddress: ['Customer Address Line 1', 'Customer Address Line 2', 'City, State - PIN Code'],

    issueDate: finance.issueDate,
    dueDate: finance.dueDate,

    metadata: [{ label: 'Shipment', value: finance.shipmentId?.shipment_name || 'N/A' }],

    lineItems,

    discount: finance.net_discount,
    taxable: finance.net_taxable,
    gst: finance.net_gst,
    grandTotal: finance.grand_total,
    currency: finance.currency,

    termsAndConditions: [
      'Payment is due within 30 days of invoice date',
      'Late payments may incur additional charges',
      'All disputes must be reported within 7 days',
    ],
  };
};
