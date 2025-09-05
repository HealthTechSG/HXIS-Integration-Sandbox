import { UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { Layout, Flex, Button, Typography, Image, Menu } from 'antd';
import React from 'react';
import { UrlUtils } from '@/common/utils';
import { PUBLIC_TOP_MENU_ITEMS } from '@/configs';
import TopMenuSider from '../TopMenu/TopMenuSider';

const { Header } = Layout;
const { Title } = Typography;

//* Constants ------------------------------------------------------------------
const LOGO_ICON_SRC = `${UrlUtils.getBaseUrl()}/logo/healthx-logo.png`;

const getMenuKeyFromPath = (pathname: string): string => {
  // Remove any trailing slashes
  const cleanedPathname = pathname.replace(/\/$/, '');
  // Return the pathname as the key
  return cleanedPathname || '/';
};

//* FC -------------------------------------------------------------------------
const LayoutHeader: React.FC = () => (
  <Header className="h-14 px-4 bg-white">
    <div className="flex h-full items-center justify-between">
      <Image alt="HealthX Logo" className="w-36" src={LOGO_ICON_SRC} />
      <TopMenuSider />
    </div>
  </Header>
);

//* Export ---------------------------------------------------------------------
export default LayoutHeader;
