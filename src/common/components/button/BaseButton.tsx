import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';

import { UrlUtils } from '@/common/utils';

/**
 * Base Button that adds the BASE_URL into the href, and use router for the navigate.
 */
const BaseButton: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (event: any) => {
    if (onClick) {
      onClick(event);
    } else if (href) {
      event.preventDefault();
      navigate(href);
    }
  };

  const fullHref = href ? UrlUtils.generateFullPath(href) : undefined;

  //* JSX ----------------------------------------------------------------------
  return (
    <Button href={fullHref} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

//* Export ---------------------------------------------------------------------
export default BaseButton;
