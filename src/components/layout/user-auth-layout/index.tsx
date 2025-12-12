import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router";


const PublicLayout: React.FC = () => {
  const { accessToken, refreshToken } = useAuthStore();

  console.log(accessToken, refreshToken, '++++++++++++++++++++++');

  if (accessToken && refreshToken) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default PublicLayout;