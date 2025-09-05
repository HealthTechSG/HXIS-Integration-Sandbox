import { HomeFilled } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import type { BreadcrumbProps } from 'antd';
import React from 'react';
import { useNavigate, generatePath } from 'react-router-dom';

import type { BreadcrumbItem } from '@/common/types';
import { UrlUtils } from '@/common/utils';
import { RouteMap } from '@/configs';

type AntdBreadcrumbItemType = Required<BreadcrumbProps>['items'][number];

//* Props ----------------------------------------------------------------------
interface PageHeaderBreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
  params?: Record<string, string>;
}

//* FC -------------------------------------------------------------------------
const PageHeaderBreadcrumb: React.FC<PageHeaderBreadcrumbProps> = ({
  breadcrumb,
  params = {},
}) => {
  const navigate = useNavigate();

  // Map the input props into Antd item.
  const breadcrumbItems = breadcrumb.map((item) => {
    const { key, path, title } = item;

    const pathWithParams = path ? generatePath(path, params) : path;
    const fullPath = pathWithParams
      ? UrlUtils.generateFullPath(pathWithParams)
      : undefined;

    return {
      key,
      title,
      href: fullPath,
      onClick: (event) => {
        event.preventDefault();
        if (pathWithParams) {
          navigate(pathWithParams);
        }
      },
    } as AntdBreadcrumbItemType;
  });

  // Default appent Home Icon as first item.
  const homeBreadcrumbItem = {
    href: UrlUtils.generateFullPath(RouteMap.RootPath),
    onClick: (event) => {
      event.preventDefault();
      navigate(RouteMap.RootPath);
    },
    title: <HomeFilled />,
  } as AntdBreadcrumbItemType;

  //* JSX ----------------------------------------------------------------------
  return (
    <Breadcrumb
      className="mb-4"
      items={[homeBreadcrumbItem, ...breadcrumbItems]}
      separator=">"
    />
  );
};

//* Export ---------------------------------------------------------------------
export default PageHeaderBreadcrumb;
