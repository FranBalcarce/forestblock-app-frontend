'use client';

import React from 'react';
import Searchbar from '../Searchbar/Searchbar';
import { HeroBannerProps } from './types';

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  children,
  showSearchbar = false,
  searchTerm = '',
  setSearchTerm = () => {},
  backgroundUrl = '/images/forest.png', // 👈 default: el de Marketplace
}) => {
  return (
    <div
      className="relative w-full bg-cover bg-center rounded-t-3xl overflow-visible h-[300px] lg:h-[400px]"
      style={{ backgroundImage: `url('${backgroundUrl}')` }} // 👈 usamos la prop
    >
      <div className="absolute inset-0 flex flex-col justify-start items-center text-white px-4 md:px-8 pt-20 md:pt-28 text-center md:items-start md:text-left">
        {title}
        <div className="mt-4 flex gap-4">{children}</div>
      </div>
      {showSearchbar && (
        <div className="absolute bottom-0 w-full flex justify-center z-5">
          <div className="w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 transform translate-y-6">
            <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

// "use client";

// import React from "react";
// import Searchbar from "../Searchbar/Searchbar";
// import { HeroBannerProps } from "./types";

// const HeroBanner: React.FC<HeroBannerProps> = ({
//   title,
//   children,
//   showSearchbar = false,
//   searchTerm = "",
//   setSearchTerm = () => {},
// }) => {
//   return (
//     <div
//       className="relative w-full bg-cover bg-center rounded-t-3xl overflow-visible h-[300px] lg:h-[400px]"
//       style={{ backgroundImage: "url('/images/forest.png')" }}
//     >
//       <div className="absolute inset-0 flex flex-col justify-start items-center text-white px-4 md:px-8 pt-20 md:pt-28 text-center md:items-start md:text-left">
//         {title}
//         <div className="mt-4 flex gap-4">{children}</div>
//       </div>
//       {showSearchbar && (
//         <div className="absolute bottom-0 w-full flex justify-center z-5">
//           <div className="w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 transform translate-y-6">
//             <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeroBanner;
