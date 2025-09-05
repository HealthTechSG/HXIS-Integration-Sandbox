import React, { useState, PropsWithChildren } from 'react';
import { Layout, Grid } from 'antd';
import { twMerge } from 'tailwind-merge';

import { LayoutHeader } from './LayoutHeader';
import { SideMenuSider } from './SideMenu';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface PrivateRootLayoutProps extends PropsWithChildren {
  className?: string;
}

const PrivateRootLayout: React.FC<PrivateRootLayoutProps> = ({
  children,
  className,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint(); // { xs, sm, md, lg, xl, xxl }
  const isMobile = !screens.lg; // true when width < lg

  return (
    <Layout className={twMerge('min-h-screen', className)} {...props}>
      <SideMenuSider collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <LayoutHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />

        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default PrivateRootLayout;
