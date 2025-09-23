import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';
import { PatientManagementPage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';

const { PatientPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const PatientRoutes: BasePageRouteObject[] = [
  {
    path: PatientPaths.PatientList,
    element: (
      <PrivateRoute>
        <PatientManagementPage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'Patient Management',
      breadcrumbs: [{ title: 'Patient Management' }],
      layout: 'private',
    },
  },
];

//* Export ---------------------------------------------------------------------
export default PatientRoutes;
