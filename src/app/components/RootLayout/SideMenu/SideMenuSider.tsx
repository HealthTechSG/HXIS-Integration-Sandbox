import { Layout, Menu, Flex } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import SiderLogo from './SiderLogo';
import { SIDE_MENU_ITEMS } from '@/configs';

const { Sider } = Layout;

//* FC -------------------------------------------------------------------------
const SideMenuSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getMenuKeyFromPath = (pathname: string): string => {
    // Remove any trailing slashes
    const cleanedPathname = pathname.replace(/\/$/, '');
    
    // Check for specific route patterns
    if (cleanedPathname.startsWith('/patient/') && cleanedPathname !== '/patient') {
      // If it's a patient profile route (/patient/123), return the pattern
      return '/patient/:id';
    }
    
    // Return the pathname as the key for other routes
    return cleanedPathname || '/';
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Sider
      collapsed={collapsed}
      collapsible
      onCollapse={(collapsed) => setCollapsed(collapsed)}
    >
      <Flex gap="small" vertical>
        <SiderLogo isMenuCollapsed={collapsed} />
        <Menu
          items={SIDE_MENU_ITEMS}
          mode="inline"
          selectedKeys={[getMenuKeyFromPath(location.pathname)]}
          theme="dark"
        />
      </Flex>
    </Sider>
  );
};

//* Export ---------------------------------------------------------------------
export default SideMenuSider;
