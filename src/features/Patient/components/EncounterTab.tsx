import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CalendarOutlined,
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
  AutoComplete,
  Input,
  Select,
  DatePicker,
  Modal,
  Popconfirm,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

// Import Encounter service
import {
  useGetEncountersByPatientIdQuery,
  useCreateEncounterMutation,
  useUpdateEncounterMutation,
  useDeleteEncounterMutation,
} from '@/services/Encounter';
import type { Encounter, CreateEncounterRequest, EncounterStatus } from '@/services/Encounter';
// Import Practitioner and Location services
import { useGetLocationListQuery } from '@/services/Location';
import { useGetPractitionerListQuery } from '@/services/Practitioner/PractitionerService';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface EncounterTabProps {
  patientId: string;
}

// Status options for encounters
const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'triaged', label: 'Triaged' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'onleave', label: 'On Leave' },
  { value: 'finished', label: 'Finished' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Encounter class options
const CLASS_OPTIONS = [
  {
    value: 'AMB',
    label: 'Ambulatory',
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    display: 'ambulatory'
  },
  {
    value: 'IMP',
    label: 'Inpatient Encounter',
    system: 'https://terminology.hl7.org/3.1.0/CodeSystem-v3-ActCode',
    display: 'inpatient encounter'
  },
  {
    value: 'OBSENC',
    label: 'Observation Encounter',
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    display: 'observation encounter'
  },
  {
    value: 'EMER',
    label: 'Emergency',
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    display: 'emergency'
  },
];

// Service type options
const SERVICE_TYPE_OPTIONS = [
  { code: '221', display: 'Surgery - General', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
  { code: '331', display: 'Psychiatry', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
  { code: '410', display: 'Pregnancy', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
  { code: '502', display: 'Gynaecology', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
  { code: '560', display: 'Pathology', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
  { code: '700', display: 'General Medicine', system: 'http://terminology.hl7.org/CodeSystem/service-type' },
];

// Priority options
const PRIORITY_OPTIONS = [
  { code: 'R', display: 'Routine', system: 'http://terminology.hl7.org/ValueSet/v3-ActPriority' },
  { code: 'P', display: 'Preop', system: 'http://terminology.hl7.org/ValueSet/v3-ActPriority' },
  { code: 'UR', display: 'Urgent', system: 'http://terminology.hl7.org/ValueSet/v3-ActPriority' },
  { code: 'S', display: 'STAT', system: 'http://terminology.hl7.org/ValueSet/v3-ActPriority' },
];

// Reason code options
const REASON_CODE_OPTIONS = [
  { code: '2598006', display: 'Open heart surgery', system: 'http://hl7.org/fhir/ValueSet/encounter-reason' },
  { code: '67890', display: 'Hypertension', system: 'http://terminology.hl7.org/CodeSystem/condition-code' },
  { code: '185347001', display: 'Encounter for check up', system: 'http://snomed.info/sct' },
  { code: '308335008', display: 'General consultation', system: 'http://snomed.info/sct' },
];

const EncounterTab: React.FC<EncounterTabProps> = ({ patientId }) => {
  // State management
  const [form] = Form.useForm();
  const [editingEncounter, setEditingEncounter] = useState<Encounter | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // API hooks
  const {
    data: encountersData,
    error: encountersError,
    isLoading: isLoadingEncounters,
    refetch,
  } = useGetEncountersByPatientIdQuery({ patientId });

  const [createEncounter, { isLoading: isCreating }] = useCreateEncounterMutation();
  const [updateEncounter, { isLoading: isUpdating }] = useUpdateEncounterMutation();
  const [deleteEncounter, { isLoading: isDeleting }] = useDeleteEncounterMutation();

  // API hooks for practitioners and locations
  const { data: practitionersData, isLoading: isLoadingPractitioners } = useGetPractitionerListQuery({
    page: 0,
    pageSize: 100,
  });
  const { data: locationsData, isLoading: isLoadingLocations } = useGetLocationListQuery({
    page: 0,
    pageSize: 100,
  });

  // Extract encounters data
  const encounters = encountersData?.entry || [];
  const totalCount = encountersData?.total || 0;

  // Extract practitioners and locations data
  const practitioners = practitionersData?.entry || [];
  const locations = locationsData?.entry || [];

  // Filter encounters based on search text
  const filteredEncounters = encounters.filter((encounter: Encounter) =>
    encounter.class.display.toLowerCase().includes(searchText.toLowerCase()) ||
    encounter.status.toLowerCase().includes(searchText.toLowerCase()) ||
    (encounter.serviceType?.coding?.[0]?.display || '').toLowerCase().includes(searchText.toLowerCase())
  );

  // Effect to populate form when editing
  useEffect(() => {
    if (isModalVisible && editingEncounter) {
      setTimeout(() => {
        const startDateTime = dayjs(editingEncounter.period.start);
        const endDateTime = editingEncounter.period.end ? dayjs(editingEncounter.period.end) : null;

        const formValues = {
          status: editingEncounter.status,
          classCode: editingEncounter.class.code,
          classDisplay: editingEncounter.class.display,
          classSystem: editingEncounter.class.system,
          serviceTypeCode: editingEncounter.serviceType?.coding?.[0]?.code || '',
          serviceTypeDisplay: editingEncounter.serviceType?.coding?.[0]?.display || '',
          serviceTypeSystem: editingEncounter.serviceType?.coding?.[0]?.system || '',
          priorityCode: editingEncounter.priority?.coding?.[0]?.code || '',
          priorityDisplay: editingEncounter.priority?.coding?.[0]?.display || '',
          prioritySystem: editingEncounter.priority?.coding?.[0]?.system || '',
          practitionerId: editingEncounter.participant?.[0]?.individual?.reference?.replace('Practitioner/', '') || '',
          locationId: editingEncounter.location?.[0]?.location?.reference?.replace('Location/', '') || '',
          period: endDateTime ? [startDateTime, endDateTime] : [startDateTime],
          reasonCode: editingEncounter.reasonCode?.[0]?.coding?.[0]?.code || '',
          reasonDisplay: editingEncounter.reasonCode?.[0]?.coding?.[0]?.display || '',
          reasonSystem: editingEncounter.reasonCode?.[0]?.coding?.[0]?.system || '',
        };

        form.setFieldsValue(formValues);
      }, 150);
    } else if (isModalVisible && !editingEncounter) {
      form.resetFields();
      // Set default values for new encounter
      form.setFieldsValue({
        status: 'planned',
        period: [dayjs(), dayjs().add(1, 'hour')],
      });
    }
  }, [isModalVisible, editingEncounter, form]);

  // Form submission handler
  const handleSubmit = async (values: any) => {
    try {
      const [startDateTime, endDateTime] = values.period || [];

      // Handle encounter class - either from predefined options or manual input
      let encounterClass;
      if (values.classCode || values.classDisplay) {
        const selectedClass = CLASS_OPTIONS.find(cls => cls.value === values.classCode);
        encounterClass = {
          system: values.classSystem || selectedClass?.system || 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: values.classCode || selectedClass?.value || 'AMB',
          display: values.classDisplay || selectedClass?.display || selectedClass?.label || 'ambulatory',
        };
      } else {
        // Default class if none provided
        encounterClass = {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'ambulatory',
        };
      }

      const formData: CreateEncounterRequest = {
        status: values.status as EncounterStatus,
        class: encounterClass,
        subject: {
          reference: `Patient/${patientId}`,
        },
        participant: values.practitionerId ? [{
          individual: {
            reference: `Practitioner/${values.practitionerId}`,
          },
        }] : [],
        period: {
          start: startDateTime ? startDateTime.toISOString() : dayjs().toISOString(),
          end: endDateTime ? endDateTime.toISOString() : undefined,
        },
      };

      // Add optional service type
      if (values.serviceTypeCode || values.serviceTypeDisplay) {
        const selectedServiceType = SERVICE_TYPE_OPTIONS.find(service => service.code === values.serviceTypeCode);
        formData.serviceType = {
          coding: [{
            system: values.serviceTypeSystem || selectedServiceType?.system || 'http://terminology.hl7.org/CodeSystem/service-type',
            code: values.serviceTypeCode || '',
            display: values.serviceTypeDisplay || selectedServiceType?.display || values.serviceTypeCode || '',
          }],
        };
      }

      // Add optional priority
      if (values.priorityCode || values.priorityDisplay) {
        const selectedPriority = PRIORITY_OPTIONS.find(priority => priority.code === values.priorityCode);
        formData.priority = {
          coding: [{
            system: values.prioritySystem || selectedPriority?.system || 'http://terminology.hl7.org/ValueSet/v3-ActPriority',
            code: values.priorityCode || '',
            display: values.priorityDisplay || selectedPriority?.display || values.priorityCode || '',
          }],
        };
      }

      // Add optional location
      if (values.locationId) {
        formData.location = [{
          location: {
            reference: `Location/${values.locationId}`,
          },
        }];
      }

      // Add optional reason
      if (values.reasonCode || values.reasonDisplay) {
        const selectedReason = REASON_CODE_OPTIONS.find(reason => reason.code === values.reasonCode);
        formData.reasonCode = [{
          coding: [{
            system: values.reasonSystem || selectedReason?.system || 'http://hl7.org/fhir/ValueSet/encounter-reason',
            code: values.reasonCode || '',
            display: values.reasonDisplay || selectedReason?.display || values.reasonCode || '',
          }],
        }];
      }

      if (editingEncounter) {
        await updateEncounter({
          ...formData,
          id: editingEncounter.id,
        } as Encounter).unwrap();
        message.success('Encounter updated successfully');
      } else {
        await createEncounter(formData).unwrap();
        message.success('Encounter added successfully');
      }

      setIsModalVisible(false);
      setEditingEncounter(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Failed to save encounter. Please try again.');
      console.error('Error saving encounter:', error);
    }
  };

  // Delete handler
  const handleDelete = async (encounterId: string) => {
    try {
      await deleteEncounter(encounterId).unwrap();
      message.success('Encounter deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete encounter. Please try again.');
      console.error('Error deleting encounter:', error);
    }
  };

  // Modal handlers
  const showModal = (encounter?: Encounter) => {
    if (encounter) {
      setEditingEncounter(encounter);
    } else {
      setEditingEncounter(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingEncounter(null);
    form.resetFields();
  };

  // Get status tag color
  const getStatusTagColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'planned': 'blue',
      'arrived': 'cyan',
      'triaged': 'orange',
      'in-progress': 'processing',
      'onleave': 'warning',
      'finished': 'success',
      'cancelled': 'error',
    };
    return statusColorMap[status] || 'default';
  };

  // Get class tag color
  const getClassTagColor = (classCode: string) => {
    const classColorMap: { [key: string]: string } = {
      'AMB': 'geekblue',
      'IMP': 'volcano',
      'OBSENC': 'purple',
      'EMER': 'red',
    };
    return classColorMap[classCode] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Type & Status',
      key: 'typeStatus',
      width: '25%',
      render: (_: any, record: Encounter) => (
        <div>
          <div className="mb-1">
            <Tag color={getClassTagColor(record.class.code)}>
              {record.class.display}
            </Tag>
          </div>
          <Tag color={getStatusTagColor(record.status)}>
            {record.status.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Service Type',
      key: 'serviceType',
      width: '20%',
      render: (_: any, record: Encounter) => (
        record.serviceType?.coding?.[0]?.display ? (
          <Text strong>{record.serviceType.coding[0].display}</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Period',
      key: 'period',
      width: '25%',
      render: (_: any, record: Encounter) => (
        <div>
          <div>
            <Text strong>Start:</Text> {dayjs(record.period.start).format('DD/MM/YYYY HH:mm')}
          </div>
          {record.period.end && (
            <div>
              <Text strong>End:</Text> {dayjs(record.period.end).format('DD/MM/YYYY HH:mm')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      width: '15%',
      render: (_: any, record: Encounter) => {
        if (!record.priority?.coding?.[0]?.display) {
          return <Text type="secondary">-</Text>;
        }

        const priorityCode = record.priority.coding[0].code;
        let color = 'blue';
        if (priorityCode === 'S') color = 'red';
        else if (priorityCode === 'UR') color = 'orange';

        return (
          <Tag color={color}>
            {record.priority.coding[0].display}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Encounter) => (
        <Space size="small">
          <Tooltip title="Edit Encounter">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
              type="link"
            />
          </Tooltip>
          <Popconfirm
            cancelText="No"
            description="Are you sure you want to delete this encounter?"
            okText="Yes"
            onConfirm={() => handleDelete(record.id)}
            title="Delete Encounter"
          >
            <Tooltip title="Delete Encounter">
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
  if (isLoadingEncounters) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <div style={{ marginTop: 16 }}>Loading encounters...</div>
      </div>
    );
  }

  // Error state
  if (encountersError) {
    return (
      <Alert
        action={
          <Button onClick={refetch} size="small" type="primary">
            Retry
          </Button>
        }
        description="Unable to load encounter data. Please try again later."
        message="Error Loading Encounters"
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
              <CalendarOutlined className="mr-2 text-blue-600" />
              Patient Encounters
            </Title>
            <Text type="secondary">
              Total: {totalCount} encounters | Filtered: {filteredEncounters.length}
            </Text>
          </Col>
          <Col>
            <Button
              icon={<SaveOutlined />}
              onClick={() => showModal()}
              size="large"
              type="primary"
            >
              Schedule New Encounter
            </Button>
          </Col>
        </Row>

        {/* Search Section */}
        <Row className="mb-4" gutter={16}>
          <Col md={8} sm={12} xs={24}>
            <Input.Search
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search encounters..."
              value={searchText}
            />
          </Col>
        </Row>
      </Card>

      {/* Encounters Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredEncounters}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} encounters`,
          }}
          rowKey="id"
          scroll={{ x: 800 }}
          style={{ background: 'white' }}
        />
      </Card>

      {/* Add/Edit Encounter Modal */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={closeModal}
        open={isModalVisible}
        title={editingEncounter ? 'Edit Encounter' : 'Schedule New Encounter'}
        width={800}
      >
        <Form
          key={editingEncounter?.id || 'new'}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Collapse className="mb-4" defaultActiveKey={['basic', 'scheduling']}>
            {/* Basic Information */}
            <Collapse.Panel key="basic" header="Basic Encounter Information">
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
                    label="Encounter Class Code"
                    name="classCode"
                  >
                    <AutoComplete
                      allowClear
                      onChange={(value: string) => {
                        const selectedClass = CLASS_OPTIONS.find(cls => cls.value === value);
                        if (selectedClass) {
                          form.setFieldValue('classDisplay', selectedClass.display);
                          form.setFieldValue('classSystem', selectedClass.system);
                        }
                      }}
                      options={CLASS_OPTIONS.map(option => ({
                        value: option.value,
                        label: `${option.value} - ${option.label}`,
                      }))}
                      placeholder="Enter or select class code"
                    />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Class Display Name"
                    name="classDisplay"
                  >
                    <Input placeholder="Enter class display name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Service Type Code"
                    name="serviceTypeCode"
                  >
                    <AutoComplete
                      allowClear
                      onChange={(value: string) => {
                        const selectedService = SERVICE_TYPE_OPTIONS.find(service => service.code === value);
                        if (selectedService) {
                          form.setFieldValue('serviceTypeDisplay', selectedService.display);
                          form.setFieldValue('serviceTypeSystem', selectedService.system);
                        }
                      }}
                      options={SERVICE_TYPE_OPTIONS.map(option => ({
                        value: option.code,
                        label: `${option.code} - ${option.display}`,
                      }))}
                      placeholder="Enter or select service type code"
                    />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Service Type Display"
                    name="serviceTypeDisplay"
                  >
                    <Input placeholder="Enter service type display name" />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Priority Code"
                    name="priorityCode"
                  >
                    <AutoComplete
                      allowClear
                      onChange={(value: string) => {
                        const selectedPriority = PRIORITY_OPTIONS.find(priority => priority.code === value);
                        if (selectedPriority) {
                          form.setFieldValue('priorityDisplay', selectedPriority.display);
                          form.setFieldValue('prioritySystem', selectedPriority.system);
                        }
                      }}
                      options={PRIORITY_OPTIONS.map(option => ({
                        value: option.code,
                        label: `${option.code} - ${option.display}`,
                      }))}
                      placeholder="Enter or select priority code"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Priority Display"
                    name="priorityDisplay"
                  >
                    <Input placeholder="Enter priority display name" />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Reason Code"
                    name="reasonCode"
                  >
                    <AutoComplete
                      allowClear
                      onChange={(value: string) => {
                        const selectedReason = REASON_CODE_OPTIONS.find(reason => reason.code === value);
                        if (selectedReason) {
                          form.setFieldValue('reasonDisplay', selectedReason.display);
                          form.setFieldValue('reasonSystem', selectedReason.system);
                        }
                      }}
                      options={REASON_CODE_OPTIONS.map(option => ({
                        value: option.code,
                        label: `${option.code} - ${option.display}`,
                      }))}
                      placeholder="Enter or select reason code"
                    />
                  </Form.Item>
                </Col>
                <Col sm={8} xs={24}>
                  <Form.Item
                    label="Reason Display"
                    name="reasonDisplay"
                  >
                    <Input placeholder="Enter reason display name" />
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>

            {/* Scheduling & Resources */}
            <Collapse.Panel key="scheduling" header="Scheduling & Resources">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <UserOutlined className="mr-1" />
                        Attending Practitioner
                      </span>
                    }
                    name="practitionerId"
                  >
                    <Select
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                      }
                      loading={isLoadingPractitioners}
                      placeholder="Select practitioner"
                      showSearch
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
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                      }
                      loading={isLoadingLocations}
                      placeholder="Select location"
                      showSearch
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

              <Form.Item
                label="Encounter Period"
                name="period"
                rules={[{ required: true, message: 'Encounter period is required' }]}
              >
                <RangePicker
                  allowEmpty={[false, true]}
                  format="DD/MM/YYYY HH:mm"
                  placeholder={['Start Date & Time', 'End Date & Time (Optional)']}
                  showTime
                  style={{ width: '100%' }}
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
                {editingEncounter ? 'Update Encounter' : 'Schedule Encounter'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EncounterTab;