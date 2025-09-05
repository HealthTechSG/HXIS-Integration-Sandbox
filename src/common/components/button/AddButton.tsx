import { PlusOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const AddButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton icon={<PlusOutlined />} type="primary" {...props}>
    {children || 'Add New'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default AddButton;
