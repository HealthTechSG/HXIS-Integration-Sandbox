import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Alert } from 'antd';
import { SearchOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

interface LoginFormValues {
  email: string;
  password: string;
}

interface OrganizationOption {
  value: string;
  label: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationOption | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const organizationOptions: OrganizationOption[] = [
    { value: 'HXEMR Demo App', label: 'HXEMR Demo App' }
  ];

  const handleOrganizationProceed = () => {
    if (selectedOrganization) {
      setShowLoginForm(true);
      setAlertMessage(null);
    } else {
      setAlertMessage('Please select an organization');
    }
  };

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      if (values.email === 'demo@healthx.sg' && values.password === 'demo123') {
        //TODO: Implement login logic
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('selectedOrganization', selectedOrganization?.value || '');
        message.success(`Login successful for ${selectedOrganization?.label}`);
        navigate('/');
      } else {
        //TODO: Implement login error logic
        setAlertMessage('Invalid email or password');
      }
    } catch (err) {
      setAlertMessage('An error occurred');
      console.error(err);
    }
  };

  const handleBack = () => {
    setShowLoginForm(false);
    form.resetFields();
    setAlertMessage(null);
  };

  return (
    <>
      <style>
        {`
          .form-validation-small .ant-form-item-explain-error {
            font-size: 10px;
          }
        `}
      </style>
      <div className="flex justify-center items-center bg-[#eef7ff]" style={{ height: 'calc(100vh - var(--header-height, 3.5rem))' }}>
        <Card 
          title="HealthX Integration Sandbox" 
          className="w-96 shadow-lg bg-white "
          styles={{ header: { backgroundColor: '#0b78b2', color: 'white', borderBottom: '2px solid #cbeafe' } }}
        >
          {!showLoginForm ? (
            <div className="space-y-4">
              {alertMessage && (
                <Alert
                  message={alertMessage}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setAlertMessage(null)}
                  className="mb-4"
                />
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Organization
                </label>
                <Select
                  value={selectedOrganization}
                  onChange={setSelectedOrganization}
                  options={organizationOptions}
                  placeholder={
                    <div className="flex items-center gap-2 text-gray-500">
                      <SearchOutlined />
                      <span>Search your organization...</span>
                    </div>
                  }
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#cbeafe',
                      borderRadius: '6px',
                      '&:hover': {
                        borderColor: '#93d4ff'
                      }
                    }),
                    placeholder: (base) => ({
                      ...base,
                      display: 'flex',
                      alignItems: 'center',
                      color: '#9CA3AF'
                    })
                  }}
                />
              </div>
              <Button
                type="primary"
                block
                onClick={handleOrganizationProceed}
                className="rounded-md"
              >
                Proceed
              </Button>
            </div>
          ) : (
            <div className="form-validation-small">
              {alertMessage && (
                <Alert
                  message={alertMessage}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setAlertMessage(null)}
                  className="mb-4"
                />
              )}
              <Form<LoginFormValues>
                form={form}
                name="loginForm"
                initialValues={{ email: '', password: '' }}
                onFinish={handleLogin}
                layout="vertical"
              >
                <div className="mb-5 flex items-center gap-2">
                  <LeftOutlined 
                    className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                    onClick={handleBack}
                  />
                  <span className="text-sm text-gray-600">Organization: </span>
                  <span className="text-sm font-medium text-blue-600">{selectedOrganization?.label}</span>
                </div>
                
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ]}
                >
                  <Input 
                    placeholder="example@domain.com" 
                    className="rounded-md"
                    style={{ borderColor: '#cbeafe' }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter your password' },
                  ]}
                >
                  <Input.Password 
                    placeholder="Enter your password..." 
                    className="rounded-md"
                    style={{ borderColor: '#cbeafe' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="rounded-md"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
