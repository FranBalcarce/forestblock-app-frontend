import { useEffect, useState } from 'react';
import ListingDetail from './ListingDetail';
import { useRetire } from '@/context/RetireContext';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListingProps } from './types';
import { formatNumber } from '@/utils/formatNumber';
import ListingItemSkeleton from './ListingItemSkeleton';
import type { RetireParams } from '@/types/marketplace';

const ListingItem = ({
  handleRetire,
  matches,
  selectedVintage,
  displayPrice,
  priceParam,
  isPricesLoading,
}: ListingProps) => {
  const {
    tonnesToRetire,
    setTonnesToRetire,
    index: contextIndex,
    setIndex,
    setTotalSupply,
  } = useRetire();

  const router = useRouter();
  const [localIndex, setLocalIndex] = useState<number>(Number(contextIndex ?? 0));
  const [defaultIndex, setDefaultIndex] = useState<number | null>(null);

  useEffect(() => {
    if (defaultIndex === null && matches.length > 0) {
      let computedIndex = matches.findIndex((match) => {
        const matchVintage = match.listing
          ? match.listing?.creditId?.vintage?.toString() ?? ''
          : match.carbonPool?.creditId?.vintage?.toString() ?? '';
        const matchPrice = Number(match.purchasePrice).toFixed(2);
        return matchVintage === (selectedVintage ?? '') && matchPrice === (displayPrice ?? '');
      });

      if (computedIndex === -1) {
        computedIndex = matches.findIndex((match) => {
          const matchVintage = match.listing
            ? match.listing?.creditId?.vintage?.toString() ?? ''
            : match.carbonPool?.creditId?.vintage?.toString() ?? '';
          return matchVintage === (selectedVintage ?? '');
        });
      }

      if (computedIndex === -1) computedIndex = 0;

      setDefaultIndex(computedIndex);
      setLocalIndex(computedIndex);
      setIndex(computedIndex);
    }
  }, [defaultIndex, matches, selectedVintage, displayPrice, setIndex]);

  if (isPricesLoading) return <ListingItemSkeleton />;

  const effectiveIndex = localIndex;
  const selectedMatch = matches[effectiveIndex] ?? matches[0];

  const price = selectedMatch ? Number(selectedMatch.purchasePrice) : Number(displayPrice ?? 0);

  const availableTonnes = selectedMatch?.supply ?? 0;

  // ✅ por si el context te lo devuelve como string
  const qty = typeof tonnesToRetire === 'number' ? tonnesToRetire : Number(tonnesToRetire);

  const total = price * qty;
  const value = formatNumber(total);

  const formattedValue =
    typeof availableTonnes === 'number'
      ? `${new Intl.NumberFormat('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(availableTonnes)} ton`
      : String(availableTonnes);

  const selectedMatchVintage =
    selectedMatch?.listing?.creditId?.vintage != null
      ? String(selectedMatch.listing.creditId.vintage)
      : selectedMatch?.carbonPool?.creditId?.vintage != null
      ? String(selectedMatch.carbonPool.creditId.vintage)
      : selectedVintage ?? '';

  // ✅ para el query param / para checkout
  const effectivePriceParam = priceParam ?? (Number.isFinite(price) ? String(price) : '');

  const projectId =
    selectedMatch?.listing?.creditId?.projectId ??
    selectedMatch?.carbonPool?.creditId?.projectId ??
    '';

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = Number(e.target.value);
    setLocalIndex(newIndex);
    setIndex(newIndex);

    const newPrice = matches[newIndex]?.purchasePrice ?? 0;
    setTotalSupply(matches[newIndex]?.supply ?? 0);

    router.replace(
      `?price=${newPrice}&vintages=${matches
        .map((match) =>
          match.listing
            ? match.listing?.creditId?.vintage?.toString() ?? ''
            : match.carbonPool?.creditId?.vintage?.toString() ?? ''
        )
        .filter(Boolean)
        .join(',')}`
    );
  };

  const isDisabled =
    !projectId ||
    !effectivePriceParam ||
    !selectedMatchVintage ||
    !Number.isFinite(qty) ||
    qty <= 0 ||
    qty > availableTonnes;

  const retireParams: RetireParams = {
    id: projectId,
    index: effectiveIndex,
    priceParam: effectivePriceParam,
    selectedVintage: selectedMatchVintage,
    quantity: qty,
  };

  return (
    <div
      key={selectedMatch?.listing?.id || selectedMatch?.carbonPool?.creditId?.creditId}
      className="relative pb-6 mb-8 last:mb-0 flex flex-col gap-5 h-auto"
    >
      <ListingDetail
        label="Año"
        value={
          <select className="w-full" onChange={handleSelectChange} value={effectiveIndex}>
            {matches.map((match, i) => {
              const matchVintage = match.listing
                ? match.listing?.creditId?.vintage?.toString() ?? ''
                : match.carbonPool?.creditId?.vintage?.toString() ?? '';
              return (
                <option key={i} value={i}>
                  {matchVintage}
                </option>
              );
            })}
          </select>
        }
      />

      <div className="w-full h-[1px] bg-gray-300" />

      <ListingDetail
        label="Precio"
        value={
          <span>
            <span className="text-forestGreen font-bold font-neueMontreal text-[23px]">
              ${Number.isFinite(price) ? price.toFixed(2) : '0.00'}
            </span>{' '}
            <span className="text-customGray text-[23px] font-neueMontreal">/tCO2e</span>
          </span>
        }
      />

      <div className="w-full h-[1px] bg-gray-300" />

      <ListingDetail label="Antigüedad" value={selectedMatchVintage || 'N/A'} />

      <div className="w-full h-[1px] bg-gray-300" />

      <div className="flex justify-between items-center">
        <label
          htmlFor={`quantity-${
            selectedMatch?.listing?.id || selectedMatch?.carbonPool?.creditId?.creditId
          }`}
          className="text-customGray text-[23px] font-aeonik"
        >
          Cantidad
        </label>
        <div className="flex flex-col items-end">
          <QuantitySelector
            value={qty}
            setValue={setTonnesToRetire}
            min={0.1}
            max={availableTonnes}
            step={0.1}
          />
          <span className="font-neueMontreal">/tCO2e</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-300" />
      <ListingDetail label="Available tonnes" value={formattedValue} />
      <div className="w-full h-[1px] bg-gray-300" />

      <div className="flex justify-between items-center">
        <p className="text-customGray text-[23px] font-aeonik">Asset</p>
        <p className="text-forestGreen text-[23px] font-aeonik">
          <Link
            href={`https://polygonscan.com/address/${
              selectedMatch?.listing
                ? selectedMatch.listing.token.address
                : selectedMatch?.carbonPool?.token.address ?? ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forestGreen underline"
          >
            {projectId}
          </Link>
        </p>
      </div>

      <div className="w-full h-[1px] bg-gray-300" />

      <div className="flex justify-between items-center text-[23px] text-customGray">
        <span className="font-aeonik">Total</span>
        <span className="font-neueMontreal">${value}</span>
      </div>

      <button
        className="mt-2 w-full px-4 py-4 bg-mintGreen text-forestGreen font-medium font-aeonik rounded-full shadow text-[23px] z-40 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isDisabled}
        onClick={() => handleRetire(retireParams)}
      >
        Retirar
      </button>
    </div>
  );
};

export default ListingItem;

// import { useEffect, useState } from "react";
// import ListingDetail from "./ListingDetail";
// import { useRetire } from "@/context/RetireContext";
// import QuantitySelector from "../QuantitySelector/QuantitySelector";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ListingProps } from "./types";
// import { formatNumber } from "@/utils/formatNumber";
// import ListingItemSkeleton from "./ListingItemSkeleton";

// const ListingItem = ({
//   handleRetire,
//   matches,
//   selectedVintage,
//   displayPrice,
//   priceParam,
//   isPricesLoading,
// }: ListingProps) => {
//   const {
//     tonnesToRetire,
//     setTonnesToRetire,
//     index: contextIndex,
//     setIndex,
//     setTotalSupply,
//   } = useRetire();

//   const router = useRouter();
//   const [localIndex, setLocalIndex] = useState<number>(contextIndex as number);
//   const [defaultIndex, setDefaultIndex] = useState<number | null>(null);

//   useEffect(() => {
//     if (defaultIndex === null && matches.length > 0) {
//       let computedIndex = matches.findIndex((match) => {
//         const matchVintage = match.listing
//           ? match.listing?.creditId?.vintage.toString()
//           : match.carbonPool?.creditId.vintage.toString();
//         const matchPrice = match.purchasePrice.toFixed(2);
//         return matchVintage === selectedVintage && matchPrice === displayPrice;
//       });
//       if (computedIndex === -1) {
//         computedIndex = matches.findIndex((match) => {
//           const matchVintage = match.listing
//             ? match.listing?.creditId?.vintage.toString()
//             : match.carbonPool?.creditId.vintage.toString();
//           return matchVintage === selectedVintage;
//         });
//       }
//       if (computedIndex === -1) {
//         computedIndex = 0;
//       }
//       setDefaultIndex(computedIndex);
//       setLocalIndex(computedIndex);
//       setIndex(computedIndex);
//     }
//   }, [defaultIndex, matches, selectedVintage, displayPrice, setIndex]);

//   const effectiveIndex = localIndex;
//   const selectedMatch = matches[effectiveIndex] || matches[0];

//   const price =
//     selectedMatch?.purchasePrice !== undefined
//       ? selectedMatch.purchasePrice
//       : parseFloat(displayPrice ?? "0");

//   const availableTonnes = selectedMatch?.supply ?? 0;
//   const total = price * tonnesToRetire;
//   const value = formatNumber(total);

//   const formattedValue =
//     typeof availableTonnes === "number"
//       ? new Intl.NumberFormat("es-ES", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(availableTonnes) + " ton"
//       : availableTonnes;

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newIndex = Number(e.target.value);
//     setLocalIndex(newIndex);
//     setIndex(newIndex);
//     const newPrice = matches[newIndex].purchasePrice;
//     setTotalSupply(matches[newIndex].supply);
//     router.replace(
//       `?price=${newPrice}&vintages=${matches
//         .map((match) =>
//           match.listing
//             ? match.listing?.creditId?.vintage.toString()
//             : match.carbonPool?.creditId.vintage.toString()
//         )
//         .join(",")}`
//     );
//   };

//   if (isPricesLoading) {
//     return <ListingItemSkeleton />;
//   }

//   return (
//     <div
//       key={
//         selectedMatch?.listing?.id ||
//         selectedMatch?.carbonPool?.creditId?.creditId
//       }
//       className="relative pb-6 mb-8 last:mb-0 flex flex-col gap-5 h-auto"
//     >
//       <ListingDetail
//         label="Año"
//         value={
//           <select
//             className="w-full"
//             onChange={handleSelectChange}
//             value={effectiveIndex}
//           >
//             {matches.map((match, i) => {
//               const matchVintage = match.listing
//                 ? match.listing?.creditId?.vintage?.toString()
//                 : match.carbonPool?.creditId.vintage.toString();
//               return (
//                 <option key={i} value={i}>
//                   {matchVintage}
//                 </option>
//               );
//             })}
//           </select>
//         }
//       />
//       <div className="w-full h-[1px] bg-gray-300"></div>

//       <ListingDetail
//         label="Precio"
//         value={
//           <span>
//             <span className="text-forestGreen font-bold font-neueMontreal text-[23px]">
//               ${price.toFixed(2)}
//             </span>{" "}
//             <span className="text-customGray text-[23px] font-neueMontreal">
//               /tCO2e
//             </span>
//           </span>
//         }
//       />
//       <div className="w-full h-[1px] bg-gray-300"></div>

//       <ListingDetail
//         label="Antigüedad"
//         value={
//           selectedMatch?.listing?.creditId?.vintage ??
//           selectedMatch?.carbonPool?.creditId?.vintage ??
//           "N/A"
//         }
//       />
//       <div className="w-full h-[1px] bg-gray-300"></div>

//       <div className="flex justify-between items-center">
//         <label
//           htmlFor={`quantity-${
//             selectedMatch?.listing?.id ||
//             selectedMatch?.carbonPool?.creditId?.creditId
//           }`}
//           className="text-customGray text-[23px] font-aeonik"
//         >
//           Cantidad
//         </label>
//         <div className="flex flex-col items-end">
//           <QuantitySelector
//             value={tonnesToRetire}
//             setValue={setTonnesToRetire}
//             min={0.1}
//             max={availableTonnes}
//             step={0.1}
//           />
//           <span className="font-neueMontreal">/tCO2e</span>
//         </div>
//       </div>

//       <div className="w-full h-[1px] bg-gray-300"></div>
//       <ListingDetail label="Available tonnes" value={formattedValue} />
//       <div className="w-full h-[1px] bg-gray-300"></div>

//       <div className="flex justify-between items-center">
//         <p className="text-customGray text-[23px] font-aeonik">Asset</p>
//         <p className="text-forestGreen text-[23px] font-aeonik">
//           <Link
//             href={`https://polygonscan.com/address/${
//               selectedMatch?.listing
//                 ? selectedMatch.listing.token.address
//                 : selectedMatch?.carbonPool?.token.address ?? ""
//             }`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-forestGreen underline"
//           >
//             {selectedMatch?.listing?.creditId?.projectId ??
//               selectedMatch?.carbonPool?.creditId?.projectId}
//           </Link>
//         </p>
//       </div>
//       <div className="w-full h-[1px] bg-gray-300"></div>

//       <div className="flex justify-between items-center text-[23px] text-customGray">
//         <span className="font-aeonik">Total</span>
//         <span className="font-neueMontreal">${value}</span>
//       </div>

//       <button
//         className="mt-2 w-full px-4 py-4 bg-mintGreen text-forestGreen font-medium font-aeonik rounded-full shadow text-[23px] z-40"
//         onClick={() =>
//           handleRetire({
//             id:
//               selectedMatch?.listing?.creditId?.projectId ??
//               selectedMatch?.carbonPool?.creditId?.projectId ??
//               "",
//             index: effectiveIndex,
//             priceParam: priceParam ?? "",
//             selectedVintage: selectedMatch?.listing?.creditId?.vintage
//               ? selectedMatch.listing.creditId.vintage.toString()
//               : selectedMatch?.carbonPool?.creditId.vintage.toString() ?? "",
//           })
//         }
//       >
//         Retirar
//       </button>
//     </div>
//   );
// };

// export default ListingItem;
