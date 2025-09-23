import React from 'react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Tabs,
  Spin,
  Alert,
} from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import ObservationTab from './ObservationTab';
import AllergyIntoleranceTab from './AllergyIntoleranceTab';
import ConditionTab from './ConditionTab';
import ProcedureTab from './ProcedureTab';
import FlagTab from './FlagTab';
import { useGetPatientByIdQuery } from '@/services/Patient/PatientService';

const { Title, Text } = Typography;

interface PatientProfilePageProps {
  patientId?: string;
}

const PatientProfilePage: React.FC<PatientProfilePageProps> = ({ patientId }) => {
  // Fetch patient data from FHIR API
  const { data: patient, isLoading, error } = useGetPatientByIdQuery(patientId || '');

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-tl-lg min-h-full flex items-center justify-center">
        <Spin size="large" tip="Loading patient information...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  // Handle error state
  if (error || !patient) {
    return (
      <div className="bg-gray-100 rounded-tl-lg min-h-full p-4">
        <Alert
          message="Error Loading Patient"
          description="Unable to load patient information. Please check the patient ID and try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Calculate age from birthdate
  const age = moment().diff(moment(patient.birthdate.toString()), 'years');


  return (
    <div className="bg-gray-100 rounded-tl-lg min-h-full">
      {/* === EPIC-Style Patient Banner === */}
      <div className="bg-blue-900 text-white p-3 px-4 rounded-tl-lg">
        <Row gutter={16} align="middle">
          <Col>
            <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
          </Col>
          <Col flex="auto">
            <div className="flex items-center gap-3 mb-1">
              <Title level={4} className="m-0 text-white text-lg">
                {patient.name}
              </Title>
            </div>
            <div className="flex gap-6 text-sm text-blue-200">
              <span><strong>MRN:</strong> {patient.mrn}</span>
              <span><strong>DOB:</strong> {moment(patient.birthdate.toString()).format('MM/DD/YYYY')} ({age}y)</span>
              <span><strong>Sex:</strong> {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</span>
              <span><strong>Status:</strong> {patient.active ? 'Active' : 'Inactive'}</span>
            </div>
          </Col>
          <Col>
            {/* Action buttons can be added here if needed */}
          </Col>
        </Row>
      </div>

      {/* === EPIC-Style Clinical Tabs === */}
      <div className="border-b border-gray-300" style={{ backgroundColor: '#eef7ff' }}>
        <Tabs
          defaultActiveKey="observations"
          size="large"
          className="mx-4"
          tabBarStyle={{ marginBottom: 0, backgroundColor: '#eef7ff' }}
          items={[
            {
              key: 'observations',
              label: 'Observations',
              children: (
                <div className="bg-white">
                  <ObservationTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'allergies',
              label: 'Allergy Intolerance',
              children: (
                <div className="bg-white">
                  <AllergyIntoleranceTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'conditions',
              label: 'Conditions',
              children: (
                <div className="bg-white">
                  <ConditionTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'procedures',
              label: 'Procedures',
              children: (
                <div className="bg-white">
                  <ProcedureTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'flags',
              label: 'Flags',
              children: (
                <div className="bg-white">
                  <FlagTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'encounters',
              label: 'Encounters',
              children: (
                <div className="p-4 bg-white">
                  <Card>
                    <Text>Visit history and encounters...</Text>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PatientProfilePage;