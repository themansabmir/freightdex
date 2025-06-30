import DashboardPage from '@modules/dashboard';
import Port from '@modules/port';
import Shipment from '@modules/shipment';
import ShipmentFolderPage from '@modules/shipment/pages/ShipmentFolderPage';
import Team from '@modules/team';
import Vendor from '@modules/vendor';
import { createBrowserRouter } from 'react-router-dom';
import { APP_ROUTES } from './APP_ROUTES';
import ProtectedRoute from './ProtectedRoute';
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
    path: APP_ROUTES.Port,
    element: <ProtectedRoute children={<Port />} />,
  },
  {
    path: APP_ROUTES.TEAM,
    element: <ProtectedRoute children={<Team />} />,
  },
  {
    path: APP_ROUTES.MY_PROFILE,
    element: <ProtectedRoute children={<Port />} />,
  },
  {
    path: APP_ROUTES.SHIPMENT,
    element: <ProtectedRoute children={<Shipment />} />,
  },
  {
    path: `${APP_ROUTES.SHIPMENT}/:id`,
    element: <ProtectedRoute children={<ShipmentFolderPage />} />,
  }
]);
