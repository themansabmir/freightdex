import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import ProtectedRoute from "./ProtectedRoute";
// import MasterDataPage from "../modules/masterData";
// import DashboardPage from "../modules/dashboard";
import DashboardPage from "@modules/dashboard";
import EGM from "@modules/dummy/EGM";
import IGM from "@modules/dummy/IGM";
import { Customer } from "@modules/masterData/Customer";
export const browserRouterRoutes = createBrowserRouter([
  // {
  //   path: APP_ROUTES.MASTER_DATA,
  //   element: <ProtectedRoute children={<MasterDataPage />} />,
  // },
  {
    path: APP_ROUTES.DASHBORD,
    element: <ProtectedRoute children={<DashboardPage />} />,
  },
  {
    path: APP_ROUTES.FORM_BUILDER,
    element: <ProtectedRoute children={<Customer />} />,
  },
  {
    path: "/egm",
    element: <ProtectedRoute children={<EGM />} />,
  },
  {
    path: "/igm",
    element: <ProtectedRoute children={<IGM />} />,
  },
]);
