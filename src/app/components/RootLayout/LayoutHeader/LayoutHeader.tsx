import { UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { Layout, Flex, Button, Typography } from 'antd';
import React from 'react';

import UserPopover from './UserPopover';

const { Header } = Layout;
const { Title } = Typography;

//* FC -------------------------------------------------------------------------
const LayoutHeader: React.FC = () => (
  <Header className="h-14 px-4" id="rootLayoutHeader">
    <div className="flex h-full items-center justify-between">
      <Title className="m-0 text-white" level={4}>
        {import.meta.env.VITE_APP_TITLE}
      </Title>
      <Flex align="center" className="h-full" gap="small" justify="end">
        <Button icon={<BellOutlined />} shape="circle" />
        <Button icon={<SettingOutlined />} shape="circle" />
        <UserPopover>
          <Button icon={<UserOutlined />} shape="circle" />
        </UserPopover>
      </Flex>
    </div>
  </Header>
);

//* Export ---------------------------------------------------------------------
export default LayoutHeader;
