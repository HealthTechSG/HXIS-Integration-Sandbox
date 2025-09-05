/**
 * This is the RootLayout for Authenticated pages.
 * The only public page in the app template is the login page.
 *
 * If you need a separate root layout for public pages, you might want to create a new one.
 */
import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
// import { Navigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import LayoutFooter from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { SideMenuSider } from './SideMenu';
// import { RouteMap } from '@/configs';
// import { useCurrentLoginUser } from '@/features/Authentication';

const { Content } = Layout;

//* Props ----------------------------------------------------------------------
interface RootLayoutProps extends PropsWithChildren {
  className?: string;
}

//* FC -------------------------------------------------------------------------
const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  className,
  ...props
}) => (
  // Redirect to login page if user is not logged in.
  // const [loginUser] = useCurrentLoginUser();
  // if (isEmpty(loginUser)) {
  // Redirect to login URL
  // return <Navigate replace to={RouteMap.AuthPaths.Login} />;
  // }
  //* JSX ----------------------------------------------------------------------
  <Layout className={twMerge('min-h-screen', className)} {...props}>
    <SideMenuSider />
    <Layout>
      <LayoutHeader />
      <Content className="p-4">{children}</Content>
      <LayoutFooter />
    </Layout>
  </Layout>
);

//* Export ---------------------------------------------------------------------
export default RootLayout;
