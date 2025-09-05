import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

import { LayoutHeader } from './LayoutHeader';

const { Content } = Layout;

interface PublicRootLayoutProps extends PropsWithChildren {
  className?: string;
}

const PublicRootLayout: React.FC<PublicRootLayoutProps> = ({
  children,
  className,
  ...props
}) => (
  <Layout className={twMerge('min-h-screen', className)} {...props}>
    <LayoutHeader />
    <Content>{children}</Content>
  </Layout>
);

export default PublicRootLayout;
