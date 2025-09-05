import type { TableProps } from 'antd';
import { get } from 'lodash-es';
import { generatePath } from 'react-router-dom';

import { ViewManageButton } from '@/common/components';
import { RouteMap } from '@/configs';
import { PatientLabels } from '@/features/Patient/constants';
import type { Patient } from '@/services/Patient/PatientTypes';

const { PatientPaths } = RouteMap;

const { fields: FieldLabel, options } = PatientLabels;
const { gender: GenderOptionLabel } = options;

//* Hook -----------------------------------------------------------------------
const usePatientTable = () => {
  //* Table Columns ------------------------------------------------------------
  // Note: FHIR Engine does not support multi-sort.
  // We can enable multi-sort when using FHIR server that supports it.

  /*
  We have to disable sorting for identifier and contact number due to FHIR Nexus sorting bug.
  FHIR Nexus Bug: https://dev.azure.com/IHIS-HIP/SEED%20InnerSource/_workitems/edit/237870

  TODO: Enable it back when FHIR Nexus bug is fixed.
  */

  const columns: TableProps<Patient>['columns'] = [
    {
      title: FieldLabel.mrn,
      dataIndex: 'mrn',
      // sorter: true,
    },
    {
      title: FieldLabel.name,
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: FieldLabel.contactNumber,
      dataIndex: 'contactNumber',
      // sorter: true,
    },
    {
      title: FieldLabel.gender,
      dataIndex: 'gender',
      sorter: true,
      render: (text) => get(GenderOptionLabel, text, text),
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const href = generatePath(PatientPaths.PatientDetail, {
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
export default usePatientTable;
