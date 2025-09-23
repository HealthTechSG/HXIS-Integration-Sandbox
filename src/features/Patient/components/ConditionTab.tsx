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
  MedicineBoxOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

// Import Condition service
import {
  useGetConditionListByPatientIdQuery,
  useCreateConditionMutation,
  useUpdateConditionMutation,
  useDeleteConditionMutation,
  CLINICAL_STATUS_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  COMMON_CONDITION_CODES,
  COMMON_BODY_SITE_CODES,
} from '@/services/Condition';
import type { Condition, CreateConditionRequest } from '@/services/Condition';

interface ConditionTabProps {
  patientId?: string;
}

interface ConditionFormValues {
  clinicalStatus: string;
  verificationStatus: string;
  category: string;
  severity: string;
  code: string;
  display: string;
  system: string;
  bodySiteCode?: string;
  bodySiteDisplay?: string;
  bodySiteSystem?: string;
  recordedDate: any;
}

const ConditionTab: React.FC<ConditionTabProps> = ({ patientId }) => {
  // State for edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [bodySiteSearchValue, setBodySiteSearchValue] = useState('');

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch condition data
  const { data: conditionsData, error, isLoading, refetch } = useGetConditionListByPatientIdQuery(
    patientId || '',
    {
      skip: !patientId,
    }
  );

  // Mutations
  const [createCondition, { isLoading: isCreating }] = useCreateConditionMutation();
  const [updateCondition, { isLoading: isUpdating }] = useUpdateConditionMutation();
  const [deleteCondition, { isLoading: isDeleting }] = useDeleteConditionMutation();

  // Extract conditions array from the response
  const conditions: Condition[] = conditionsData?.entry || [];

  // Handle create condition
  const handleCreateCondition = async (values: ConditionFormValues) => {
    if (!patientId) {
      message.error('Patient ID is required');
      return;
    }

    try {
      const conditionData: CreateConditionRequest = {
        patientId,
        clinicalStatus: values.clinicalStatus,
        verificationStatus: values.verificationStatus,
        category: values.category,
        severity: values.severity,
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        bodySiteCode: values.bodySiteCode,
        bodySiteDisplay: values.bodySiteDisplay,
        bodySiteSystem: values.bodySiteSystem || 'http://snomed.info/sct',
        recordedDate: values.recordedDate ? dayjs(values.recordedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      };

      await createCondition(conditionData).unwrap();
      message.success('Condition created successfully');
      createForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Error creating condition:', error);
      message.error('Failed to create condition. Please try again.');
    }
  };

  // Handle edit condition
  const handleEditCondition = (condition: Condition) => {
    setEditingCondition(condition);
    editForm.setFieldsValue({
      clinicalStatus: condition.clinicalStatus,
      verificationStatus: condition.verificationStatus,
      category: condition.category,
      severity: condition.severity,
      code: condition.code,
      display: condition.display,
      system: condition.system,
      bodySiteCode: condition.bodySiteCode,
      bodySiteDisplay: condition.bodySiteDisplay,
      bodySiteSystem: condition.bodySiteSystem,
      recordedDate: condition.recordedDate ? dayjs(condition.recordedDate.toString()) : null,
    });
    setIsEditModalVisible(true);
  };

  // Handle update condition
  const handleUpdateCondition = async (values: ConditionFormValues) => {
    if (!editingCondition) return;

    try {
      const updatedCondition: Condition = {
        ...editingCondition,
        clinicalStatus: values.clinicalStatus,
        verificationStatus: values.verificationStatus,
        category: values.category,
        severity: values.severity,
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        bodySiteCode: values.bodySiteCode,
        bodySiteDisplay: values.bodySiteDisplay,
        bodySiteSystem: values.bodySiteSystem || 'http://snomed.info/sct',
        recordedDate: values.recordedDate ? dayjs(values.recordedDate).format('YYYY-MM-DD') : editingCondition.recordedDate,
      };

      await updateCondition(updatedCondition).unwrap();
      message.success('Condition updated successfully');
      setIsEditModalVisible(false);
      setEditingCondition(null);
      refetch();
    } catch (error) {
      console.error('Error updating condition:', error);
      message.error('Failed to update condition. Please try again.');
    }
  };

  // Handle delete condition
  const handleDeleteCondition = async (conditionId: string) => {
    try {
      await deleteCondition(conditionId).unwrap();
      message.success('Condition deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting condition:', error);
      message.error('Failed to delete condition. Please try again.');
    }
  };

  // Auto-complete options for condition codes
  const conditionCodeOptions = COMMON_CONDITION_CODES.map(condition => ({
    value: condition.code,
    label: `${condition.display} (${condition.code})`,
    condition,
  }));

  const filteredConditionOptions = conditionCodeOptions.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Auto-complete options for body site codes
  const bodySiteOptions = COMMON_BODY_SITE_CODES.map(bodySite => ({
    value: bodySite.code,
    label: `${bodySite.display} (${bodySite.code})`,
    bodySite,
  }));

  const filteredBodySiteOptions = bodySiteOptions.filter(option =>
    option.label.toLowerCase().includes(bodySiteSearchValue.toLowerCase())
  );

  // Handle condition selection from autocomplete
  const handleConditionSelect = (_: string, option: any, form: any) => {
    if (option?.condition) {
      form.setFieldsValue({
        code: option.condition.code,
        display: option.condition.display,
        system: option.condition.system,
      });
    }
  };

  // Handle body site selection from autocomplete
  const handleBodySiteSelect = (_: string, option: any, form: any) => {
    if (option?.bodySite) {
      form.setFieldsValue({
        bodySiteCode: option.bodySite.code,
        bodySiteDisplay: option.bodySite.display,
        bodySiteSystem: option.bodySite.system,
      });
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '24484000': return 'red';
      case '6736007': return 'gold';
      case '255604002': return 'green';
      default: return 'default';
    }
  };


  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="ml-3">Loading condition information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading conditions"
        description="Unable to fetch patient condition information. Please try again later."
        type="error"
        showIcon
        className="m-5"
      />
    );
  }

  const hasConditions = conditions && conditions.length > 0;

  return (
    <div className="p-5 bg-gray-100">
      {/* === Create New Condition Form === */}
      <Collapse
        className="bg-blue-50 mb-5"
        items={[
          {
            key: 'create-condition',
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MedicineBoxOutlined style={{ color: '#1890ff' }} />
                <Text strong>Document New Medical Condition</Text>
              </div>
            ),
            children: (
              <Form
                form={createForm}
                layout="vertical"
                onFinish={handleCreateCondition}
                style={{ maxWidth: '1200px' }}
                initialValues={{
                  clinicalStatus: 'active',
                  verificationStatus: 'confirmed',
                  category: 'encounter-diagnosis',
                  severity: '255604002',
                  recordedDate: dayjs(),
                  system: 'http://snomed.info/sct',
                  bodySiteSystem: 'http://snomed.info/sct',
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="conditionSearch"
                      label="Search Common Conditions"
                      help="Start typing to search for common medical conditions"
                    >
                      <AutoComplete
                        options={filteredConditionOptions}
                        onSelect={(value, option) => handleConditionSelect(value, option, createForm)}
                        onSearch={setSearchValue}
                        placeholder="Search conditions (e.g., diabetes, hypertension, asthma...)"
                        filterOption={false}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="recordedDate"
                      label="Date Recorded"
                      rules={[{ required: true, message: 'Please select recorded date' }]}
                    >
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="display"
                      label="Condition Name"
                      rules={[{ required: true, message: 'Please enter condition name' }]}
                    >
                      <Input placeholder="e.g., Type 2 Diabetes Mellitus" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="code"
                      label="SNOMED CT Code"
                      rules={[{ required: true, message: 'Please enter SNOMED code' }]}
                    >
                      <Input placeholder="e.g., 73211009" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
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
                  <Col span={6}>
                    <Form.Item
                      name="clinicalStatus"
                      label="Clinical Status"
                      rules={[{ required: true, message: 'Please select clinical status' }]}
                    >
                      <Select>
                        {CLINICAL_STATUS_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="verificationStatus"
                      label="Verification Status"
                      rules={[{ required: true, message: 'Please select verification status' }]}
                    >
                      <Select>
                        {VERIFICATION_STATUS_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: 'Please select category' }]}
                    >
                      <Select>
                        {CATEGORY_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="severity"
                      label="Severity"
                      rules={[{ required: true, message: 'Please select severity' }]}
                    >
                      <Select>
                        {SEVERITY_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="bodySiteSearch"
                      label="Body Site (Optional)"
                      help="Search for anatomical location"
                    >
                      <AutoComplete
                        options={filteredBodySiteOptions}
                        onSelect={(value, option) => handleBodySiteSelect(value, option, createForm)}
                        onSearch={setBodySiteSearchValue}
                        placeholder="Search body sites (e.g., heart, lung, brain...)"
                        filterOption={false}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="bodySiteDisplay"
                      label="Body Site Name"
                    >
                      <Input placeholder="e.g., Heart structure" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="bodySiteCode"
                      label="Body Site Code"
                    >
                      <Input placeholder="e.g., 80891009" />
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
                    >
                      Document Condition
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

      {/* === Active Conditions Alert Banner === */}
      {hasConditions && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExclamationCircleOutlined />
              <Text strong>PATIENT HAS DOCUMENTED MEDICAL CONDITIONS</Text>
            </div>
          }
          description={`This patient has ${conditions.length} documented medical condition(s). Review carefully for treatment planning and medication considerations.`}
          type="info"
          showIcon
          className="mb-5"
          style={{
            backgroundColor: '#e6f7ff',
            border: '2px solid #1890ff',
            borderRadius: '8px'
          }}
        />
      )}

      {/* === Active Conditions Overview Cards === */}
      {hasConditions && (
        <div className="mb-5">
          <Title level={5} className="mb-3 text-blue-600">
            <HeartOutlined className="mr-2" />
            Active Medical Conditions
          </Title>
          <Row gutter={[16, 16]}>
            {conditions
              .filter(condition => condition.clinicalStatus === 'active')
              .slice(0, 4) // Show only first 4 for overview
              .map((condition) => (
                <Col key={condition.id} span={6}>
                  <Card
                    size="small"
                    className="condition-card"
                    style={{
                      border: `2px solid ${condition.severity === '24484000' ? '#ff4d4f' : '#1890ff'}`,
                      borderRadius: '8px',
                      backgroundColor: condition.severity === '24484000' ? '#fff2f0' : '#f0f8ff'
                    }}
                  >
                    <div className="text-center">
                      <MedicineBoxOutlined
                        style={{
                          fontSize: '20px',
                          color: condition.severity === '24484000' ? '#ff4d4f' : '#1890ff',
                          marginBottom: '4px'
                        }}
                      />
                      <div className="font-bold text-sm text-gray-800 mb-1">
                        {condition.display}
                      </div>
                      <Tag
                        color={getSeverityColor(condition.severity)}
                        className="mb-2 text-xs"
                      >
                        {SEVERITY_OPTIONS.find(s => s.value === condition.severity)?.label || 'Unknown'}
                      </Tag>
                      <div className="text-xs text-gray-600">
                        {CATEGORY_OPTIONS.find(c => c.value === condition.category)?.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Recorded: {dayjs(condition.recordedDate.toString()).format('MM/DD/YY')}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      )}

      {/* === Conditions History Table === */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-blue-500" />
            <Text strong>Medical Conditions History</Text>
            <Tag color="blue">{conditions.length} Total</Tag>
          </div>
        }
        size="small"
        styles={{
          header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
          body: { padding: '16px' }
        }}
      >
        {!hasConditions ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <MedicineBoxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>No Medical Conditions</div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              No medical conditions have been documented for this patient. Use the form above to document any medical conditions.
            </div>
          </div>
        ) : (
          <Table
            dataSource={conditions}
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} conditions`,
            }}
            scroll={{ x: 'max-content' }}
            rowKey="id"
            columns={[
              {
                title: 'Medical Condition',
                dataIndex: 'display',
                key: 'display',
                ellipsis: true,
                render: (text: string, record: Condition) => (
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
                dataIndex: 'clinicalStatus',
                key: 'clinicalStatus',
                render: (status: string) => (
                  <span className="text-xs whitespace-nowrap">
                    {status?.charAt(0).toUpperCase() + status?.slice(1) || ''}
                  </span>
                ),
              },
              {
                title: 'Verification',
                dataIndex: 'verificationStatus',
                key: 'verificationStatus',
                render: (status: string) => (
                  <span className="text-xs whitespace-nowrap">
                    {status?.charAt(0).toUpperCase() + status?.slice(1) || ''}
                  </span>
                ),
              },
              {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                render: (category: string) => (
                  <Tag color="blue" className="text-xs">
                    {CATEGORY_OPTIONS.find(c => c.value === category)?.label || category}
                  </Tag>
                ),
              },
              {
                title: 'Severity',
                dataIndex: 'severity',
                key: 'severity',
                render: (severity: string) => (
                  <Tag color={getSeverityColor(severity)} className="text-xs">
                    {SEVERITY_OPTIONS.find(s => s.value === severity)?.label || 'Unknown'}
                  </Tag>
                ),
              },
              {
                title: 'Body Site',
                dataIndex: 'bodySiteDisplay',
                key: 'bodySiteDisplay',
                render: (bodySite: string) => (
                  <span className="text-xs">
                    {bodySite || '—'}
                  </span>
                ),
              },
              {
                title: 'Date',
                dataIndex: 'recordedDate',
                key: 'recordedDate',
                render: (date: string) => (
                  <div className="text-xs whitespace-nowrap">
                    {dayjs(date.toString()).format('MM/DD/YY')}
                  </div>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record: Condition) => (
                  <Space size="small">
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditCondition(record)}
                        disabled={isUpdating}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete condition?"
                      onConfirm={() => handleDeleteCondition(record.id)}
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
            rowClassName={() => 'condition-row-white'}
          />
        )}
      </Card>

      {/* === Edit Modal === */}
      <Modal
        title="Edit Medical Condition"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingCondition(null);
        }}
        footer={null}
        width={1000}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateCondition}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="display"
                label="Condition Name"
                rules={[{ required: true, message: 'Please enter condition name' }]}
              >
                <Input placeholder="e.g., Type 2 Diabetes Mellitus" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="recordedDate"
                label="Date Recorded"
                rules={[{ required: true, message: 'Please select recorded date' }]}
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
                <Input placeholder="e.g., 73211009" />
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
            <Col span={6}>
              <Form.Item
                name="clinicalStatus"
                label="Clinical Status"
                rules={[{ required: true, message: 'Please select clinical status' }]}
              >
                <Select>
                  {CLINICAL_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="verificationStatus"
                label="Verification Status"
                rules={[{ required: true, message: 'Please select verification status' }]}
              >
                <Select>
                  {VERIFICATION_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select>
                  {CATEGORY_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="severity"
                label="Severity"
                rules={[{ required: true, message: 'Please select severity' }]}
              >
                <Select>
                  {SEVERITY_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name="bodySiteDisplay"
                label="Body Site Name"
              >
                <Input placeholder="e.g., Heart structure" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bodySiteCode"
                label="Body Site Code"
              >
                <Input placeholder="e.g., 80891009" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bodySiteSystem"
                label="Body Site System"
              >
                <Input placeholder="http://snomed.info/sct" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsEditModalVisible(false);
                  setEditingCondition(null);
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
                Update Condition
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .condition-row-white {
          background-color: #ffffff !important;
        }
        .condition-row-white:hover {
          background-color: #f0f8ff !important;
        }
        .condition-card {
          transition: all 0.2s ease;
        }
        .condition-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ConditionTab;