import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';

//* FC -------------------------------------------------------------------------
const DynamicFieldAddButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => (
  <Button block icon={<PlusOutlined />} type="dashed" {...props}>
    {children || 'Add more rows'}
  </Button>
);

//* Export ---------------------------------------------------------------------
export default DynamicFieldAddButton;
