import { CaretRightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';

import BaseButton from './BaseButton';

//* Props ----------------------------------------------------------------------
interface RedirectButtonProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

//* FC -------------------------------------------------------------------------
const RedirectButton: React.FC<RedirectButtonProps> = ({
  children,
  href,
  ...props
}) => (
  <BaseButton href={href} {...props}>
    <Flex align="center" gap="small">
      {children}
      <CaretRightOutlined />
    </Flex>
  </BaseButton>
);

//* Export ---------------------------------------------------------------------
export default RedirectButton;
