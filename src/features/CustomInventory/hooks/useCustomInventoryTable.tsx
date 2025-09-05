import type { TableProps } from 'antd';
import { generatePath } from 'react-router-dom';

import { CustomInventoryLabels as Labels } from '../constants';
import { ViewManageButton } from '@/common/components';
import { DateUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import type { CustomInventory } from '@/services/CustomInventory/CustomInventoryTypes';

const { CustomInventoryPaths } = RouteMap;

//* Hook -----------------------------------------------------------------------
const useEducationTable = () => {
  //* Table Columns ------------------------------------------------------------
  // Note: FHIR Engine does not support multi-sort.
  // We can enable multi-sort when using FHIR server that supports it.

  /*
  We have to disable sorting for identifier and contact number due to FHIR Nexus sorting bug.
  FHIR Nexus Bug: https://dev.azure.com/IHIS-HIP/SEED%20InnerSource/_workitems/edit/237870

  TODO: Enable it back when FHIR Nexus bug is fixed.
  */
  const columns: TableProps<CustomInventory>['columns'] = [
    {
      title: Labels.product,
      dataIndex: 'product',
      sorter: true,
    },
    {
      title: Labels.category,
      dataIndex: 'category',
      sorter: true,
    },
    {
      title: Labels.warehouse,
      dataIndex: 'warehouse',
      sorter: true,
    },
    {
      title: Labels.quantity,
      dataIndex: 'quantity',
      // sorter: true,
    },
    {
      title: Labels.date,
      dataIndex: 'date',
      render: (text) => DateUtils.formatDate(text),
      // sorter: true,
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const href = generatePath(CustomInventoryPaths.CustomInventoryView, {
          id: record.id,
        });
        return <ViewManageButton href={href} />;
      },
    },
  ];

  //* Return -------------------------------------------------------------------
  return {
    columns,
  };
};

//* Export ---------------------------------------------------------------------
export default useEducationTable;
