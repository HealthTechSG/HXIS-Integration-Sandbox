import { Flex } from 'antd';
import { isEmpty } from 'lodash-es';
import React from 'react';

import { LabelValueTag } from '@/common/components';

//* Props ----------------------------------------------------------------------
interface TableCurrentFilterTagsProps {
  filters?: Record<string, string | undefined>;
  renderLabel?: (key: string) => string;
  renderValue?: (key: string, value: string) => string;
}

//* FC -------------------------------------------------------------------------
const TableCurrentFilterTags: React.FC<TableCurrentFilterTagsProps> = ({
  filters = {},
  renderLabel = (key) => key,
  renderValue = (_key, value) => value,
}) => {
  // Omit filters that has empty values.
  const shownFilters = Object.entries(filters).filter(
    ([, value]) => isEmpty(value) === false,
  );

  //* JSX ----------------------------------------------------------------------
  return (
    <Flex gap="small">
      <label>Current Filter(s):</label>

      <Flex className="grow" wrap>
        {isEmpty(shownFilters) ? (
          <span className="opacity-50">None</span>
        ) : (
          shownFilters.map(([key, value]) => {
            const label = renderLabel(key);
            const displayValue = renderValue(key, value!);
            return (
              <LabelValueTag key={key} label={label} value={displayValue} />
            );
          })
        )}
      </Flex>
    </Flex>
  );
};

//* Export ---------------------------------------------------------------------
export default TableCurrentFilterTags;
