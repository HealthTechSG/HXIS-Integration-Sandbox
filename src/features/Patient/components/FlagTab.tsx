import React, { useState } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Spin,
  Alert,
  Form,
  Button,
  Space,
  message,
  Collapse,
  Input,
  Select,
  DatePicker,
  Modal,
  Popconfirm,
  Tooltip,
  AutoComplete,
} from 'antd';
import {
  FlagOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

// Import Flag service
import {
  useGetFlagListByPatientIdQuery,
  useCreateFlagMutation,
  useUpdateFlagMutation,
  useDeleteFlagMutation,
  FLAG_STATUS_OPTIONS,
  FLAG_CATEGORY_OPTIONS,
  COMMON_FLAG_CODES,
} from '@/services/Flag';
import type { Flag, CreateFlagRequest } from '@/services/Flag';

// Import Practitioner service for author selection
import { useGetPractitionerListQuery } from '@/services/Practitioner/PractitionerService';

interface FlagTabProps {
  patientId?: string;
}

interface FlagFormValues {
  status: 'active' | 'inactive' | 'entered-in-error';
  categoryCode: string;
  categoryDisplay: string;
  categorySystem: string;
  code: string;
  display: string;
  system: string;
  periodStart: any;
  periodEnd?: any;
  author: string;
}

const FlagTab: React.FC<FlagTabProps> = ({ patientId }) => {
  // State for edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFlag, setEditingFlag] = useState<Flag | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch flag data
  const { data: flagsData, error, isLoading, refetch } = useGetFlagListByPatientIdQuery(
    patientId || '',
    {
      skip: !patientId,
    }
  );

  // Fetch practitioners for author selection
  const { data: practitionersData, isLoading: isLoadingPractitioners } = useGetPractitionerListQuery({
    page: 0,
    pageSize: 100,
  });

  // Mutations
  const [createFlag, { isLoading: isCreating }] = useCreateFlagMutation();
  const [updateFlag, { isLoading: isUpdating }] = useUpdateFlagMutation();
  const [deleteFlag, { isLoading: isDeleting }] = useDeleteFlagMutation();

  // Extract flags array from the response
  const flags: Flag[] = flagsData?.entry || [];

  // Handle create flag
  const handleCreateFlag = async (values: FlagFormValues) => {
    if (!patientId) {
      message.error('Patient ID is required');
      return;
    }

    try {
      const flagData: CreateFlagRequest = {
        status: values.status,
        categoryCode: values.categoryCode,
        categoryDisplay: values.categoryDisplay,
        categorySystem: values.categorySystem || 'http://terminology.hl7.org/CodeSystem/flag-category',
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        subject: patientId,
        periodStart: values.periodStart ? dayjs(values.periodStart).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        periodEnd: values.periodEnd ? dayjs(values.periodEnd).format('YYYY-MM-DD') : undefined,
        author: values.author,
      };

      await createFlag(flagData).unwrap();
      message.success('Flag created successfully');
      createForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Error creating flag:', error);
      message.error('Failed to create flag. Please try again.');
    }
  };

  // Handle edit flag
  const handleEditFlag = (flag: Flag) => {
    setEditingFlag(flag);
    editForm.setFieldsValue({
      status: flag.status,
      categoryCode: flag.categoryCode,
      categoryDisplay: flag.categoryDisplay,
      categorySystem: flag.categorySystem,
      code: flag.code,
      display: flag.display,
      system: flag.system,
      periodStart: flag.periodStart ? dayjs(flag.periodStart.toString()) : null,
      periodEnd: flag.periodEnd ? dayjs(flag.periodEnd.toString()) : null,
      author: flag.author,
    });
    setIsEditModalVisible(true);
  };

  // Handle update flag
  const handleUpdateFlag = async (values: FlagFormValues) => {
    if (!editingFlag) return;

    try {
      const updatedFlag: Flag = {
        ...editingFlag,
        status: values.status,
        categoryCode: values.categoryCode,
        categoryDisplay: values.categoryDisplay,
        categorySystem: values.categorySystem || 'http://terminology.hl7.org/CodeSystem/flag-category',
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        periodStart: values.periodStart ? dayjs(values.periodStart).format('YYYY-MM-DD') : editingFlag.periodStart,
        periodEnd: values.periodEnd ? dayjs(values.periodEnd).format('YYYY-MM-DD') : undefined,
        author: values.author,
      };

      await updateFlag(updatedFlag).unwrap();
      message.success('Flag updated successfully');
      setIsEditModalVisible(false);
      setEditingFlag(null);
      refetch();
    } catch (error) {
      console.error('Error updating flag:', error);
      message.error('Failed to update flag. Please try again.');
    }
  };

  // Handle delete flag
  const handleDeleteFlag = async (flagId: string) => {
    try {
      await deleteFlag(flagId).unwrap();
      message.success('Flag deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting flag:', error);
      message.error('Failed to delete flag. Please try again.');
    }
  };

  // Auto-complete options for flag codes
  const flagCodeOptions = COMMON_FLAG_CODES.map(flag => ({
    value: flag.code,
    label: `${flag.display} (${flag.code})`,
    flag,
  }));

  const filteredOptions = flagCodeOptions.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle flag selection from autocomplete
  const handleFlagSelect = (_: string, option: any, form: any) => {
    if (option?.flag) {
      form.setFieldsValue({
        code: option.flag.code,
        display: option.flag.display,
        system: option.flag.system,
      });
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryCode: string, form: any) => {
    const category = FLAG_CATEGORY_OPTIONS.find(cat => cat.value === categoryCode);
    if (category) {
      form.setFieldsValue({
        categoryCode: category.value,
        categoryDisplay: category.label,
        categorySystem: category.system,
      });
    }
  };

  // Get flag priority color based on category
  const getFlagColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'safety': return '#ff4d4f';
      case 'clinical': return '#fa8c16';
      case 'drug': return '#eb2f96';
      case 'admin': return '#1890ff';
      case 'behavioral': return '#722ed1';
      default: return '#52c41a';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'red';
      case 'inactive': return 'default';
      case 'entered-in-error': return 'orange';
      default: return 'default';
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="ml-3">Loading flag information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading flags"
        description="Unable to fetch patient flag information. Please try again later."
        type="error"
        showIcon
        className="m-5"
      />
    );
  }

  const hasActiveFlags = flags && flags.some(flag => flag.status === 'active');
  const activeFlags = flags.filter(flag => flag.status === 'active');

  return (
    <div className="p-5 bg-gray-100">
      {/* === Create New Flag Form === */}
      <Collapse
        className="bg-[#fff7e6] mb-5"
        items={[
          {
            key: 'create-flag',
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FlagOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Create New Patient Flag</Text>
              </div>
            ),
            children: (
              <Form
                form={createForm}
                layout="vertical"
                onFinish={handleCreateFlag}
                style={{ maxWidth: '1000px' }}
                initialValues={{
                  status: 'active',
                  categoryCode: 'clinical',
                  categoryDisplay: 'Clinical',
                  categorySystem: 'http://terminology.hl7.org/CodeSystem/flag-category',
                  periodStart: dayjs(),
                  system: 'http://snomed.info/sct',
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="flagSearch"
                      label="Search Common Flags"
                      help="Start typing to search for common clinical flags, or manually enter details below"
                    >
                      <AutoComplete
                        options={filteredOptions}
                        onSelect={(value, option) => handleFlagSelect(value, option, createForm)}
                        onSearch={setSearchValue}
                        placeholder="Search for flags (e.g., decreased hair growth, anemia, hypertension...)"
                        filterOption={false}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="periodStart"
                      label="Flag Start Date"
                      rules={[{ required: true, message: 'Please select start date' }]}
                    >
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="display"
                      label="Flag Description"
                      rules={[{ required: true, message: 'Please enter flag description' }]}
                    >
                      <Input placeholder="e.g., Decreased hair growth" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="code"
                      label="SNOMED CT Code"
                      rules={[{ required: true, message: 'Please enter SNOMED code' }]}
                    >
                      <Input placeholder="e.g., 134006" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="system"
                      label="Coding System"
                      rules={[{ required: true, message: 'Please enter coding system' }]}
                    >
                      <Input placeholder="http://snomed.info/sct" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="categoryCode"
                      label="Flag Category"
                      rules={[{ required: true, message: 'Please select category' }]}
                    >
                      <Select
                        placeholder="Select category"
                        onChange={(value) => handleCategoryChange(value, createForm)}
                      >
                        {FLAG_CATEGORY_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true, message: 'Please select status' }]}
                    >
                      <Select>
                        {FLAG_STATUS_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="author"
                      label="Author (Practitioner)"
                      rules={[{ required: true, message: 'Please select author' }]}
                    >
                      <Select
                        placeholder="Select practitioner"
                        loading={isLoadingPractitioners}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {practitionersData?.entry?.map((practitioner: any) => (
                          <Select.Option key={practitioner.id} value={practitioner.id}>
                            {practitioner.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="periodEnd"
                      label="Flag End Date (Optional)"
                      help="Leave empty if flag should remain active indefinitely"
                    >
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: '24px' }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={isCreating}
                      disabled={!patientId}
                      style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                    >
                      Create Flag
                    </Button>
                    <Button
                      onClick={() => createForm.resetFields()}
                      disabled={isCreating}
                    >
                      Clear Form
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />

      {/* === Active Flags Alert Banner === */}
      {hasActiveFlags && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WarningOutlined />
              <Text strong>PATIENT HAS ACTIVE FLAGS</Text>
            </div>
          }
          description={`This patient has ${activeFlags.length} active clinical flag(s). Review carefully before providing care or treatment.`}
          type="warning"
          showIcon
          className="mb-5"
        />
      )}

      {/* === Active Flags Overview Cards === */}
      {hasActiveFlags && (
        <div className="mb-5">
          <Title level={5} className="mb-3 text-orange-600">
            <FlagOutlined className="mr-2" />
            Active Clinical Flags
          </Title>
          <Row gutter={[16, 16]}>
            {activeFlags
              .slice(0, 4) // Show only first 4 for overview
              .map((flag) => (
                <Col key={flag.id} span={6}>
                  <Card
                    size="small"
                    className="flag-card"
                    style={{
                      border: `2px solid ${getFlagColor(flag.categoryCode)}`,
                      borderRadius: '8px',
                      backgroundColor: '#fff7e6'
                    }}
                  >
                    <div className="text-center">
                      <ExclamationCircleOutlined
                        style={{
                          fontSize: '20px',
                          color: getFlagColor(flag.categoryCode),
                          marginBottom: '4px'
                        }}
                      />
                      <div className="font-bold text-sm text-gray-800 mb-1">
                        {flag.display}
                      </div>
                      <Tag
                        color={getFlagColor(flag.categoryCode)}
                        className="mb-2 text-xs"
                      >
                        {flag.categoryDisplay?.toUpperCase()}
                      </Tag>
                      <div className="text-xs text-gray-600">
                        Code: {flag.code}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Started: {dayjs(flag.periodStart.toString()).format('MM/DD/YY')}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      )}

      {/* === Flags History Table === */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FlagOutlined className="text-orange-500" />
            <Text strong>Clinical Flags History</Text>
          </div>
        }
        size="small"
        styles={{
          header: { backgroundColor: '#fff7e6', padding: '12px 16px' },
          body: { padding: '16px' }
        }}
      >
        {!flags.length ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FlagOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>No Clinical Flags</div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              No clinical flags have been documented for this patient. Use the form above to document any relevant clinical flags.
            </div>
          </div>
        ) : (
          <Table
            dataSource={flags}
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} flags`,
            }}
            scroll={{ x: 'max-content' }}
            rowKey="id"
            columns={[
              {
                title: 'Flag Description',
                dataIndex: 'display',
                key: 'display',
                ellipsis: true,
                render: (text: string, record: Flag) => (
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-gray-800 truncate">
                      {text}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {record.code}
                    </div>
                  </div>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={getStatusColor(status)} className="text-xs">
                    {status?.toUpperCase()}
                  </Tag>
                ),
              },
              {
                title: 'Category',
                dataIndex: 'categoryDisplay',
                key: 'categoryDisplay',
                render: (category: string, record: Flag) => (
                  <Tag
                    color={getFlagColor(record.categoryCode)}
                    className="text-xs"
                  >
                    {category?.toUpperCase()}
                  </Tag>
                ),
              },
              {
                title: 'Start Date',
                dataIndex: 'periodStart',
                key: 'periodStart',
                render: (date: string) => (
                  <div className="text-xs whitespace-nowrap">
                    {dayjs(date.toString()).format('MM/DD/YY')}
                  </div>
                ),
              },
              {
                title: 'End Date',
                dataIndex: 'periodEnd',
                key: 'periodEnd',
                render: (date?: string) => (
                  <div className="text-xs whitespace-nowrap">
                    {date ? dayjs(date.toString()).format('MM/DD/YY') : '—'}
                  </div>
                ),
              },
              {
                title: 'Author',
                dataIndex: 'author',
                key: 'author',
                render: (authorId: string) => {
                  const practitioner = practitionersData?.entry?.find((p: any) => p.id === authorId);
                  return (
                    <div className="text-xs">
                      {practitioner?.name || authorId}
                    </div>
                  );
                },
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record: Flag) => (
                  <Space size="small">
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditFlag(record)}
                        disabled={isUpdating}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete flag?"
                      onConfirm={() => handleDeleteFlag(record.id)}
                      okButtonProps={{ danger: true, size: 'small' }}
                      cancelButtonProps={{ size: 'small' }}
                    >
                      <Tooltip title="Delete">
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          disabled={isDeleting}
                        />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            rowClassName={(record) => record.status === 'active' ? 'flag-row-active' : 'flag-row-white'}
          />
        )}
      </Card>

      {/* === Edit Modal === */}
      <Modal
        title="Edit Clinical Flag"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingFlag(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateFlag}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="display"
                label="Flag Description"
                rules={[{ required: true, message: 'Please enter flag description' }]}
              >
                <Input placeholder="e.g., Decreased hair growth" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="periodStart"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name="code"
                label="SNOMED CT Code"
                rules={[{ required: true, message: 'Please enter SNOMED code' }]}
              >
                <Input placeholder="e.g., 134006" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="system"
                label="Coding System"
                rules={[{ required: true, message: 'Please enter coding system' }]}
              >
                <Input placeholder="http://snomed.info/sct" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name="categoryCode"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select
                  placeholder="Select category"
                  onChange={(value) => handleCategoryChange(value, editForm)}
                >
                  {FLAG_CATEGORY_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  {FLAG_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="author"
                label="Author"
                rules={[{ required: true, message: 'Please select author' }]}
              >
                <Select
                  placeholder="Select practitioner"
                  loading={isLoadingPractitioners}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {practitionersData?.entry?.map((practitioner: any) => (
                    <Select.Option key={practitioner.id} value={practitioner.id}>
                      {practitioner.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="periodEnd"
                label="End Date (Optional)"
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsEditModalVisible(false);
                  setEditingFlag(null);
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isUpdating}
              >
                Update Flag
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .flag-row-white {
          background-color: #ffffff !important;
        }
        .flag-row-white:hover {
          background-color: #fff7e6 !important;
        }
        .flag-row-active {
          background-color: #fff2e8 !important;
        }
        .flag-row-active:hover {
          background-color: #ffe7d3 !important;
        }
        .flag-card {
          box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2);
        }
      `}</style>
    </div>
  );
};

export default FlagTab;