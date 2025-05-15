import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@modules/dashboard";
import Vendor from "@modules/vendor";
import AirportPage from "@modules/Airport";
export const browserRouterRoutes = createBrowserRouter([
  {
    path: APP_ROUTES.DASHBORD,
    element: <ProtectedRoute children={<DashboardPage />} />,
  },
  {
    path: APP_ROUTES.VENDOR,
    element: <ProtectedRoute children={<Vendor />} />,
  },
  {
    path: APP_ROUTES.AIRPORT,
    element: <ProtectedRoute children={<AirportPage />} />,
  }
]);
