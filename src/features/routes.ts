import { RouteObject } from 'react-router-dom';

import { HomeRoutes } from './Home';
import { LoginRoutes } from './Login';
import type { BasePageRouteObject } from '@/common/types';
import { PatientRoutes } from './Patient';

const ROUTES: BasePageRouteObject[] = [
  // Login
  ...LoginRoutes,

  // Home
  ...HomeRoutes,

  // Patient
  ...PatientRoutes,
];

export default ROUTES as RouteObject[];
