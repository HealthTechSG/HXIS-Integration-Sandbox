import React from 'react';
import { RouteObject } from 'react-router-dom';

import { BreadcrumbItem } from '@/common/types';

export interface BasePageRouteObject extends Omit<RouteObject, 'handle'> {
  handle: {
    noWrap?: boolean;
    layout?: 'public' | 'login' | 'protected' | 'none' | 'private';
    pageTitle?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
  };
}
