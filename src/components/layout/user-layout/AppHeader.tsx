import { useSidebar } from "@/contexts/SideBarContext";
import { useAuthStore } from "@/stores/authStore";
import {
  UserOutlined,
} from '@ant-design/icons';
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router";

const AppHeader: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 flex w-full z-99999"
      style={{ background: 'radial-gradient(circle,rgba(92, 31, 67, 1) 0%, rgba(89, 22, 56, 1) 50%, rgba(59, 20, 42, 1) 100%)' }}
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
          <div
            onClick={handleToggle}
            className="relative cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={46} viewBox="0 0 52 50" fill="none"><path d="M6.80009 0.648197L45.4022 0.648214C49.0461 0.648215 52 3.60214 52 7.24599L52 42.874C52 46.5178 49.0461 49.4718 45.4022 49.4718L16.2333 49.4718C13.2398 49.4718 10.6215 47.4565 9.85529 44.5627L0.422082 8.93468C-0.68621 4.74881 2.46998 0.648195 6.80009 0.648197Z" fill='#e972be'></path></svg>
            <div className={`absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ${isExpanded || isMobileOpen ? 'rotate-180' : ''}`}>
              <FaArrowRight />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" className="lg:hidden !max-w-[45px]">
              <img
                src="./images/logo/wayground.png"
                alt="Logo"
              />
            </Link>

            <p className="text-[#e8589d] flex gap-2 items-center lg:hidden font-bold">
              Plays
            </p>
          </div>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              className="shrink-0 cursor-pointer"
            />
            <div className="text-[#f3efda] font-bold">
              {user?.name}
            </div>
            {/* <!-- Dark Mode Toggler --> */}
            {/* <ThemeToggleButton /> */}
            {/* <!-- Dark Mode Toggler --> */}
            {/* <!-- Language Toggler --> */}
            {/* <LanguageToggleButton /> */}
          </div>
          {/* <!-- User Area --> */}
          {/* <UserDropdown /> */}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
