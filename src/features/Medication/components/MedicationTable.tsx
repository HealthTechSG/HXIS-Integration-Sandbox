import {
  DeleteOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Modal, Space, Spin, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';

import { useGetMedicationListQuery, useDeleteMedicationMutation } from '@/services/Medication/MedicationService';

const { Text } = Typography;

interface MedicationTableProps {
  searchQuery?: string;
  status?: string;
  onEditMedication?: (medication: any) => void;
}

const MedicationTable: React.FC<MedicationTableProps> = ({
  onEditMedication,
  searchQuery = '',
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch medications from FHIR API
  const { data: medicationListData, error, isLoading } = useGetMedicationListQuery({
    search: searchQuery,
    page: 0,
    pageSize: 100
  });

  // Delete medication mutation
  const [deleteMedication, { isLoading: isDeleting }] = useDeleteMedicationMutation();

  // Transform FHIR data to display format
  const filteredMedications = useMemo(() => {
    if (!medicationListData?.entry) {
      return [];
    }

    console.log('medicationListData:', medicationListData);
    console.log('First medication entry:', medicationListData.entry[0]);

    // Transform mapped Medication service response to display format
    let transformedMedications = medicationListData.entry.map((medication: any) => ({
        key: medication.id,
        id: medication.id,
        code: medication.code || 'N/A',
        display: medication.display || 'Unknown Medication',
        system: medication.system || 'http://snomed.info/sct',
        status: medication.status || 'active',
        formCode: medication.formCode || '',
        formDisplay: medication.formDisplay || '',
        formSystem: medication.formSystem || 'http://snomed.info/sct',
        originalMedication: medication, // Preserve original data for editing
      }));

    // Apply local search filter if there's a local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase().trim();
      transformedMedications = transformedMedications.filter((medication: any) => (
          medication.display.toLowerCase().includes(query) ||
          medication.code.toLowerCase().includes(query) ||
          medication.formDisplay.toLowerCase().includes(query) ||
          medication.formCode.toLowerCase().includes(query) ||
          medication.system.toLowerCase().includes(query)
        ));
    }

    return transformedMedications;
  }, [medicationListData, localSearchQuery]);

  const handleMedicationClick = (medicationId: string, medicationName: string) => {
    console.log('View medication profile:', medicationId, medicationName);
    message.info('Medication profile view coming soon!');
  };

  const handleDeleteMedication = (medicationId: string, medicationName: string) => {
    Modal.confirm({
      title: 'Delete Medication',
      content: `Are you sure you want to delete medication "${medicationName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteMedication(medicationId).unwrap();
          message.success(`Medication "${medicationName}" has been deleted successfully.`);
        } catch (error) {
          console.error('Failed to delete medication:', error);
          message.error('Failed to delete medication. Please try again.');
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'entered-in-error': return 'orange';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'inactive': return 'INACTIVE';
      case 'entered-in-error': return 'ERROR';
      default: return status.toUpperCase();
    }
  };

  const columns = [
    {
      title: 'Medication Information',
      key: 'medication',
      width: '40%',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            className="shrink-0 bg-blue-500"
            icon={<MedicineBoxOutlined />}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <Button
                className="h-auto p-0 text-sm font-bold text-blue-900"
                onClick={() => handleMedicationClick(record.id, record.display)}
                type="link"
              >
                {record.display}
              </Button>
              <Tag color={getStatusColor(record.status)}>
                {getStatusLabel(record.status)}
              </Tag>
            </div>
            <div className="text-xs text-gray-600">
              <Text className="text-xs">Code: {record.code}</Text>
              <Text className="ml-3 text-xs">System: {record.system.replace('http://snomed.info/sct', 'SNOMED CT')}</Text>
            </div>
            {record.formDisplay && (
              <div className="text-[11px] text-green-600">
                Form: {record.formDisplay} ({record.formCode})
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '💊 Drug Details',
      key: 'details',
      width: '30%',
      render: (_: any, record: any) => (
        <div>
          <div className="mb-1 text-xs font-semibold text-blue-700">
            SNOMED Code: {record.code}
          </div>
          {record.formCode && record.formDisplay && (
            <div className="mb-1 text-xs">
              Dose Form: {record.formDisplay}
            </div>
          )}
          {record.formCode && (
            <div className="text-[11px] text-gray-600">
              Form Code: {record.formCode}
            </div>
          )}
          {!record.formDisplay && (
            <div className="text-xs text-gray-400">
              No form information
            </div>
          )}
        </div>
      ),
    },
    {
      title: '🔄 Status & System',
      key: 'status',
      width: '15%',
      render: (_: any, record: any) => (
        <div>
          <div className="mb-1 text-xs">
            <Tag color={getStatusColor(record.status)}>
              {getStatusLabel(record.status)}
            </Tag>
          </div>
          <div className="text-[11px] text-gray-600">
            {record.system === 'http://snomed.info/sct' ? 'SNOMED CT' : 'Custom'}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            icon={<FileTextOutlined />}
            onClick={() => handleMedicationClick(record.id, record.display)}
            shape="circle"
            title="View Details"
            type="default"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditMedication?.(record.originalMedication)}
            shape="circle"
            title="Edit"
            type="default"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
            onClick={() => handleDeleteMedication(record.id, record.display)}
            shape="circle"
            title="Delete"
            type="default"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spin size="large" tip="Loading medications...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        <Text>Error loading medications. Please try again.</Text>
      </div>
    );
  }

  return (
    <div className='mt-4'>
      {/* Search Input */}
      <div className="mb-4 flex justify-end">
        <Input.Search
          allowClear
          className="w-80"
          enterButton={<SearchOutlined />}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          placeholder="Search medications..."
          value={localSearchQuery}
        />
      </div>

      <Table
        className="text-xs"
        columns={columns}
        dataSource={filteredMedications}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} medications`,
          className: 'text-xs'
        }}
        rowClassName={() => 'medication-row-normal'}
        scroll={{ y: 600 }}
        size="small"
      />

      {/* Results summary moved to bottom */}
      <div className="mt-3 flex items-center justify-between">
        <Text className="text-xs text-gray-400">
          Last updated: {moment().format('MM/DD/YY h:mm A')}
        </Text>
      </div>

      <style>{`
        .medication-row-normal:hover {
          background-color: #f0f8ff !important;
        }
        .ant-table-tbody > tr > td {
          padding: 8px 8px !important;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f8ff !important;
          font-weight: bold !important;
          font-size: 12px !important;
          padding: 8px 8px !important;
        }
      `}</style>
    </div>
  );
};

export default MedicationTable;