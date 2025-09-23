import { Layout, Typography } from 'antd';
import React from 'react';

const { Header } = Layout;

//* Constants ------------------------------------------------------------------

//* FC -------------------------------------------------------------------------
const LayoutHeader: React.FC = () => (
  <Header className="h-14 px-4 bg-[#93d4ff]" style={{ '--header-height': '3.5rem' } as React.CSSProperties}>
    <div className="flex h-full items-center justify-between">
      <Typography.Title level={3} className="m-0 text-[#ba122b] font-bold italic">HXEMR</Typography.Title>
    </div>
  </Header>
);

//* Export ---------------------------------------------------------------------
export default LayoutHeader;
