import { EditOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const EditButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton icon={<EditOutlined />} type="primary" {...props}>
    {children || 'Edit'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default EditButton;
