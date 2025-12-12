import { ChatPage } from '@/components/chat/ChatPage';
import UserLayout from '@/components/layout/user-layout';
import { NotingPage } from '@/components/notes/NotingPage';
import { TestPage } from '@/components/test';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { MentalHealthPage } from './components/mental-health';
import { HomePage } from './components/home';
import { LoginPage } from './components/login';
import { SignUpPage } from './components/signup';
import UserAuthLayout from './components/layout/user-auth-layout';

function App() {

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e972be',
          controlHeight: 48,
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 16,
          fontWeightStrong: 600,
        },
        components: {
          Modal: {
            titleFontSize: 20,
          },
        },
      }}
    >
      <BrowserRouter>
        <div className="h-screen w-screen">
          <Routes>
            <Route element={<UserAuthLayout />}>
              <Route index element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignUpPage />} />
            </Route>
            <Route element={<UserLayout />}>
              {/* Others Page */}
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/mental-health" element={<MentalHealthPage />} />
              <Route path="/note" element={<NotingPage />} />
              <Route path="/test" element={<TestPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
