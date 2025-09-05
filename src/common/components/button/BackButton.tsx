import { ArrowLeftOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const BackButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton icon={<ArrowLeftOutlined />} {...props}>
    {children || 'Back'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default BackButton;
