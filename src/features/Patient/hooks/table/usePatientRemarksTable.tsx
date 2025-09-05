import { Flex } from 'antd';
import type { TableProps } from 'antd';
import { generatePath } from 'react-router-dom';

import { EditButton } from '@/common/components';
import { RouteMap } from '@/configs';
import { PatientRemarksDeleteButton } from '@/features/Patient/components/PatientRemarks';
import type { PatientRemarks } from '@/services/Patient/PatientTypes';

const { PatientPaths } = RouteMap;

//* Hook -----------------------------------------------------------------------
const usePatientRemarksTable = (patientId: string) => {
  //* Table Columns --------------------------------------------------------------
  const columns: TableProps<PatientRemarks>['columns'] = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const editPath = generatePath(PatientPaths.PatientRemarksEdit, {
          id: patientId,
          referenceId: record.id,
        });

        return (
          <Flex gap="small">
            <EditButton href={editPath} />
            <PatientRemarksDeleteButton id={record.id} />
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
export default usePatientRemarksTable;
