export const APP_ROUTES = {
  DASHBORD: '/',
  VENDOR: '/vendor',
  AIRPORT: '/airport',
  Port: '/port',
  TEAM: '/team',
  MY_PROFILE:'/my-profile',
  SHIPMENT:'/shipment',
} as const;

export type APP_ROUTE = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
