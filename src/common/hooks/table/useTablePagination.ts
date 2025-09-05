import { useState } from 'react';

//* Hook -----------------------------------------------------------------------
const useTablePagination = () => {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const setPagination = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Return -------------------------------------------------------------------
  return {
    page,
    pageSize,
    setPagination,
  };
};

//* Export ---------------------------------------------------------------------
export default useTablePagination;
