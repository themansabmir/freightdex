export const APP_ROUTES = {
  DASHBORD: '/',
  VENDOR: '/vendor',
  AIRPORT: '/airport',
  Port: '/port',
  TEAM: '/team',
  MY_PROFILE: '/my-profile',
  SHIPMENT: '/shipment',
  HBL: '/shipment/:id/hbl/:hblId',
  INVOICE: '/invoice',
  INVOICE_ITEM: '/invoice-item',
  PROFORMA: '/proforma',
  CREDIT_NOTE: '/credit-note',
  SALES: '/sales',
} as const;

export type APP_ROUTE = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
