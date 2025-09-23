import React from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Button,
  Card,
  Table,
  Dropdown,
  Space,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Select,
  ConfigProvider,
} from 'antd';
import {
  DownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

const { Sider } = Layout;

// --- (1) Data interfaces & dummy data ---------------------------------------
interface Condition {
  key: string;
  disease: string;
  startDate: string;
  comment?: string;
}
const conditionData: Condition[] = [
  { key: '1', disease: 'Diabetes mellitus', startDate: '2012-11-23' },
  { key: '2', disease: 'Asthma', startDate: '2009-01-12' },
];

// --- (2) Table columns definitions ------------------------------------------
const conditionColumns: ColumnsType<Condition> = [
  {
    title: 'Disease/Condition',
    dataIndex: 'disease',
    key: 'disease',
    render: (_, record) => (
      <Select
        defaultValue={record.disease}
        showSearch
        style={{ width: '100%' }}
        options={[
          { label: 'Diabetes insipidus', value: 'Diabetes insipidus' },
          { label: 'Diabetes mellitus', value: 'Diabetes mellitus' },
          { label: 'Diabetic neuropathy', value: 'Diabetic neuropathy' },
          { label: 'Asthma', value: 'Asthma' },
          // …etc
        ]}
      />
    ),
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (val) => (
      <DatePicker defaultValue={moment(val)} style={{ width: '100%' }} />
    ),
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    render: (val) => <Input placeholder="Add comment" defaultValue={val} />,
  },
  {
    title: '',
    key: 'actions',
    width: 48,
    render: () => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="delete">Delete this row</Menu.Item>
            <Menu.Item key="reset">Reset</Menu.Item>
          </Menu>
        }
      >
        <DownOutlined style={{ cursor: 'pointer' }} />
      </Dropdown>
    ),
  },
];

// --- (3) The page component -------------------------------------------------
const HomePage: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: '#bf5af5',
            itemSelectedColor: '#fff',
          },
        },
      }}
    >
      <Layout className="h-screen">
        <Sider
          width={200}
          className="bg-slate-100 border-r-2 border-r-slate-200"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['patientprofile']}
            className="h-full bg-slate-100 border-none"
          >
            <Menu.Item key="patientprofile">Patient Profile</Menu.Item>
            <Menu.Item key="history">History</Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '24px' }}>
          {/* Header Info */}
          <Card style={{ marginBottom: 24 }}>
            <Space align="center">
              <Avatar size={64} src="/path/to/photo.jpg" />
              <div className="pl-4">
                <h2 style={{ margin: 0 }}>Frey, Nicole</h2>
                <div>Female, 39 y.o. | DOB: 09/29/1980 | MRN: 202417</div>
                <div>Allergies: No Known Allergies | Primary Ins: None</div>
              </div>
              {/* <div style={{ marginLeft: 'auto' }}>
                <Button type="primary">Save</Button>
                <Button style={{ marginLeft: 8 }}>Add note</Button>
                <Button type="dashed" style={{ marginLeft: 16 }}>
                  Schedule New Appointment
                </Button>
              </div> */}
            </Space>
          </Card>

          {/* Main content grid */}
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Left column */}
            <div
              style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {/* Current medical condition */}
              <Card
                title="Current medical condition"
                extra={<Button size="small">+ Add</Button>}
                size="small"
              >
                <Table
                  columns={conditionColumns}
                  dataSource={conditionData}
                  pagination={false}
                  size="small"
                  rowKey="key"
                />
              </Card>

              {/* Tobacco / Alcohol / Immunization */}
              <Card size="small" title="Tobacco use">
                <Space>
                  <span>Smoke cigarettes?</span>
                  <Checkbox>Yes</Checkbox>
                  <Checkbox>No</Checkbox>
                  <Checkbox>Never</Checkbox>
                </Space>
                <div style={{ marginTop: 12 }}>
                  <span>Packs/day:</span>
                  <InputNumber min={0} defaultValue={1} />
                  <span style={{ marginLeft: 12 }}># of Years:</span>
                  <InputNumber min={0} defaultValue={5} />
                </div>
              </Card>

              <Card size="small" title="Alcohol use">
                <Space>
                  <span>Drink alcohol?</span>
                  <Checkbox>Yes</Checkbox>
                  <Checkbox>No</Checkbox>
                </Space>
                <div style={{ marginTop: 12 }}>
                  <Checkbox>Beer</Checkbox>
                  <Checkbox>Wine</Checkbox>
                  <Checkbox>Liquor</Checkbox>
                  <span style={{ marginLeft: 12 }}>Drinks/week:</span>
                  <InputNumber min={0} defaultValue={4} />
                </div>
              </Card>

              <Card
                size="small"
                title="Immunization"
                extra={<Button size="small">+ Add</Button>}
              >
                {/* …Immunization table goes here… */}
              </Card>
            </div>

            {/* Right column */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              <Card
                size="small"
                title="Surgeries"
                extra={<Button size="small">+ Add</Button>}
              >
                {/* …Surgeries table… */}
              </Card>

              <Card
                size="small"
                title="Family history"
                extra={<Button size="small">+ Add</Button>}
              >
                {/* …Family history table… */}
              </Card>

              <Card
                size="small"
                title="Medications"
                extra={<Button size="small">+ Add</Button>}
              >
                {/* …Medications table… */}
              </Card>
            </div>
          </div>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default HomePage;
