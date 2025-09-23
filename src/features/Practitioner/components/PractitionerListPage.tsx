import React, { useState } from 'react';

import {
  UserOutlined,
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
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from 'antd';
import moment from 'moment';

import type { CreatePractitionerRequest, Practitioner } from '@/services/Practitioner/PractitionerTypes';
import { useCreatePractitionerMutation, useUpdatePractitionerMutation } from '@/services/Practitioner/PractitionerService';

import PractitionerTable from './PractitionerTable';

const { Title, Text } = Typography;

// Specialty options matching FHIR codes from PractitionerMapperUtil
const SPECIALTY_OPTIONS = [
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Emergency Medicine', label: 'Emergency Medicine' },
  { value: 'Family Medicine', label: 'Family Medicine' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Anesthesiology', label: 'Anesthesiology' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Medical Doctor', label: 'Medical Doctor' },
  { value: 'Certified Nurse Practitioner', label: 'Certified Nurse Practitioner' },
  { value: 'Registered Nurse', label: 'Registered Nurse' },
  { value: 'Physical Therapist', label: 'Physical Therapist' },
];

const PractitionerListPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [selectedDepartment] = useState<string>('all');
  const [selectedSpecialty] = useState<string>('all');
  const [selectedStatus] = useState<string>('all');
  const [isPractitionerModalOpen, setIsPractitionerModalOpen] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
  const [activeTab, setActiveTab] = useState('my-practitioners');
  const [form] = Form.useForm();

  // Practitioner mutations
  const [createPractitioner, { isLoading: isCreatingPractitioner }] = useCreatePractitionerMutation();
  const [updatePractitioner, { isLoading: isUpdatingPractitioner }] = useUpdatePractitionerMutation();
  
  const isSubmitting = isCreatingPractitioner || isUpdatingPractitioner;

  const handleNewPractitioner = () => {
    setEditingPractitioner(null);
    form.resetFields();
    setIsPractitionerModalOpen(true);
  };

  const handleEditPractitioner = (practitioner: Practitioner) => {
    setEditingPractitioner(practitioner);
    // Pre-fill form with practitioner data (following FHIR structure)
    const nameParts = practitioner.name?.split(' ') || [];
    const givenNames = nameParts.slice(0, -1);
    const familyName = nameParts[nameParts.length - 1] || '';
    
    form.setFieldsValue({
      givenName: givenNames.length > 0 ? givenNames : [''],
      familyName: familyName,
      birthDate: practitioner.birthdate ? moment(practitioner.birthdate.toString()) : null,
      gender: practitioner.gender, // Already in correct format (male/female/other/unknown)
      active: practitioner.active,
      workPhone: practitioner.contactNumber || '',
      workEmail: practitioner.email || '',
      addressLine: practitioner.address || '',
      city: practitioner.city || '',
      state: practitioner.state || '',
      postalCode: practitioner.postalCode || '',
      country: practitioner.country || 'Singapore',
      specialty: practitioner.specialty || '',
    });
    setIsPractitionerModalOpen(true);
  };

  const handlePractitionerSubmit = async (values: any) => {
    try {
      if (editingPractitioner) {
        // UPDATE PRACTITIONER - Transform form values to Practitioner format for update
        const updatePractitionerRequest: CreatePractitionerRequest & { id: string } = {
          id: editingPractitioner.id, // Required for update
          name: `${values.givenName || ''} ${values.familyName || ''}`.trim(),
          gender: values.gender,
          birthdate: values.birthDate?.format('YYYY-MM-DD'),
          contactNumber: values.workPhone || '',
          email: values.workEmail || '',
          active: values.active !== undefined ? values.active : true,
          address: values.addressLine || '',
          city: values.city || '',
          state: values.state || '',
          postalCode: values.postalCode || '',
          country: values.country || 'Singapore',
          specialty: values.specialty,
        };

        console.log('🟢 [PractitionerListPage] Updating practitioner:', updatePractitionerRequest);
        const result = await updatePractitioner(updatePractitionerRequest).unwrap();
        message.success(`Practitioner ${result.name} updated successfully!`);
      } else {
        // CREATE PRACTITIONER - Transform form values to CreatePractitionerRequest format
        const createPractitionerRequest: CreatePractitionerRequest = {
          name: `${values.givenName || ''} ${values.familyName || ''}`.trim(),
          gender: values.gender,
          birthdate: values.birthDate?.format('YYYY-MM-DD'),
          contactNumber: values.workPhone || '',
          email: values.workEmail || '',
          active: values.active !== undefined ? values.active : true,
          address: values.addressLine || '',
          city: values.city || '',
          state: values.state || '',
          postalCode: values.postalCode || '',
          country: values.country || 'Singapore',
          specialty: values.specialty,
        };

        console.log('🟢 [PractitionerListPage] Creating practitioner:', createPractitionerRequest);
        const result = await createPractitioner(createPractitionerRequest).unwrap();
        message.success(`Practitioner ${result.name} created successfully!`);
      }
      
      setIsPractitionerModalOpen(false);
      setEditingPractitioner(null);
      form.resetFields();
    } catch (error: any) {
      const actionText = editingPractitioner ? 'update' : 'create';
      console.error(`Failed to ${actionText} practitioner:`, error);
      message.error(`Failed to ${actionText} practitioner. Please try again.`);
    }
  };

  return (
    <div className="bg-[#cbeafe] p-4 rounded-tl-lg min-h-full">
      {/* === EPIC-Style Header === */}
      <div className="bg-white p-4 px-5 rounded-lg mb-4 shadow-lg">
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} className="m-0 text-blue-900 text-xl">
              <UserOutlined /> Practitioner Lookup
            </Title>
            <Text type="secondary" className="text-sm">
              Search and manage practitioner records
            </Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                size="large"
                onClick={handleNewPractitioner}
                className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
              >
                New Practitioner
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* === EPIC-Style Practitioner Tabs === */}
      <div className="bg-white rounded-lg shadow-lg">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="mx-5"
          tabBarStyle={{ marginBottom: 0, borderBottom: '1px solid #d9d9d9' }}
          items={[
            {
              key: 'my-practitioners',
              label: (
                <Space>
                  Practitioner List
                </Space>
              ),
              children: (
                <div className="px-5 pb-5">
                  <PractitionerTable 
                    searchQuery={searchQuery}
                    department={selectedDepartment}
                    specialty={selectedSpecialty}
                    status={selectedStatus}
                    onEditPractitioner={handleEditPractitioner}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* === New Practitioner Registration Modal === */}
      <Modal
        title={
          <div className="text-blue-900 text-lg">
            <UserAddOutlined /> {editingPractitioner ? 'Edit Practitioner' : 'Register New Practitioner'}
          </div>
        }
        open={isPractitionerModalOpen}
        onCancel={() => {
          setIsPractitionerModalOpen(false);
          setEditingPractitioner(null);
          form.resetFields();
        }}
        width={800}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsPractitionerModalOpen(false);
              setEditingPractitioner(null);
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
            {isSubmitting ? (editingPractitioner ? 'Updating...' : 'Creating...') : (editingPractitioner ? 'Update Practitioner' : 'Register Practitioner')}
          </Button>,
        ]}
      >
        {isSubmitting && (
          <div className="text-center mb-5">
            <Spin tip={editingPractitioner ? "Updating practitioner..." : "Creating practitioner..."}>
              <div className="min-h-[50px]" />
            </Spin>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePractitionerSubmit}
          initialValues={{ 
            gender: 'male', 
            active: true,
            country: 'Singapore'
          }}
          disabled={isSubmitting}
        >
          <Divider orientation="left" className="mt-0">Name Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name (Given Name)"
                name="givenName"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name (Family Name)"
                name="familyName"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Birth Date"
                name="birthDate"
                rules={[{ required: true, message: 'Birth date is required' }]}
              >
                <DatePicker 
                  className="w-full" 
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  placeholder="Select birth date"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Gender is required' }]}
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
                label="Active Status"
                name="active"
                tooltip="Whether the practitioner record is active"
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Contact Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Work Phone"
                name="workPhone"
                rules={[
                  { pattern: /^\+?[\d\s-()]+$/, message: 'Please enter a valid phone number' }
                ]}
                tooltip="Primary work contact number (e.g., +65 6123 4567)"
              >
                <Input placeholder="Work phone number (e.g., +65 6123 4567)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Work Email"
                name="workEmail"
                rules={[
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
                tooltip="Primary work email address"
              >
                <Input placeholder="Work email address" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Address Information</Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Address Line"
                name="addressLine"
                tooltip="Primary address line (street address)"
              >
                <Input placeholder="Street address (e.g., 271 Bt Timah Rd #02-17)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="City"
                name="city"
                tooltip="City or locality"
              >
                <Input placeholder="Singapore" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="State/Province"
                name="state"
                tooltip="State, province, or region"
              >
                <Input placeholder="SG" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
                tooltip="Postal or zip code"
              >
                <Input placeholder="259708" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                tooltip="Country name"
              >
                <Input placeholder="Singapore" defaultValue="Singapore" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Professional Qualification</Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Primary Specialty"
                name="specialty"
                rules={[{ required: true, message: 'Please enter or select a specialty' }]}
                tooltip="Primary medical or healthcare specialty. You can select from the list or enter a custom specialty."
              >
                <Select 
                  placeholder="Select or enter primary specialty"
                  className="w-full"
                  showSearch
                  allowClear
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                    </div>
                  )}
                  onSearch={(searchText) => {
                    // Allow custom input by setting the value when user types
                    if (searchText && !SPECIALTY_OPTIONS.some(option => 
                      option.value.toLowerCase() === searchText.toLowerCase()
                    )) {
                      // This is a custom entry, we'll handle it in onBlur or onPressEnter
                    }
                  }}
                  onBlur={(e) => {
                    const inputValue = (e.target as HTMLInputElement).value;
                    if (inputValue && !form.getFieldValue('specialty')) {
                      // Set custom value if nothing is selected but there's text
                      form.setFieldValue('specialty', inputValue);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      const inputValue = target.value;
                      if (inputValue && !SPECIALTY_OPTIONS.some(option => 
                        option.value.toLowerCase() === inputValue.toLowerCase()
                      )) {
                        // Set custom value when Enter is pressed
                        form.setFieldValue('specialty', inputValue);
                        e.preventDefault();
                      }
                    }
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={SPECIALTY_OPTIONS}
                  notFoundContent="Type and press Enter to add custom specialty"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PractitionerListPage;