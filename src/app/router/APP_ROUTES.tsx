export const APP_ROUTES = {
  DASHBORD: "/",
  MASTER_DATA: "/master-data",
  FORM_BUILDER: "/master-data/form-builder",
  EGM: '/egm',
  IGM:'/igm'
} as const;

export type APP_ROUTE = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
