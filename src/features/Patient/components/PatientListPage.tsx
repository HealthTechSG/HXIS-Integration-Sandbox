import React, { useState } from 'react';

import {
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from 'antd';
import moment from 'moment';

import type { CreatePatientRequest, Patient } from '@/services/Patient/PatientTypes';
import { useCreatePatientMutation, useUpdatePatientMutation } from '@/services/Patient/PatientService';

import PatientTable from './PatientTable';

const { Title, Text } = Typography;

const PatientListPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [selectedDepartment] = useState<string>('all');
  const [selectedProvider] = useState<string>('all');
  const [selectedStatus] = useState<string>('all');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('my-patients');
  const [form] = Form.useForm();

  // Patient mutations
  const [createPatient, { isLoading: isCreatingPatient }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdatingPatient }] = useUpdatePatientMutation();
  
  const isSubmitting = isCreatingPatient || isUpdatingPatient;


  const handleNewPatient = () => {
    setEditingPatient(null);
    form.resetFields();
    setIsPatientModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    // Pre-fill form with patient data (following Patient type structure)
    form.setFieldsValue({
      firstName: patient.name?.split(' ')[0] || '',
      lastName: patient.name?.split(' ').slice(1).join(' ') || '',
      dateOfBirth: patient.birthdate ? moment(patient.birthdate.toString()) : null,
      gender: patient.gender, // Already in correct format (male/female/other)
      phone: patient.contactNumber || '',
      email: patient.email || '',
      address: patient.address || '',
      postalCode: patient.postalCode || '',
      country: patient.country || 'Singapore',
      mrn: patient.mrn || '',
      nationalId: patient.idNumber || '',
    });
    setIsPatientModalOpen(true);
  };

  const handlePatientSubmit = async (values: any) => {
    try {
      if (editingPatient) {
        // UPDATE PATIENT - Transform form values to Patient format for update
        const updatePatientRequest: Patient = {
          id: editingPatient.id, // Required for update
          name: `${values.firstName} ${values.lastName}`,
          gender: values.gender,
          birthdate: values.dateOfBirth?.format('YYYY-MM-DD'),
          contactNumber: values.phone,
          email: values.email,
          mrn: values.mrn || editingPatient.mrn,
          idType: 'NRIC',
          idNumber: values.nationalId || '',
          active: true,
          address: values.address || '',
          postalCode: values.postalCode || '',
          country: values.country || 'Singapore',
          maritalStatus: '', // Required by Patient type
        };

        console.log('🟢 [PatientListPage] Updating patient:', updatePatientRequest);
        const result = await updatePatient(updatePatientRequest).unwrap();
        message.success(`Patient ${result.name} updated successfully!`);
      } else {
        // CREATE PATIENT - Transform form values to CreatePatientRequest format
        const createPatientRequest: CreatePatientRequest = {
          name: `${values.firstName} ${values.lastName}`,
          gender: values.gender,
          birthdate: values.dateOfBirth?.format('YYYY-MM-DD'),
          contactNumber: values.phone,
          email: values.email,
          mrn: values.mrn || `MRN-${Date.now()}`, // Auto-generate if not provided
          idType: 'NRIC',
          idNumber: values.nationalId || '',
          active: true,
          address: values.address || '',
          postalCode: values.postalCode || '',
          country: values.country || 'Singapore',
        };

        console.log('🟢 [PatientListPage] Creating patient:', createPatientRequest);
        const result = await createPatient(createPatientRequest).unwrap();
        message.success(`Patient ${result.name} created successfully!`);
      }
      
      setIsPatientModalOpen(false);
      setEditingPatient(null);
      form.resetFields();
    } catch (error: any) {
      const actionText = editingPatient ? 'update' : 'create';
      console.error(`Failed to ${actionText} patient:`, error);
      message.error(`Failed to ${actionText} patient. Please try again.`);
    }
  };

  return (
    <div className="bg-[#cbeafe] p-4 rounded-tl-lg min-h-full">
      {/* === EPIC-Style Header === */}
      <div className="bg-white p-4 px-5 rounded-lg mb-4 shadow-lg">
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} className="m-0 text-blue-900 text-xl">
              <TeamOutlined /> Patient Lookup
            </Title>
            <Text type="secondary" className="text-sm">
              Search and manage patient records
            </Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                size="large"
                onClick={handleNewPatient}
                className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
              >
                New Patient
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* === EPIC-Style Patient Tabs === */}
      <div className="bg-white rounded-lg shadow-lg">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="mx-5"
          tabBarStyle={{ marginBottom: 0, borderBottom: '1px solid #d9d9d9' }}
          items={[
            {
              key: 'my-patients',
              label: (
                <Space>
                  Patient List
                </Space>
              ),
              children: (
                <div className="px-5 pb-5">
                  <PatientTable 
                    searchQuery={searchQuery}
                    department={selectedDepartment}
                    provider={selectedProvider}
                    status={selectedStatus}
                    onEditPatient={handleEditPatient}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* === New Patient Registration Modal === */}
      <Modal
        title={
          <div className="text-blue-900 text-lg">
            <UserAddOutlined /> {editingPatient ? 'Edit Patient' : 'Register New Patient'}
          </div>
        }
        open={isPatientModalOpen}
        onCancel={() => {
          setIsPatientModalOpen(false);
          setEditingPatient(null);
          form.resetFields();
        }}
        width={800}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsPatientModalOpen(false);
              setEditingPatient(null);
              form.resetFields();
            }} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            loading={isSubmitting}
            className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
          >
            {isSubmitting ? (editingPatient ? 'Updating...' : 'Creating...') : (editingPatient ? 'Update Patient' : 'Register Patient')}
          </Button>,
        ]}
      >
        {isSubmitting && (
          <div className="text-center mb-5">
            <Spin tip={editingPatient ? "Updating patient..." : "Creating patient..."}>
              <div className="min-h-[50px]" />
            </Spin>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePatientSubmit}
          initialValues={{ gender: 'male' }}
          disabled={isSubmitting}
        >
          <Divider orientation="left" className="mt-0">Demographics</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker 
                  className="w-full" 
                  format="MM/DD/YYYY"
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input placeholder="Email address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
              >
                <Input placeholder="Street address (e.g., 1 North, Buona Vista Link)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
              >
                <Input placeholder="139691" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Country"
                name="country"
              >
                <Input placeholder="Singapore" defaultValue="Singapore" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Identifiers</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Medical Record Number (MRN)"
                name="mrn"
                extra="Auto-generated if left blank"
              >
                <Input placeholder="MRN (optional)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="National ID (NRIC/FIN)"
                name="nationalId"
              >
                <Input placeholder="S1234567A" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientListPage;