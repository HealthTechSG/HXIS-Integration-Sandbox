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

import { useTabs } from '@/common/hooks/useTabs';
import { useGetPractitionerListQuery, useDeletePractitionerMutation } from '@/services/Practitioner/PractitionerService';

const { Text } = Typography;

interface PractitionerTableProps {
  searchQuery?: string;
  department?: string;
  specialty?: string;
  status?: string;
  onEditPractitioner?: (practitioner: any) => void;
}

const PractitionerTable: React.FC<PractitionerTableProps> = ({
  searchQuery = '', // TODO: Use this for server-side filtering when FHIR API is ready
  onEditPractitioner,
}) => {
  const { openPractitionerProfileTab } = useTabs();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch practitioners from FHIR API
  const { data: practitionerListData, isLoading, error } = useGetPractitionerListQuery({
    search: searchQuery,
    page: 0,
    pageSize: 100
  });

  // Delete practitioner mutation
  const [deletePractitioner, { isLoading: isDeleting }] = useDeletePractitionerMutation();

  // Transform FHIR data to display format
  const filteredPractitioners = useMemo(() => {
    if (!practitionerListData?.entry) {
      return [];
    }

    console.log('practitionerListData:', practitionerListData);
    console.log('First practitioner entry:', practitionerListData.entry[0]);

    // Transform mapped Practitioner service response to display format
    let transformedPractitioners = practitionerListData.entry.map((practitioner: any) => {
      const birthDateString = typeof practitioner.birthdate === 'string' 
        ? practitioner.birthdate 
        : practitioner.birthdate?.format?.('YYYY-MM-DD') || '';
      const age = birthDateString ? moment().diff(moment(birthDateString), 'years') : 0;
      const gender = practitioner.gender === 'male' ? 'M' : practitioner.gender === 'female' ? 'F' : practitioner.gender?.charAt(0)?.toUpperCase() || 'U';

      return {
        key: practitioner.id,
        id: practitioner.id,
        identifier: practitioner.practitionerId || practitioner.idNumber || 'N/A',
        name: practitioner.name || 'Unknown',
        age,
        gender,
        birthDate: birthDateString,
        phone: practitioner.contactNumber || '',
        email: practitioner.email || '',
        address: practitioner.address || '',
        city: practitioner.city || '',
        state: practitioner.state || '',
        postalCode: practitioner.postalCode || '',
        country: practitioner.country || '',
        specialty: practitioner.specialty || 'General',
        originalPractitioner: practitioner, // Preserve original data for editing
      };
    });

    // Apply local search filter if there's a local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase().trim();
      transformedPractitioners = transformedPractitioners.filter((practitioner: any) => {
        return (
          practitioner.name.toLowerCase().includes(query) ||
          practitioner.identifier.toLowerCase().includes(query) ||
          practitioner.phone.toLowerCase().includes(query) ||
          practitioner.email.toLowerCase().includes(query) ||
          practitioner.address.toLowerCase().includes(query) ||
          practitioner.specialty.toLowerCase().includes(query) ||
          practitioner.birthDate.toLowerCase().includes(query)
        );
      });
    }

    return transformedPractitioners;
  }, [practitionerListData, localSearchQuery]);

  const handlePractitionerClick = (practitionerId: string, practitionerName: string) => {
    openPractitionerProfileTab(practitionerId, practitionerName);
  };

  const handleDeletePractitioner = (practitionerId: string, practitionerName: string) => {
    Modal.confirm({
      title: 'Delete Practitioner',
      content: `Are you sure you want to delete practitioner "${practitionerName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePractitioner(practitionerId).unwrap();
          message.success(`Practitioner "${practitionerName}" has been deleted successfully.`);
        } catch (error) {
          console.error('Failed to delete practitioner:', error);
          message.error('Failed to delete practitioner. Please try again.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Practitioner Information',
      key: 'practitioner',
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
                onClick={() => handlePractitionerClick(record.id, record.name)}
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
      title: '🏥 Specialty & Address',
      key: 'specialty',
      width: '25%',
      render: (_: any, record: any) => (
        <div>
          <div className="text-xs font-semibold text-blue-700 mb-1">
            {record.specialty}
          </div>
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
            onClick={() => handlePractitionerClick(record.id, record.name)}
            title="View Profile"
          />
          <Button 
            type="default" 
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => onEditPractitioner?.(record.originalPractitioner)}
            title="Edit"
          />
          <Button 
            type="default" 
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePractitioner(record.id, record.name)}
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
        <Spin size="large" tip="Loading practitioners...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <Text>Error loading practitioners. Please try again.</Text>
      </div>
    );
  }

  return (
    <div className='mt-4'>
      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <Input.Search
          placeholder="Search here..."
          allowClear
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          enterButton={<SearchOutlined />}
          className="w-80"
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredPractitioners}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} practitioners`,
          className: 'text-xs'
        }}
        size="small"
        scroll={{ y: 600 }}
        rowClassName={() => 'practitioner-row-normal'}
        className="text-xs"
      />

      {/* Results summary moved to bottom */}
      <div className="mt-3 flex justify-between items-center">
        <Text className="text-xs text-gray-400">
          Last updated: {moment().format('MM/DD/YY h:mm A')}
        </Text>
      </div>

      <style>{`
        .practitioner-row-normal:hover {
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

export default PractitionerTable;