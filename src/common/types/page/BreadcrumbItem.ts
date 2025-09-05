import React from 'react';

export interface BreadcrumbItem {
  key?: string;
  title: string | React.ReactNode;
  path?: string;
}
