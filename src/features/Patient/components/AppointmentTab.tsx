import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
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
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

// Import Appointment service
import {
  useGetAppointmentsByPatientIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from '@/services/Appointment';
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  ParticipantRequired,
  ParticipantStatus,
} from '@/services/Appointment';

// Import Practitioner and Location services
import { useGetLocationListQuery } from '@/services/Location';
import { useGetPractitionerListQuery } from '@/services/Practitioner/PractitionerService';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface AppointmentTabProps {
  patientId: string;
}

// Status options for appointments
const STATUS_OPTIONS = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'pending', label: 'Pending' },
  { value: 'booked', label: 'Booked' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'noshow', label: 'No Show' },
  { value: 'entered-in-error', label: 'Entered in Error' },
  { value: 'checked-in', label: 'Checked In' },
  { value: 'waitlist', label: 'Waitlist' },
];

// Participant required options
const PARTICIPANT_REQUIRED_OPTIONS = [
  { value: 'required', label: 'Required' },
  { value: 'optional', label: 'Optional' },
  { value: 'information-only', label: 'Information Only' },
];

// Participant status options
const PARTICIPANT_STATUS_OPTIONS = [
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'tentative', label: 'Tentative' },
  { value: 'needs-action', label: 'Needs Action' },
];

// Service category options
const SERVICE_CATEGORY_OPTIONS = [
  { code: '1', display: 'Adoption/Permanent Care Info', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
  { code: '2', display: 'Aged Care Info', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
  { code: '8', display: 'Counselling', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
  { code: '11', display: 'Disability Support', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
  { code: '34', display: 'Specialist Medical', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
  { code: '47', display: 'General Practice', system: 'http://terminology.hl7.org/CodeSystem/service-category' },
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

// Specialty options
const SPECIALTY_OPTIONS = [
  { code: 'cardio', display: 'Cardiology', system: 'http://snomed.info/sct' },
  { code: 'dent', display: 'Dentistry', system: 'http://snomed.info/sct' },
  { code: 'dietary', display: 'Dietary', system: 'http://snomed.info/sct' },
  { code: 'midw', display: 'Midwifery', system: 'http://snomed.info/sct' },
  { code: 'surg', display: 'Surgery', system: 'http://snomed.info/sct' },
  { code: 'peds', display: 'Pediatrics', system: 'http://snomed.info/sct' },
];

// Appointment type options
const APPOINTMENT_TYPE_OPTIONS = [
  { code: 'CHECKUP', display: 'Check Up', system: 'http://terminology.hl7.org/CodeSystem/v2-0276' },
  { code: 'EMERGENCY', display: 'Emergency', system: 'http://terminology.hl7.org/CodeSystem/v2-0276' },
  { code: 'FOLLOWUP', display: 'Follow Up', system: 'http://terminology.hl7.org/CodeSystem/v2-0276' },
  { code: 'ROUTINE', display: 'Routine', system: 'http://terminology.hl7.org/CodeSystem/v2-0276' },
  { code: 'WALKIN', display: 'Walk In', system: 'http://terminology.hl7.org/CodeSystem/v2-0276' },
];

const AppointmentTab: React.FC<AppointmentTabProps> = ({ patientId }) => {
  // State management
  const [form] = Form.useForm();
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // API hooks
  const {
    data: appointmentsData,
    error: appointmentsError,
    isLoading: isLoadingAppointments,
    refetch,
  } = useGetAppointmentsByPatientIdQuery({ patientId });

  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();

  // API hooks for practitioners and locations
  const { data: practitionersData, isLoading: isLoadingPractitioners } = useGetPractitionerListQuery({
    page: 0,
    pageSize: 100,
  });
  const { data: locationsData, isLoading: isLoadingLocations } = useGetLocationListQuery({
    page: 0,
    pageSize: 100,
  });

  // Extract appointments data
  const appointments = appointmentsData?.entry || [];
  const totalCount = appointmentsData?.total || 0;

  // Extract practitioners and locations data
  const practitioners = practitionersData?.entry || [];
  const locations = locationsData?.entry || [];

  // Filter appointments based on search text
  const filteredAppointments = appointments.filter((appointment: Appointment) =>
    appointment.status.toLowerCase().includes(searchText.toLowerCase()) ||
    (appointment.description?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (appointment.appointmentType?.coding?.[0]?.display || '').toLowerCase().includes(searchText.toLowerCase())
  );

  // Effect to populate form when editing
  useEffect(() => {
    if (isModalVisible && editingAppointment) {
      setTimeout(() => {
        const startDateTime = dayjs(editingAppointment.start);
        const endDateTime = editingAppointment.end ? dayjs(editingAppointment.end) : null;

        // Get practitioner participant
        const practitionerParticipant = editingAppointment.participant.find(p =>
          p.actor.reference.startsWith('Practitioner/')
        );
        const locationParticipant = editingAppointment.participant.find(p =>
          p.actor.reference.startsWith('Location/')
        );

        const formValues = {
          status: editingAppointment.status,
          start: startDateTime,
          end: endDateTime,
          description: editingAppointment.description || '',
          comment: editingAppointment.comment || '',
          priority: editingAppointment.priority,
          serviceCategoryCode: editingAppointment.serviceCategory?.[0]?.coding?.[0]?.code || '',
          serviceTypeCode: editingAppointment.serviceType?.[0]?.coding?.[0]?.code || '',
          specialtyCode: editingAppointment.specialty?.[0]?.coding?.[0]?.code || '',
          appointmentTypeCode: editingAppointment.appointmentType?.coding?.[0]?.code || '',
          practitionerId: practitionerParticipant?.actor.reference?.replace('Practitioner/', '') || '',
          practitionerRequired: practitionerParticipant?.required || 'required',
          practitionerStatus: practitionerParticipant?.status || 'accepted',
          locationId: locationParticipant?.actor.reference?.replace('Location/', '') || '',
        };

        form.setFieldsValue(formValues);
      }, 150);
    } else if (isModalVisible && !editingAppointment) {
      form.resetFields();
      // Set default values for new appointment
      form.setFieldsValue({
        status: 'proposed',
        start: dayjs(),
        end: dayjs().add(30, 'minute'),
        practitionerRequired: 'required',
        practitionerStatus: 'accepted',
        priority: 5,
      });
    }
  }, [isModalVisible, editingAppointment, form]);

  // Form submission handler
  const handleSubmit = async (values: any) => {
    try {
      // Build participant array
      const participants = [];

      // Add patient participant
      participants.push({
        actor: {
          reference: `Patient/${patientId}`,
          display: 'Patient',
        },
        required: 'required' as ParticipantRequired,
        status: 'accepted' as ParticipantStatus,
      });

      // Add practitioner participant if selected
      if (values.practitionerId) {
        const selectedPractitioner = practitioners.find(p => p.id === values.practitionerId);
        participants.push({
          actor: {
            reference: `Practitioner/${values.practitionerId}`,
            display: selectedPractitioner?.name || 'Practitioner',
          },
          required: values.practitionerRequired as ParticipantRequired,
          status: values.practitionerStatus as ParticipantStatus,
          type: [{
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
              code: 'PPRF',
              display: 'primary performer',
            }],
          }],
        });
      }

      // Add location participant if selected
      if (values.locationId) {
        const selectedLocation = locations.find(l => l.id === values.locationId);
        participants.push({
          actor: {
            reference: `Location/${values.locationId}`,
            display: selectedLocation?.name || 'Location',
          },
          required: 'required' as ParticipantRequired,
          status: 'accepted' as ParticipantStatus,
        });
      }

      const formData: CreateAppointmentRequest = {
        status: values.status as AppointmentStatus,
        start: values.start ? values.start.toISOString() : dayjs().toISOString(),
        end: values.end ? values.end.toISOString() : undefined,
        participant: participants,
        description: values.description,
        comment: values.comment,
        priority: values.priority,
      };

      // Add optional service category
      if (values.serviceCategoryCode) {
        const selectedCategory = SERVICE_CATEGORY_OPTIONS.find(cat => cat.code === values.serviceCategoryCode);
        formData.serviceCategory = [{
          coding: [{
            system: selectedCategory?.system || 'http://terminology.hl7.org/CodeSystem/service-category',
            code: values.serviceCategoryCode,
            display: selectedCategory?.display || values.serviceCategoryCode,
          }],
        }];
      }

      // Add optional service type
      if (values.serviceTypeCode) {
        const selectedType = SERVICE_TYPE_OPTIONS.find(type => type.code === values.serviceTypeCode);
        formData.serviceType = [{
          coding: [{
            system: selectedType?.system || 'http://terminology.hl7.org/CodeSystem/service-type',
            code: values.serviceTypeCode,
            display: selectedType?.display || values.serviceTypeCode,
          }],
        }];
      }

      // Add optional specialty
      if (values.specialtyCode) {
        const selectedSpecialty = SPECIALTY_OPTIONS.find(spec => spec.code === values.specialtyCode);
        formData.specialty = [{
          coding: [{
            system: selectedSpecialty?.system || 'http://snomed.info/sct',
            code: values.specialtyCode,
            display: selectedSpecialty?.display || values.specialtyCode,
          }],
        }];
      }

      // Add optional appointment type
      if (values.appointmentTypeCode) {
        const selectedAppType = APPOINTMENT_TYPE_OPTIONS.find(type => type.code === values.appointmentTypeCode);
        formData.appointmentType = {
          coding: [{
            system: selectedAppType?.system || 'http://terminology.hl7.org/CodeSystem/v2-0276',
            code: values.appointmentTypeCode,
            display: selectedAppType?.display || values.appointmentTypeCode,
          }],
        };
      }

      if (editingAppointment) {
        await updateAppointment({
          ...formData,
          id: editingAppointment.id,
        } as Appointment).unwrap();
        message.success('Appointment updated successfully');
      } else {
        await createAppointment(formData).unwrap();
        message.success('Appointment scheduled successfully');
      }

      setIsModalVisible(false);
      setEditingAppointment(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Failed to save appointment. Please try again.');
      console.error('Error saving appointment:', error);
    }
  };

  // Delete handler
  const handleDelete = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId).unwrap();
      message.success('Appointment cancelled successfully');
      refetch();
    } catch (error) {
      message.error('Failed to cancel appointment. Please try again.');
      console.error('Error deleting appointment:', error);
    }
  };

  // Modal handlers
  const showModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
    } else {
      setEditingAppointment(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingAppointment(null);
    form.resetFields();
  };

  // Get status tag color
  const getStatusTagColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'proposed': 'default',
      'pending': 'processing',
      'booked': 'blue',
      'arrived': 'cyan',
      'fulfilled': 'success',
      'cancelled': 'error',
      'noshow': 'red',
      'entered-in-error': 'red',
      'checked-in': 'geekblue',
      'waitlist': 'orange',
    };
    return statusColorMap[status] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Date & Time',
      key: 'dateTime',
      width: '20%',
      render: (_: any, record: Appointment) => (
        <div>
          <div>
            <ClockCircleOutlined className="mr-1" />
            <Text strong>{dayjs(record.start).format('DD/MM/YYYY HH:mm')}</Text>
          </div>
          {record.end && (
            <div>
              <Text type="secondary">
                Duration: {dayjs(record.end).diff(dayjs(record.start), 'minute')} mins
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Type & Status',
      key: 'typeStatus',
      width: '25%',
      render: (_: any, record: Appointment) => (
        <div>
          {record.appointmentType?.coding?.[0]?.display && (
            <div className="mb-1">
              <Tag color="purple">
                {record.appointmentType.coding[0].display}
              </Tag>
            </div>
          )}
          <Tag color={getStatusTagColor(record.status)}>
            {record.status.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      render: (text: string) => (
        text ? <Text>{text}</Text> : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Practitioner',
      key: 'practitioner',
      width: '15%',
      render: (_: any, record: Appointment) => {
        const practitionerParticipant = record.participant.find(p =>
          p.actor.reference.startsWith('Practitioner/')
        );
        if (!practitionerParticipant) return <Text type="secondary">-</Text>;

        const practitionerId = practitionerParticipant.actor.reference.replace('Practitioner/', '');
        const practitioner = practitioners.find(p => p.id === practitionerId);

        return (
          <div>
            <Text>{practitioner?.name || practitionerParticipant.actor.display || 'Unknown'}</Text>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Appointment) => (
        <Space size="small">
          <Tooltip title="Edit Appointment">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
              type="link"
            />
          </Tooltip>
          <Popconfirm
            cancelText="No"
            description="Are you sure you want to cancel this appointment?"
            okText="Yes"
            onConfirm={() => handleDelete(record.id)}
            title="Cancel Appointment"
          >
            <Tooltip title="Cancel Appointment">
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
  if (isLoadingAppointments) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <div style={{ marginTop: 16 }}>Loading appointments...</div>
      </div>
    );
  }

  // Error state
  if (appointmentsError) {
    return (
      <Alert
        action={
          <Button onClick={refetch} size="small" type="primary">
            Retry
          </Button>
        }
        description="Unable to load appointment data. Please try again later."
        message="Error Loading Appointments"
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
              Patient Appointments
            </Title>
            <Text type="secondary">
              Total: {totalCount} appointments | Filtered: {filteredAppointments.length}
            </Text>
          </Col>
          <Col>
            <Button
              icon={<SaveOutlined />}
              onClick={() => showModal()}
              size="large"
              type="primary"
            >
              Schedule New Appointment
            </Button>
          </Col>
        </Row>

        {/* Search Section */}
        <Row className="mb-4" gutter={16}>
          <Col md={8} sm={12} xs={24}>
            <Input.Search
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search appointments..."
              value={searchText}
            />
          </Col>
        </Row>
      </Card>

      {/* Appointments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
          rowKey="id"
          scroll={{ x: 800 }}
          style={{ background: 'white' }}
        />
      </Card>

      {/* Add/Edit Appointment Modal */}
      <Modal
        destroyOnClose
        footer={null}
        onCancel={closeModal}
        open={isModalVisible}
        title={editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        width={900}
      >
        <Form
          key={editingAppointment?.id || 'new'}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Collapse className="mb-4" defaultActiveKey={['basic', 'scheduling', 'classification']}>
            {/* Basic Information */}
            <Collapse.Panel key="basic" header="Basic Appointment Information">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
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
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Priority (1-10)"
                    name="priority"
                  >
                    <InputNumber
                      max={10}
                      min={1}
                      placeholder="Enter priority"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
              >
                <Input placeholder="Enter appointment description" />
              </Form.Item>

              <Form.Item
                label="Comments"
                name="comment"
              >
                <TextArea
                  placeholder="Enter any additional comments..."
                  rows={3}
                />
              </Form.Item>
            </Collapse.Panel>

            {/* Scheduling */}
            <Collapse.Panel key="scheduling" header="Scheduling & Participants">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Start Date & Time"
                    name="start"
                    rules={[{ required: true, message: 'Start date & time is required' }]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Select start date and time"
                      showTime
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="End Date & Time (Optional)"
                    name="end"
                  >
                    <DatePicker
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Select end date and time"
                      showTime
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <UserOutlined className="mr-1" />
                        Practitioner
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
                <Col sm={6} xs={24}>
                  <Form.Item
                    label="Practitioner Required"
                    name="practitionerRequired"
                  >
                    <Select placeholder="Select">
                      {PARTICIPANT_REQUIRED_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={6} xs={24}>
                  <Form.Item
                    label="Practitioner Status"
                    name="practitionerStatus"
                  >
                    <Select placeholder="Select">
                      {PARTICIPANT_STATUS_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
            </Collapse.Panel>

            {/* Classification */}
            <Collapse.Panel key="classification" header="Appointment Classification">
              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Service Category"
                    name="serviceCategoryCode"
                  >
                    <Select allowClear placeholder="Select service category">
                      {SERVICE_CATEGORY_OPTIONS.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                          {option.display}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Service Type"
                    name="serviceTypeCode"
                  >
                    <Select allowClear placeholder="Select service type">
                      {SERVICE_TYPE_OPTIONS.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                          {option.display}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Specialty"
                    name="specialtyCode"
                  >
                    <Select allowClear placeholder="Select specialty">
                      {SPECIALTY_OPTIONS.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                          {option.display}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Appointment Type"
                    name="appointmentTypeCode"
                  >
                    <Select allowClear placeholder="Select appointment type">
                      {APPOINTMENT_TYPE_OPTIONS.map(option => (
                        <Select.Option key={option.code} value={option.code}>
                          {option.display}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
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
                {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentTab;
