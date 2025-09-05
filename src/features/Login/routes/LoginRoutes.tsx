import { LoginPage } from '../components';
import PublicRoute from '@/common/components/PublicRoute';
import type { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';

const LoginRoutes: BasePageRouteObject[] = [
  {
    path: RouteMap.PrivatePaths.Login,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
    handle: {
      pageTitle: 'Login',
      breadcrumbs: [{ title: 'Login' }],
      layout: 'login',
    },
  },
];

export default LoginRoutes;
