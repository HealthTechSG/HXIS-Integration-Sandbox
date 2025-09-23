import {
  PlusOutlined,
  UnorderedListOutlined,
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
  Tabs,
  Typography,
  message,
  DatePicker,
} from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';

import ListTable from './ListTable';
import {
  useCreateListMutation,
  useUpdateListMutation,
  LIST_STATUS_OPTIONS,
  LIST_MODE_OPTIONS,
  LIST_CODE_OPTIONS,
  COMMON_LIST_TEMPLATES,
} from '@/services/List';
import type { CreateListRequest, List } from '@/services/List';
import { useGetPatientListQuery } from '@/services/Patient/PatientService';
import { useGetAllergyIntoleranceListByPatientIdQuery } from '@/services/AllergyIntolerance/AllergyIntoleranceService';

const { Text, Title } = Typography;

const ListListPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [selectedStatus] = useState<string>('all');
  const [selectedCode] = useState<string>('all');
  const [selectedPatient] = useState<string>('');
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [activeTab, setActiveTab] = useState('list-list');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedAllergyIntolerances, setSelectedAllergyIntolerances] = useState<string[]>([]);
  const [form] = Form.useForm();

  // List mutations
  const [createList, { isLoading: isCreatingList }] = useCreateListMutation();
  const [updateList, { isLoading: isUpdatingList }] = useUpdateListMutation();

  // Fetch patients for dropdown
  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatientListQuery({
    page: 0,
    pageSize: 100,
  });

  // Fetch allergy intolerances for selected patient
  const { data: allergyIntolerancesData, isLoading: isLoadingAllergyIntolerances } =
    useGetAllergyIntoleranceListByPatientIdQuery(selectedPatientId, {
      skip: !selectedPatientId,
    });

  const isSubmitting = isCreatingList || isUpdatingList;

  const handleNewList = () => {
    setEditingList(null);
    setSelectedPatientId('');
    setSelectedAllergyIntolerances([]);
    form.resetFields();
    setIsListModalOpen(true);
  };

  const handleEditList = (list: List) => {
    setEditingList(list);

    // Set patient ID and allergy intolerances from existing list
    setSelectedPatientId(list.subject);

    // Extract allergy intolerance IDs from entries
    const allergyIds = list.entries
      ?.filter(entry => entry.type === 'AllergyIntolerance')
      ?.map(entry => entry.reference) || [];
    setSelectedAllergyIntolerances(allergyIds);

    // Pre-fill form with list data
    form.setFieldsValue({
      title: list.title,
      status: list.status,
      mode: list.mode,
      code: list.code,
      codeDisplay: list.codeDisplay,
      codeSystem: list.codeSystem || 'https://r4.fhir.space/codesystem-list-example-codes.html',
      subject: list.subject,
      date: list.date ? dayjs(list.date) : null,
      entries: list.entries || [],
    });
    setIsListModalOpen(true);
  };

  const handleListSubmit = async (values: any) => {
    try {
      // Transform selected allergy intolerances to entries format
      const entries = selectedAllergyIntolerances.map(allergyId => ({
        reference: allergyId,
        type: 'AllergyIntolerance',
        date: new Date().toISOString(),
      }));

      if (editingList) {
        // UPDATE LIST - Transform form values to List format for update
        const updateListRequest: CreateListRequest & { id: string } = {
          id: editingList.id, // Required for update
          title: values.title,
          status: values.status,
          mode: values.mode,
          code: values.code,
          codeDisplay: values.codeDisplay,
          codeSystem: values.codeSystem || 'https://r4.fhir.space/codesystem-list-example-codes.html',
          subject: values.subject,
          date: values.date ? values.date.toISOString() : new Date().toISOString(),
          entries,
        };

        console.log('🟢 [ListListPage] Updating list:', updateListRequest);
        const result = await updateList(updateListRequest).unwrap();
        message.success(`List "${result.title}" updated successfully!`);
      } else {
        // CREATE LIST - Transform form values to CreateListRequest format
        const createListRequest: CreateListRequest = {
          title: values.title,
          status: values.status,
          mode: values.mode,
          code: values.code,
          codeDisplay: values.codeDisplay,
          codeSystem: values.codeSystem || 'https://r4.fhir.space/codesystem-list-example-codes.html',
          subject: values.subject,
          date: values.date ? values.date.toISOString() : new Date().toISOString(),
          entries,
        };

        console.log('🟢 [ListListPage] Creating list:', createListRequest);
        const result = await createList(createListRequest).unwrap();
        message.success(`List "${result.title}" created successfully!`);
      }

      setIsListModalOpen(false);
      setEditingList(null);
      setSelectedPatientId('');
      setSelectedAllergyIntolerances([]);
      form.resetFields();
    } catch (error: any) {
      const actionText = editingList ? 'update' : 'create';
      console.error(`Failed to ${actionText} list:`, error);
      message.error(`Failed to ${actionText} list. Please try again.`);
    }
  };

  const handleApplyTemplate = (templateCode: string) => {
    const template = COMMON_LIST_TEMPLATES.find(t => t.code === templateCode);
    if (template) {
      form.setFieldsValue({
        title: template.title,
        code: template.code,
        codeDisplay: template.codeDisplay,
        status: template.status,
        mode: template.mode,
        codeSystem: 'https://r4.fhir.space/codesystem-list-example-codes.html',
        date: dayjs(),
        entries: [],
      });
    }
  };

  const handleCodeChange = (code: string) => {
    const codeOption = LIST_CODE_OPTIONS.find(option => option.value === code);
    if (codeOption) {
      form.setFieldValue('codeDisplay', codeOption.label);
      form.setFieldValue('codeSystem', codeOption.system);
    }
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAllergyIntolerances([]);
    form.setFieldValue('subject', patientId);
  };

  const handleAllergyIntoleranceChange = (allergyIds: string[]) => {
    setSelectedAllergyIntolerances(allergyIds);
  };

  const tabItems = [
    {
      key: 'list-list',
      label: (
        <Space>
          <UnorderedListOutlined />
          Lists
        </Space>
      ),
      children: (
        <ListTable
          searchQuery={searchQuery}
          status={selectedStatus}
          code={selectedCode}
          patientId={selectedPatient}
          onEditList={handleEditList}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              <UnorderedListOutlined style={{ marginRight: 8 }} />
              List Management
            </Title>
            <Text type="secondary">
              Manage clinical lists, including allergies, problems, medications, and care plans
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewList}
            size="large"
          >
            New List
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* List Form Modal */}
      <Modal
        title={editingList ? 'Edit List' : 'Create New List'}
        open={isListModalOpen}
        onCancel={() => {
          setIsListModalOpen(false);
          setEditingList(null);
          setSelectedPatientId('');
          setSelectedAllergyIntolerances([]);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleListSubmit}
          requiredMark="optional"
        >
          {/* Template Selection for New Lists */}
          {!editingList && (
            <>
              <Form.Item label="Quick Templates">
                <Row gutter={[8, 8]}>
                  {COMMON_LIST_TEMPLATES.map(template => (
                    <Col key={template.code}>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => handleApplyTemplate(template.code)}
                      >
                        {template.title}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
              <Divider />
            </>
          )}

          {/* Basic Information */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="List Title"
                rules={[{ required: true, message: 'List title is required' }]}
              >
                <Input placeholder="Enter list title" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="subject"
                label="Patient"
                rules={[{ required: true, message: 'Patient is required' }]}
              >
                <Select
                  placeholder="Select patient"
                  loading={isLoadingPatients}
                  onChange={handlePatientChange}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {patientsData?.entry?.map((patient: any) => (
                    <Select.Option key={patient.id} value={patient.id}>
                      {patient.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* AllergyIntolerance Selection */}
          {selectedPatientId && (
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Allergy Intolerances"
                  help={`Select allergy intolerances for ${patientsData?.entry?.find((p: any) => p.id === selectedPatientId)?.name || 'the selected patient'}`}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select allergy intolerances to include in this list"
                    loading={isLoadingAllergyIntolerances}
                    value={selectedAllergyIntolerances}
                    onChange={handleAllergyIntoleranceChange}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {allergyIntolerancesData?.entry?.map((allergy: any) => (
                      <Select.Option key={allergy.id} value={allergy.id}>
                        {allergy.code?.coding?.[0]?.display || allergy.clinicalStatus?.coding?.[0]?.display || `AllergyIntolerance ${allergy.id}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Status is required' }]}
                initialValue="current"
              >
                <Select>
                  {LIST_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="mode"
                label="Mode"
                rules={[{ required: true, message: 'Mode is required' }]}
                initialValue="working"
              >
                <Select>
                  {LIST_MODE_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="date"
                label="Date"
                initialValue={dayjs()}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Code Information */}
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="code"
                label="List Code Type"
                rules={[{ required: true, message: 'List code type is required' }]}
              >
                <Select
                  placeholder="Select list code type"
                  onChange={handleCodeChange}
                >
                  {LIST_CODE_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="codeSystem"
                label="Code System"
                initialValue="https://r4.fhir.space/codesystem-list-example-codes.html"
              >
                <Input placeholder="Code system URL" />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setIsListModalOpen(false);
                setEditingList(null);
                setSelectedPatientId('');
                setSelectedAllergyIntolerances([]);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<PlusOutlined />}
              >
                {editingList ? 'Update List' : 'Create List'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListListPage;