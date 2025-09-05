import type {
  CustomInventory,
  GetCustomInventoryListRequest,
} from './CustomInventoryTypes';
import type { FhirCustomInventory } from './FhirCustomInventoryTypes';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR patient type to the UI type that we use.
 */
const EducationMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Patient
  //* --------------------------------------------------------------------------
  mapFromFhirCustomInventory: (fhirInventory: FhirCustomInventory) =>
    ({
      id: fhirInventory.id,
      product: fhirInventory.product,
      category: fhirInventory.category,
      warehouse: fhirInventory.warehouse,
      quantity: fhirInventory.quantity.value,
      date: fhirInventory.date,
    }) as CustomInventory,

  //* --------------------------------------------------------------------------
  mapToFhirCustomInventory: (inventory: Partial<CustomInventory>) =>
    ({
      resourceType: 'CustomInventory',
      id: inventory.id,
      product: inventory.product,
      category: inventory.category,
      warehouse: inventory.warehouse,
      quantity: {
        value: inventory.quantity,
        unit: 'unit',
      },
      date: inventory.date
        ? DateUtils.formatDateForFhir(inventory.date)
        : undefined,
    }) as FhirCustomInventory,

  //* --------------------------------------------------------------------------
  mapToFhirCustomInventorySortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    // TODO: FHIR Engine very buggy when sorting one-to-many references... This is unused for now.
    const fieldNameMapping = {
      // Add mapping here if needed.
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirCustomInventoryFilters: ({
    category,
    product,
    warehouse,
    ...filters
  }: Partial<GetCustomInventoryListRequest>) => ({
    ...(product ? { 'product:contains': product } : {}),
    ...(warehouse ? { 'warehouse:contains': warehouse } : {}),
    ...(category ? { 'category:contains': category } : {}),
    ...filters,
  }),

  //* --------------------------------------------------------------------------
};

export default EducationMapperUtil;
