import { RouteObject } from 'react-router-dom';

import { LoginRoutes } from './Login';
import type { BasePageRouteObject } from '@/common/types';
import { PatientRoutes } from './Patient';
import { LocationRoutes } from './Location';
import { ListRoutes } from './List';

const ROUTES: BasePageRouteObject[] = [
  // Login
  ...LoginRoutes,

  // Patient
  ...PatientRoutes,

  // Location
  ...LocationRoutes,

  // List
  ...ListRoutes,
];

export default ROUTES as RouteObject[];
