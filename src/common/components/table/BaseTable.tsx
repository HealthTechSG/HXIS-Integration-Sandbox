/**
 * Wrapped Table component that support paging, sorting, loading, and error.
 */
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { isArray } from 'lodash-es';

import TableErrorSpinProps from './TableErrorSpinProps';
import { LabelValueTag } from '@/common/components';

//* Props ----------------------------------------------------------------------
interface BaseTableProps<T> {
  columns: TableProps<T>['columns'];
  dataSource: TableProps<T>['dataSource'];
  loading?: boolean;
  error?: boolean;
  totalRowCount?: number;
  onChange: (
    page: number,
    pageSize: number,
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => void;
}

//* FC -------------------------------------------------------------------------
const BaseTable = <T,>({
  columns,
  dataSource,
  error = false,
  loading = false,
  onChange,
  totalRowCount = 0,
}: BaseTableProps<T>) => {
  //* Table Handlers -----------------------------------------------------------
  const onTableChange: TableProps<T>['onChange'] = (
    pagination,
    _filters,
    sorter,
  ) => {
    //* Pagination
    const { current, pageSize } = pagination;

    // Minus the page by 1, to make it 0-based.
    const page = (current ?? 1) - 1;

    //* Filtering - Ignored. Filtering is handled using modal form instead.

    //* Sorting
    const antdSorters = isArray(sorter) ? sorter : [sorter];

    const sortFields = antdSorters
      .filter((antdSorter) => antdSorter.field)
      .map((antdSorter) => antdSorter.field as string);

    const sortDirections = antdSorters.map((antdSorter) =>
      antdSorter.order === 'ascend' ? 'asc' : 'desc',
    );

    // Call the parent onChange handler.
    onChange(page, pageSize ?? 10, sortFields, sortDirections);
  };

  const renderShowTotal = (total: number, range: [number, number]) => (
    <>
      <LabelValueTag label="Total" value={total} />
      <LabelValueTag label="Showing" value={`${range[0]} - ${range[1]}`} />
    </>
  );

  //* JSX ----------------------------------------------------------------------
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={error ? TableErrorSpinProps : loading}
      onChange={onTableChange}
      pagination={{
        total: totalRowCount,
        showTotal: renderShowTotal,
        showSizeChanger: true,
      }}
      rowKey="id"
    />
  );
};

//* Export ---------------------------------------------------------------------
export default BaseTable;
