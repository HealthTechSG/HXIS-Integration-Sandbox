
import { 
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Modal, Space, Spin, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';

// import { useTabs } from '@/common/hooks/useTabs'; // TODO: Implement location profile tabs if needed
import { useGetLocationListQuery, useDeleteLocationMutation } from '@/services/Location/LocationService';

const { Text } = Typography;

interface LocationTableProps {
  searchQuery?: string;
  status?: string;
  type?: string;
  physicalType?: string;
  onEditLocation?: (location: any) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
  onEditLocation, // TODO: Use this for server-side filtering when FHIR API is ready
  searchQuery = '',
}) => {
  // const { openLocationProfileTab } = useTabs(); // TODO: Implement location profile tabs if needed
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch locations from FHIR API
  const { data: locationListData, error, isLoading } = useGetLocationListQuery({
    search: searchQuery,
    page: 0,
    pageSize: 100
  });

  // Delete location mutation
  const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();

  // Transform FHIR data to display format
  const filteredLocations = useMemo(() => {
    if (!locationListData?.entry) {
      return [];
    }

    console.log('locationListData:', locationListData);
    console.log('First location entry:', locationListData.entry[0]);

    // Transform mapped Location service response to display format
    let transformedLocations = locationListData.entry.map((location: any) => ({
        key: location.id,
        id: location.id,
        identifier: location.locationId || 'N/A',
        name: location.name || 'Unknown Location',
        status: location.status || 'active',
        alias: location.alias || [],
        type: location.type || '',
        physicalType: location.physicalType || '',
        description: location.description || '',
        phone: location.contactNumber || '',
        email: location.email || '',
        address: location.address || '',
        city: location.city || '',
        state: location.state || '',
        postalCode: location.postalCode || '',
        country: location.country || '',
        longitude: location.longitude,
        latitude: location.latitude,
        altitude: location.altitude,
        managingOrganization: location.managingOrganization || '',
        partOf: location.partOf || '',
        hoursOfOperation: location.hoursOfOperation || [],
        originalLocation: location, // Preserve original data for editing
      }));

    // Apply local search filter if there's a local search query
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase().trim();
      transformedLocations = transformedLocations.filter((location: any) => (
          location.name.toLowerCase().includes(query) ||
          location.identifier.toLowerCase().includes(query) ||
          location.type.toLowerCase().includes(query) ||
          location.physicalType.toLowerCase().includes(query) ||
          location.phone.toLowerCase().includes(query) ||
          location.email.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query) ||
          location.city.toLowerCase().includes(query) ||
          location.managingOrganization.toLowerCase().includes(query) ||
          location.description.toLowerCase().includes(query) ||
          (location.alias && location.alias.some((alias: string) => alias.toLowerCase().includes(query)))
        ));
    }

    return transformedLocations;
  }, [locationListData, localSearchQuery]);

  const handleLocationClick = (locationId: string, locationName: string) => {
    // TODO: Implement location profile tabs if needed
    console.log('View location profile:', locationId, locationName);
    message.info('Location profile view coming soon!');
  };

  const handleDeleteLocation = (locationId: string, locationName: string) => {
    Modal.confirm({
      title: 'Delete Location',
      content: `Are you sure you want to delete location "${locationName}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteLocation(locationId).unwrap();
          message.success(`Location "${locationName}" has been deleted successfully.`);
        } catch (error) {
          console.error('Failed to delete location:', error);
          message.error('Failed to delete location. Please try again.');
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'suspended': return 'orange';
      case 'inactive': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Location Information',
      key: 'location',
      width: '35%',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            className="shrink-0 bg-blue-500" 
            icon={<EnvironmentOutlined />} 
          />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <Button 
                className="h-auto p-0 text-sm font-bold text-blue-900" 
                onClick={() => handleLocationClick(record.id, record.name)}
                type="link"
              >
                {record.name}
              </Button>
              <Tag color={getStatusColor(record.status)}>
                {record.status.toUpperCase()}
              </Tag>
            </div>
            <div className="text-xs text-gray-600">
              <Text className="text-xs">ID: {record.identifier}</Text>
              {record.type && (
                <Text className="ml-3 text-xs">Type: {record.type}</Text>
              )}
            </div>
            {record.alias && record.alias.length > 0 && (
              <div className="text-[11px] text-blue-600">
                Aliases: {record.alias.join(', ')}
              </div>
            )}
            {record.physicalType && (
              <div className="text-[11px] text-gray-400">
                Physical: {record.physicalType}
              </div>
            )}
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
            <div className="mb-1 text-xs">
              {record.phone}
            </div>
          )}
          {record.email && (
            <div className="mb-1 text-xs text-gray-600">
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
      title: '🏢 Address & Organization',
      key: 'address',
      width: '25%',
      render: (_: any, record: any) => (
        <div>
          {record.managingOrganization && (
            <div className="mb-1 text-xs font-semibold text-blue-700">
              {record.managingOrganization}
            </div>
          )}
          {record.address && (
            <div className="mb-0.5 text-xs">
              {record.address}
            </div>
          )}
          {(record.city || record.state || record.postalCode) && (
            <div className="mb-0.5 text-[11px] text-gray-600">
              {[record.city, record.state, record.postalCode].filter(Boolean).join(', ')}
            </div>
          )}
          {record.country && (
            <div className="text-[11px] text-gray-500">
              {record.country}
            </div>
          )}
          {record.partOf && (
            <div className="text-[11px] text-blue-600">
              Part of: {record.partOf}
            </div>
          )}
          {!record.address && !record.city && !record.managingOrganization && (
            <div className="text-xs text-gray-400">
              No address info
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
            icon={<FileTextOutlined />} 
            onClick={() => handleLocationClick(record.id, record.name)}
            shape="circle"
            title="View Details"
            type="default"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEditLocation?.(record.originalLocation)}
            shape="circle"
            title="Edit"
            type="default"
          />
          <Button 
            danger 
            icon={<DeleteOutlined />}
            loading={isDeleting}
            onClick={() => handleDeleteLocation(record.id, record.name)}
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
        <Spin size="large" tip="Loading locations...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        <Text>Error loading locations. Please try again.</Text>
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
          placeholder="Search locations..."
          value={localSearchQuery}
        />
      </div>
      
      <Table
        className="text-xs"
        columns={columns}
        dataSource={filteredLocations}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} locations`,
          className: 'text-xs'
        }}
        rowClassName={() => 'location-row-normal'}
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
        .location-row-normal:hover {
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

export default LocationTable;