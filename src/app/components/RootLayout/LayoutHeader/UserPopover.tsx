import { Popover } from 'antd';
import type { PopoverProps } from 'antd';
import React from 'react';

import UserPopoverContent from './UserPopoverContent';

//* FC -------------------------------------------------------------------------
const UserPopover: React.FC<PopoverProps> = ({ children, ...props }) => (
  <Popover
    content={<UserPopoverContent />}
    placement="bottomRight"
    trigger="click"
    {...props}
  >
    {children}
  </Popover>
);

//* Export ---------------------------------------------------------------------
export default UserPopover;
