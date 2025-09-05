import { Flex } from 'antd';
import type { TableProps } from 'antd';
import { get } from 'lodash-es';
import { generatePath } from 'react-router-dom';

import { EditButton } from '@/common/components';
import { TableSortUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import { PatientNextOfKinDeleteButton } from '@/features/Patient/components/PatientNextOfKin';
import { PatientNextOfKinLabels } from '@/features/Patient/constants';
import type { PatientNextOfKin } from '@/services/Patient/PatientTypes';

const { PatientPaths } = RouteMap;
const { StringCompare } = TableSortUtils;

const { fields: FieldLabels, options } = PatientNextOfKinLabels;
const { relationship: RelationshipOptionLabels } = options;

//* Hook -----------------------------------------------------------------------
const usePatientNextOfKinTable = (patientId: string) => {
  //* Table Columns --------------------------------------------------------------
  const columns: TableProps<PatientNextOfKin>['columns'] = [
    {
      title: FieldLabels.name,
      dataIndex: 'name',
      sorter: { multiple: 1, compare: StringCompare('name') },
    },
    {
      title: FieldLabels.relationship,
      dataIndex: 'relationship',
      sorter: {
        multiple: 2,
        compare: StringCompare('relationship'),
      },
      render: (text) => get(RelationshipOptionLabels, text, text),
    },
    {
      title: FieldLabels.contactNumber,
      dataIndex: 'contactNumber',
      sorter: {
        multiple: 3,
        compare: StringCompare('contactNumber'),
      },
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const editPath = generatePath(PatientPaths.PatientNextOfKinEdit, {
          id: patientId,
          referenceId: record.id,
        });

        return (
          <Flex gap="small">
            <EditButton href={editPath} />
            <PatientNextOfKinDeleteButton id={record.id} />
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
export default usePatientNextOfKinTable;
