import {
  UserOutlined,
} from '@ant-design/icons';
import {
  Row,
  Col,
  Avatar,
  Typography,
  Tabs,
  Spin,
  Alert,
} from 'antd';
import moment from 'moment';
import React from 'react';

import AllergyIntoleranceTab from './AllergyIntoleranceTab';
import AppointmentTab from './AppointmentTab';
import ConditionTab from './ConditionTab';
import EncounterTab from './EncounterTab';
import FlagTab from './FlagTab';
import MedicationRequestTab from './MedicationRequestTab';
import ObservationTab from './ObservationTab';
import ProcedureTab from './ProcedureTab';
import { useGetPatientByIdQuery } from '@/services/Patient/PatientService';

const { Title } = Typography;

interface PatientProfilePageProps {
  patientId?: string;
}

const PatientProfilePage: React.FC<PatientProfilePageProps> = ({ patientId }) => {
  // Fetch patient data from FHIR API
  const { data: patient, error, isLoading } = useGetPatientByIdQuery(patientId || '');

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center rounded-tl-lg bg-gray-100">
        <Spin size="large" tip="Loading patient information...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  // Handle error state
  if (error || !patient) {
    return (
      <div className="min-h-full rounded-tl-lg bg-gray-100 p-4">
        <Alert
          description="Unable to load patient information. Please check the patient ID and try again."
          message="Error Loading Patient"
          showIcon
          type="error"
        />
      </div>
    );
  }

  // Calculate age from birthdate
  const age = moment().diff(moment(patient.birthdate.toString()), 'years');


  return (
    <div className="min-h-full rounded-tl-lg bg-gray-100">
      {/* === EPIC-Style Patient Banner === */}
      <div className="rounded-tl-lg bg-blue-900 p-3 px-4 text-white">
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar className="bg-blue-500" icon={<UserOutlined />} size={64} />
          </Col>
          <Col flex="auto">
            <div className="mb-1 flex items-center gap-3">
              <Title className="m-0 text-lg text-white" level={4}>
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
          className="mx-4"
          defaultActiveKey="observations"
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
              key: 'medication-requests',
              label: 'Medication Requests',
              children: (
                <div className="bg-white">
                  <MedicationRequestTab patientId={patient.id} />
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
                <div className="bg-white">
                  <EncounterTab patientId={patient.id} />
                </div>
              ),
            },
            {
              key: 'appointments',
              label: 'Appointments',
              children: (
                <div className="bg-white">
                  <AppointmentTab patientId={patient.id} />
                </div>
              ),
            },
          ]}
          size="large"
          tabBarStyle={{ marginBottom: 0, backgroundColor: '#eef7ff' }}
        />
      </div>
    </div>
  );
};

export default PatientProfilePage;