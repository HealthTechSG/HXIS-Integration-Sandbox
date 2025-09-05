import type { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';
import { Navigate } from 'react-router-dom';

const HomeRoutes: BasePageRouteObject[] = [
  {
    path: RouteMap.RootPath,
    element: <Navigate to={RouteMap.PatientPaths.PatientList} replace />,
    handle: {
      noWrap: true,
    },
  },
];

export default HomeRoutes;
