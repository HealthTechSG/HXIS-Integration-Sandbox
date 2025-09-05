import React from 'react';
import { Layout, Button, Grid } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

interface LayoutHeaderProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  isMobile: boolean;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
}) => {
  return (
    <Header className="h-14 px-4 bg-white">
      <div className="flex h-full items-center justify-between">
        {isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        )}
      </div>
    </Header>
  );
};

export default LayoutHeader;
