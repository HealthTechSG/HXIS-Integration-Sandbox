import { DeleteOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const DeleteButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton danger icon={<DeleteOutlined />} {...props}>
    {children || 'Delete'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default DeleteButton;
