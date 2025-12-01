'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuItem, MenuProps } from './types';
import { useModal } from '@/context/ModalContext';
import LogoutButton from './LogoutButton';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Menu: React.FC<MenuProps> = ({
  menuItems,
  isAuthenticated,
  isActive,
  // onItemClick,  // 👈 lo sacamos de acá
  logout,
}) => {
  const leftOffset = isAuthenticated ? '-left-10' : '-left-[2.5rem]';
  const { openModal } = useModal();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const forestTrackItems = menuItems.slice(0, 2);
  const forestxItems = menuItems.slice(2, 4);
  const newFeatureItems = menuItems.slice(4, 5);
  const infoItems = menuItems.slice(5); // toma el resto

  const handleItemClick = (item: MenuItem, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      setOpenSubMenu(openSubMenu === item.label ? null : item.label);
      return;
    }

    if (!isAuthenticated && (item.href?.startsWith('/dashboard') || item.href === '/retirements')) {
      e.preventDefault();
      openModal('login');
      return;
    }

    // si está autenticado o la ruta no es protegida, dejamos que <Link> navegue solo
  };

  const renderMenuItem = (item: MenuItem, isNested: boolean = false) => {
    const isExternalLink = item.href?.startsWith('http');
    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = openSubMenu === item.label;

    return (
      <div key={item.label}>
        <Link
          href={item.href || '#'}
          onClick={(e) => handleItemClick(item, e)}
          target={isExternalLink ? '_blank' : undefined}
          rel={isExternalLink ? 'noopener noreferrer' : undefined}
          className="relative text-[#ecf0f1] text-[18px] flex items-center gap-2 px-2 py-2 rounded transition-transform ease-in-out duration-200 hover:text-mintGreen hover:bg-white/10 no-underline"
        >
          {!isNested && isActive(item) && (
            <span
              className={`absolute ${leftOffset} top-0 bottom-0 w-2 bg-mintGreen rounded-full`}
            ></span>
          )}
          <span
            className={`transition-colors duration-200 ${
              isActive(item) ? 'text-mintGreen' : 'text-[#ecf0f1]/80'
            }`}
          >
            {item.icon}
          </span>
          <span
            className={`font-aeonik transition-colors duration-200 ${
              isActive(item) ? 'text-[#ecf0f1]' : 'text-[#ecf0f1]/80'
            }`}
          >
            {item.label}
          </span>
          {hasChildren && (
            <span className="ml-auto">
              {isSubMenuOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </span>
          )}
        </Link>

        {hasChildren && isSubMenuOpen && (
          <div className="pl-2">{item.children?.map((child) => renderMenuItem(child, true))}</div>
        )}
      </div>
    );
  };

  return (
    <nav className="flex flex-col gap-5 w-full mt-5">
      <span className="px-2 py-2 text-[18px] font-aeonik">FOREST-TRACK</span>
      {forestTrackItems.map((item) => renderMenuItem(item))}

      <span className="px-2 py-2 text-[18px] font-aeonik mt-6">FORESTX</span>
      {forestxItems.map((item) => renderMenuItem(item))}

      <span className="px-2 py-2 text-[18px] font-aeonik mt-6">NUEVOS PROYECTOS</span>
      {newFeatureItems.map((item) => renderMenuItem(item))}

      <span className="px-2 py-2 text-[18px] font-aeonik mt-6">INFO</span>
      {infoItems.map((item) => renderMenuItem(item))}

      <div className="xl:mt-10 md:mt-5 mb-5">
        <LogoutButton isAuthenticated={isAuthenticated} logout={logout} />
      </div>
    </nav>
  );
};

export default Menu;

// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { MenuItem, MenuProps } from './types';
// import { useModal } from '@/context/ModalContext';
// import LogoutButton from './LogoutButton';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const Menu: React.FC<MenuProps> = ({
//   menuItems,
//   isAuthenticated,
//   isActive,
//   onItemClick, // lo dejamos pero no lo usamos
//   logout,
// }) => {
//   const leftOffset = isAuthenticated ? '-left-10' : '-left-[2.5rem]';
//   const { openModal } = useModal();
//   const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

//   const forestTrackItems = menuItems.slice(0, 2);
//   const forestxItems = menuItems.slice(2, 4);
//   const newFeatureItems = menuItems.slice(4, 5);
//   const infoItems = menuItems.slice(5); // toma el resto

//   const handleItemClick = (item: MenuItem, e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (item.children && item.children.length > 0) {
//       e.preventDefault();
//       setOpenSubMenu(openSubMenu === item.label ? null : item.label);
//       return;
//     }
//     if (!isAuthenticated && (item.href?.startsWith('/dashboard') || item.href === '/retirements')) {
//       e.preventDefault();
//       openModal('login');
//       return;
//     }
//     // si está autenticado o la ruta no es protegida, dejamos que <Link> navegue solo
//   };

//   const renderMenuItem = (item: MenuItem, isNested: boolean = false) => {
//     const isExternalLink = item.href?.startsWith('http');
//     const hasChildren = item.children && item.children.length > 0;
//     const isSubMenuOpen = openSubMenu === item.label;

//     return (
//       <div key={item.label}>
//         <Link
//           href={item.href || '#'}
//           onClick={(e) => handleItemClick(item, e)}
//           target={isExternalLink ? '_blank' : undefined}
//           rel={isExternalLink ? 'noopener noreferrer' : undefined}
//           className="relative text-[#ecf0f1] text-[18px] flex items-center gap-2 px-2 py-2 rounded transition-transform ease-in-out duration-200 hover:text-mintGreen hover:bg-white/10 no-underline"
//         >
//           {!isNested && isActive(item) && (
//             <span
//               className={`absolute ${leftOffset} top-0 bottom-0 w-2 bg-mintGreen rounded-full`}
//             ></span>
//           )}
//           <span
//             className={`transition-colors duration-200 ${
//               isActive(item) ? 'text-mintGreen' : 'text-[#ecf0f1]/80'
//             }`}
//           >
//             {item.icon}
//           </span>
//           <span
//             className={`font-aeonik transition-colors duration-200 ${
//               isActive(item) ? 'text-[#ecf0f1]' : 'text-[#ecf0f1]/80'
//             }`}
//           >
//             {item.label}
//           </span>
//           {hasChildren && (
//             <span className="ml-auto">
//               {isSubMenuOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
//             </span>
//           )}
//         </Link>

//         {hasChildren && isSubMenuOpen && (
//           <div className="pl-2">{item.children?.map((child) => renderMenuItem(child, true))}</div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <nav className="flex flex-col gap-5 w-full mt-5">
//       <span className="px-2 py-2 text-[18px] font-aeonik">FOREST-TRACK</span>
//       {forestTrackItems.map((item) => renderMenuItem(item))}

//       <span className="px-2 py-2 text-[18px] font-aeonik mt-6">FORESTX</span>
//       {forestxItems.map((item) => renderMenuItem(item))}

//       <span className="px-2 py-2 text-[18px] font-aeonik mt-6">NUEVOS PROYECTOS</span>
//       {newFeatureItems.map((item) => renderMenuItem(item))}

//       <span className="px-2 py-2 text-[18px] font-aeonik mt-6">INFO</span>
//       {infoItems.map((item) => renderMenuItem(item))}

//       <div className="xl:mt-10 md:mt-5 mb-5">
//         <LogoutButton isAuthenticated={isAuthenticated} logout={logout} />
//       </div>
//     </nav>
//   );
// };

// export default Menu;
