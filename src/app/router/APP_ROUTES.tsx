export const APP_ROUTES = {
  DASHBORD: "/",
  VENDOR: "/vendor",
} as const;

export type APP_ROUTE = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
