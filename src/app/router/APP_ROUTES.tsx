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
  FINANCE: '/finance',
  FINANCE_FORM: '/finance_form',
  CREDIT_NOTE: '/credit-note',
  SALES: '/sales',
  RATE_MASTER: '/rate_master',
} as const;

export type APP_ROUTE = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
