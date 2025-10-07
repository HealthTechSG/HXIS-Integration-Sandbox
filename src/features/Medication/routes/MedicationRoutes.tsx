import { MedicationListPage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';
import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';

const { MedicationPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const MedicationRoutes: BasePageRouteObject[] = [
  {
    path: MedicationPaths.MedicationList,
    element: (
      <PrivateRoute>
        <MedicationListPage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'Medication Management',
      breadcrumbs: [{ title: 'Medication Management' }],
      layout: 'private',
    },
  },
];

//* Export ---------------------------------------------------------------------
export default MedicationRoutes;