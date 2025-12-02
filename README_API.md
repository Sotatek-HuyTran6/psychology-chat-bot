# API Configuration Guide

## Setup

### 1. Cài đặt dependencies
```bash
npm install axios
```

### 2. Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Cấu trúc Files

```
src/
├── config/
│   └── axios.config.ts          # Axios instance & interceptors
├── types/
│   └── auth.types.ts            # Auth type definitions
├── api/
│   └── auth.api.ts              # Auth API endpoints
├── hooks/
│   └── useAuth.ts               # Auth hook
└── components/
    ├── LoginForm.tsx            # Login form component
    └── SignUpForm.tsx           # Sign up form component
```

## Axios Interceptors

### Request Interceptor
- Tự động thêm `Authorization` header với Bearer token
- Log request trong development mode
- Handle request errors

### Response Interceptor
- Log response trong development mode
- **Auto refresh token** khi gặp 401 Unauthorized
- Handle các HTTP errors: 403, 404, 500
- Handle network errors

## API Endpoints

### Authentication APIs

#### 1. Sign Up
```typescript
await authApi.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'User Name',
  confirmPassword: 'password123'
});
```

#### 2. Sign In
```typescript
await authApi.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

#### 3. Sign Out
```typescript
await authApi.signOut();
```

#### 4. Get Current User
```typescript
const user = await authApi.getCurrentUser();
```

#### 5. Refresh Token
```typescript
await authApi.refreshToken({
  refreshToken: 'refresh_token_here'
});
```

#### 6. Forgot Password
```typescript
await authApi.forgotPassword({
  email: 'user@example.com'
});
```

#### 7. Reset Password
```typescript
await authApi.resetPassword({
  token: 'reset_token',
  password: 'new_password',
  confirmPassword: 'new_password'
});
```

#### 8. Change Password
```typescript
await authApi.changePassword({
  oldPassword: 'old_password',
  newPassword: 'new_password',
  confirmPassword: 'new_password'
});
```

## useAuth Hook

Custom hook để quản lý authentication state:

```typescript
const {
  user,              // Current user object
  isLoading,         // Loading state
  isAuthenticated,   // Authentication status
  signIn,            // Sign in function
  signUp,            // Sign up function
  signOut,           // Sign out function
  refreshUser,       // Refresh user data
  error              // Error message
} = useAuth();
```

### Sử dụng trong Component

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Components

### LoginForm
Form component cho đăng nhập với validation.

### SignUpForm
Form component cho đăng ký với validation và password confirmation.

## Token Management

### Storage
- `access_token`: Stored in localStorage
- `refresh_token`: Stored in localStorage
- `user`: User object stored in localStorage

### Auto Refresh
Axios interceptor tự động refresh token khi:
- Response trả về 401 Unauthorized
- Có refresh token trong localStorage
- Chưa retry request

Nếu refresh token thất bại:
- Clear tất cả tokens
- Redirect về trang login

## Error Handling

### API Errors
```typescript
try {
  await authApi.signIn(credentials);
} catch (error) {
  // error.response.data.message
  // error.response.status
}
```

### Hook Errors
```typescript
const { error, signIn } = useAuth();

try {
  await signIn(credentials);
} catch (err) {
  console.error('Login failed:', err.message);
}
```

## Backend API Contract

Backend cần implement các endpoints sau:

```
POST   /api/auth/signup          - Đăng ký
POST   /api/auth/signin          - Đăng nhập
POST   /api/auth/signout         - Đăng xuất
POST   /api/auth/refresh         - Refresh token
GET    /api/auth/me              - Lấy thông tin user hiện tại
POST   /api/auth/forgot-password - Quên mật khẩu
POST   /api/auth/reset-password  - Reset mật khẩu
PUT    /api/auth/change-password - Đổi mật khẩu
POST   /api/auth/verify-email/:token - Xác thực email
```

### Response Format
```typescript
{
  success: boolean,
  message: string,
  data?: T,
  error?: string
}
```

### Auth Response
```typescript
{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    name: string,
    avatar?: string,
    role?: string,
    createdAt: string,
    updatedAt: string
  }
}
```

## Best Practices

1. **Always check authentication** trước khi render protected components
2. **Handle errors gracefully** với user-friendly messages
3. **Clear tokens on logout** để đảm bảo security
4. **Use HTTPS** trong production
5. **Set appropriate token expiration times**
6. **Implement rate limiting** trên backend
7. **Validate input** ở cả frontend và backend

## Security Notes

⚠️ **Important:**
- Không lưu sensitive data trong localStorage nếu có thể
- Implement CSRF protection
- Use secure, httpOnly cookies cho production
- Implement proper CORS policies
- Validate và sanitize all user inputs
- Use strong password requirements
- Implement rate limiting cho auth endpoints
