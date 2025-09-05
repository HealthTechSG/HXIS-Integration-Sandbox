import React from 'react';
import { Layout, Menu, Image } from 'antd';
import { useLocation } from 'react-router-dom';

import { SIDE_MENU_ITEMS } from '@/configs';

const { Sider } = Layout;

interface SideMenuSiderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const LOGO_ICON_SRC = `/logo/healthx-logo.png`;

const SideMenuSider: React.FC<SideMenuSiderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const location = useLocation();
  const getMenuKeyFromPath = (pathname: string) => {
    const cleaned = pathname.replace(/\/$/, '');
    return cleaned || '/';
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={0}
      onBreakpoint={(broken) => {
        // optional: if you want to auto-open when returning to desktop
        if (!broken) setCollapsed(false);
      }}
      onCollapse={(newCollapsed) => {
        setCollapsed(newCollapsed);
      }}
      className="bg-slate-300"
    >
      <div className="w-full h-14 flex justify-center items-center">
        <Image
          alt="HealthX Logo"
          className="p-2 h-14"
          src={LOGO_ICON_SRC}
          preview={false}
        />
      </div>

      <Menu
        items={SIDE_MENU_ITEMS}
        mode="inline"
        selectedKeys={[getMenuKeyFromPath(location.pathname)]}
        theme="light"
        className="bg-slate-300"
      />
    </Sider>
  );
};

export default SideMenuSider;
