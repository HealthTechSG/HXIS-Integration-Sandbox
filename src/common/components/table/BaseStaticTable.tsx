/**
 * Wrapped Table component for static data which does not need paging and filtering.
 * Useful for small data sets that display every rows at once.
 */
import { Table } from 'antd';
import type { TableProps } from 'antd';

import TableErrorSpinProps from './TableErrorSpinProps';

//* Props ----------------------------------------------------------------------
interface BaseStaticTableProps<T> {
  columns: TableProps<T>['columns'];
  dataSource: TableProps<T>['dataSource'];
  loading?: boolean;
  error?: boolean;
}

//* FC -------------------------------------------------------------------------
const BaseStaticTable = <T,>({
  columns,
  dataSource,
  error = false,
  loading = false,
}: BaseStaticTableProps<T>) => (
  <Table
    columns={columns}
    dataSource={dataSource}
    loading={error ? TableErrorSpinProps : loading}
    pagination={false}
    rowKey="id"
  />
);

//* Export ---------------------------------------------------------------------
export default BaseStaticTable;
