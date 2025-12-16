import dayjs from 'dayjs';

export function mapQuotationApiResponse(q: any) {
  return {
    _id: q._id,
    company: {
      name: 'Global Cargo Consolidated India',
      address: 'Nehru Place, New Delhi',
      email: 'info@gcci.in',
      phone: '+91 98765 43210',
    },

    quotationMeta: {
      number: q.quotationNumber,
      status: q.status,
      tradeType: q.tradeType,
    },

    customer: {
      name: q.customerName,
      email: q.customerEmail,
      address: q.customerId?.locations?.[0]?.address || q.customerId?.vendor_name || '',
    },

    dates: {
      issueDate: dayjs(q.createdAt).format('DD MMM YYYY'),
      validTill: dayjs(q.validTo).format('DD MMM YYYY'),
    },

    shipment: {
      shippingLine: q.shippingLineId?.vendor_name || '',
      containerType: `${q.containerSize}FT ${q.containerType}`,
      containerCount: q.lineItems?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 1,
      shipmentMode: q.tradeType === 'EXPORT' ? 'FCL' : 'LCL',
      route: `${q.startPortId?.port_name} → ${q.endPortId?.port_name}`,
    },

    items: (q.lineItems || []).map((item: any) => ({
      description: item.chargeName,
      qty: item.quantity,
      rate: item.price,
      currency: item.currency,
      amount: item.totalAmount,
      hsnCode: item.hsnCode,
    })),

    totals: {
      subtotal: (q.lineItems || []).reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0),
      currency: q.lineItems?.[0]?.currency || 'INR',
    },

    terms: 'Rates are subject to carrier confirmation. Payment due within 7 days. Any port surcharges will be billed separately.',
  };
}
