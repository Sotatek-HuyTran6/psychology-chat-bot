import RippleButton from "@/components/common/RippleButton";
import { useGetNotes } from "@/hooks/features/useNotes";
import { useAuthStore } from "@/stores/authStore";
import { useMentalHealthStore } from "@/stores/mentalHealthStore";
import {
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, type MenuProps } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { FaRegEdit, FaSignOutAlt } from "react-icons/fa";

export default function SidebarWidget() {
  const { user, logout } = useAuthStore();
  const { clearEvaluation } = useMentalHealthStore();
  const { data: notes } = useGetNotes();
  
  const handleLogout = async () => {
    try {
      clearEvaluation();
      logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: <span className="text-[#3b142a] !text-[14px]">Chỉnh sửa thông tin</span>,
      icon: <FaRegEdit size={18} color='#3b142a' />,
      onClick: () => {
        console.log('Edit information clicked');
      },
    },
    {
      key: 'analysis',
      label: <span className="text-[#3b142a] !text-[14px]">Đăng xuất</span>,
      icon: <FaSignOutAlt size={18} color='#3b142a' />,
      onClick: () => handleLogout(),
    },
  ];

   // Get the nearest upcoming note
    const upcomingNote = useMemo(() => {
      if (notes?.length) {
        return notes[0];
      } else {
        return null;
      }
    }, [notes]);
  
    const getImportanceColor = (importance: string) => {
      switch (importance) {
        case 'medium':
          return 'bg-blue-100 text-blue-700';
        case 'critical':
          return 'bg-green-100 text-green-700';
        default:
          return 'bg-blue-100 text-blue-700';
      }
    };
  
    const getImportanceText = (importance: string) => {
      switch (importance) {
        case 'critical':
          return 'Quan Trọng';
        case 'medium':
          return 'Nhặc nhở';
        default:
          return importance;
      }
    };
  
    const formatNoteTime = (timeString: string) => {
      const noteTime = dayjs(timeString);
      const now = dayjs();
      const diffMinutes = Math.abs(noteTime.diff(now, 'minute'));
      const diffHours = Math.abs(noteTime.diff(now, 'hour'));
      const diffDays = Math.abs(noteTime.diff(now, 'day'));
  
      if (diffMinutes < 60) {
        return `${diffMinutes} phút nữa`;
      } else if (diffHours < 24) {
        return `${diffHours} giờ nữa`;
      } else if (diffDays === 1) {
        return 'Ngày mai';
      } else if (diffDays < 7) {
        return `${diffDays} ngày nữa`;
      } else {
        return noteTime.format('DD/MM/YYYY HH:mm');
      }
    };

  return (
   <>
    {user ? (
        <div>
          {/* User info with dropdown */}
            {
             upcomingNote && (
              <div
                className="relative cursor-pointer mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={250} viewBox="0 0 52 50" fill="none"><path d="M6.80009 0.648197L45.4022 0.648214C49.0461 0.648215 52 3.60214 52 7.24599L52 42.874C52 46.5178 49.0461 49.4718 45.4022 49.4718L16.2333 49.4718C13.2398 49.4718 10.6215 47.4565 9.85529 44.5627L0.422082 8.93468C-0.68621 4.74881 2.46998 0.648195 6.80009 0.648197Z" fill='#ffc685'></path></svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
                  {user && upcomingNote && (
                    <div className="pr-4 pl-6 pb-3 border-slate-200 pt-3">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          {/* <ClockCircleOutlined className="text-blue-600" /> */}
                          <span className="text-[20px] font-bold text-[#3b142a] whitespace-nowrap">Lịch trình sắp tới</span>
                        </div>
                        <div className="space-y-4">
                          <p className="ps-2 text-sm font-medium line-clamp-2 text-[#3b142a]">
                            {upcomingNote.content}
                          </p>
                          <div className="flex items-center justify-between ps-6">
                            <span className="text-xs text-[#3b142a] whitespace-nowrap">{formatNoteTime(upcomingNote.time)}</span>
                          </div>  
                          <div className="ps-8">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getImportanceColor(upcomingNote.importance)}`}
                            >
                              {getImportanceText(upcomingNote.importance)}
                            </span>
                            {upcomingNote.isAiGenerated && (
                              <span className="px-2 ml-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                                AI
                              </span>
                            )}
                            </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
             ) 
            }
            
            <Dropdown 
              menu={{ items: menuItems }} 
              trigger={['click']} 
              placement="topLeft"
              overlayStyle={{ 
                backgroundColor: '#f3efda', 
                borderRadius: '8px',
                padding: 0
              }}
              overlayClassName="custom-dropdown"
            >
              <RippleButton className="flex items-center gap-3 px-3 py-2 bg-[#ffc685] rounded-lg hover:bg-[#ffc685]! w-full">
                <Avatar
                  size={40}
                  src={user.avatar}
                  icon={!user.avatar && <UserOutlined />}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0 flex justify-start flex-col items-start">
                  <div className="text-sm font-semibold text-[#3b142a] truncate">{user.name}</div>
                  <div className="text-xs text-[#3b142a] truncate">{user.email}</div>
                </div>
              </RippleButton>
            </Dropdown>

          {/* Logout button */}
          {/* <RippleButton
            icon={<LogoutOutlined />}
            // onClick={handleLogout}
            className="w-full rounded-3xl text-red-600 bg-red-50 border border-red-200 hover:bg-red-100!"
          >
            Đăng xuất
          </RippleButton> */}
        </div>
      ) : (
        <RippleButton
          // icon={<GoSignIn size={20} />}
          // onClick={() => setIsLoginModalOpen(true)}
          className="w-full rounded-3xl items-center!"
        >
          Đăng nhập
        </RippleButton>
      )}
   </>
  );
}
