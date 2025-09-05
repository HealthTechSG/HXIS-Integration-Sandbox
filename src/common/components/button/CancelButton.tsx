import { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const CancelButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton {...props}>{children || 'Cancel'}</BaseButton>
);

//* Export ---------------------------------------------------------------------
export default CancelButton;
