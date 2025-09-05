import { RouteObject } from 'react-router-dom';

import { RootLayout } from '@/app/components/RootLayout';
import { PublicRootLayout } from '@/app/components/PublicRootLayout';
import { LoginLayout } from '@/app/components/LoginLayout';
import { PrivateRootLayout } from '@/app/components/PrivateRootLayout';

/**
 * Our feature routes will only map to the content body element.
 *
 * Our App.tsx will call this, to wrap all the content body element with
 * the RootLayout (including Header, SideMenu, Footer...)
 */
const wrapRoutes = (routes: RouteObject[]): RouteObject[] => {
  const wrappedRoutes = routes.map((route) => {
    const { children, element, handle } = route;

    if (handle?.noWrap) return route as RouteObject;

    const LayoutComponent =
      handle?.layout === 'public'
        ? PublicRootLayout
        : handle?.layout === 'login'
          ? LoginLayout
          : handle?.layout === 'private'
            ? PrivateRootLayout
            : RootLayout;

    // Wrap the element with your desired component
    const wrappedElement = element ? (
      <LayoutComponent>{element}</LayoutComponent>
    ) : undefined;

    // If the route has children, recursively wrap the children as well
    const wrappedChildren = children ? wrapRoutes(children) : undefined;

    // Return the updated route object with wrapped element and children
    return {
      ...route,
      element: wrappedElement,
      children: wrappedChildren,
    } as RouteObject;
  });

  return wrappedRoutes;
};

//* Export ---------------------------------------------------------------------
export default {
  wrapRoutes,
};
