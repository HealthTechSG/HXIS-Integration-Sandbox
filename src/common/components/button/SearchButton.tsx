import { SearchOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const SearchButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton icon={<SearchOutlined />} type="primary" {...props}>
    {children || 'Search'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default SearchButton;
