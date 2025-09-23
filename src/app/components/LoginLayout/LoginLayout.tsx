import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

import { LayoutHeader } from './LayoutHeader';

const { Content } = Layout;

interface PublicRootLayoutProps extends PropsWithChildren {
  className?: string;
}

const LoginLayout: React.FC<PublicRootLayoutProps> = ({
  children,
  className,
  ...props
}) => (
  <Layout className={twMerge('min-h-screen flex flex-col', className)} {...props}>
    <LayoutHeader />
    <Content className="flex-1">{children}</Content>
  </Layout>
);

export default LoginLayout;
