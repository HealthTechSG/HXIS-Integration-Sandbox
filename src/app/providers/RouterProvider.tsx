import React from 'react';
import {
  RouterProvider as ReactRouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import RouterUtils from '../utils/RouterUtils';
import { UrlUtils } from '@/common/utils';
import { ROUTES } from '@/features';

const routes = RouterUtils.wrapRoutes(ROUTES);
const router = createBrowserRouter(routes, { basename: UrlUtils.getBaseUrl() });

//* FC -------------------------------------------------------------------------
const RouterProvider: React.FC = () => <ReactRouterProvider router={router} />;

//* Export ---------------------------------------------------------------------
export default RouterProvider;
