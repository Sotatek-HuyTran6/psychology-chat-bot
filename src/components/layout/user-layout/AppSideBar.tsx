import { useSidebar } from '@/contexts/SideBarContext';
import { ChevronDownIcon } from '@/icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import SidebarWidget from './SideBarWidget';
import { IoChatboxSharp } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRegNoteSticky } from "react-icons/fa6";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        icon: <IoChatboxSharp size={20} />,
        name: 'Chat Bot',
        path: '/chat',
      },
      {
        icon: <FaCalendar size={20} />,
        name: 'Lịch Trình',
        path: '/note',
      },
      {
        icon: <FaRegFileLines size={20} />,
        name: 'Bài kiểm tra nhanh',
        path: '/test',
      },
      {
        icon: <FaRegNoteSticky size={20} />,
        name: 'Mental Health',
        path: '/mental-health',
      },
    ],
    [],
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname.includes(path),
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    ['main'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
              }
              `}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`flex gap-2 py-[13px] px-4 items-center text-[14px] font-bold rounded-md hover:!bg-[#e972be] !transition-all !duration-300 !ease-in-out ${
                  isActive(nav.path) ? '!bg-[#e972be]' : '!bg-[#ffffff1e]'
                }
                `}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text whitespace-nowrap !text-[13px]">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      style={{ background: 'radial-gradient(circle,rgba(77, 25, 55, 1) 0%, rgba(89, 22, 56, 1) 50%, rgba(59, 20, 42, 1) 100%)' }}
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#3b142a] text-[#f3efda] h-screen transition-all duration-300 ease-in-out z-50 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 max-md:pb-2 max-md:pt-4 flex max-sm:hidden ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className='font-bold text-[18px] whitespace-nowrap text-[#e8589d] flex gap-2 items-center max-md:hidden'>
              <div className='!max-w-[45px]'>
                <img
                  src="./images/logo/wayground.png"
                  alt="Logo"
                />
              </div>
              Plays
            </div>
          ) : (
            <div className='font-bold text-[18px] whitespace-nowrap text-[#e8589d]'>
              <div className='!max-w-[45px]'>
                <img
                  src="./images/logo/wayground.png"
                  alt="Logo"
                />
              </div>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-grow-1 overflow-x-hidden">
        <nav className="flex-grow-1">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-[#f3efda] ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>
          </div>
        </nav>
        <div className='lg:mb-5 mb-20 overflow-x-hidden'>
          {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
