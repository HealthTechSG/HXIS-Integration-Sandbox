import type { DomainResource, Quantity } from 'fhir/r5';

export type FhirCustomInventory = DomainResource & {
  product: string;
  category: string;
  warehouse: string;
  quantity: Quantity;
  date: string;
};
