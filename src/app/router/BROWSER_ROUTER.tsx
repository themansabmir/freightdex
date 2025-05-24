import AirportPage from "@modules/airport";
import DashboardPage from "@modules/dashboard";
import Port from "@modules/port";
import Vendor from "@modules/vendor";
import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import ProtectedRoute from "./ProtectedRoute";
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
  },
  {
    path: APP_ROUTES.Port,
    element: <ProtectedRoute children={<Port />} />,
  },
]);
