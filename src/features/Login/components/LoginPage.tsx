import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      if (values.username === 'admin' && values.password === 'admin') {
        //TODO: Implement login logic
        localStorage.setItem('isLoggedIn', 'true');
        message.success('Login successful');
        navigate('/');
      } else {
        //TODO: Implement login error logic
        message.error('Invalid username or password');
      }
    } catch (err) {
      message.error('An error occurred');
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <Card title="HXIS Integration Sandbox" className="w-96 shadow-lg">
          <Form<LoginFormValues>
            form={form}
            name="loginForm"
            initialValues={{ username: '', password: '' }}
            onFinish={handleLogin}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter your username' },
              ]}
            >
              <Input placeholder="Username" className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password placeholder="Password" className="rounded-md" />
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
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
