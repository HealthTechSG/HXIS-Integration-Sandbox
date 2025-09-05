import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Education = {
  id: string;
  subject: string;
  institute: string;
  study: string;
  graduateDate: string | Dayjs;
};

//* Request & Response Format --------------------------------------------------
export type GetEducationListRequest = {
  // Search
  search?: string;

  // Page
  page?: number;
  pageSize?: number;

  //* FHIR Nexus template does not come with available sorting or filtering for this resource.
  // TODO: Shall we also customize this resource to support?

  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];

  /*
  // Filters
  subject?: string;
  institute?: string;
  study?: string;
  graduateDate?: string | Dayjs;
  */
};
