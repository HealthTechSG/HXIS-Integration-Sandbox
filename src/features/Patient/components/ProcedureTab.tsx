import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ThunderboltOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
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
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

// Import Procedure service
import {
  useGetProcedureListByPatientIdQuery,
  useCreateProcedureMutation,
  useUpdateProcedureMutation,
  useDeleteProcedureMutation,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  OUTCOME_OPTIONS,
  COMMON_PROCEDURE_CODES,
  COMMON_BODY_SITE_CODES,
} from '@/services/Procedure';
import type { Procedure, CreateProcedureRequest } from '@/services/Procedure';

// Import Practitioner and Location services
import { useGetPractitionerListQuery } from '@/services/Practitioner/PractitionerService';
import { useGetLocationListQuery } from '@/services/Location';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface ProcedureTabProps {
  patientId: string;
}

const ProcedureTab: React.FC<ProcedureTabProps> = ({ patientId }) => {
  // State management
  const [form] = Form.useForm();
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // API hooks
  const {
    data: proceduresData,
    error: proceduresError,
    isLoading: isLoadingProcedures,
    refetch,
  } = useGetProcedureListByPatientIdQuery(patientId);

  const [createProcedure, { isLoading: isCreating }] = useCreateProcedureMutation();
  const [updateProcedure, { isLoading: isUpdating }] = useUpdateProcedureMutation();
  const [deleteProcedure, { isLoading: isDeleting }] = useDeleteProcedureMutation();

  // API hooks for practitioners and locations
  const { data: practitionersData, isLoading: isLoadingPractitioners } = useGetPractitionerListQuery({
    page: 0,
    pageSize: 100, // Get more practitioners for dropdown
  });
  const { data: locationsData, isLoading: isLoadingLocations } = useGetLocationListQuery({
    page: 0,
    pageSize: 100, // Get more locations for dropdown
  });

  // Extract procedures data
  const procedures = proceduresData?.entry || [];
  const totalCount = proceduresData?.total || 0;

  // Extract practitioners and locations data
  const practitioners = practitionersData?.entry || [];
  const locations = locationsData?.entry || [];

  // Filter procedures based on search text
  const filteredProcedures = procedures.filter((procedure: Procedure) =>
    procedure.display.toLowerCase().includes(searchText.toLowerCase()) ||
    procedure.code.toLowerCase().includes(searchText.toLowerCase()) ||
    procedure.categoryDisplay.toLowerCase().includes(searchText.toLowerCase())
  );

  // Effect to populate form when editing
  useEffect(() => {
    if (isModalVisible && editingProcedure) {
      // Small delay to ensure form is ready
      setTimeout(() => {
        const formValues = {
          code: editingProcedure.code || '',
          display: editingProcedure.display || '',
          status: editingProcedure.status || '',
          categoryCode: editingProcedure.categoryCode || '',
          system: editingProcedure.system || 'http://snomed.info/sct',
          performedDateTime: editingProcedure.performedDateTime ? dayjs(editingProcedure.performedDateTime) : null,
          performerIds: editingProcedure.performerIds?.[0] || '',
          locationId: editingProcedure.locationId || '',
          bodySiteCode: editingProcedure.bodySiteCode || '',
          bodySiteDisplay: editingProcedure.bodySiteDisplay || '',
          outcomeCode: editingProcedure.outcomeCode || '',
          note: editingProcedure.note || '',
        };

        form.setFieldsValue(formValues);
      }, 150);
    } else if (isModalVisible && !editingProcedure) {
      // Creating new procedure
      form.resetFields();
    }
  }, [isModalVisible, editingProcedure, form]);

  // Form submission handler
  const handleSubmit = async (values: any) => {
    try {
      // Find the category display from the selected category code
      const selectedCategory = CATEGORY_OPTIONS.find(cat => cat.value === values.categoryCode);
      // Find the outcome display from the selected outcome code
      const selectedOutcome = OUTCOME_OPTIONS.find(outcome => outcome.value === values.outcomeCode);

      const formData: CreateProcedureRequest = {
        ...values,
        patientId,
        categoryDisplay: selectedCategory?.label || '',
        outcomeDisplay: selectedOutcome?.label || undefined,
        performedDateTime: values.performedDateTime ? values.performedDateTime.toISOString() : new Date().toISOString(),
        performerIds: values.performerIds ? [values.performerIds] : [],
        system: values.system || 'http://snomed.info/sct',
      };

      if (editingProcedure) {
        await updateProcedure({
          ...formData,
          id: editingProcedure.id,
        } as Procedure).unwrap();
        message.success('Procedure updated successfully');
      } else {
        await createProcedure(formData).unwrap();
        message.success('Procedure added successfully');
      }

      setIsModalVisible(false);
      setEditingProcedure(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Failed to save procedure. Please try again.');
      console.error('Error saving procedure:', error);
    }
  };

  // Delete handler
  const handleDelete = async (procedureId: string) => {
    try {
      await deleteProcedure(procedureId).unwrap();
      message.success('Procedure deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete procedure. Please try again.');
      console.error('Error deleting procedure:', error);
    }
  };

  // Modal handlers
  const showModal = (procedure?: Procedure) => {
    if (procedure) {
      setEditingProcedure(procedure);
    } else {
      setEditingProcedure(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingProcedure(null);
    form.resetFields();
  };

  // Get status tag color
  const getStatusTagColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'preparation': 'orange',
      'in-progress': 'blue',
      'not-done': 'red',
      'on-hold': 'orange',
      'stopped': 'red',
      'completed': 'green',
      'entered-in-error': 'red',
      'unknown': 'gray',
    };
    return statusColorMap[status] || 'gray';
  };

  // Get category tag color
  const getCategoryTagColor = (categoryCode: string) => {
    const categoryColorMap: { [key: string]: string } = {
      '387713003': 'volcano', // Surgical procedure
      '103693007': 'geekblue', // Diagnostic procedure
      '409063005': 'green', // Counseling
      '409073007': 'blue', // Education
      '2464200': 'purple', // Psychiatry procedure
      '46947000': 'cyan', // Chiropractic manipulation
      '410606002': 'magenta', // Social service procedure
    };
    return categoryColorMap[categoryCode] || 'default';
  };

  // Get outcome tag color
  const getOutcomeTagColor = (outcomeCode?: string) => {
    if (!outcomeCode) return 'default';
    const outcomeColorMap: { [key: string]: string } = {
      '385669000': 'green', // Successful
      '385671000': 'red', // Unsuccessful
      '385670004': 'orange', // Partially successful
    };
    return outcomeColorMap[outcomeCode] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Procedure',
      dataIndex: 'display',
      key: 'display',
      width: '25%',
      render: (text: string, record: Procedure) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text style={{ fontSize: '12px' }} type="secondary">
              Code: {record.code} | System: {record.system}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryDisplay',
      key: 'categoryDisplay',
      width: '20%',
      render: (text: string, record: Procedure) => (
        <Tag color={getCategoryTagColor(record.categoryCode)}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date Performed',
      dataIndex: 'performedDateTime',
      key: 'performedDateTime',
      width: '15%',
      render: (date: string) => (
        <Text>{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
      ),
    },
    {
      title: 'Outcome',
      dataIndex: 'outcomeDisplay',
      key: 'outcomeDisplay',
      width: '12%',
      render: (text: string, record: Procedure) => (
        record.outcomeDisplay ? (
          <Tag color={getOutcomeTagColor(record.outcomeCode)}>
            {text}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '16%',
      render: (_: any, record: Procedure) => (
        <Space size="small">
          <Tooltip title="Edit Procedure">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
              type="link"
            />
          </Tooltip>
          <Popconfirm
            cancelText="No"
            description="Are you sure you want to delete this procedure?"
            okText="Yes"
            onConfirm={() => handleDelete(record.id)}
            title="Delete Procedure"
          >
            <Tooltip title="Delete Procedure">
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                size="small"
                type="link"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Loading state
  if (isLoadingProcedures) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <div style={{ marginTop: 16 }}>Loading procedures...</div>
      </div>
    );
  }

  // Error state
  if (proceduresError) {
    return (
      <Alert
        action={
          <Button onClick={refetch} size="small" type="primary">
            Retry
          </Button>
        }
        description="Unable to load procedure data. Please try again later."
        message="Error Loading Procedures"
        showIcon
        type="error"
      />
    );
  }

  return (
    <div>
      {/* Header Section */}
      <Card className="mb-4">
        <Row align="middle" className="mb-4" justify="space-between">
          <Col>
            <Title className="m-0" level={4}>
              <ThunderboltOutlined className="mr-2 text-blue-600" />
              Patient Procedures
            </Title>
            <Text type="secondary">
              Total: {totalCount} procedures | Filtered: {filteredProcedures.length}
            </Text>
          </Col>
          <Col>
            <Button
              icon={<SaveOutlined />}
              onClick={() => showModal()}
              size="large"
              type="primary"
            >
              Add New Procedure
            </Button>
          </Col>
        </Row>

        {/* Search Section */}
        <Row className="mb-4" gutter={16}>
          <Col md={8} sm={12} xs={24}>
            <Input.Search
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search procedures..."
              value={searchText}
            />
          </Col>
        </Row>
      </Card>

      {/* Procedures Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProcedures}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} procedures`,
          }}
          rowKey="id"
          scroll={{ x: 800 }}
          style={{ background: 'white' }}
        />
      </Card>

      {/* Add/Edit Procedure Modal */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={closeModal}
        open={isModalVisible}
        title={editingProcedure ? 'Edit Procedure' : 'Add New Procedure'}
        width={800}
      >
        <Form
          key={editingProcedure?.id || 'new'}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Collapse className="mb-4" defaultActiveKey={['basic', 'details']}>
            {/* Basic Information */}
            <Collapse.Panel key="basic" header="Basic Procedure Information">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Procedure Code"
                    name="code"
                    rules={[{ required: true, message: 'Procedure code is required' }]}
                  >
                    <AutoComplete
                      filterOption={(inputValue, option) =>
                        option?.label.toLowerCase().includes(inputValue.toLowerCase()) ?? false
                      }
                      options={COMMON_PROCEDURE_CODES.map(proc => ({
                        value: proc.code,
                        label: `${proc.code} - ${proc.display}`,
                      }))}
                      placeholder="Select or enter procedure code"
                      onChange={(value) => {
                        // When code changes, auto-update the display name
                        const selectedProcedure = COMMON_PROCEDURE_CODES.find(proc => proc.code === value);
                        if (selectedProcedure) {
                          form.setFieldValue('display', selectedProcedure.display);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Procedure Name"
                    name="display"
                    rules={[{ required: true, message: 'Procedure name is required' }]}
                  >
                    <AutoComplete
                      filterOption={(inputValue, option) =>
                        option?.label.toLowerCase().includes(inputValue.toLowerCase()) ?? false
                      }
                      options={COMMON_PROCEDURE_CODES.map(proc => ({
                        value: proc.display,
                        label: proc.display,
                      }))}
                      placeholder="Select or enter procedure name"
                      onChange={(value) => {
                        // When display name changes, auto-update the code
                        const selectedProcedure = COMMON_PROCEDURE_CODES.find(proc => proc.display === value);
                        if (selectedProcedure) {
                          form.setFieldValue('code', selectedProcedure.code);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Status is required' }]}
                  >
                    <Select placeholder="Select status">
                      {STATUS_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Category"
                    name="categoryCode"
                    rules={[{ required: true, message: 'Category is required' }]}
                  >
                    <Select placeholder="Select category">
                      {CATEGORY_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Date Performed"
                    name="performedDateTime"
                    rules={[{ required: true, message: 'Date performed is required' }]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Select date and time"
                      showTime
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                initialValue="http://snomed.info/sct"
                label="Coding System"
                name="system"
              >
                <Input placeholder="Coding system URL" />
              </Form.Item>
            </Collapse.Panel>

            {/* Additional Details */}
            <Collapse.Panel key="details" header="Additional Details">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <UserOutlined className="mr-1" />
                        Performer
                      </span>
                    }
                    name="performerIds"
                  >
                    <Select
                      placeholder="Select practitioner who performed the procedure"
                      loading={isLoadingPractitioners}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                      }
                    >
                      {practitioners.map(practitioner => (
                        <Select.Option key={practitioner.id} value={practitioner.id}>
                          {practitioner.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <EnvironmentOutlined className="mr-1" />
                        Location
                      </span>
                    }
                    name="locationId"
                  >
                    <Select
                      placeholder="Select location where procedure was performed"
                      loading={isLoadingLocations}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                      }
                    >
                      {locations.map(location => (
                        <Select.Option key={location.id} value={location.id}>
                          {location.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Body Site Code"
                    name="bodySiteCode"
                  >
                    <AutoComplete
                      filterOption={(inputValue, option) =>
                        option?.label.toLowerCase().includes(inputValue.toLowerCase()) ?? false
                      }
                      options={COMMON_BODY_SITE_CODES.map(site => ({
                        value: site.code,
                        label: `${site.code} - ${site.display}`,
                      }))}
                      placeholder="Select body site"
                      onChange={(value) => {
                        // When body site code changes, auto-update the display name
                        const selectedSite = COMMON_BODY_SITE_CODES.find(site => site.code === value);
                        if (selectedSite) {
                          form.setFieldValue('bodySiteDisplay', selectedSite.display);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Body Site Name"
                    name="bodySiteDisplay"
                  >
                    <AutoComplete
                      filterOption={(inputValue, option) =>
                        option?.label.toLowerCase().includes(inputValue.toLowerCase()) ?? false
                      }
                      options={COMMON_BODY_SITE_CODES.map(site => ({
                        value: site.display,
                        label: site.display,
                      }))}
                      placeholder="Enter body site name"
                      onChange={(value) => {
                        // When body site display name changes, auto-update the code
                        const selectedSite = COMMON_BODY_SITE_CODES.find(site => site.display === value);
                        if (selectedSite) {
                          form.setFieldValue('bodySiteCode', selectedSite.code);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Outcome"
                    name="outcomeCode"
                  >
                    <Select placeholder="Select outcome">
                      {OUTCOME_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Clinical Notes"
                name="note"
              >
                <TextArea
                  placeholder="Enter any additional clinical notes about the procedure..."
                  rows={3}
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          {/* Form Actions */}
          <Form.Item className="mb-0 text-center">
            <Space>
              <Button onClick={closeModal}>
                Cancel
              </Button>
              <Button
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isCreating || isUpdating}
                type="primary"
              >
                {editingProcedure ? 'Update Procedure' : 'Add Procedure'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProcedureTab;