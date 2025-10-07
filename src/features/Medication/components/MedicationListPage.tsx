import {
  MedicineBoxOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
  message,
} from 'antd';
import React, { useState } from 'react';

import MedicationTable from './MedicationTable';
import { useCreateMedicationMutation, useUpdateMedicationMutation } from '@/services/Medication/MedicationService';
import type { CreateMedicationRequest, Medication } from '@/services/Medication/MedicationTypes';
import { MEDICATION_STATUS_OPTIONS, COMMON_MEDICATION_CODES, COMMON_DOSE_FORM_CODES } from '@/services/Medication/MedicationTypes';

const { Text, Title } = Typography;

const MedicationListPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [selectedStatus] = useState<string>('all');
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [activeTab, setActiveTab] = useState('medication-list');
  const [form] = Form.useForm();

  // Medication mutations
  const [createMedication, { isLoading: isCreatingMedication }] = useCreateMedicationMutation();
  const [updateMedication, { isLoading: isUpdatingMedication }] = useUpdateMedicationMutation();

  const isSubmitting = isCreatingMedication || isUpdatingMedication;

  const handleNewMedication = () => {
    setEditingMedication(null);
    form.resetFields();
    setIsMedicationModalOpen(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    // Pre-fill form with medication data
    form.setFieldsValue({
      code: medication.code,
      display: medication.display,
      system: medication.system || 'http://snomed.info/sct',
      status: medication.status,
      formCode: medication.formCode || '',
      formDisplay: medication.formDisplay || '',
      formSystem: medication.formSystem || 'http://snomed.info/sct',
    });
    setIsMedicationModalOpen(true);
  };

  const handleMedicationSubmit = async (values: any) => {
    try {
      if (editingMedication) {
        // UPDATE MEDICATION - Transform form values to Medication format for update
        const updateMedicationRequest: Medication = {
          id: editingMedication.id, // Required for update
          code: values.code || editingMedication.code, // Ensure required field is present
          display: values.display || editingMedication.display, // Ensure required field is present
          system: values.system || editingMedication.system || 'http://snomed.info/sct',
          status: values.status || editingMedication.status,
          formCode: values.formCode || editingMedication.formCode,
          formDisplay: values.formDisplay || editingMedication.formDisplay,
          formSystem: values.formSystem || editingMedication.formSystem || 'http://snomed.info/sct',
        };

        console.log('🟢 [MedicationListPage] Updating medication:', updateMedicationRequest);
        const result = await updateMedication(updateMedicationRequest).unwrap();
        message.success(`Medication ${result.display} updated successfully!`);
      } else {
        // CREATE MEDICATION - Transform form values to CreateMedicationRequest format
        const createMedicationRequest: CreateMedicationRequest = {
          code: values.code,
          display: values.display,
          system: values.system || 'http://snomed.info/sct',
          status: values.status,
          formCode: values.formCode || undefined,
          formDisplay: values.formDisplay || undefined,
          formSystem: values.formSystem || 'http://snomed.info/sct',
        };

        console.log('🟢 [MedicationListPage] Creating medication:', createMedicationRequest);
        const result = await createMedication(createMedicationRequest).unwrap();
        message.success(`Medication ${result.display} created successfully!`);
      }

      setIsMedicationModalOpen(false);
      setEditingMedication(null);
      form.resetFields();
    } catch (error: any) {
      const actionText = editingMedication ? 'update' : 'create';
      console.error(`Failed to ${actionText} medication:`, error);
      message.error(`Failed to ${actionText} medication. Please try again.`);
    }
  };

  const handlePresetMedication = (medicationCode: any) => {
    form.setFieldsValue({
      code: medicationCode.code,
      display: medicationCode.display,
      system: medicationCode.system,
    });
  };

  const handlePresetForm = (formCode: any) => {
    form.setFieldsValue({
      formCode: formCode.code,
      formDisplay: formCode.display,
      formSystem: formCode.system,
    });
  };

  return (
    <div className="min-h-full rounded-tl-lg bg-[#cbeafe] p-4">
      {/* === EPIC-Style Header === */}
      <div className="mb-4 rounded-lg bg-white p-4 px-5 shadow-lg">
        <Row align="middle" justify="space-between">
          <Col>
            <Title className="m-0 text-xl text-blue-900" level={3}>
              <MedicineBoxOutlined /> Medication Lookup
            </Title>
            <Text className="text-sm" type="secondary">
              Search and manage medication records
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                className="border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600"
                icon={<PlusOutlined />}
                onClick={handleNewMedication}
                size="large"
                type="primary"
              >
                New Medication
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* === EPIC-Style Medication Tabs === */}
      <div className="rounded-lg bg-white shadow-lg">
        <Tabs
          activeKey={activeTab}
          className="mx-5"
          items={[
            {
              key: 'medication-list',
              label: (
                <Space>
                  Medication List
                </Space>
              ),
              children: (
                <div className="px-5 pb-5">
                  <MedicationTable
                    onEditMedication={handleEditMedication}
                    searchQuery={searchQuery}
                    status={selectedStatus}
                  />
                </div>
              ),
            },
          ]}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: 0, borderBottom: '1px solid #d9d9d9' }}
        />
      </div>

      {/* === New Medication Registration Modal === */}
      <Modal
        footer={[
          <Button
            key="cancel"
            disabled={isSubmitting}
            onClick={() => {
              setIsMedicationModalOpen(false);
              setEditingMedication(null);
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
            {isSubmitting ? (editingMedication ? 'Updating...' : 'Creating...') : (editingMedication ? 'Update Medication' : 'Register Medication')}
          </Button>,
        ]}
        onCancel={() => {
          setIsMedicationModalOpen(false);
          setEditingMedication(null);
          form.resetFields();
        }}
        open={isMedicationModalOpen}
        title={
          <div className="text-lg text-blue-900">
            <MedicineBoxOutlined /> {editingMedication ? 'Edit Medication' : 'Register New Medication'}
          </div>
        }
        width={900}
      >
        {isSubmitting && (
          <div className="mb-5 text-center">
            <Spin tip={editingMedication ? "Updating medication..." : "Creating medication..."}>
              <div className="min-h-[50px]" />
            </Spin>
          </div>
        )}
        <Form
          disabled={isSubmitting}
          form={form}
          initialValues={{
            status: 'active',
            system: 'http://snomed.info/sct',
            formSystem: 'http://snomed.info/sct',
          }}
          layout="vertical"
          onFinish={handleMedicationSubmit}
        >
          <Divider className="mt-0" orientation="left">Medication Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Medication Code"
                name="code"
                rules={[{ required: true, message: 'Medication code is required' }]}
                tooltip="SNOMED CT code for the medication"
              >
                <Input placeholder="Enter SNOMED code (e.g., 90332006)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Status is required' }]}
              >
                <Select placeholder="Select status">
                  {MEDICATION_STATUS_OPTIONS.map(option => (
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
                label="Display Name"
                name="display"
                rules={[{ required: true, message: 'Display name is required' }]}
                tooltip="Human-readable name for the medication"
              >
                <Input placeholder="Enter medication name (e.g., Paracetamol)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="System"
                name="system"
                tooltip="Code system (typically SNOMED CT)"
              >
                <Input placeholder="http://snomed.info/sct" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Dose Form Information (Optional)</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Form Code"
                name="formCode"
                tooltip="SNOMED CT code for the dose form"
              >
                <Input placeholder="Enter form code (e.g., 385268001)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Form Display"
                name="formDisplay"
                tooltip="Human-readable name for the dose form"
              >
                <Input placeholder="Enter form name (e.g., Oral dose form)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Form System"
                name="formSystem"
                tooltip="Code system for the dose form"
              >
                <Input placeholder="http://snomed.info/sct" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Quick Presets</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <div className="mb-2 text-sm font-semibold">Common Medications:</div>
              <div className="space-y-1">
                {COMMON_MEDICATION_CODES.slice(0, 4).map(med => (
                  <Button
                    key={med.code}
                    className="mb-1 mr-1"
                    onClick={() => handlePresetMedication(med)}
                    size="small"
                    type="dashed"
                  >
                    {med.display.substring(0, 25)}...
                  </Button>
                ))}
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-2 text-sm font-semibold">Common Dose Forms:</div>
              <div className="space-y-1">
                {COMMON_DOSE_FORM_CODES.slice(0, 4).map(form => (
                  <Button
                    key={form.code}
                    className="mb-1 mr-1"
                    onClick={() => handlePresetForm(form)}
                    size="small"
                    type="dashed"
                  >
                    {form.display}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicationListPage;