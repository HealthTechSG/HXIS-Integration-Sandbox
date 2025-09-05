import { Flex } from 'antd';
import type { TableProps } from 'antd';
import { get } from 'lodash-es';
import { generatePath } from 'react-router-dom';

import { EditButton } from '@/common/components';
import { TableSortUtils, DateUtils } from '@/common/utils';
import { RouteMap } from '@/configs';
import { PatientAllergyDeleteButton } from '@/features/Patient/components/PatientAllergy';
import { PatientAllergyLabels } from '@/features/Patient/constants';
import type { PatientAllergy } from '@/services/Patient/PatientTypes';

const { PatientPaths } = RouteMap;
const { DateCompare, StringCompare } = TableSortUtils;

const { fields: FieldLabels, options } = PatientAllergyLabels;
const {
  category: CategoryOptionLabels,
  severity: SeverityOptionLabels,
  type: TypeOptionLabels,
} = options;

//* Hook -----------------------------------------------------------------------
const usePatientAllergyTable = (patientId: string) => {
  //* Table Columns --------------------------------------------------------------
  const columns: TableProps<PatientAllergy>['columns'] = [
    {
      title: FieldLabels.name,
      dataIndex: 'name',
      sorter: { multiple: 1, compare: StringCompare('name') },
    },
    {
      title: FieldLabels.description,
      dataIndex: 'description',
    },
    {
      title: FieldLabels.type,
      dataIndex: 'type',
      sorter: { multiple: 2, compare: StringCompare('type') },
      render: (text) => get(TypeOptionLabels, text, text),
    },
    {
      title: FieldLabels.category,
      dataIndex: 'category',
      sorter: {
        multiple: 3,
        compare: StringCompare('category'),
      },
      render: (text) => get(CategoryOptionLabels, text, text),
    },
    {
      title: FieldLabels.severity,
      dataIndex: 'severity',
      sorter: {
        multiple: 4,
        compare: StringCompare('severity'),
      },
      render: (text) => get(SeverityOptionLabels, text, text),
    },
    {
      title: FieldLabels.recordedDate,
      dataIndex: 'recordedDate',
      sorter: {
        multiple: 5,
        compare: DateCompare('recordedDate'),
      },
      render: (text) => DateUtils.formatDate(text),
    },
    {
      title: FieldLabels.note,
      dataIndex: 'note',
    },
    {
      title: 'Actions',
      key: '_actions',
      fixed: 'right',
      width: 100,
      render: (_text, record) => {
        const editPath = generatePath(PatientPaths.PatientAllergyEdit, {
          id: patientId,
          referenceId: record.id,
        });

        return (
          <Flex gap="small">
            <EditButton href={editPath} />
            <PatientAllergyDeleteButton id={record.id} />
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
export default usePatientAllergyTable;
