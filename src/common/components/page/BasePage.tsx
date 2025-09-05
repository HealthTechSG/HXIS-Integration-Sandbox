import React from 'react';

import { PageHeader } from './PageHeader';
import { BreadcrumbItem } from '@/common/types';

//* Props ----------------------------------------------------------------------
interface BasePageProps {
  renderPageTitle?: (pageTitle: React.ReactNode) => React.ReactNode;
  renderBreadcrumb?: (breadcrumbs: BreadcrumbItem[]) => BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  breadcrumbParams?: Record<string, string>;
}

//* FC -------------------------------------------------------------------------
const BasePage: React.FC<BasePageProps> = ({
  actions,
  breadcrumbParams,
  children,
  renderBreadcrumb,
  renderPageTitle,
}) => (
  <>
    <PageHeader
      actions={actions}
      breadcrumbParams={breadcrumbParams}
      renderBreadcrumb={renderBreadcrumb}
      renderPageTitle={renderPageTitle}
    />
    {children}
  </>
);

//* Export ---------------------------------------------------------------------
export default BasePage;
