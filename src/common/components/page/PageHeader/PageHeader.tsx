import { Layout, Typography, Flex } from 'antd';
import { isEmpty } from 'lodash-es';
import React from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

import PageHeaderBreadcrumb from './PageHeaderBreadcrumb';
import type { BasePageRouteObject, BreadcrumbItem } from '@/common/types';

const { Header } = Layout;
const { Title } = Typography;

type BasePageRouteHandle = BasePageRouteObject['handle'];

//* Props ----------------------------------------------------------------------
interface PageHeaderProps {
  renderPageTitle?: (pageTitle: React.ReactNode) => React.ReactNode;
  renderBreadcrumb?: (breadcrumb: BreadcrumbItem[]) => BreadcrumbItem[];
  actions?: React.ReactNode;
  breadcrumbParams?: Record<string, string>;
}

//* FC -------------------------------------------------------------------------
const PageHeader: React.FC<PageHeaderProps> = ({
  actions,
  breadcrumbParams,
  renderBreadcrumb = (breadcrumb) => breadcrumb,
  renderPageTitle = (pageTitle) => pageTitle,
}) => {
  const matches: UIMatch[] = useMatches();

  const { breadcrumbs, pageTitle } = matches?.[0]
    ?.handle as BasePageRouteHandle;

  const displayPageTitle = renderPageTitle(pageTitle);
  const displayBreadcrumb = renderBreadcrumb(breadcrumbs || []);

  //* JSX ----------------------------------------------------------------------
  return (
    <Header className="h-auto bg-transparent p-0 leading-none">
      <Flex gap="small" justify="space-between">
        <Flex vertical>
          {isEmpty(displayPageTitle) ? null : (
            <Title className="m-0">{displayPageTitle}</Title>
          )}

          {isEmpty(displayBreadcrumb) ? null : (
            <PageHeaderBreadcrumb
              breadcrumb={displayBreadcrumb}
              params={breadcrumbParams}
            />
          )}
        </Flex>
        <Flex align="center" gap="small">
          {actions}
        </Flex>
      </Flex>
    </Header>
  );
};

//* Export ---------------------------------------------------------------------
export default PageHeader;
