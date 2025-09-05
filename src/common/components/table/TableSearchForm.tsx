import { Flex, Input } from 'antd';
import React, { useState } from 'react';

import { SearchButton } from '@/common/components';

//* Props ----------------------------------------------------------------------
interface TableSearchFormProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

//* FC -------------------------------------------------------------------------
const TableSearchForm: React.FC<TableSearchFormProps> = ({
  onSearch,
  placeholder,
}) => {
  const [searchValue, setSearchValue] = useState<string>();

  const onSearchButtonClicked = () => {
    onSearch(searchValue || '');
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Flex className="grow" gap="small">
      <Input
        allowClear
        className="grow"
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder={placeholder}
        value={searchValue}
      />
      <SearchButton onClick={onSearchButtonClicked} />
    </Flex>
  );
};

//* Export ---------------------------------------------------------------------
export default TableSearchForm;
