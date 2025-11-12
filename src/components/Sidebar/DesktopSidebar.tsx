'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useSearchParams } from 'next/navigation';
import Logo from './Logo';
import Menu from './Menu';
import Divider from '../Divider/Divider';
import { useMenuItems, useIsActive } from '@/utils/menuConfig';

const DesktopSidebar: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isActive = useIsActive(pathname, searchParams);
  const menuItems = useMenuItems();

  useEffect(() => setIsVisible(true), []);

  return (
    <div className="hidden md:h-screen md:flex md:sticky md:top-0">
      <div
        className={`sticky translate-y-1 scrollbar-hidden top-0 overflow-y-auto w-[260px] h-[99%] left-2 bg-forestGreen text-customWhite flex flex-col justify-between items-center rounded-3xl z-40 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="mb-10">
            <Logo variant="default" />
          </div>
          <Divider customClassName="w-full opacity-10" />
          <Menu
            menuItems={menuItems}
            isAuthenticated={isAuthenticated}
            isActive={isActive}
            onItemClick={() => {}} // 👈 neutraliza cualquier push por defecto
            logout={logout}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white p-2" />
    </div>
  );
};

export default DesktopSidebar;
