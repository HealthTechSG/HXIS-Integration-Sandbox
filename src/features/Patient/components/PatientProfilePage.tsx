import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Checkbox,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Types ---
interface Patient {
  name: string;
  gender: string;
  age: number;
  MRN: string;
  DOB: string;
  PCP: string;
  code: string;
  allergies: string;
  primaryIns: string;
  secondaryPayer: string;
}

interface MedicalCondition {
  key: string;
  disease: string;
  startDate: Moment;
  comment?: string;
}

interface Surgery {
  key: string;
  type: string;
  date: Moment;
  location: string;
}

interface FamilyHistory {
  key: string;
  relationship: string;
  adopted: boolean;
  biological: boolean;
  medicalHistory: string;
}

interface Immunization {
  key: string;
  vaccine: string;
  dateGiven: Moment;
  location: string;
  nextDose: string;
}

interface Medication {
  key: string;
  name: string;
  dose: string;
  timesPerDay: number;
}

const PatientProfilePage: React.FC = () => {
  // --- mock patient data ---
  const patient: Patient = {
    name: 'Frey, Nicole',
    gender: 'Female',
    age: 39,
    MRN: '202417',
    DOB: '09/29/1980',
    PCP: 'None',
    code: 'None',
    allergies: 'No Known Allergies',
    primaryIns: 'None',
    secondaryPayer: 'None',
  };

  // --- mock table data ---
  const [conditions] = useState<MedicalCondition[]>([
    {
      key: '1',
      disease: 'Diabetes mellitus',
      startDate: moment('2012-11-23'),
      comment: '',
    },
    {
      key: '2',
      disease: 'Asthma',
      startDate: moment('2009-01-12'),
      comment: '',
    },
  ]);
  const [surgeries] = useState<Surgery[]>([
    {
      key: '1',
      type: 'Cholecystectomy',
      date: moment('2017-01-12'),
      location: 'Univ. of Washington Medical Center',
    },
    {
      key: '2',
      type: 'Low back pain surgery',
      date: moment('2015-05-21'),
      location: 'Boulder Community Health',
    },
  ]);
  const [familyHistory] = useState<FamilyHistory[]>([
    {
      key: '1',
      relationship: 'Mother',
      adopted: false,
      biological: true,
      medicalHistory: 'Diabetes',
    },
    {
      key: '2',
      relationship: 'Father',
      adopted: false,
      biological: true,
      medicalHistory: 'High Cholesterol',
    },
  ]);
  const [immunizations] = useState<Immunization[]>([
    {
      key: '1',
      vaccine: 'Tetanus Booster/ TdaP',
      dateGiven: moment('2010-01-12'),
      location: "John's Hops Clinic",
      nextDose: '01/12/2020',
    },
    {
      key: '2',
      vaccine: 'Flu Vaccine',
      dateGiven: moment('2019-10-12'),
      location: 'Safeway Pharmacy',
      nextDose: '10/12/2020',
    },
    {
      key: '3',
      vaccine: 'MMR',
      dateGiven: moment('1984-01-12'),
      location: 'Children’s Hospital',
      nextDose: 'DONE',
    },
  ]);
  const [medications] = useState<Medication[]>([
    { key: '1', name: 'Medication A', dose: '1 pill', timesPerDay: 1 },
    { key: '2', name: 'Medication B', dose: '1 pill', timesPerDay: 3 },
    { key: '3', name: 'Medication C', dose: '1 pill', timesPerDay: 2 },
  ]);

  // --- column definitions ---
  const conditionCols = [
    { title: 'Disease/Condition', dataIndex: 'disease', key: 'disease' },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (d: Moment) => d.format('MM/DD/YYYY'),
    },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
  ];

  const surgeryCols = [
    { title: 'Type (L/R)', dataIndex: 'type', key: 'type' },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (d: Moment) => d.format('MM/DD/YYYY'),
    },
    { title: 'Location/Facility', dataIndex: 'location', key: 'location' },
  ];

  const familyCols = [
    { title: 'Relationship', dataIndex: 'relationship', key: 'relationship' },
    {
      title: 'Adopted?',
      dataIndex: 'adopted',
      key: 'adopted',
      render: (v: boolean) => <Checkbox checked={v} />,
    },
    {
      title: 'Biological',
      dataIndex: 'biological',
      key: 'biological',
      render: (v: boolean) => <Checkbox checked={v} />,
    },
    {
      title: 'Medical History',
      dataIndex: 'medicalHistory',
      key: 'medicalHistory',
    },
  ];

  const immunizationCols = [
    { title: 'Vaccine', dataIndex: 'vaccine', key: 'vaccine' },
    {
      title: 'Date Given',
      dataIndex: 'dateGiven',
      key: 'dateGiven',
      render: (d: Moment) => d.format('MM/DD/YYYY'),
    },
    { title: 'Location/Facility', dataIndex: 'location', key: 'location' },
    { title: 'Next Dose Due', dataIndex: 'nextDose', key: 'nextDose' },
  ];

  const medicationCols = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Dose (mg, pill, etc)', dataIndex: 'dose', key: 'dose' },
    { title: 'Times per Day', dataIndex: 'timesPerDay', key: 'timesPerDay' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* === Profile Header === */}
      <Card>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar size={100} src="https://via.placeholder.com/100" />
          </Col>
          <Col flex="auto">
            <Title level={3}>{patient.name}</Title>
            <Text>{`${patient.gender}, ${patient.age} y.o.`}</Text>
            <br />
            <Text>MRN: {patient.MRN}</Text> • <Text>DOB: {patient.DOB}</Text>
            <br />
            <Text>PCP: {patient.PCP}</Text> • <Text>Code: {patient.code}</Text>
            <br />
            <Text>Allergies: {patient.allergies}</Text>
            <br />
            <Text>Primary Ins: {patient.primaryIns}</Text> •{' '}
            <Text>Secondary Payer: {patient.secondaryPayer}</Text>
          </Col>
          <Col>
            <Button type="primary">Schedule New Appointment</Button>
          </Col>
        </Row>
      </Card>

      {/* === Main Content === */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* left column */}
        <Col span={14}>
          <Card
            title="Current Medical Condition"
            extra={<Button icon={<PlusOutlined />} size="small" />}
          >
            <Table
              dataSource={conditions}
              columns={conditionCols}
              pagination={false}
              size="small"
            />
          </Card>

          <Card title="Tobacco Use" style={{ marginTop: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Smoke cigarettes?">
                <Checkbox.Group options={['Yes', 'No', 'Never']} />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Packs/day">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="# of Years">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title="Alcohol Use" style={{ marginTop: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Drink alcohol?">
                <Checkbox.Group options={['Yes', 'No']} />
              </Form.Item>
              <Form.Item label="Alcohol Type">
                <Checkbox.Group options={['Beer', 'Wine', 'Liquor']} />
              </Form.Item>
              <Form.Item label="Drinks/week">
                <Input />
              </Form.Item>
            </Form>
          </Card>

          <Card
            title="Immunization"
            style={{ marginTop: 16 }}
            extra={<Button icon={<PlusOutlined />} size="small" />}
          >
            <Table
              dataSource={immunizations}
              columns={immunizationCols}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* right column */}
        <Col span={10}>
          <Card
            title="Surgeries"
            extra={<Button icon={<PlusOutlined />} size="small" />}
          >
            <Table
              dataSource={surgeries}
              columns={surgeryCols}
              pagination={false}
              size="small"
            />
          </Card>

          <Card
            title="Family History"
            style={{ marginTop: 16 }}
            extra={<Button icon={<PlusOutlined />} size="small" />}
          >
            <Table
              dataSource={familyHistory}
              columns={familyCols}
              pagination={false}
              size="small"
            />
          </Card>

          <Card
            title="Medications"
            style={{ marginTop: 16 }}
            extra={<Button icon={<PlusOutlined />} size="small" />}
          >
            <Table
              dataSource={medications}
              columns={medicationCols}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientProfilePage;
