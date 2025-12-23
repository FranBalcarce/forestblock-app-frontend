// src/components/ListingCard/ListingCard.tsx
import React from 'react';
import ListingItem from './ListingItem';
import type { ListingProps } from './types';

const ListingCard = ({
  handleRetire,
  matches,
  selectedVintage,
  displayPrice,
  priceParam,
  isPricesLoading,
}: ListingProps) => {
  if (!matches || matches.length === 0) {
    return <p className="text-gray-400 text-[23px] font-aeonik">No active listings available.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg md:rounded-xl px-10 py-10">
      <ListingItem
        handleRetire={handleRetire}
        matches={matches}
        selectedVintage={selectedVintage}
        displayPrice={displayPrice}
        priceParam={priceParam}
        isPricesLoading={isPricesLoading}
      />
    </div>
  );
};

export default ListingCard;

// import React from "react";
// import ListingItem from "./ListingItem";
// import { ListingProps } from "./types";

// const ListingCard = ({
//   handleRetire,
//   matches,
//   selectedVintage,
//   displayPrice,
//   priceParam,
//   isPricesLoading,
// }: ListingProps) => {
//   if (!matches) {
//     return (
//       <p className="text-gray-400 text-[23px] font-aeonik">
//         No active listings available.
//       </p>
//     );
//   }
//   return (
//     <div className="bg-white shadow-lg rounded-lg md:rounded-xl px-10 py-10">
//       {matches ? (
//         <ListingItem
//           handleRetire={handleRetire}
//           matches={matches}
//           selectedVintage={selectedVintage}
//           displayPrice={displayPrice}
//           priceParam={priceParam}
//           isPricesLoading={isPricesLoading}
//         />
//       ) : (
//         <p>No listings available for the selected year.</p>
//       )}
//     </div>
//   );
// };

// export default ListingCard;
