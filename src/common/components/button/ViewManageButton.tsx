import { CaretRightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const ViewManageButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton {...props}>
    <Flex align="center" gap="small">
      {children || <span>View / Manage</span>}
      <CaretRightOutlined />
    </Flex>
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default ViewManageButton;
