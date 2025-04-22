import { SidebarItem } from "./sidebar.types";
import { APP_ROUTES } from "../../router/APP_ROUTES";
import { LayoutDashboard, TextQuote, ShieldPlus } from "lucide-react";

const internalSidebarRoutes: SidebarItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: <LayoutDashboard fill='none' />,
  },
  {
    label: "EGM",
    to: APP_ROUTES.EGM,
    icon: <LayoutDashboard fill='none' />,
  },
  {
    label: "IGM",
    to: APP_ROUTES.IGM,
    icon: <LayoutDashboard fill='none' />,
  },
  {
    label: "Master Data",
    to: APP_ROUTES.MASTER_DATA,
    icon: <ShieldPlus fill='none' />,
    children: [
      {
        label: "Customer",
        to: APP_ROUTES.FORM_BUILDER,
        icon: <TextQuote fill='none' size={18} />,
      },
      {
        label: "Users",
        to: APP_ROUTES.FORM_BUILDER,
        icon: <TextQuote fill='none' size={18} />,
      },
    ],
  },
  // {
  //   label: 'Master Data',
  //   to: '/fd',
  //   icon: <ShieldPlus fill="none" />,
  //   children: [
  //     {
  //       label: 'Shipping Lines',
  //       to: '/shippingLines/view',
  //     },
  //     { label: 'Document', to: APP_ROUTES.DOCUMENT },
  //     { label: 'Project', to: APP_ROUTES.PROJECT },
  //   ],
  // },
];
export const sidebarRoutes = internalSidebarRoutes.map((route, index) => {
  if (route.children && route.children.length > 0) {
    return {
      ...route,
      id: `${index}`,
      children: route.children.map((childRoute, childIndex) => ({
        ...childRoute,
        id: `${index}-${childIndex}`,
      })),
    };
  }

  return { ...route, id: `${index}` };
});
