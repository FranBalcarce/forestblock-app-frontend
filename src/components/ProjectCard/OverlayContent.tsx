import React, { useState } from 'react';
import Image from 'next/image';
import CountryFlag from './CountryFlag';
import { getOdsImage } from '@/utils/odsUtils';

interface OverlayContentProps {
  vintages: string;
  country: string;
  category?: string;
  name: string;
  price?: string | null;
  onPurchase: () => void;
  sdgs: number;
  sdgsArray: string[];
}

function OverlayContent({
  vintages,
  country,
  category,
  name,
  price,
  onPurchase,
  sdgs,
  sdgsArray,
}: OverlayContentProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const truncateText = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.slice(0, maxLength) + '...';

  const limitText = 30;

  const hasPrice = price && !Number.isNaN(Number(price));
  const displayPrice = hasPrice ? `$${Number(price).toFixed(2)}` : null;

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('https://www.forestblock.tech/contact/contacto', '_blank');
  };

  return (
    <div
      className="relative z-5 bg-black bg-opacity-50 h-full flex flex-col justify-between p-4 text-white cursor-pointer"
      onClick={onPurchase}
    >
      {/* HEADER */}
      <div className="flex justify-end gap-2 items-center">
        <span className="bg-white px-3 py-1 text-[13px] rounded-full text-forestGreen">
          {vintages}
        </span>
        <CountryFlag country={country} />
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-2">
        <div className="bg-mintGreen text-[11px] px-3 py-1 rounded-full inline-block self-start text-forestGreen">
          {category || 'Categoría'}
        </div>

        <h2 className="text-[20px] font-bold text-left">
          {truncateText(name || 'Nombre del Proyecto', limitText)}
        </h2>

        <div className="w-full border-t border-white opacity-30 my-2" />

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          {/* IZQUIERDA */}
          {displayPrice ? (
            <span className="text-[26px] font-medium">{displayPrice}</span>
          ) : (
            <button
              onClick={handleContact}
              className="bg-white text-forestGreen px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
            >
              Contactar
            </button>
          )}

          {/* DERECHA */}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="bg-white px-3 py-1 text-[13px] font-semibold rounded-full text-forestGreen flex gap-2">
              <Image src="/images/rueda_ODS.png" alt="SDGs" width={20} height={20} />
              <span>{sdgs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLTIP */}
      {showTooltip && (
        <div className="absolute bottom-[60px] left-3 w-full pointer-events-none z-40">
          <div className="bg-white text-black text-xs p-2 rounded shadow w-[90%]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {sdgsArray.map((goal) => (
                <Image
                  key={goal}
                  src={getOdsImage(Number(goal))}
                  alt={`ODS ${goal}`}
                  width={50}
                  height={50}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverlayContent;

// import React, { useState } from "react";
// import Image from "next/image";
// import CountryFlag from "./CountryFlag";
// import { getOdsImage } from "@/utils/odsUtils";

// interface OverlayContentProps {
//   vintages: string;
//   country: string;
//   category?: string;
//   name: string;
//   price: string;
//   onPurchase: () => void;
//   sdgs: number;
//   sdgsArray: string[];
// }

// function OverlayContent({
//   vintages,
//   country,
//   category,
//   name,
//   price,
//   onPurchase,
//   sdgs,
//   sdgsArray,
// }: OverlayContentProps) {
//   const [showTooltip, setShowTooltip] = useState(false);

//   const truncateText = (text: string, maxLength: number): string => {
//     if (text.length <= maxLength) return text;
//     return text.slice(0, maxLength) + "...";
//   };

//   const limitText = 30;

//   return (
//     <div
//       className="relative z-5 bg-black bg-opacity-50 h-full flex flex-col justify-between p-4 text-white cursor-pointer"
//       onClick={onPurchase}
//     >
//       <div className="flex justify-end gap-2 items-center">
//         <span className="bg-white px-3 py-1 text-[13px] font-neueMontreal rounded-full text-forestGreen">
//           {vintages}
//         </span>
//         <CountryFlag country={country} />
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="flex flex-col gap-2">
//           <div className="bg-mintGreen text-[11px] font-neueMontreal px-3 py-1 rounded-full inline-block self-start text-forestGreen">
//             {category || "Categoría"}
//           </div>
//           <h2 className="text-[20px] font-bold font-aeonik text-left">
//             {truncateText(name || "Nombre del Proyecto", limitText)}
//           </h2>
//         </div>
//         <div className="w-full border-t border-white opacity-30 my-2"></div>
//         <div className="flex justify-between items-center">
//           <span className="text-[26px] font-medium font-aeonik text-white text-start">
//             ${Number(price)?.toFixed(2) || "Precio"}
//           </span>
//           <div
//             className="relative"
//             onMouseEnter={() => setShowTooltip(true)}
//             onMouseLeave={() => setShowTooltip(false)}
//           >
//             <div className="bg-white px-3 py-1 text-[13px] font-semibold rounded-full text-forestGreen flex gap-2">
//               <Image
//                 src="/images/rueda_ODS.png"
//                 alt="SDGs"
//                 width={20}
//                 height={20}
//               />
//               <span className="text-[13px] font-semibold">{sdgs}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showTooltip && (
//         <div className="absolute bottom-[60px] left-3 w-full pointer-events-none z-40">
//           <div className="bg-white text-black text-xs p-2 pb-3 rounded shadow relative w-[90%]">
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
//               {sdgsArray.map((goal) => (
//                 <div key={goal} className="flex justify-center items-center">
//                   <Image
//                     src={getOdsImage(Number(goal))}
//                     alt={`ODS ${goal}`}
//                     width={50}
//                     height={50}
//                     className="rounded"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="absolute bottom-0 right-4 transform translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OverlayContent;
