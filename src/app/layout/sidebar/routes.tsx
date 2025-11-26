import { Container, CreditCard, Handshake, LayoutDashboard, ScrollText, ShieldPlus, TextQuote, Wallet } from "lucide-react";
import { APP_ROUTES } from "../../router/APP_ROUTES";
import { SidebarItem } from "./sidebar.types";

const internalSidebarRoutes: SidebarItem[] = [
  {
    label: 'Dashboard',
    to: APP_ROUTES.DASHBORD,
    icon: <LayoutDashboard strokeWidth={1.25} fill="none" />,
  },
  {
    label: 'Shipment',
    to: APP_ROUTES.SHIPMENT,
    icon: <Container strokeWidth={1.25} fill="none" />,
  },
  {
    label: 'Quotation',
    to: '',
    icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
    children: [
      {
        label: 'Quotation List',
        to: APP_ROUTES.QUOTATION,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
    ],
  },
  {
    label: 'Finance',
    to: '',
    icon: <Wallet strokeWidth={1.25} fill="none" />,
    children: [
      {
        label: 'Proforma',
        to: `${APP_ROUTES.FINANCE}?type=proforma`,
        icon: <Handshake strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Sales',
        to: `${APP_ROUTES.FINANCE}?type=invoice`,
        icon: <CreditCard strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Credit Note',
        to: `${APP_ROUTES.FINANCE}?type=credit_note`,
        icon: <ScrollText strokeWidth={1.25} fill="none" size={18} />,
      },
    ]
  },
  {
    label: 'Master Data',
    to: '',
    icon: <ShieldPlus strokeWidth={1.25} fill="none" />,
    children: [
      {
        label: 'Vendor',
        to: APP_ROUTES.VENDOR,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Rate Master',
        to: APP_ROUTES.RATE_MASTER,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Quotation',
        to: APP_ROUTES.QUOTATION,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Invoice Item',
        to: APP_ROUTES.INVOICE_ITEM,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Port',
        to: APP_ROUTES.Port,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
      },
      {
        label: 'Airport',
        to: APP_ROUTES.AIRPORT,
        icon: <TextQuote strokeWidth={1.25} fill="none" size={18} />,
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
