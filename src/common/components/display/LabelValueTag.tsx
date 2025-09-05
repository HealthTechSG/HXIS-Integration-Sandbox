import { Tag } from 'antd';
import React from 'react';

//* Props ----------------------------------------------------------------------
interface LabelValueTagProps {
  label: string;
  value: string | number; // TODO: handle dayjs
}

//* FC -------------------------------------------------------------------------
const LabelValueTag: React.FC<LabelValueTagProps> = ({ label, value }) => (
  <Tag>
    <label className="mr-1 opacity-60">{label}:</label>
    <span>{`${value}`}</span>
  </Tag>
);

//* Export ---------------------------------------------------------------------
export default LabelValueTag;
