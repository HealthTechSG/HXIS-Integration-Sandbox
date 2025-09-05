import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* FC -------------------------------------------------------------------------
const SubmitButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton htmlType="submit" type="primary" {...props}>
    {children || 'Submit'}
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default SubmitButton;
