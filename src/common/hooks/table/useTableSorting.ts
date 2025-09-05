import { useState } from 'react';

//* Hook -----------------------------------------------------------------------
const useTableSorting = () => {
  const [sortFields, setSortFields] = useState<string[]>([]);
  const [sortDirections, setSortDirections] = useState<('asc' | 'desc')[]>([]);

  const setTableSorting = (
    fields: string[],
    directions: ('asc' | 'desc')[],
  ) => {
    setSortFields(fields);
    setSortDirections(directions);
  };

  // Return -------------------------------------------------------------------
  return {
    sortFields,
    sortDirections,
    setTableSorting,
  };
};

//* Export ---------------------------------------------------------------------
export default useTableSorting;
