/**
 * This component simulate a Card that can be collapsed.
 */
import { Collapse } from 'antd';
import React from 'react';

//* Props ----------------------------------------------------------------------
interface SingleItemCollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

//* FC -------------------------------------------------------------------------
const SingleItemCollapse: React.FC<SingleItemCollapseProps> = ({
  children,
  defaultOpen = false,
  title,
}) => (
  //* JSX ----------------------------------------------------------------------
  <Collapse
    defaultActiveKey={defaultOpen ? [title] : []}
    items={[
      {
        key: title,
        label: title,
        children,
      },
    ]}
  />
);
//* Export ---------------------------------------------------------------------
export default SingleItemCollapse;
