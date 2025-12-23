// src/types/marketplace.ts
import { Project } from './project';

export type AssetPriceType = 'listing'; // v18: solo listing :contentReference[oaicite:1]{index=1}

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

  // compat (legacy). Idealmente lo removés cuando ya migraste todo.
  carbonPool?: {
    creditId: { vintage: number; projectId: string; creditId: string };
    token: ListingToken;
  };
}

export type Match = Price;

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
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;

  projects: Project[];
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;

  project: Project | null;
  handleRetire: (params: RetireParams) => void;

  prices: Price[];
  isPricesLoading: boolean;
}

export type RetireParams = {
  id: string; // projectId (ej "VCS-844")
  index: number; // índice del match elegido
  priceParam: string; // purchasePrice string
  selectedVintage: string; // vintage elegido
  quantity: number; // ✅ obligatorio
};

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
