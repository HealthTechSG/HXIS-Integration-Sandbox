import { LocationListPage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';
import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';

const { LocationPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const LocationRoutes: BasePageRouteObject[] = [
  {
    path: LocationPaths.LocationList,
    element: (
      <PrivateRoute>
        <LocationListPage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'Location Management',
      breadcrumbs: [{ title: 'Location Management' }],
      layout: 'private',
    },
  },
];

//* Export ---------------------------------------------------------------------
export default LocationRoutes;