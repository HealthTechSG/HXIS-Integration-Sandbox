import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';
import { PatientListPage, PatientProfilePage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';

const { PatientPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const PatientRoutes: BasePageRouteObject[] = [
  {
    path: PatientPaths.PatientList,
    element: (
      <PrivateRoute>
        <PatientListPage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'Patient List',
      breadcrumbs: [{ title: 'Patient List' }],
      layout: 'private',
    },
  },
  {
    path: PatientPaths.PatientProfile,
    element: (
      <PrivateRoute>
        <PatientProfilePage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'Patient List',
      breadcrumbs: [{ title: 'Patient List' }],
      layout: 'private',
    },
  },
];

//* Export ---------------------------------------------------------------------
export default PatientRoutes;
