/**
 * Utils for client-side sorting of tables.
 */
import dayjs from 'dayjs';
import { get } from 'lodash-es';

//* Util -----------------------------------------------------------------------
const TableSortUtils = {
  //* String Compare -----------------------------------------------------------
  StringCompare: (fieldName: string) => (a: any, b: any) => {
    const aValue = get(a, fieldName);
    const bValue = get(b, fieldName);

    return aValue.localeCompare(bValue);
  },

  //* Date Compare -------------------------------------------------------------
  DateCompare: (fieldName: string) => (a: any, b: any) => {
    const aValue = dayjs(get(a, fieldName));
    const bValue = dayjs(get(b, fieldName));

    return aValue.diff(bValue);
  },

  //* --------------------------------------------------------------------------
  // TODO: Other compare types.
};

export default TableSortUtils;
