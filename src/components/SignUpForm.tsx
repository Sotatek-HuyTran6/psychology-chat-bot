import { Form, Input, message } from 'antd';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { SignUpRequest } from '@/types/auth.types';
import RippleButton from '@/components/common/RippleButton';
import { useNavigate } from 'react-router-dom';

interface SignUpFormProps {
  setIsSignupModalOpen: (open: boolean) => void;
  setIsLoginModalOpen: (open: boolean) => void;
}

export const SignUpForm = ({ setIsSignupModalOpen, setIsLoginModalOpen }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const [signupForm] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: SignUpRequest) => {
    try {
      setLoading(true);

      const formPayload = {
        email: values.email,
        name: values.name,
        phone: values.phoneNumber,
        password: values.password,
      };
      await signUp(formPayload);
      message.success('Đăng ký thành công!');
      setIsSignupModalOpen(false);
      setIsLoginModalOpen(true);
      navigate('/login');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="signup" layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input placeholder="Nhập email của bạn" />
      </Form.Item>

      <Form.Item
        label="Họ và tên"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập họ và tên!' },
          { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
          { max: 50, message: 'Họ và tên không được vượt quá 50 ký tự!' },
          {
            pattern:
              /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/,
            message: 'Họ và tên chỉ được chứa chữ cái!',
          },
        ]}
      >
        <Input placeholder="Nhập họ và tên đầy đủ" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          {
            pattern: /^(0|\+84)[0-9]{9,10}$/,
            message: 'Số điện thoại không hợp lệ! (VD: 0912345678 hoặc +84912345678)',
          },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!',
          },
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Nhập lại mật khẩu" />
      </Form.Item>

      <div className="text-center mt-4 mb-4">
        <span className="text-[#3b142a]">Đã có tài khoản? </span>
        <a
          className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
          onClick={() => {
            navigate('/login');
          }}
        >
          Đăng nhập ngay
        </a>
      </div>

      <Form.Item>
        <RippleButton
          onClick={() => signupForm.submit()}
          loading={loading}
          className="w-[120px] h-[48px] text-[15px] !font-bold rounded-sm text-white bg-[#e85cac] hover:!bg-[#e85cac]"
        >
          Đăng ký
        </RippleButton>
      </Form.Item>
    </Form>
  );
};
