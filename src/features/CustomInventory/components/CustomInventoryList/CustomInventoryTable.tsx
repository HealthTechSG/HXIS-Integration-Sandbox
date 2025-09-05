import { Divider, Flex } from 'antd';
import { get } from 'lodash-es';
import React, { useState } from 'react';

import CustomInventoryTableFilterForm from './CustomInventoryTableFilterForm';
import { BaseTable, TableCurrentFilterTags } from '@/common/components';
import { useTablePagination, useTableSorting } from '@/common/hooks';
import { CustomInventoryLabels as Labels } from '@/features/CustomInventory/constants';
import { useCustomInventoryTable } from '@/features/CustomInventory/hooks';
import { useGetCustomInventoryListQuery } from '@/services/CustomInventory/CustomInventoryService';

//* FC -------------------------------------------------------------------------
const CustomInventoryTable: React.FC = () => {
  //* Table Params -------------------------------------------------------------
  // TODO: Refactor and move most of the logic into the custom hooks.
  const { columns } = useCustomInventoryTable();

  //* Table States -------------------------------------------------------------
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const { page, pageSize, setPagination } = useTablePagination();
  const { setTableSorting, sortDirections, sortFields } = useTableSorting();

  //* Query --------------------------------------------------------------------
  const { data, isError, isFetching } = useGetCustomInventoryListQuery({
    page,
    pageSize,
    sortFields,
    sortDirections,
    ...filterValues,
  });

  //* JSX ----------------------------------------------------------------------
  return (
    <Flex gap="middle" vertical>
      <CustomInventoryTableFilterForm
        onFilter={(values) => setFilterValues(values)}
      />

      <Divider className="m-0" />

      <TableCurrentFilterTags
        filters={filterValues}
        renderLabel={(key) => get(Labels, key, key)}
      />

      <BaseTable
        columns={columns}
        dataSource={data?.entry}
        error={isError}
        loading={isFetching}
        onChange={(page, pageSize, sortFields, sortDirections) => {
          setPagination(page, pageSize);
          setTableSorting(sortFields, sortDirections);
        }}
        totalRowCount={data?.total}
      />
    </Flex>
  );
};

//* Export ---------------------------------------------------------------------
export default CustomInventoryTable;
