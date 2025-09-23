import { ListListPage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';
import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';

const { ListPaths } = RouteMap;

//* The Const ------------------------------------------------------------------
const ListRoutes: BasePageRouteObject[] = [
  {
    path: ListPaths.ListList,
    element: (
      <PrivateRoute>
        <ListListPage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'List Management',
      breadcrumbs: [{ title: 'List Management' }],
      layout: 'private',
    },
  },
];

//* Export ---------------------------------------------------------------------
export default ListRoutes;