import React, { useMemo, useState } from 'react';

import { 
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  SearchOutlined,
  UserOutlined, 
} from '@ant-design/icons';
import { Avatar, Button, Input, Modal, Space, Spin, Table, Typography, message } from 'antd';
import moment from 'moment';

import { useGetPatientListQuery, useDeletePatientMutation } from '@/services/Patient/PatientService';
import { useTabs } from '@/common/hooks/useTabs';

const { Text } = Typography;

interface PatientTableProps {
  searchQuery?: string;
  department?: string;
  provider?: string;
  status?: string;
  onEditPatient?: (patient: any) => void;
}



const PatientTable: React.FC<PatientTableProps> = ({
  searchQuery = '',
  // department = 'all',
  // provider = 'all',
  // status = 'all'
  onEditPatient,
}) => {
  const { openPatientProfileTab } = useTabs();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch patients from external FHIR API
  const { data: patientListData, isLoading, error } = useGetPatientListQuery({
    search: searchQuery,
    page: 0,
    pageSize: 100,
    count: 100
  });

  // Delete patient mutation
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();



  // Transform FHIR Bundle response to display format
  const filteredPatients = useMemo(() => {
    if (!patientListData?.entry) {
      return [];
    }

    console.log('patientListData:', patientListData);
    console.log('First patient entry:', patientListData.entry[0]);

    // Transform mapped Patient service response to display format
    let transformedPatients = patientListData.entry.map((patient: any) => {
      const birthDateString = typeof patient.birthdate === 'string' 
        ? patient.birthdate 
        : patient.birthdate?.format?.('YYYY-MM-DD') || '';
      const age = birthDateString ? moment().diff(moment(birthDateString), 'years') : 0;
      const gender = patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : patient.gender?.charAt(0)?.toUpperCase() || 'U';

      return {
        key: patient.id,
        id: patient.id,
        identifier: patient.mrn || patient.idNumber || 'N/A',
        name: patient.name || 'Unknown',
        age,
        gender,
        birthDate: birthDateString,
        phone: patient.contactNumber || '',
        email: patient.email || '',
        address: patient.address || '',
        postalCode: patient.postalCode || '',
        country: patient.country || '',
        originalPatient: patient, // Preserve original Patient data for editing
      };
    });

    // Apply local search filter if there's a local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase().trim();
      transformedPatients = transformedPatients.filter((patient) => {
        return (
          patient.name.toLowerCase().includes(query) ||
          patient.identifier.toLowerCase().includes(query) ||
          patient.phone.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.address.toLowerCase().includes(query) ||
          patient.birthDate.toLowerCase().includes(query)
        );
      });
    }

    return transformedPatients;
  }, [patientListData, localSearchQuery]);

  const handlePatientClick = (patientId: string, patientName: string) => {
    openPatientProfileTab(patientId, patientName);
  };

  const handleDeletePatient = (patientId: string, patientName: string) => {
    Modal.confirm({
      title: 'Delete Patient',
      content: `Are you sure you want to delete patient "${patientName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePatient(patientId).unwrap();
          message.success(`Patient "${patientName}" has been deleted successfully.`);
        } catch (error) {
          console.error('Failed to delete patient:', error);
          message.error('Failed to delete patient. Please try again.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Patient Information',
      key: 'patient',
      width: '35%',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            icon={<UserOutlined />} 
            className={`flex-shrink-0 ${
              record.gender === 'M' ? 'bg-blue-500' : 
              record.gender === 'F' ? 'bg-pink-500' : 
              'bg-green-500'
            }`} 
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Button 
                type="link" 
                className="p-0 h-auto text-sm font-bold text-blue-900"
                onClick={() => handlePatientClick(record.id, record.name)}
              >
                {record.name}
              </Button>
            </div>
            <div className="text-xs text-gray-600">
              <Text className="text-xs">ID: {record.identifier}</Text>
              <Text className="text-xs ml-3">{record.gender}, {record.age}y</Text>
            </div>
            <div className="text-[11px] text-gray-400">
              DOB: {record.birthDate ? moment(record.birthDate).format('DD/MM/YYYY') : 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '📞 Contact Information',
      key: 'contact',
      width: '25%',
      render: (_: any, record: any) => (
        <div>
          {record.phone && (
            <div className="text-xs mb-1">
              {record.phone}
            </div>
          )}
          {record.email && (
            <div className="text-xs text-gray-600 mb-1">
              {record.email}
            </div>
          )}
          {!record.phone && !record.email && (
            <div className="text-xs text-gray-400">
              No contact info
            </div>
          )}
        </div>
      ),
    },
    {
      title: '🏠 Address',
      key: 'address',
      width: '25%',
      render: (_: any, record: any) => (
        <div>
          {record.address && (
            <div className="text-xs mb-0.5">
              {record.address}
            </div>
          )}
          {(record.postalCode || record.country) && (
            <div className="text-[11px] text-gray-600">
              {record.postalCode} {record.country}
            </div>
          )}
          {!record.address && !record.postalCode && !record.country && (
            <div className="text-xs text-gray-400">
              No address
            </div>
          )}
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
            type="default" 
            shape="circle"
            icon={<FileTextOutlined />}
            onClick={() => handlePatientClick(record.id, record.name)}
            title="View Profile"
          />
          <Button 
            type="default" 
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEditPatient?.(record.originalPatient)}
            title="Edit"
          />
          <Button 
            type="default" 
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePatient(record.id, record.name)}
            title="Delete"
            loading={isDeleting}
            danger
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" tip="Loading patients...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <Text>Error loading patients. Please try again.</Text>
      </div>
    );
  }

  return (
    <div className='mt-0 h-full flex flex-col'>
      {/* Search Input */}
      <div className="flex justify-end mb-4 flex-shrink-0">
        <Input.Search
          placeholder="Search here..."
          allowClear
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          enterButton={<SearchOutlined />}
          className="w-80"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredPatients}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: false,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} patients`,
            className: 'text-xs',
            onChange: (page, newPageSize) => {
              setCurrentPage(page);
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
                setCurrentPage(1);
              }
            },
          }}
          size="small"
          scroll={{ y: 'calc(100vh - 380px)' }}
          rowClassName={() => 'patient-row-normal'}
          className="text-xs"
        />
      </div>

      <style>{`
        .patient-row-normal:hover {
          background-color: #f0f8ff !important;
        }
        .ant-table-tbody > tr > td {
          padding: 4px 8px !important;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f8ff !important;
          font-weight: bold !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
        }
      `}</style>
    </div>
  );
};

export default PatientTable;