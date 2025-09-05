import React, { useState } from 'react';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Grid, Menu, Button, Drawer, Typography } from 'antd';
import { PUBLIC_TOP_MENU_ITEMS } from '@/configs';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const getMenuKeyFromPath = (pathname: string): string => {
  const cleaned = pathname.replace(/\/$/, '');
  return cleaned || '/';
};

const TopMenuSider: React.FC = () => {
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedKey = getMenuKeyFromPath(window.location.pathname);

  const menu = (
    <Menu
      className="bg-white w-full h-14 border-none"
      mode={screens.lg ? 'horizontal' : 'inline'}
      items={PUBLIC_TOP_MENU_ITEMS}
      selectedKeys={[selectedKey]}
      theme="light"
      style={!screens.lg ? { border: 'none' } : undefined}
    />
  );

  // Desktop view: inline menu + button
  if (screens.lg) {
    return (
      <div className="flex-1 ml-10 flex items-center justify-between">
        {menu}
      </div>
    );
  }

  // Mobile view: hamburger → drawer
  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setDrawerOpen(true)}
      />
      <Drawer
        title={<Title level={4}>Menu</Title>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {menu}
      </Drawer>
    </>
  );
};

export default TopMenuSider;
