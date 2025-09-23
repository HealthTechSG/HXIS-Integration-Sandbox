import { Layout, Image } from 'antd';
import React from 'react';
import { UrlUtils } from '@/common/utils';
import TopMenuSider from '../TopMenu/TopMenuSider';

const { Header } = Layout;

//* Constants ------------------------------------------------------------------
const LOGO_ICON_SRC = `${UrlUtils.getBaseUrl()}/logo/healthx-logo.png`;

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
