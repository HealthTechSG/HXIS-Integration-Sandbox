import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type CustomInventory = {
  id: string;
  product: string;
  category: string;
  warehouse: string;
  quantity: number;
  date: string | Dayjs;
};

//* Request & Response Format --------------------------------------------------
export type GetCustomInventoryListRequest = {
  // Search
  search?: string;

  // Page
  page?: number;
  pageSize?: number;

  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];

  // Filters
  product?: string;
  warehouse?: string;
  category?: string;
};
