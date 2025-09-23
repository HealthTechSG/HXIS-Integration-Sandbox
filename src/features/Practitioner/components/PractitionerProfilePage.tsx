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
import { useGetPractitionerByIdQuery } from '@/services/Practitioner/PractitionerService';

const { Title, Text } = Typography;

interface PractitionerProfilePageProps {
  practitionerId?: string;
}

const PractitionerProfilePage: React.FC<PractitionerProfilePageProps> = ({ practitionerId }) => {
  // Fetch practitioner data from FHIR API
  const { data: practitioner, isLoading, error } = useGetPractitionerByIdQuery(practitionerId || '');

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-tl-lg min-h-full flex items-center justify-center">
        <Spin size="large" tip="Loading practitioner information...">
          <div className="min-h-[200px]" />
        </Spin>
      </div>
    );
  }

  // Handle error state
  if (error || !practitioner) {
    return (
      <div className="bg-gray-100 rounded-tl-lg min-h-full p-4">
        <Alert
          message="Error Loading Practitioner"
          description="Unable to load practitioner information. Please check the practitioner ID and try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Calculate age from birthdate
  const age = moment().diff(moment(practitioner.birthdate.toString()), 'years');

  return (
    <div className="bg-gray-100 rounded-tl-lg min-h-full">
      {/* === EPIC-Style Practitioner Banner === */}
      <div className="bg-blue-900 text-white p-3 px-4 rounded-tl-lg">
        <Row gutter={16} align="middle">
          <Col>
            <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
          </Col>
          <Col flex="auto">
            <div className="flex items-center gap-3 mb-1">
              <Title level={4} className="m-0 text-white text-lg">
                {practitioner.name}
              </Title>
            </div>
            <div className="flex gap-6 text-sm text-blue-200">
              <span><strong>ID:</strong> {practitioner.practitionerId}</span>
              <span><strong>DOB:</strong> {moment(practitioner.birthdate.toString()).format('MM/DD/YYYY')} ({age}y)</span>
              <span><strong>Sex:</strong> {practitioner.gender.charAt(0).toUpperCase() + practitioner.gender.slice(1)}</span>
              <span><strong>Status:</strong> {practitioner.active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="mt-2 text-sm text-blue-200">
              {practitioner.address && (
                <span><strong>Location:</strong> {practitioner.city ? `${practitioner.city}, ` : ''}{practitioner.state ? `${practitioner.state} ` : ''}{practitioner.postalCode || ''}</span>
              )}
            </div>
            <div className="mt-2 text-sm">
              <span className="bg-blue-700 px-2 py-1 rounded text-xs font-semibold">
                {practitioner.specialty}
              </span>
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
          defaultActiveKey="schedule"
          size="large"
          className="mx-4"
          tabBarStyle={{ marginBottom: 0, backgroundColor: '#eef7ff' }}
          items={[
            {
              key: 'schedule',
              label: 'Schedule',
              children: (
                <div className="p-4 bg-white">
                  <Card>
                    <Title level={5}>Weekly Schedule</Title>
                    <Text>Practitioner schedule and appointments...</Text>
                    <div className="mt-4 space-y-2">
                      <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                        <div className="text-sm font-semibold">Monday - Friday</div>
                        <div className="text-xs text-gray-600">9:00 AM - 5:00 PM</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                        <div className="text-sm font-semibold">On-Call Rotation</div>
                        <div className="text-xs text-gray-600">Every 3rd weekend</div>
                      </div>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'patients',
              label: 'Patients',
              children: (
                <div className="p-4 bg-white">
                  <Card>
                    <Title level={5}>Assigned Patients</Title>
                    <Text>Current patient assignments and case load...</Text>
                    <div className="mt-4">
                      <div className="text-sm text-gray-600">
                        Active Cases: <span className="font-semibold text-blue-600">23</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Cases per Week: <span className="font-semibold text-green-600">15</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'qualifications',
              label: 'Qualifications',
              children: (
                <div className="p-4 bg-white">
                  <Card>
                    <Title level={5}>Professional Qualifications</Title>
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                        <div className="text-sm font-semibold">Medical Degree</div>
                        <div className="text-xs text-gray-600">MD, National University of Singapore (2000)</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                        <div className="text-sm font-semibold">Specialty Board Certification</div>
                        <div className="text-xs text-gray-600">{practitioner.specialty} - Singapore Medical Council</div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded border-l-4 border-indigo-500">
                        <div className="text-sm font-semibold">License</div>
                        <div className="text-xs text-gray-600">Singapore Medical Registration #SMR12345</div>
                      </div>
                    </div>
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

export default PractitionerProfilePage;