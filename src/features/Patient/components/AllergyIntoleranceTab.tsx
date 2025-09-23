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
  AlertOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

// Import AllergyIntolerance service
import {
  useGetAllergyIntoleranceListByPatientIdQuery,
  useCreateAllergyIntoleranceMutation,
  useUpdateAllergyIntoleranceMutation,
  useDeleteAllergyIntoleranceMutation,
  CLINICAL_STATUS_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  CRITICALITY_OPTIONS,
  COMMON_ALLERGY_CODES,
} from '@/services/AllergyIntolerance';
import type { AllergyIntolerance, CreateAllergyIntoleranceRequest } from '@/services/AllergyIntolerance';

interface AllergyIntoleranceTabProps {
  patientId?: string;
}

interface AllergyFormValues {
  clinicalStatus: string;
  verificationStatus: string;
  type: string;
  category: string[];
  criticality: string;
  code: string;
  display: string;
  system: string;
  recordedDate: any;
  note: string;
}

const AllergyIntoleranceTab: React.FC<AllergyIntoleranceTabProps> = ({ patientId }) => {
  // State for edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<AllergyIntolerance | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch allergy intolerance data
  const { data: allergiesData, error, isLoading, refetch } = useGetAllergyIntoleranceListByPatientIdQuery(
    patientId || '',
    {
      skip: !patientId,
    }
  );

  // Mutations
  const [createAllergy, { isLoading: isCreating }] = useCreateAllergyIntoleranceMutation();
  const [updateAllergy, { isLoading: isUpdating }] = useUpdateAllergyIntoleranceMutation();
  const [deleteAllergy, { isLoading: isDeleting }] = useDeleteAllergyIntoleranceMutation();

  // Extract allergies array from the response
  const allergies: AllergyIntolerance[] = allergiesData?.entry || [];

  // Handle create allergy
  const handleCreateAllergy = async (values: AllergyFormValues) => {
    if (!patientId) {
      message.error('Patient ID is required');
      return;
    }

    try {
      const allergyData: CreateAllergyIntoleranceRequest = {
        patientId,
        clinicalStatus: values.clinicalStatus,
        verificationStatus: values.verificationStatus,
        type: values.type,
        category: values.category,
        criticality: values.criticality,
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        recordedDate: values.recordedDate ? dayjs(values.recordedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        note: values.note || '',
      };

      await createAllergy(allergyData).unwrap();
      message.success('Allergy intolerance created successfully');
      createForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Error creating allergy:', error);
      message.error('Failed to create allergy intolerance. Please try again.');
    }
  };

  // Handle edit allergy
  const handleEditAllergy = (allergy: AllergyIntolerance) => {
    setEditingAllergy(allergy);
    editForm.setFieldsValue({
      clinicalStatus: allergy.clinicalStatus,
      verificationStatus: allergy.verificationStatus,
      type: allergy.type,
      category: allergy.category,
      criticality: allergy.criticality,
      code: allergy.code,
      display: allergy.display,
      system: allergy.system,
      recordedDate: allergy.recordedDate ? dayjs(allergy.recordedDate.toString()) : null,
      note: allergy.note,
    });
    setIsEditModalVisible(true);
  };

  // Handle update allergy
  const handleUpdateAllergy = async (values: AllergyFormValues) => {
    if (!editingAllergy) return;

    try {
      const updatedAllergy: AllergyIntolerance = {
        ...editingAllergy,
        clinicalStatus: values.clinicalStatus,
        verificationStatus: values.verificationStatus,
        type: values.type,
        category: values.category,
        criticality: values.criticality,
        code: values.code,
        display: values.display,
        system: values.system || 'http://snomed.info/sct',
        recordedDate: values.recordedDate ? dayjs(values.recordedDate).format('YYYY-MM-DD') : editingAllergy.recordedDate,
        note: values.note || '',
      };

      await updateAllergy(updatedAllergy).unwrap();
      message.success('Allergy intolerance updated successfully');
      setIsEditModalVisible(false);
      setEditingAllergy(null);
      refetch();
    } catch (error) {
      console.error('Error updating allergy:', error);
      message.error('Failed to update allergy intolerance. Please try again.');
    }
  };

  // Handle delete allergy
  const handleDeleteAllergy = async (allergyId: string) => {
    try {
      await deleteAllergy(allergyId).unwrap();
      message.success('Allergy intolerance deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting allergy:', error);
      message.error('Failed to delete allergy intolerance. Please try again.');
    }
  };

  // Auto-complete options for allergy codes
  const allergyCodeOptions = COMMON_ALLERGY_CODES.map(allergy => ({
    value: allergy.code,
    label: `${allergy.display} (${allergy.code})`,
    allergy,
  }));

  const filteredOptions = allergyCodeOptions.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle allergy selection from autocomplete
  const handleAllergySelect = (_: string, option: any, form: any) => {
    if (option?.allergy) {
      form.setFieldsValue({
        code: option.allergy.code,
        display: option.allergy.display,
        system: option.allergy.system,
      });
    }
  };

  // Get severity color
  const getCriticalityColor = (criticality: string) => {
    switch (criticality?.toLowerCase()) {
      case 'high': return '#ff4d4f';
      case 'low': return '#FAAD14';
      case 'unable-to-assess': return '#272727';
      default: return '#d9d9d9';
    }
  };


  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="ml-3">Loading allergy information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading allergies"
        description="Unable to fetch patient allergy information. Please try again later."
        type="error"
        showIcon
        className="m-5"
      />
    );
  }

  const hasAllergies = allergies && allergies.length > 0;

  return (
    <div className="p-5 bg-gray-100">
      {/* === Create New Allergy Form === */}
      <Collapse
        className="bg-[#f0f8ff] mb-5"
        items={[
          {
            key: 'create-allergy',
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOutlined style={{ color: '#ff4d4f' }} />
                <Text strong>Create New Allergy/Intolerance</Text>
              </div>
            ),
            children: (
              <Form
                form={createForm}
                layout="vertical"
                onFinish={handleCreateAllergy}
                style={{ maxWidth: '1000px' }}
                initialValues={{
                  clinicalStatus: 'active',
                  verificationStatus: 'confirmed',
                  type: 'allergy',
                  category: ['medication'],
                  criticality: 'low',
                  recordedDate: dayjs(),
                  system: 'http://snomed.info/sct',
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="allergySearch"
                      label="Search Common Allergies"
                      help="Start typing to search for common allergies, or manually enter details below"
                    >
                      <AutoComplete
                        options={filteredOptions}
                        onSelect={(value, option) => handleAllergySelect(value, option, createForm)}
                        onSearch={setSearchValue}
                        placeholder="Search for allergies (e.g., penicillin, peanuts, seafood...)"
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
                  <Col span={8}>
                    <Form.Item
                      name="display"
                      label="Allergy/Intolerance Name"
                      rules={[{ required: true, message: 'Please enter allergy name' }]}
                    >
                      <Input placeholder="e.g., Allergy to penicillin" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="code"
                      label="SNOMED CT Code"
                      rules={[{ required: true, message: 'Please enter SNOMED code' }]}
                    >
                      <Input placeholder="e.g., 91936005" />
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
                      name="type"
                      label="Type"
                      rules={[{ required: true, message: 'Please select type' }]}
                    >
                      <Select>
                        {TYPE_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="criticality"
                      label="Criticality"
                      rules={[{ required: true, message: 'Please select criticality' }]}
                    >
                      <Select>
                        {CRITICALITY_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                      <Select mode="multiple" placeholder="Select categories">
                        {CATEGORY_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="note"
                      label="Clinical Notes"
                      help="Describe reactions, manifestations, or other relevant clinical information"
                      rules={[{ required: true, message: 'Please enter some notes' }]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="e.g., Patient develops rash and difficulty breathing when exposed to penicillin. Avoid all beta-lactam antibiotics."
                      />
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
                      danger
                    >
                      Create Allergy
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

      {/* === Active Allergies Alert Banner === */}
      {hasAllergies && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong>PATIENT HAS KNOWN ALLERGIES/INTOLERANCES</Text>
            </div>
          }
          description={`This patient has ${allergies.length} documented allergy/intolerance record(s). Review carefully before prescribing medications or treatments.`}
          type="info"
          showIcon
          className="mb-5"
        />
      )}

      {/* === Allergies Overview Cards === */}
      {hasAllergies && (
        <div className="mb-5">
          <Title level={5} className="mb-3 text-red-600">
            <AlertOutlined className="mr-2" />
            Active Allergies & Intolerances
          </Title>
          <Row gutter={[16, 16]}>
            {allergies
              .filter(allergy => allergy.clinicalStatus === 'active')
              .slice(0, 4) // Show only first 4 for overview
              .map((allergy) => (
                <Col key={allergy.id} span={6}>
                  <Card
                    size="small"
                    className={`allergy-card ${allergy.criticality}`}
                    style={{
                      border: `2px solid ${getCriticalityColor(allergy.criticality)}`,
                      borderRadius: '8px',
                      backgroundColor: allergy.criticality === 'high' ? '#fff2f0' : allergy.criticality === "low" ? '#fff7e6' : '#F1F1F1'
                    }}
                  >
                    <div className="text-center">
                      <MedicineBoxOutlined 
                        style={{ 
                          fontSize: '20px', 
                          color: getCriticalityColor(allergy.criticality),
                          marginBottom: '4px'
                        }} 
                      />
                      <div className="font-bold text-sm text-gray-800 mb-1">
                        {allergy.display}
                      </div>
                      <Tag 
                        color={getCriticalityColor(allergy.criticality)}
                        className="mb-2 text-xs"
                      >
                        {allergy.criticality?.toUpperCase()}
                      </Tag>
                      <div className="text-xs text-gray-600">
                        {allergy.category.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Recorded: {dayjs(allergy.recordedDate.toString()).format('MM/DD/YY')}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      )}

      {/* === Allergies History Table === */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <AlertOutlined className="text-red-500" />
            <Text strong>Allergy & Intolerance History</Text>
          </div>
        }
        size="small"
        styles={{
          header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
          body: { padding: '16px' }
        }}
      >
        {!hasAllergies ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <MedicineBoxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>No Known Allergies</div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              No allergies or intolerances have been documented for this patient. Use the form above to document any known allergies.
            </div>
          </div>
        ) : (
          <Table
            dataSource={allergies}
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} allergies`,
            }}
            scroll={{ x: 'max-content' }}
            rowKey="id"
            columns={[
              {
                title: 'Allergy/Intolerance',
                dataIndex: 'display',
                key: 'display',
                ellipsis: true,
                render: (text: string, record: AllergyIntolerance) => (
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
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (type: string) => (
                  <span className="text-xs whitespace-nowrap">
                    {type?.charAt(0).toUpperCase() + type?.slice(1) || ''}
                  </span>
                ),
              },
              {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                render: (categories: string[]) => (
                  <div>
                    {categories?.slice(0, 2).map((cat) => (
                      <Tag key={cat} color="purple" className="mb-1 text-xs">
                        {cat}
                      </Tag>
                    ))}
                    {categories?.length > 2 && (
                      <div className="text-xs text-gray-400">+{categories.length - 2} more</div>
                    )}
                  </div>
                ),
              },
              {
                title: 'Criticality',
                dataIndex: 'criticality',
                key: 'criticality',
                render: (criticality: string) => {
                  const getTagColor = () => {
                    switch (criticality?.toLowerCase()) {
                      case 'high': return 'red';
                      case 'low': return 'gold';
                      case 'unable-to-assess': return 'default';
                      default: return 'default';
                    }
                  };
                  
                  return (
                    <Tag color={getTagColor()} className="text-xs">
                      {criticality?.toUpperCase()}
                    </Tag>
                  );
                },
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
                title: 'Notes',
                dataIndex: 'note',
                key: 'note',
                ellipsis: {
                  showTitle: false,
                },
                render: (note: string) => (
                  note ? (
                    <Tooltip title={note} placement="topLeft">
                      <div className="text-xs text-gray-600 truncate max-w-32">
                        {note}
                      </div>
                    </Tooltip>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record: AllergyIntolerance) => (
                  <Space size="small">
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditAllergy(record)}
                        disabled={isUpdating}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete allergy?"
                      onConfirm={() => handleDeleteAllergy(record.id)}
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
            rowClassName={() => 'allergy-row-white'}
          />
        )}
      </Card>

      {/* === Edit Modal === */}
      <Modal
        title="Edit Allergy/Intolerance"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingAllergy(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateAllergy}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="display"
                label="Allergy/Intolerance Name"
                rules={[{ required: true, message: 'Please enter allergy name' }]}
              >
                <Input placeholder="e.g., Allergy to penicillin" />
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
                <Input placeholder="e.g., 91936005" />
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
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select>
                  {TYPE_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="criticality"
                label="Criticality"
                rules={[{ required: true, message: 'Please select criticality' }]}
              >
                <Select>
                  {CRITICALITY_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select at least one category' }]}
              >
                <Select mode="multiple" placeholder="Select categories">
                  {CATEGORY_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="note"
                label="Clinical Notes"
              >
                <TextArea
                  rows={3}
                  placeholder="Describe reactions, manifestations, or other relevant clinical information"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsEditModalVisible(false);
                  setEditingAllergy(null);
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
                Update Allergy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .allergy-row-white {
          background-color: #ffffff !important;
        }
        .allergy-row-white:hover {
          background-color: #f0f8ff !important;
        }
        .allergy-card.high {
          box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
        }
        .allergy-card.low {
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AllergyIntoleranceTab;