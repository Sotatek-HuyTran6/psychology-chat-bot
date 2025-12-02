import { Form, Input, message } from 'antd';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { SignInRequest } from '../types/auth.types';
import RippleButton from './RippleButton';

interface LoginFormProps {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsSignupModalOpen: (open: boolean) => void;
}

export const LoginForm = ({ setIsLoginModalOpen, setIsSignupModalOpen }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [loginForm] = Form.useForm();

  const onFinish = async (values: SignInRequest) => {
    try {
      setLoading(true);
      await signIn(values);
      message.success('Đăng nhập thành công!');
      setIsLoginModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input placeholder="email@example.com" size="middle" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password placeholder="Nhập mật khẩu" size="middle" />
      </Form.Item>

      <div className="text-center mt-4 mb-4">
        <span className="text-slate-600">Chưa có tài khoản? </span>
        <a
          className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
          onClick={() => {
            setIsLoginModalOpen(false);
            loginForm.resetFields();
            setIsSignupModalOpen(true);
          }}
        >
          Đăng ký ngay
        </a>
      </div>

      <Form.Item>
        <RippleButton
          onClick={() => loginForm.submit()}
          loading={loading}
          className="w-full !h-[52px] rounded-3xl text-[#0842a0] bg-[#d3e3fd] hover:bg-[#d3e3fd]"
        >
          Đăng nhập
        </RippleButton>
      </Form.Item>
    </Form>
  );
};
