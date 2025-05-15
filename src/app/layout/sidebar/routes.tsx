import { SidebarItem } from "./sidebar.types";
import { APP_ROUTES } from "../../router/APP_ROUTES";
import { LayoutDashboard, TextQuote, ShieldPlus } from "lucide-react";

const internalSidebarRoutes: SidebarItem[] = [
  {
    label: "Dashboard",
    to: APP_ROUTES.DASHBORD,
    icon: <LayoutDashboard fill='none' />,
  },
  {
    label: "Master Data",
    to: "",
    icon: <ShieldPlus fill='none' />,
    children: [
      {
        label: "Vendor",
        to: APP_ROUTES.VENDOR,
        icon: <TextQuote fill='none' size={18} />,
      },
      {
        label: "Airport",
        to: APP_ROUTES.AIRPORT,
        icon: <TextQuote fill='none' size={18} />,
      },
    ],
  },
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
