import { Flex } from 'antd';
import type { TableProps } from 'antd';
import { generatePath } from 'react-router-dom';

import { EditButton } from '@/common/components';
import { TableSortUtils, DateUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import { PatientImmunizationDeleteButton } from '@/features/Patient/components/PatientImmunization';
import { PatientImmunizationLabels } from '@/features/Patient/constants';
import type { PatientImmunization } from '@/services/Patient/PatientTypes';

const { PatientPaths } = RouteMap;
const { DateCompare, StringCompare } = TableSortUtils;

const { fields: FieldLabels } = PatientImmunizationLabels;

//* Hook -----------------------------------------------------------------------
const usePatientImmunizationTable = (patientId: string) => {
  //* Table Columns --------------------------------------------------------------
  const columns: TableProps<PatientImmunization>['columns'] = [
    {
      title: FieldLabels.name,
      dataIndex: 'name',
      sorter: { multiple: 1, compare: StringCompare('name') },
    },
    {
      title: FieldLabels.productName,
      dataIndex: 'productName',
      sorter: { multiple: 2, compare: StringCompare('productName') },
    },
    {
      title: FieldLabels.manufacturerName,
      dataIndex: 'manufacturerName',
      sorter: { multiple: 3, compare: StringCompare('manufacturerName') },
    },
    {
      title: FieldLabels.vaccineDate,
      dataIndex: 'vaccineDate',
      sorter: { multiple: 4, compare: DateCompare('vaccineDate') },
      render: (text) => DateUtils.formatDate(text),
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const editPath = generatePath(PatientPaths.PatientImmunizationEdit, {
          id: patientId,
          referenceId: record.id,
        });

        return (
          <Flex gap="small">
            <EditButton href={editPath} />
            <PatientImmunizationDeleteButton id={record.id} />
          </Flex>
        );
      },
    },
  ];

  //* Return -------------------------------------------------------------------
  return {
    columns,
  };
};

//* Export ---------------------------------------------------------------------
export default usePatientImmunizationTable;
