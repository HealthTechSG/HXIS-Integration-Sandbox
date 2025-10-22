
import {
  EnvironmentOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import React, { useState } from 'react';

import LocationTable from './LocationTable';
import { useCreateLocationMutation, useUpdateLocationMutation } from '@/services/Location/LocationService';
import type { CreateLocationRequest, Location } from '@/services/Location/LocationTypes';

const { Text, Title } = Typography;


const LocationListPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [selectedStatus] = useState<string>('all');
  const [selectedType] = useState<string>('all');
  const [selectedPhysicalType] = useState<string>('all');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [form] = Form.useForm();

  // Location mutations
  const [createLocation, { isLoading: isCreatingLocation }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation();
  
  const isSubmitting = isCreatingLocation || isUpdatingLocation;

  const handleNewLocation = () => {
    setEditingLocation(null);
    form.resetFields();
    setIsLocationModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    // Pre-fill form with location data
    const firstHours = location.hoursOfOperation?.[0];
    form.setFieldsValue({
      name: location.name,
      status: location.status,
      alias: location.alias || [],
      description: location.description || '',
      phone: location.contactNumber || '',
      email: location.email || '',
      addressLine: location.address || '',
      city: location.city || '',
      postalCode: location.postalCode || '',
      country: location.country || 'SG',
      longitude: location.longitude,
      latitude: location.latitude,
      altitude: location.altitude,
      daysOfWeek: firstHours?.daysOfWeek || [],
      allDay: firstHours?.allDay || false,
      openingTime: firstHours?.openingTime || '',
      closingTime: firstHours?.closingTime || '',
    });
    setIsLocationModalOpen(true);
  };

  const handleLocationSubmit = async (values: any) => {
    try {
      if (editingLocation) {
        // UPDATE LOCATION - Transform form values to Location format for update
        // Build hours of operation from form values
        const hoursOfOperation = values.daysOfWeek && values.daysOfWeek.length > 0 ? [{
          daysOfWeek: values.daysOfWeek,
          allDay: values.allDay || false,
          openingTime: !values.allDay ? values.openingTime : undefined,
          closingTime: !values.allDay ? values.closingTime : undefined,
        }] : [];

        const updateLocationRequest: CreateLocationRequest & { id: string } = {
          id: editingLocation.id, // Required for update
          name: values.name,
          status: values.status,
          alias: values.alias || [],
          description: values.description || '',
          contactNumber: values.phone || '',
          email: values.email || '',
          address: values.addressLine || '',
          city: values.city || '',
          postalCode: values.postalCode || '',
          country: values.country || 'SG',
          longitude: values.longitude,
          latitude: values.latitude,
          altitude: values.altitude,
          hoursOfOperation,
        };

        console.log('🟢 [LocationListPage] Updating location:', updateLocationRequest);
        const result = await updateLocation(updateLocationRequest).unwrap();
        message.success(`Location ${result.name} updated successfully!`);
      } else {
        // CREATE LOCATION - Transform form values to CreateLocationRequest format
        // Build hours of operation from form values
        const hoursOfOperation = values.daysOfWeek && values.daysOfWeek.length > 0 ? [{
          daysOfWeek: values.daysOfWeek,
          allDay: values.allDay || false,
          openingTime: !values.allDay ? values.openingTime : undefined,
          closingTime: !values.allDay ? values.closingTime : undefined,
        }] : [];

        const createLocationRequest: CreateLocationRequest = {
          name: values.name,
          status: values.status,
          alias: values.alias || [],
          description: values.description || '',
          contactNumber: values.phone || '',
          email: values.email || '',
          address: values.addressLine || '',
          city: values.city || '',
          postalCode: values.postalCode || '',
          country: values.country || 'SG',
          longitude: values.longitude,
          latitude: values.latitude,
          altitude: values.altitude,
          hoursOfOperation,
        };

        console.log('🟢 [LocationListPage] Creating location:', createLocationRequest);
        const result = await createLocation(createLocationRequest).unwrap();
        message.success(`Location ${result.name} created successfully!`);
      }
      
      setIsLocationModalOpen(false);
      setEditingLocation(null);
      form.resetFields();
    } catch (error: any) {
      const actionText = editingLocation ? 'update' : 'create';
      console.error(`Failed to ${actionText} location:`, error);
      message.error(`Failed to ${actionText} location. Please try again.`);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-tl-lg bg-[#cbeafe] p-4">
      {/* === EPIC-Style Header === */}
      <div className="mb-4 rounded-lg bg-white p-2 px-4 shadow-lg flex-shrink-0">
        <Row align="middle" justify="space-between">
          <Col>
            <Title className="m-0 text-base text-blue-900" level={4}>
              <EnvironmentOutlined /> Location Lookup
            </Title>
            <Text className="text-xs" type="secondary">
              Search and manage healthcare location records
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                className="border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600"
                icon={<PlusOutlined />}
                onClick={handleNewLocation}
                size="middle"
                type="primary"
              >
                New Location
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* === Location Table === */}
      <div className="rounded-lg bg-white shadow-lg flex-1 flex flex-col overflow-hidden p-5">
        <LocationTable
          onEditLocation={handleEditLocation}
          physicalType={selectedPhysicalType}
          searchQuery={searchQuery}
          status={selectedStatus}
          type={selectedType}
        />
      </div>

      {/* === New Location Registration Modal === */}
      <Modal
        footer={[
          <Button 
            key="cancel" 
            disabled={isSubmitting} 
            onClick={() => {
              setIsLocationModalOpen(false);
              setEditingLocation(null);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            className="border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600" 
            loading={isSubmitting}
            onClick={() => form.submit()}
            type="primary"
          >
            {isSubmitting ? (editingLocation ? 'Updating...' : 'Creating...') : (editingLocation ? 'Update Location' : 'Register Location')}
          </Button>,
        ]}
        onCancel={() => {
          setIsLocationModalOpen(false);
          setEditingLocation(null);
          form.resetFields();
        }}
        open={isLocationModalOpen}
        title={
          <div className="text-lg text-blue-900">
            <EnvironmentOutlined /> {editingLocation ? 'Edit Location' : 'Register New Location'}
          </div>
        }
        width={900}
      >
        {isSubmitting && (
          <div className="mb-5 text-center">
            <Spin tip={editingLocation ? "Updating location..." : "Creating location..."}>
              <div className="min-h-[50px]" />
            </Spin>
          </div>
        )}
        <Form
          disabled={isSubmitting}
          form={form}
          initialValues={{ 
            status: 'active', 
            country: 'SG',
            allDay: false
          }}
          layout="vertical"
          onFinish={handleLocationSubmit}
        >
          <Divider className="mt-0" orientation="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Location Name"
                name="name"
                rules={[{ required: true, message: 'Location name is required' }]}
              >
                <Input placeholder="Enter location name (e.g., Tan Tock Seng Hospital)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Status is required' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="suspended">Suspended</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Aliases"
                name="alias"
                tooltip="Alternative names or abbreviations for the location (e.g., TTSH, WH)"
              >
                <Select
                  mode="tags"
                  placeholder="Enter aliases (press Enter to add)"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Description"
                name="description"
                tooltip="Additional description or notes about the location"
              >
                <Input.TextArea 
                  placeholder="Enter location description" 
                  rows={2}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Contact Information (Telecom)</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { pattern: /^\+?[\d\s-()]+$/, message: 'Please enter a valid phone number' }
                ]}
                tooltip="Primary phone number (e.g., +6500001111)"
              >
                <Input placeholder="+6500001111" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
                tooltip="Primary email address (e.g., ttsh@domain.com)"
              >
                <Input placeholder="ttsh@domain.com" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Address Information</Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Address Line"
                name="addressLine"
                tooltip="Complete address line (e.g., Jalan Tan Tock Seng, Tan Tock Seng Hospital)"
              >
                <Input placeholder="Jalan Tan Tock Seng, Tan Tock Seng Hospital" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="City"
                name="city"
                tooltip="City name"
              >
                <Input placeholder="Singapore" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
                tooltip="Postal code (e.g., 62566012)"
              >
                <Input placeholder="62566012" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Country Code"
                name="country"
                tooltip="Country code (e.g., SG)"
              >
                <Input defaultValue="SG" placeholder="SG" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Coordinates</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[
                  { 
                    validator: (_, value) => {
                      if (value !== undefined && (value < -180 || value > 180)) {
                        return Promise.reject(new Error('Longitude must be between -180 and 180'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                tooltip="Longitude coordinate (-180 to 180)"
              >
                <InputNumber 
                  className="w-full" 
                  max={180}
                  min={-180}
                  placeholder="Longitude"
                  step={0.000001}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  { 
                    validator: (_, value) => {
                      if (value !== undefined && (value < -90 || value > 90)) {
                        return Promise.reject(new Error('Latitude must be between -90 and 90'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                tooltip="Latitude coordinate (-90 to 90)"
              >
                <InputNumber 
                  className="w-full" 
                  max={90}
                  min={-90}
                  placeholder="Latitude"
                  step={0.000001}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Altitude"
                name="altitude"
                tooltip="Altitude in meters above sea level"
              >
                <InputNumber 
                  className="w-full" 
                  placeholder="Altitude (m)"
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Hours of Operation</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Days of Week"
                name="daysOfWeek"
                tooltip="Select operating days"
              >
                <Select
                  mode="multiple"
                  placeholder="Select days of operation"
                  options={[
                    { value: 'mon', label: 'Monday' },
                    { value: 'tue', label: 'Tuesday' },
                    { value: 'wed', label: 'Wednesday' },
                    { value: 'thu', label: 'Thursday' },
                    { value: 'fri', label: 'Friday' },
                    { value: 'sat', label: 'Saturday' },
                    { value: 'sun', label: 'Sunday' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="All Day"
                name="allDay"
                tooltip="Is this location open 24 hours?"
                valuePropName="checked"
              >
                <Select placeholder="Select all day option">
                  <Select.Option value={true}>Yes - Open 24 hours</Select.Option>
                  <Select.Option value={false}>No - Specific hours</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.allDay !== currentValues.allDay}
          >
            {({ getFieldValue }) =>
              getFieldValue('allDay') === false && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Opening Time"
                      name="openingTime"
                      tooltip="Opening time (e.g., 08:00:00)"
                    >
                      <Input placeholder="08:00:00" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Closing Time"
                      name="closingTime"
                      tooltip="Closing time (e.g., 17:00:00)"
                    >
                      <Input placeholder="17:00:00" />
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LocationListPage;