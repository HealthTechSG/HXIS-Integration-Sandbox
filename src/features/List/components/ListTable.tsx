import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Modal, Space, Spin, Table, Tag, Typography, message } from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';

import { useGetListListQuery, useDeleteListMutation } from '@/services/List';
import { useGetPatientListQuery } from '@/services/Patient/PatientService';

const { Text } = Typography;

interface ListTableProps {
  searchQuery?: string;
  status?: string;
  code?: string;
  patientId?: string;
  onEditList?: (list: any) => void;
}

const ListTable: React.FC<ListTableProps> = ({
  onEditList,
  searchQuery = '',
  status,
  code,
  patientId,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch lists from FHIR API
  const { data: listData, error, isLoading } = useGetListListQuery({
    patient: patientId,
    status: status !== 'all' ? status : undefined,
    code: code !== 'all' ? code : undefined,
    title: searchQuery || undefined,
    page: 0,
    pageSize: 100
  });

  // Fetch patients for name lookup
  const { data: patientsData } = useGetPatientListQuery({
    page: 0,
    pageSize: 100,
  });

  // Delete list mutation
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();

  // Patient lookup function
  const getPatientName = (patientId: string): string => {
    if (!patientsData?.entry) {
      return patientId; // Fallback to ID if no patient data
    }

    const patient = patientsData.entry.find((p: any) => p.id === patientId);
    return patient?.name || patientId; // Fallback to ID if patient not found
  };

  // Transform FHIR data to display format
  const filteredLists = useMemo(() => {
    if (!listData?.entry) {
      return [];
    }

    console.log('listData:', listData);
    console.log('First list entry:', listData.entry[0]);

    // Filter by local search query if provided
    return listData.entry.filter((list) => {
      const searchTerm = localSearchQuery.toLowerCase();
      if (!searchTerm) return true;

      return (
        list.title?.toLowerCase().includes(searchTerm) ||
        list.codeDisplay?.toLowerCase().includes(searchTerm) ||
        list.subject?.toLowerCase().includes(searchTerm)
      );
    });
  }, [listData, localSearchQuery]);

  // Handle delete list
  const handleDeleteList = async (listId: string, listTitle: string) => {
    try {
      await deleteList(listId).unwrap();
      message.success(`List "${listTitle}" deleted successfully!`);
    } catch (error: any) {
      console.error('Failed to delete list:', error);
      message.error(`Failed to delete list "${listTitle}". Please try again.`);
    }
  };

  // Confirm delete modal
  const confirmDelete = (list: any) => {
    Modal.confirm({
      title: `Delete List "${list.title}"?`,
      content: `Are you sure you want to delete this list? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDeleteList(list.id, list.title),
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'current':
        return 'green';
      case 'retired':
        return 'orange';
      case 'entered-in-error':
        return 'red';
      default:
        return 'default';
    }
  };

  // Get mode color
  const getModeColor = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'working':
        return 'blue';
      case 'snapshot':
        return 'purple';
      case 'changes':
        return 'cyan';
      default:
        return 'default';
    }
  };

  // Table columns
  const columns = [
    {
      title: 'List',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (title: string, record: any) => (
        <Space>
          <Avatar
            icon={<UnorderedListOutlined />}
            style={{ backgroundColor: '#1890ff' }}
            size="small"
          />
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.codeDisplay}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      width: '10%',
      render: (mode: string) => (
        <Tag color={getModeColor(mode)}>
          {mode?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Entries',
      dataIndex: 'entries',
      key: 'entries',
      width: '10%',
      render: (entries: any[]) => (
        <Text>{entries?.length || 0}</Text>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: '15%',
      render: (subject: string) => {
        const patientName = getPatientName(subject);
        return (
          <div>
            <Text>{patientName}</Text>
            {patientName !== subject && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  ID: {subject}
                </Text>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: (date: string) => (
        <Text>{date ? moment(date).format('DD/MM/YYYY HH:mm') : '-'}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEditList?.(record)}
            title="Edit List"
            size="small"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record)}
            danger
            title="Delete List"
            size="small"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">Error loading lists. Please try again.</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search lists by title, type, or subject..."
          prefix={<SearchOutlined />}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
        />
      </div>

      {/* Lists Table */}
      <Table
        dataSource={filteredLists}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} lists`,
        }}
        loading={isDeleting}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ListTable;