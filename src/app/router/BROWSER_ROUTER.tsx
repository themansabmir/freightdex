import DashboardPage from '@modules/dashboard';
import Port from '@modules/port';
import Shipment from '@modules/shipment';
import ShipmentFolderPage from '@modules/shipment/pages/ShipmentFolderPage';
import MBLFormPage from '@modules/mbl'; // Import MBLFormPage
import HBLFormPage from '@modules/hbl'; // Import HBLFormPage
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
    // It seems ShipmentFolderPage might be where MBLs are listed or accessed.
    // Let's assume clicking an MBL from ShipmentFolderPage navigates to an MBL page.
    // The MBL page itself might be identified by the shipment folder ID if MBL is unique per folder,
    // or it might have its own distinct MBL ID.
    // Based on MBLFormPage taking an `id` prop, which we mapped to `mblId` (potentially shipmentFolderId),
    // the route below assumes `mblId` is the identifier passed in the URL for the MBL.
  },
  // Route for MBL page (view/edit MBL)
  // It's nested under a shipment conceptually, so using shipmentId in the path.
  // If an MBL is uniquely identified by its own ID, distinct from shipmentFolderId:
  {
    path: `${APP_ROUTES.SHIPMENT}/:shipmentId/mbl/:mblId`,
    element: <ProtectedRoute children={<MBLFormPage id={':mblId'} />} />, // Pass mblId to MBLFormPage
  },
  // Route for creating a new MBL (if MBLs are created under a shipment context)
  // This might be handled by the above route if `:mblId` can be 'new', or a separate route:
  {
    path: `${APP_ROUTES.SHIPMENT}/:shipmentId/mbl/new`,
    element: <ProtectedRoute children={<MBLFormPage id={'new'} />} />, // Pass 'new' or handle inside MBLFormPage
  },
  // Routes for HBL
  // Creating a new HBL, linked to a specific MBL and Shipment
  {
    path: `${APP_ROUTES.SHIPMENT}/:shipmentId/mbl/:mblId/hbl/new`,
    element: <ProtectedRoute children={<HBLFormPage />} />, // HBLFormPage uses useParams and useLocation for context
  },
  // Viewing/editing an existing HBL
  {
    path: `${APP_ROUTES.SHIPMENT}/:shipmentId/mbl/:mblId/hbl/:hblId`,
    element: <ProtectedRoute children={<HBLFormPage />} />, // HBLFormPage uses useParams for context
  }
]);
