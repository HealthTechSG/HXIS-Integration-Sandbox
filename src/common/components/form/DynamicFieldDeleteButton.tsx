import { DeleteOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import React from 'react';

//* FC -------------------------------------------------------------------------
const DynamicFieldDeleteButton: React.FC<ButtonProps> = ({ ...props }) => (
  <Button danger icon={<DeleteOutlined />} {...props} />
);

//* Export ---------------------------------------------------------------------
export default DynamicFieldDeleteButton;
