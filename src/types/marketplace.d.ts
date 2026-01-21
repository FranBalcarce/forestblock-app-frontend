import type { Project } from './project';

export type SortBy = 'price_asc' | 'price_desc' | 'recently_updated' | 'newest' | 'oldest' | 'name';

export interface ListingCreditId {
  standard: string; // 👈 CLAVE (VCS, GS, etc)
  projectId: string; // ej: "191"
  vintage: number;
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
  type: 'listing';
  purchasePrice: number;
  baseUnitPrice: number;
  supply: number;
  minFillAmount: number;
  listing?: ListingPricePayload;
  carbonPool?: {
    creditId: { vintage: number; projectId: string; creditId: string };
    token: ListingToken;
  };
}

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
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;

  projects: Project[];
  project: Project | null;

  prices: Price[];
  isPricesLoading: boolean;

  handleRetire: (params: {
    id: string;
    index: number;
    priceParam: string;
    selectedVintage: string;
    quantity: number;
  }) => void;
}
export type RetireParams = {
  id: string;
  index: number;
  priceParam: string;
  selectedVintage: string;
  quantity: number;
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
