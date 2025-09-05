import { FilterOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const FilterButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton icon={<FilterOutlined />} {...props}>
    {children || 'Filter'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default FilterButton;
