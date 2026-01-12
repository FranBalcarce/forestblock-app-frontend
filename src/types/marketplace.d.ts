// src/types/marketplace.d.ts
import React from 'react';
import { Project } from './project';
import type { SortBy } from './marketplace';

sortBy: SortBy;
setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;

/* ================= PRICES ================= */

export type AssetPriceType = 'listing'; // v18

export interface ListingCreditId {
  vintage: number;
  projectId: string; // ej: "VCS-844"
}

export interface ListingToken {
  id: string;
  address: string;
  decimals: number;
  tokenStandard: string;
  name: string;
  isExAnte: boolean;
  symbol: string;
  tokenId: number;
}

export interface ListingPricePayload {
  id: string;
  creditId?: ListingCreditId;
  token: ListingToken;
  sellerId: string;
}

export interface Price {
  sourceId: string;
  type: AssetPriceType; // 'listing'
  purchasePrice: number;
  baseUnitPrice: number;
  supply: number;
  minFillAmount: number;
  listing?: ListingPricePayload;

  // compat (legacy)
  carbonPool?: {
    creditId: {
      vintage: number;
      projectId: string;
      creditId: string;
    };
    token: ListingToken;
  };
}

/* ================= SORT ================= */

// ✅ NUEVO: sort tipado (arregla error TS)
export type SortBy = 'price_asc' | 'price_desc' | 'recently_updated' | 'newest' | 'oldest' | 'name';

/* ================= RETIRE ================= */

export type RetireParams = {
  id: string; // projectId (ej "VCS-844")
  index: number; // índice del match elegido
  priceParam: string; // precio RAW (string)
  selectedVintage?: string;
  quantity: number;
};

/* ================= HOOK ================= */

export interface UseMarketplace {
  filteredProjects: Project[];
  loading: boolean;

  availableCategories: string[];

  selectedCountries: string[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;

  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;

  selectedVintages: string[];
  setSelectedVintages: React.Dispatch<React.SetStateAction<string[]>>;

  selectedUNSDG: string[];
  setSelectedUNSDG: React.Dispatch<React.SetStateAction<string[]>>;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  // ✅ CORREGIDO
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;

  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;

  project: Project | null;

  handleRetire: (params: RetireParams) => void;

  prices: Price[];
  isPricesLoading: boolean;
}

/* ================= COMPAT ================= */

// compatibilidad con imports viejos
export type Listing = Price;
export type Match = Price;

// import { Project } from './project';
// export interface Price {
//   sourceId: string;
//   type: 'listing' | 'carbon_pool';
//   purchasePrice: number;
//   baseUnitPrice: number;
//   supply: number;
//   minFillAmount: number;
//   listing?: {
//     id: string;
//     creditId?: {
//       vintage: number;
//       projectId: string;
//     };
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//     sellerId: string;
//   };
//   carbonPool?: {
//     creditId: {
//       vintage: number;
//       projectId: string;
//       creditId: string;
//     };
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//   };
// }

// export interface UseMarketplace {
//   filteredProjects: Project[];
//   loading: boolean;
//   availableCategories: string[];
//   selectedCountries: string[];
//   setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
//   selectedCategories: string[];
//   setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
//   selectedVintages: string[];
//   setSelectedVintages: React.Dispatch<React.SetStateAction<string[]>>;
//   selectedUNSDG: string[];
//   setSelectedUNSDG: React.Dispatch<React.SetStateAction<string[]>>;
//   searchTerm: string;
//   setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
//   sortBy: string;
//   setSortBy: React.Dispatch<React.SetStateAction<string>>;
//   projects: Project[];
//   setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
//   project: Project | null;
//   handleRetire: (params: RetireParams) => void;
//   prices: Price[];
//   isPricesLoading: boolean;
// }

// export interface Listing {
//   singleUnitPrice: number;
//   id: string;
//   carbonPool: {
//     creditId: {
//       vintage: number;
//       projectId: string;
//     };
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//   };
//   supply: number;
//   purchasePrice: number;
//   listing: {
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//     id: string;
//     symbol: string;
//     active: boolean;
//     deleted: boolean;
//     expiration: number;
//     leftToSell: string;
//     minFillAmount: string;
//     singleUnitPrice: string;
//     tokenAddress: string;
//     tokenId: string;
//     tokenStandard: string;
//     totalAmountToSell: string;
//     createdAt: number;
//     updatedAt: number;
//     project: {
//       category: string;
//       country: string;
//       id: string;
//       isExAnte: boolean;
//       key: string;
//       methodology: string;
//       name: string;
//       tokenId: string;
//       vintage: string;
//       coverImage: {
//         url: string;
//       };
//     };
//     seller: {
//       id: string;
//     };
//   };
// }

// export interface Match {
//   sourceId: string;
//   type: 'listing' | 'carbon_pool';
//   purchasePrice: number;
//   baseUnitPrice: number;
//   supply: number;
//   minFillAmount: number;
//   listing?: {
//     id: string;
//     creditId?: {
//       vintage: number;
//       projectId: string;
//     };
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//     sellerId: string;
//   };
//   carbonPool?: {
//     creditId: {
//       vintage: number;
//       projectId: string;
//       creditId: string;
//     };
//     token: {
//       id: string;
//       address: string;
//       decimals: number;
//       tokenStandard: string;
//       name: string;
//       isExAnte: boolean;
//       symbol: string;
//       tokenId: number;
//     };
//   };
// }

// export type RetireParams = {
//   id: string;
//   index: number;
//   priceParam: string;
//   selectedVintage: string;
//   quantity: number; // ✅ OBLIGATORIO
// };
