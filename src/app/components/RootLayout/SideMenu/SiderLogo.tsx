import { Flex } from 'antd';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { UrlUtils } from '@/common/utils';

//* Constants ------------------------------------------------------------------
const LOGO_ICON_SRC = `${UrlUtils.getBaseUrl()}/logo/synapxe-logo-icon.png`;
const LOGO_TEXT_SRC = `${UrlUtils.getBaseUrl()}/logo/synapxe-logo-text.png`;

//* Props ----------------------------------------------------------------------
type LogoIconProps = {
  isMenuCollapsed: boolean;
};

//* FC -------------------------------------------------------------------------
const SiderLogo: React.FC<LogoIconProps> = ({ isMenuCollapsed }) => {
  const collapsedClass = 'w-[0%] opacity-0 ml-0';
  const expandedClass = 'w-[100%] opacity-100 ml-1';

  const logoTextClass = twMerge(
    'h-8 transition-all duration-300',
    isMenuCollapsed ? collapsedClass : expandedClass,
  );

  //* JSX ----------------------------------------------------------------------
  return (
    <Flex align="center" className="h-16 px-2 py-4" justify="center">
      <img alt="Synapxe Logo Icon" className="size-8" src={LOGO_ICON_SRC} />
      <img
        alt="Synapxe Logo Text"
        className={logoTextClass}
        src={LOGO_TEXT_SRC}
      />
    </Flex>
  );
};

//* Export ---------------------------------------------------------------------
export default SiderLogo;
