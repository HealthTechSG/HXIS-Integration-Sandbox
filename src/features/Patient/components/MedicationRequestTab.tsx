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
  Input,
  Select,
  DatePicker,
  Modal,
  Popconfirm,
  Tooltip,
  Divider,
} from 'antd';
import {
  MedicineBoxOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

// Import MedicationRequest service
import {
  useGetMedicationRequestListByPatientIdQuery,
  useCreateMedicationRequestMutation,
  useUpdateMedicationRequestMutation,
  useDeleteMedicationRequestMutation,
  MEDICATION_REQUEST_STATUS_OPTIONS,
  MEDICATION_REQUEST_INTENT_OPTIONS,
  COMMON_DOSAGE_INSTRUCTIONS,
} from '@/services/MedicationRequest';
import type { MedicationRequest, CreateMedicationRequestRequest } from '@/services/MedicationRequest';

// Import other services for dropdowns
import { useGetMedicationListQuery } from '@/services/Medication/MedicationService';
import { useGetPractitionerListQuery } from '@/services/Practitioner/PractitionerService';

interface MedicationRequestTabProps {
  patientId: string;
}

const MedicationRequestTab: React.FC<MedicationRequestTabProps> = ({ patientId }) => {
  // States
  const [editingMedicationRequest, setEditingMedicationRequest] = useState<MedicationRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // API Queries
  const {
    data: medicationRequestData,
    isLoading: isLoadingMedicationRequests,
    error: medicationRequestError
  } = useGetMedicationRequestListByPatientIdQuery(patientId);

  const { data: medicationData } = useGetMedicationListQuery({
    page: 0,
    pageSize: 100,
  });

  const { data: practitionerData } = useGetPractitionerListQuery({
    page: 0,
    pageSize: 100,
  });

  // Mutations
  const [createMedicationRequest, { isLoading: isCreatingMedicationRequest }] = useCreateMedicationRequestMutation();
  const [updateMedicationRequest, { isLoading: isUpdatingMedicationRequest }] = useUpdateMedicationRequestMutation();
  const [deleteMedicationRequest, { isLoading: isDeletingMedicationRequest }] = useDeleteMedicationRequestMutation();

  const isSubmittingForm = isCreatingMedicationRequest || isUpdatingMedicationRequest;

  // Prepare dropdown options
  const medicationOptions = medicationData?.entry?.map(med => ({
    label: `${med.display} (${med.code})`,
    value: med.id,
    display: med.display,
  })) || [];

  const practitionerOptions = practitionerData?.entry?.map(prac => ({
    label: prac.name,
    value: prac.id,
  })) || [];

  // Handle form submission
  const handleSubmitMedicationRequest = async (values: any) => {
    try {
      // Find selected medication for display name
      const selectedMedication = medicationData?.entry?.find(med => med.id === values.medicationId);

      const medicationRequestData: CreateMedicationRequestRequest = {
        status: values.status,
        intent: values.intent,
        medicationId: values.medicationId,
        medicationDisplay: selectedMedication?.display || '',
        patientId,
        practitionerId: values.practitionerId,
        authoredOn: values.authoredOn ? dayjs(values.authoredOn).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        dosageInstructionText: values.dosageInstructionText,
        dosageInstructionSequence: values.dosageInstructionSequence || 1,
      };

      if (editingMedicationRequest) {
        // Update existing medication request - ensure all required fields are present
        const updateMedicationRequestData: MedicationRequest = {
          id: editingMedicationRequest.id,
          status: values.status || editingMedicationRequest.status,
          intent: values.intent || editingMedicationRequest.intent,
          medicationId: values.medicationId || editingMedicationRequest.medicationId,
          medicationDisplay: selectedMedication?.display || editingMedicationRequest.medicationDisplay,
          patientId,
          practitionerId: values.practitionerId || editingMedicationRequest.practitionerId,
          authoredOn: values.authoredOn ? dayjs(values.authoredOn).format('YYYY-MM-DD') : editingMedicationRequest.authoredOn,
          dosageInstructionText: values.dosageInstructionText || editingMedicationRequest.dosageInstructionText,
          dosageInstructionSequence: values.dosageInstructionSequence || editingMedicationRequest.dosageInstructionSequence || 1,
        };

        await updateMedicationRequest(updateMedicationRequestData).unwrap();

        message.success('Medication request updated successfully');
        setEditingMedicationRequest(null);
      } else {
        // Create new medication request
        await createMedicationRequest(medicationRequestData).unwrap();
        message.success('Medication request created successfully');
      }

      form.resetFields();
      setEditingMedicationRequest(null);
      setIsModalVisible(false);
    } catch (error: any) {
      console.error('Failed to submit medication request:', error);
      message.error('Failed to save medication request. Please try again.');
    }
  };

  // Handle modal functions
  const showModal = (medicationRequest?: MedicationRequest) => {
    if (medicationRequest) {
      setEditingMedicationRequest(medicationRequest);
      form.setFieldsValue({
        status: medicationRequest.status,
        intent: medicationRequest.intent,
        medicationId: medicationRequest.medicationId,
        practitionerId: medicationRequest.practitionerId,
        authoredOn: medicationRequest.authoredOn ? dayjs(medicationRequest.authoredOn.toString()) : null,
        dosageInstructionText: medicationRequest.dosageInstructionText,
        dosageInstructionSequence: medicationRequest.dosageInstructionSequence,
      });
    } else {
      setEditingMedicationRequest(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingMedicationRequest(null);
    form.resetFields();
  };

  // Handle delete
  const handleDeleteMedicationRequest = async (medicationRequestId: string) => {
    try {
      await deleteMedicationRequest(medicationRequestId).unwrap();
      message.success('Medication request deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete medication request:', error);
      message.error('Failed to delete medication request. Please try again.');
    }
  };

  // Handle cancel
  const handleCancelForm = () => {
    closeModal();
  };

  // Handle preset dosage selection
  const handlePresetDosage = (dosage: { text: string; sequence: number }) => {
    form.setFieldsValue({
      dosageInstructionText: dosage.text,
      dosageInstructionSequence: dosage.sequence,
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      case 'on-hold': return 'orange';
      case 'stopped': return 'red';
      case 'entered-in-error': return 'red';
      case 'draft': return 'default';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  // Get intent color
  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'order': return 'blue';
      case 'plan': return 'green';
      case 'proposal': return 'orange';
      default: return 'default';
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Medication',
      key: 'medication',
      width: '30%',
      render: (_: any, record: MedicationRequest) => (
        <div>
          <div className="font-semibold text-blue-700 mb-1">
            {record.medicationDisplay}
          </div>
          <div className="text-xs text-gray-500">
            ID: {record.medicationId}
          </div>
        </div>
      ),
    },
    {
      title: 'Status & Intent',
      key: 'status',
      width: '20%',
      render: (_: any, record: MedicationRequest) => (
        <div>
          <Tag color={getStatusColor(record.status)} className="mb-1">
            {record.status.toUpperCase()}
          </Tag>
          <br />
          <Tag color={getIntentColor(record.intent)}>
            {record.intent.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Dosage Instructions',
      dataIndex: 'dosageInstructionText',
      key: 'dosage',
      width: '25%',
      render: (text: string, record: MedicationRequest) => (
        <div>
          <div className="text-sm">{text}</div>
          <div className="text-xs text-gray-500">Sequence: {record.dosageInstructionSequence}</div>
        </div>
      ),
    },
    {
      title: 'Authored On',
      key: 'authoredOn',
      width: '15%',
      render: (_: any, record: MedicationRequest) => (
        <div>
          <CalendarOutlined className="mr-1" />
          {dayjs(record.authoredOn.toString()).format('MM/DD/YYYY')}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: MedicationRequest) => (
        <Space size="small">
          <Tooltip title="Edit Medication Request">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
              type="text"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Medication Request"
            description="Are you sure you want to delete this medication request?"
            onConfirm={() => handleDeleteMedicationRequest(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Tooltip title="Delete Medication Request">
              <Button
                icon={<DeleteOutlined />}
                loading={isDeletingMedicationRequest}
                size="small"
                type="text"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoadingMedicationRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading medication requests...">
          <div style={{ minHeight: 100 }} />
        </Spin>
      </div>
    );
  }

  if (medicationRequestError) {
    return (
      <Alert
        message="Error Loading Medication Requests"
        description="Unable to load medication requests. Please try again."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="p-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4} className="m-0 flex items-center">
            <MedicineBoxOutlined className="mr-2 text-blue-600" />
            Medication Requests
          </Title>
          <Text type="secondary">Manage patient medication prescriptions and orders</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size="large"
          className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
        >
          New Prescription
        </Button>
      </div>

      {/* Add/Edit Medication Request Modal */}
      <Modal
        title={(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MedicineBoxOutlined style={{ color: '#52c41a' }} />
            <Text strong>
              {editingMedicationRequest ? 'Edit Medication Request' : 'Create New Medication Request'}
            </Text>
          </div>
        )}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitMedicationRequest}
          disabled={isSubmittingForm}
          initialValues={{
            status: 'active',
            intent: 'order',
            dosageInstructionSequence: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  {MEDICATION_REQUEST_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Intent"
                name="intent"
                rules={[{ required: true, message: 'Please select intent' }]}
              >
                <Select placeholder="Select intent">
                  {MEDICATION_REQUEST_INTENT_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Medication"
                name="medicationId"
                rules={[{ required: true, message: 'Please select medication' }]}
              >
                <Select
                  showSearch
                  placeholder="Select medication"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={medicationOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Prescribing Practitioner"
                name="practitionerId"
                rules={[{ required: true, message: 'Please select practitioner' }]}
              >
                <Select
                  showSearch
                  placeholder="Select practitioner"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={practitionerOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Authored Date"
                name="authoredOn"
                rules={[{ required: true, message: 'Please select authored date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Dosage Sequence"
                name="dosageInstructionSequence"
              >
                <Select placeholder="Select sequence">
                  <Select.Option value={1}>1 - Primary</Select.Option>
                  <Select.Option value={2}>2 - Secondary</Select.Option>
                  <Select.Option value={3}>3 - Additional</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Dosage Instructions"
            name="dosageInstructionText"
            rules={[{ required: true, message: 'Please enter dosage instructions' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter detailed dosage instructions..."
            />
          </Form.Item>

          <Divider orientation="left" className="text-sm">Quick Dosage Presets</Divider>
          <div className="mb-4">
            <Space wrap>
              {COMMON_DOSAGE_INSTRUCTIONS.slice(0, 6).map((dosage, index) => (
                <Button
                  key={index}
                  size="small"
                  type="dashed"
                  onClick={() => handlePresetDosage(dosage)}
                >
                  {dosage.text.substring(0, 30)}...
                </Button>
              ))}
            </Space>
          </div>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmittingForm}
                icon={<SaveOutlined />}
                className="bg-blue-500 border-blue-500"
              >
                {isSubmittingForm
                  ? (editingMedicationRequest ? 'Updating...' : 'Creating...')
                  : (editingMedicationRequest ? 'Update Prescription' : 'Create Prescription')
                }
              </Button>
              <Button onClick={handleCancelForm}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Medication Requests Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={medicationRequestData?.entry || []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
          }}
          size="small"
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <MedicineBoxOutlined className="text-4xl text-gray-400 mb-4" />
                <Text type="secondary">No medication requests found</Text>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default MedicationRequestTab;