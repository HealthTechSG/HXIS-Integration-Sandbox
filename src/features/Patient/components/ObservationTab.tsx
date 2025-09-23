import React from 'react';
import { 
  Table, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Spin, 
  Alert, 
  Form,
  Button, 
  Space, 
  message,
  Collapse,
  InputNumber,
  DatePicker
} from 'antd';
import { 
  HeartOutlined, 
  ExperimentOutlined,
  LoadingOutlined, 
  PlusOutlined,
  SaveOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

// Import the new Observation service
import { 
  useGetVitalSignsByPatientIdQuery,
  useCreateObservationMutation 
} from '@/services/Observation/ObservationService';
import type { Observation } from '@/services/Observation/ObservationTypes';
import { VITAL_SIGNS_CODES, VITAL_SIGNS_DISPLAYS, VITAL_SIGNS_UNITS } from '@/services/Observation/ObservationTypes';

// Helper interface for consolidated vital signs data
interface ConsolidatedVitalSigns {
  key: string;
  patientId: string;
  recordedTime: string;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  spO2?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  respiratoryRate?: number;
  notes?: string;
}

interface ObservationTabProps {
  patientId?: string;
}

const ObservationTab: React.FC<ObservationTabProps> = ({ patientId }) => {
  // Fetch vital signs data using the real service
  const { data: vitalSignsData, error, isLoading } = useGetVitalSignsByPatientIdQuery(
    patientId || '',
    {
      skip: !patientId,
    }
  );

  // Create observation mutation
  const [createObservation, { isLoading: isCreating }] = useCreateObservationMutation();

  // Form instance
  const [form] = Form.useForm();


  console.log(vitalSignsData);

  // Form submission handler
  const handleCreateObservation = async (values: any) => {
    if (!patientId) {
      message.error('Patient ID is required');
      return;
    }

    try {
      const observations = [];
      const effectiveDateTime = values.effectiveDateTime ? dayjs(values.effectiveDateTime).toISOString() : dayjs().toISOString();

      // Create heart rate observation
      if (values.heartRate) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.HEART_RATE,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.HEART_RATE],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.HEART_RATE],
          effectiveDateTime,
          value: values.heartRate,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.HEART_RATE],
        });
      }

      // Create blood pressure observation
      if (values.systolic && values.diastolic) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.BLOOD_PRESSURE,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.BLOOD_PRESSURE],
          text: 'Blood pressure systolic & diastolic',
          effectiveDateTime,
          components: [
            {
              code: VITAL_SIGNS_CODES.SYSTOLIC_BP,
              display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.SYSTOLIC_BP],
              value: values.systolic,
              unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.SYSTOLIC_BP],
            },
            {
              code: VITAL_SIGNS_CODES.DIASTOLIC_BP,
              display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.DIASTOLIC_BP],
              value: values.diastolic,
              unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.DIASTOLIC_BP],
            },
          ],
        });
      }

      // Create SpO2 observation
      if (values.spO2) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.SAT_O2,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.SAT_O2],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.SAT_O2],
          effectiveDateTime,
          value: values.spO2,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.SAT_O2],
        });
      }

      // Create temperature observation
      if (values.temperature) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.TEMPERATURE,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.TEMPERATURE],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.TEMPERATURE],
          effectiveDateTime,
          value: values.temperature,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.TEMPERATURE],
        });
      }

      // Create weight observation
      if (values.weight) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.WEIGHT,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.WEIGHT],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.WEIGHT],
          effectiveDateTime,
          value: values.weight,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.WEIGHT],
        });
      }

      // Create height observation
      if (values.height) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.HEIGHT,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.HEIGHT],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.HEIGHT],
          effectiveDateTime,
          value: values.height,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.HEIGHT],
        });
      }

      // Create BMI observation
      if (values.bmi) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.BMI,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.BMI],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.BMI],
          effectiveDateTime,
          value: values.bmi,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.BMI],
        });
      }

      // Create respiratory rate observation
      if (values.respiratoryRate) {
        observations.push({
          patientId,
          status: 'final',
          category: 'vital-signs',
          code: VITAL_SIGNS_CODES.RESPIRATORY_RATE,
          display: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.RESPIRATORY_RATE],
          text: VITAL_SIGNS_DISPLAYS[VITAL_SIGNS_CODES.RESPIRATORY_RATE],
          effectiveDateTime,
          value: values.respiratoryRate,
          unit: VITAL_SIGNS_UNITS[VITAL_SIGNS_CODES.RESPIRATORY_RATE],
        });
      }

      // Create all observations
      const promises = observations.map(obs => createObservation(obs).unwrap());
      await Promise.all(promises);

      message.success(`Successfully created ${observations.length} vital sign observation(s)`);
      form.resetFields();
    } catch (error) {
      console.error('Error creating observations:', error);
      message.error('Failed to create observations. Please try again.');
    }
  };

  // Helper function to extract value from observation
  const getObservationValue = (observation?: Observation): number | undefined => {
    if (!observation) return undefined;
    return observation.value;
  };

  // Helper function to get the latest observation from an array
  const getLatestObservation = (observations?: Observation[]): Observation | undefined => {
    if (!observations || observations.length === 0) return undefined;
    
    // Create a copy of the array before sorting to avoid mutating read-only arrays
    return [...observations].sort((a, b) => 
      dayjs(b.effectiveDateTime).valueOf() - dayjs(a.effectiveDateTime).valueOf()
    )[0];
  };

  // Helper function to get blood pressure components
  const getBloodPressureValues = (observation?: Observation) => {
    if (!observation || !observation.components) return { systolic: undefined, diastolic: undefined };
    
    const systolic = observation.components.find(comp => comp.code === '8480-6')?.value;
    const diastolic = observation.components.find(comp => comp.code === '8462-4')?.value;
    
    return { systolic, diastolic };
  };

  // Process the vital signs data into a consolidated format
  const processedVitalSigns: ConsolidatedVitalSigns[] = React.useMemo(() => {
    if (!vitalSignsData) return [];

    // Flatten all observations from all arrays
    const allObservations: Observation[] = [];
    Object.values(vitalSignsData).forEach((obsArray) => {
      if (obsArray && Array.isArray(obsArray)) {
        allObservations.push(...obsArray);
      }
    });

    if (allObservations.length === 0) return [];

    // Group by date and combine all vital signs for that date
    const groupedByDate: Record<string, ConsolidatedVitalSigns> = {};
    
    allObservations.forEach((obs) => {
      const dateKey = dayjs(obs.effectiveDateTime).format('YYYY-MM-DD HH:mm:ss');
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          key: dateKey,
          patientId: obs.patientId,
          recordedTime: dateKey,
        };
      }

      // Map each observation type to the consolidated structure
      switch (obs.code) {
        case '8867-4': // Heart rate
          groupedByDate[dateKey].heartRate = getObservationValue(obs);
          break;
        case '85354-9': // Blood pressure
          const { systolic, diastolic } = getBloodPressureValues(obs);
          groupedByDate[dateKey].bloodPressureSystolic = systolic;
          groupedByDate[dateKey].bloodPressureDiastolic = diastolic;
          break;
        case '2708-6': // Oxygen saturation
          groupedByDate[dateKey].spO2 = getObservationValue(obs);
          break;
        case '8310-5': // Temperature
          groupedByDate[dateKey].temperature = getObservationValue(obs);
          break;
        case '9279-1': // Respiratory rate
          groupedByDate[dateKey].respiratoryRate = getObservationValue(obs);
          break;
        case '29463-7': // Weight
          groupedByDate[dateKey].weight = getObservationValue(obs);
          break;
        case '8302-2': // Height
          groupedByDate[dateKey].height = getObservationValue(obs);
          break;
        case '39156-5': // BMI
          groupedByDate[dateKey].bmi = getObservationValue(obs);
          break;
      }
    });

    return Object.values(groupedByDate).sort((a, b) => 
      dayjs(b.recordedTime).valueOf() - dayjs(a.recordedTime).valueOf()
    );
  }, [vitalSignsData]);

  // Get the latest vital signs for the overview section using arrays
  const latestVitals = React.useMemo(() => {
    if (!vitalSignsData) return undefined;
    
    return {
      heartRate: getObservationValue(getLatestObservation(vitalSignsData.heartRate)),
      bloodPressureSystolic: getBloodPressureValues(getLatestObservation(vitalSignsData.bloodPressure)).systolic,
      bloodPressureDiastolic: getBloodPressureValues(getLatestObservation(vitalSignsData.bloodPressure)).diastolic,
      spO2: getObservationValue(getLatestObservation(vitalSignsData.satO2)),
      temperature: getObservationValue(getLatestObservation(vitalSignsData.temperature)),
      respiratoryRate: getObservationValue(getLatestObservation(vitalSignsData.respiratoryRate)),
      weight: getObservationValue(getLatestObservation(vitalSignsData.weight)),
      height: getObservationValue(getLatestObservation(vitalSignsData.height)),
      bmi: getObservationValue(getLatestObservation(vitalSignsData.bmi)),
      recordedTime: getLatestObservation([
        ...((vitalSignsData.heartRate || [])),
        ...((vitalSignsData.bloodPressure || [])),
        ...((vitalSignsData.satO2 || [])),
        ...((vitalSignsData.temperature || [])),
        ...((vitalSignsData.respiratoryRate || [])),
        ...((vitalSignsData.weight || [])),
        ...((vitalSignsData.height || [])),
        ...((vitalSignsData.bmi || [])),
      ])?.effectiveDateTime,
    };
  }, [vitalSignsData]);

  // Function to determine if vital sign is abnormal
  const getVitalStatus = (vital: string, value?: number) => {
    if (value === undefined || value === null) return 'unknown';
    
    const normalRanges: { [key: string]: { min: number; max: number } } = {
      heartRate: { min: 60, max: 100 },
      systolic: { min: 90, max: 140 },
      diastolic: { min: 60, max: 90 },
      spO2: { min: 95, max: 100 },
      temperature: { min: 36.1, max: 37.2 },
      bmi: { min: 18.5, max: 25.0 },
      respiratoryRate: { min: 12, max: 20 },
    };
    
    const range = normalRanges[vital];
    if (!range) return 'normal';
    
    if (value < range.min) return 'low';
    if (value > range.max) return 'high';
    return 'normal';
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <span className="ml-3">Loading vital signs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading vital signs"
        description="Unable to fetch patient vital signs data. Please try again later."
        type="error"
        showIcon
        className="m-5"
      />
    );
  }

  // Check if we have an empty bundle (no entries) vs actual error
  const hasEmptyBundle = vitalSignsData && Object.keys(vitalSignsData).length > 0 && processedVitalSigns.length === 0;
  const hasNoData = !vitalSignsData || hasEmptyBundle;

  if (hasNoData) {
    return (
      <div className="p-5 bg-gray-100">
        {/* === Create New Observation Form === */}
        <Collapse
          className='bg-[#f0f8ff] mb-5' 
          items={[
            {
              key: 'create-observation',
              label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Create New Vital Signs Observation</Text>
                </div>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateObservation}
                  style={{ maxWidth: '800px' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name="effectiveDateTime"
                        label="Date & Time"
                        rules={[{ required: true, message: 'Please select date and time' }]}
                        initialValue={dayjs()}
                      >
                        <DatePicker 
                          showTime 
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item
                        name="heartRate"
                        label="Heart Rate (bpm)"
                        rules={[
                          { type: 'number', min: 30, max: 250, message: 'Heart rate must be between 30-250 bpm' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter heart rate"
                          style={{ width: '100%' }}
                          min={30}
                          max={250}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="systolic"
                        label="Systolic BP (mmHg)"
                        rules={[
                          { type: 'number', min: 60, max: 250, message: 'Systolic BP must be between 60-250 mmHg' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter systolic"
                          style={{ width: '100%' }}
                          min={60}
                          max={250}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="diastolic"
                        label="Diastolic BP (mmHg)"
                        rules={[
                          { type: 'number', min: 30, max: 150, message: 'Diastolic BP must be between 30-150 mmHg' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter diastolic"
                          style={{ width: '100%' }}
                          min={30}
                          max={150}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item
                        name="spO2"
                        label="SpO2 (%)"
                        rules={[
                          { type: 'number', min: 50, max: 100, message: 'SpO2 must be between 50-100%' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter SpO2"
                          style={{ width: '100%' }}
                          min={50}
                          max={100}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="temperature"
                        label="Temperature (°C)"
                        rules={[
                          { type: 'number', min: 30, max: 45, message: 'Temperature must be between 30-45°C' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter temperature"
                          style={{ width: '100%' }}
                          min={30}
                          max={45}
                          step={0.1}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="weight"
                        label="Weight (kg)"
                        rules={[
                          { type: 'number', min: 1, max: 300, message: 'Weight must be between 1-300 kg' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter weight"
                          style={{ width: '100%' }}
                          min={1}
                          max={300}
                          step={0.1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item
                        name="height"
                        label="Height (m)"
                        rules={[
                          { type: 'number', min: 0.3, max: 2.5, message: 'Height must be between 0.3-2.5 m' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter height"
                          style={{ width: '100%' }}
                          min={0.3}
                          max={2.5}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item
                        name="bmi"
                        label="BMI (kg/m²)"
                        rules={[
                          { type: 'number', min: 10, max: 60, message: 'BMI must be between 10-60 kg/m²' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter BMI"
                          style={{ width: '100%' }}
                          min={10}
                          max={60}
                          step={0.1}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="respiratoryRate"
                        label="Respiratory Rate (/min)"
                        rules={[
                          { type: 'number', min: 8, max: 40, message: 'Respiratory rate must be between 8-40 /min' }
                        ]}
                      >
                        <InputNumber
                          placeholder="Enter respiratory rate"
                          style={{ width: '100%' }}
                          min={8}
                          max={40}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ marginTop: '24px' }}>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={isCreating}
                        disabled={!patientId}
                      >
                        Create Observations
                      </Button>
                      <Button
                        onClick={() => form.resetFields()}
                        disabled={isCreating}
                      >
                        Reset
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />

        {/* === Latest Vitals Overview (No Data) === */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartOutlined style={{ color: '#1890ff' }} />
              <Text strong>Latest Vital Signs Overview</Text>
              <Tag color="orange" style={{ fontSize: '11px' }}>
                No Data Available
              </Tag>
            </div>
          }
          styles={{
            header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
            body: { padding: '16px' },
          }}
          className='mb-5'
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Heart Rate</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>bpm</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Blood Pressure</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>mmHg</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>SpO2</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Temperature</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Weight</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>kg</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#fafafa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px dashed #d9d9d9'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>BMI</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#bfbfbf' }}>—</div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* === No Data Message === */}
        <Card 
          styles={{
            header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
            body: { padding: '16px' }
          }}
        >
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <ExperimentOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>No Vital Signs History</div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              No vital signs have been recorded for this patient. Use the form above to create the first observation.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-100">
      {/* === Create New Observation Form === */}
      <Collapse
        className='bg-[#f0f8ff] mb-5' 
        items={[
          {
            key: 'create-observation',
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusOutlined style={{ color: '#1890ff' }} />
                <Text strong>Create New Vital Signs Observation</Text>
              </div>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateObservation}
                style={{ maxWidth: '800px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="effectiveDateTime"
                      label="Date & Time"
                      rules={[{ required: true, message: 'Please select date and time' }]}
                      initialValue={dayjs()}
                    >
                      <DatePicker 
                        showTime 
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="heartRate"
                      label="Heart Rate (bpm)"
                      rules={[
                        { type: 'number', min: 30, max: 250, message: 'Heart rate must be between 30-250 bpm' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter heart rate"
                        style={{ width: '100%' }}
                        min={30}
                        max={250}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={8}>
                    <Form.Item
                      name="systolic"
                      label="Systolic BP (mmHg)"
                      rules={[
                        { type: 'number', min: 60, max: 250, message: 'Systolic BP must be between 60-250 mmHg' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter systolic"
                        style={{ width: '100%' }}
                        min={60}
                        max={250}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={8}>
                    <Form.Item
                      name="diastolic"
                      label="Diastolic BP (mmHg)"
                      rules={[
                        { type: 'number', min: 30, max: 150, message: 'Diastolic BP must be between 30-150 mmHg' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter diastolic"
                        style={{ width: '100%' }}
                        min={30}
                        max={150}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="spO2"
                      label="SpO2 (%)"
                      rules={[
                        { type: 'number', min: 50, max: 100, message: 'SpO2 must be between 50-100%' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter SpO2"
                        style={{ width: '100%' }}
                        min={50}
                        max={100}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={8}>
                    <Form.Item
                      name="temperature"
                      label="Temperature (°C)"
                      rules={[
                        { type: 'number', min: 30, max: 45, message: 'Temperature must be between 30-45°C' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter temperature"
                        style={{ width: '100%' }}
                        min={30}
                        max={45}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={8}>
                    <Form.Item
                      name="weight"
                      label="Weight (kg)"
                      rules={[
                        { type: 'number', min: 1, max: 300, message: 'Weight must be between 1-300 kg' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter weight"
                        style={{ width: '100%' }}
                        min={1}
                        max={300}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name="height"
                      label="Height (m)"
                      rules={[
                        { type: 'number', min: 0.3, max: 2.5, message: 'Height must be between 0.3-2.5 m' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter height"
                        style={{ width: '100%' }}
                        min={0.3}
                        max={2.5}
                        step={0.01}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col span={8}>
                    <Form.Item
                      name="bmi"
                      label="BMI (kg/m²)"
                      rules={[
                        { type: 'number', min: 10, max: 60, message: 'BMI must be between 10-60 kg/m²' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter BMI"
                        style={{ width: '100%' }}
                        min={10}
                        max={60}
                        step={0.1}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="respiratoryRate"
                      label="Respiratory Rate (/min)"
                      rules={[
                        { type: 'number', min: 8, max: 40, message: 'Respiratory rate must be between 8-40 /min' }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter respiratory rate"
                        style={{ width: '100%' }}
                        min={8}
                        max={40}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: '24px' }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={isCreating}
                      disabled={!patientId}
                    >
                      Create Observations
                    </Button>
                    <Button
                      onClick={() => form.resetFields()}
                      disabled={isCreating}
                    >
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />

      {/* === Latest Vitals Overview === */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartOutlined style={{ color: '#1890ff' }} />
            <Text strong>Latest Vital Signs Overview</Text>
            <Tag color="blue" style={{ fontSize: '11px' }}>
              {latestVitals ? dayjs(latestVitals.recordedTime).format('MM/DD/YY HH:mm') : '—'}
            </Tag>
          </div>
        }
        styles={{
          header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
          body: { padding: '16px' },
        }}
        className='mb-5'
        size="small"
      >
        {latestVitals && (
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Heart Rate</div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: getVitalStatus('heartRate', latestVitals.heartRate) === 'normal' ? '#52c41a' : '#ff4d4f'
                }}>
                  {latestVitals.heartRate || '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>bpm</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Blood Pressure</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: getVitalStatus('systolic', latestVitals.bloodPressureSystolic) === 'normal' ? '#52c41a' : '#ff4d4f'
                }}>
                  {latestVitals.bloodPressureSystolic && latestVitals.bloodPressureDiastolic 
                    ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` 
                    : '—'
                  }
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>mmHg</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>SpO2</div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: getVitalStatus('spO2', latestVitals.spO2) === 'normal' ? '#52c41a' : '#ff4d4f'
                }}>
                  {latestVitals.spO2 ? `${latestVitals.spO2}%` : '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Temperature</div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: getVitalStatus('temperature', latestVitals.temperature) === 'normal' ? '#52c41a' : '#ff4d4f'
                }}>
                  {latestVitals.temperature ? `${latestVitals.temperature}°C` : '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>Weight</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {latestVitals.weight || '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>kg</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ 
                textAlign: 'center', 
                padding: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '11px', color: '#666' }}>BMI</div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: getVitalStatus('bmi', latestVitals.bmi) === 'normal' ? '#52c41a' : '#faad14'
                }}>
                  {latestVitals.bmi || '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>&nbsp;</div>
              </div>
            </Col>
          </Row>
        )}
      </Card>

      {/* === Vital Signs History Table === */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <ExperimentOutlined className="text-blue-500" />
            <Text strong>Vital Signs History</Text>
          </div>
        }
        size="small"
        styles={{
          header: { backgroundColor: '#f0f8ff', padding: '12px 16px' },
          body: { padding: '16px' }
        }}
      >
        <Table
          dataSource={processedVitalSigns}
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
            className: 'text-xs'
          }}
          scroll={{ x: 1200 }}
          columns={[
            {
              title: 'Date/Time',
              key: 'datetime',
              width: 120,
              fixed: 'left',
              render: (_, record: ConsolidatedVitalSigns) => (
                <div>
                  <div className="text-xs font-bold">
                    {dayjs(record.recordedTime).format('MM/DD/YY')}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {dayjs(record.recordedTime).format('HH:mm')}
                  </div>
                </div>
              ),
            },
            {
              title: 'HR',
              dataIndex: 'heartRate',
              key: 'heartRate',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                const status = getVitalStatus('heartRate', value);
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      status === 'normal' ? 'text-green-500' : 
                      status === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {value}
                    </div>
                    <div className="text-[10px] text-gray-400">bpm</div>
                  </div>
                );
              },
            },
            {
              title: 'BP',
              key: 'bloodPressure',
              width: 80,
              render: (_, record: ConsolidatedVitalSigns) => {
                if (!record.bloodPressureSystolic || !record.bloodPressureDiastolic) {
                  return <div className="text-center text-gray-400">—</div>;
                }
                const sysStatus = getVitalStatus('systolic', record.bloodPressureSystolic);
                const diaStatus = getVitalStatus('diastolic', record.bloodPressureDiastolic);
                const isAbnormal = sysStatus !== 'normal' || diaStatus !== 'normal';
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      isAbnormal ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {record.bloodPressureSystolic}/{record.bloodPressureDiastolic}
                    </div>
                    <div className="text-[10px] text-gray-400">mmHg</div>
                  </div>
                );
              },
            },
            {
              title: 'SpO2',
              dataIndex: 'spO2',
              key: 'spO2',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                const status = getVitalStatus('spO2', value);
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      status === 'normal' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {value}%
                    </div>
                  </div>
                );
              },
            },
            {
              title: 'Temp',
              dataIndex: 'temperature',
              key: 'temperature',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                const status = getVitalStatus('temperature', value);
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      status === 'normal' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {value}°C
                    </div>
                  </div>
                );
              },
            },
            {
              title: 'Weight',
              dataIndex: 'weight',
              key: 'weight',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-sm font-bold">{value}</div>
                    <div className="text-[10px] text-gray-400">kg</div>
                  </div>
                );
              },
            },
            {
              title: 'Height',
              dataIndex: 'height',
              key: 'height',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-sm font-bold">{value}</div>
                    <div className="text-[10px] text-gray-400">m</div>
                  </div>
                );
              },
            },
            {
              title: 'BMI',
              dataIndex: 'bmi',
              key: 'bmi',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                const status = getVitalStatus('bmi', value);
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      status === 'normal' ? 'text-green-500' : 
                      status === 'high' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {value}
                    </div>
                  </div>
                );
              },
            },
            {
              title: 'RR',
              dataIndex: 'respiratoryRate',
              key: 'respiratoryRate',
              width: 70,
              render: (value: number | undefined) => {
                if (value === undefined) return <div className="text-center text-gray-400">—</div>;
                const status = getVitalStatus('respiratoryRate', value);
                return (
                  <div className="text-center">
                    <div className={`text-sm font-bold ${
                      status === 'normal' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {value}
                    </div>
                    <div className="text-[10px] text-gray-400">/min</div>
                  </div>
                );
              },
            },
            {
              title: 'Notes',
              dataIndex: 'notes',
              key: 'notes',
              width: 200,
              render: (text: string | undefined) => (
                <div className="text-[11px] text-gray-600">
                  {text || '—'}
                </div>
              ),
            },
          ]}
          rowClassName={(record: ConsolidatedVitalSigns) => {
            const hasAbnormal = 
              getVitalStatus('heartRate', record.heartRate) !== 'normal' ||
              getVitalStatus('systolic', record.bloodPressureSystolic) !== 'normal' ||
              getVitalStatus('spO2', record.spO2) !== 'normal' ||
              getVitalStatus('temperature', record.temperature) !== 'normal' ||
              getVitalStatus('respiratoryRate', record.respiratoryRate) !== 'normal' ||
              getVitalStatus('bmi', record.bmi) !== 'normal';
            
            return hasAbnormal ? 'vital-row-abnormal' : 'vital-row-normal';
          }}
        />
      </Card>

      <style>{`
        .vital-row-abnormal {
          background-color: #fff2f0 !important;
        }
        .vital-row-normal:hover {
          background-color: #f0f8ff !important;
        }
      `}</style>
    </div>
  );
};

export default ObservationTab;