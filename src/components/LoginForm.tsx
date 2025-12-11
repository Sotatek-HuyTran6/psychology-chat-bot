import { Form, Input, message } from 'antd';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { SignInRequest } from '../types/auth.types';
import RippleButton from './common/RippleButton';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsSignupModalOpen: (open: boolean) => void;
}

export const LoginForm = ({ setIsLoginModalOpen, setIsSignupModalOpen }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [loginForm] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: SignInRequest) => {
    try {
      setLoading(true);
      await signIn(values);
      message.success('Đăng nhập thành công!');
      setIsLoginModalOpen(false);
      navigate('/chat');
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
        <span className="!text-[#3b142a]">Chưa có tài khoản? </span>
        <a
          className="text-[#3b142a] hover:text-blue-700 cursor-pointer font-medium"
          onClick={() => {
             navigate('/signup');
          }}
        >
          Đăng ký ngay
        </a>
      </div>

      <Form.Item className='flex justify-end mt-5'>
        <RippleButton
          loading={loading}
          onClick={() => loginForm.submit()}
          className="w-[120px] h-[48px] text-[15px] !font-bold rounded-sm text-white bg-[#e85cac] hover:!bg-[#e85cac]"
        >
          Đăng nhập
        </RippleButton>
      </Form.Item>
    </Form>
  );
};
