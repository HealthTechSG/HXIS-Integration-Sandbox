//* Search Resource ------------------------------------------------------------
export type SearchResourceProps = {
  resourceType: string;
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
  sortFields?: string[];
  resultFields?: string[];
};

export type SearchResourceResult<T> = {
  entry: T[];
  total?: number;
};

//* Get Resource by ID ---------------------------------------------------------
export type GetResourceByIdProps = {
  resourceType: string;
  resourceId: string;
  resolveReferences?: Array<string>;
};

//* ----------------------------------------------------------------------------
