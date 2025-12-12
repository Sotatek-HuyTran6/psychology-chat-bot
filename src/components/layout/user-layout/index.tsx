import { SidebarProvider, useSidebar } from '@/contexts/SideBarContext';
import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router';
import AppHeader from './AppHeader';
import AppSidebar from './AppSideBar';
// import { useMentalHealthEvaluation } from '@/hooks/features/useMentalHealthEvaluation';
// import { useMentalHealthStore } from '@/stores/mentalHealthStore';
// import { useEffect } from 'react';
import { useGetMe } from '@/hooks/features/useUser';

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { accessToken, refreshToken } = useAuthStore();
  // const { user } = useAuthStore();
  // const { setEvaluation } = useMentalHealthStore();
  useGetMe();
  // const { data: evaluationData } = useMentalHealthEvaluation(!!user);

  // useEffect(() => {
  //   if (evaluationData?.data) {
  //     setEvaluation(evaluationData?.data);
  //   }
  // }, [evaluationData]);


  if (!accessToken && !refreshToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='min-h-dvh bg-[#f3efda]'>
      <div>
        <AppSidebar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out h-dvh ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''} overflow-auto`}
      >
        <AppHeader />
        <Outlet />
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
