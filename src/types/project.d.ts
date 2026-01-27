import { Location } from './location';
import { Listing } from './marketplace';

export interface Project {
  /** 🔑 Identificador frontend */
  key: string;

  /** 🔑 Project ID real del registro (VCS / PUR / GS) */
  projectID: string;

  name: string;

  registry: string;
  country: string;
  region: string;

  description: string;
  short_description: string;
  long_description: string;

  methodologies: Methodology[];
  vintages: string[];

  sustainableDevelopmentGoals: string[];

  location: Location;

  /** ⚠️ pueden NO existir */
  images?: Image[];
  coverImage?: Image;

  /** 🛰 opcional */
  satelliteImage?: Image;

  url: string;

  /** 🔥 MARKETPLACE DATA (backend join) */
  minPrice?: number;
  listings?: Listing[];

  /** flags */
  hasSupply: boolean;

  /** stats */
  stats?: Stats;

  /** opcionales UI */
  category?: string;
  selectedVintage?: string;
  displayPrice?: string;
  pdfUrl?: string;
}

export interface Image {
  url: string;
  caption?: string;
}

export interface Methodology {
  id: string;
  category: string;
  name: string;
}

export interface Stats {
  totalSupply?: number;
  totalListingsSupply?: number;
  availableTonnes?: number;
}

// import { Location } from "./location";
// import { Listing } from "./marketplace";

// export interface Project {
//   key: string;
//   projectID: string;
//   name: string;
//   methodologies: Methodology[];
//   vintages: string[];
//   registry: string;
//   updatedAt: string;
//   country: string;
//   region: string;
//   price: string;
//   stats: Stats;
//   hasSupply: boolean;
//   sustainableDevelopmentGoals: string[];
//   description: string;
//   long_description: string;
//   short_description: string;
//   location: Location;
//   url: string;
//   images: Image[];
//   coverImage: Image;
//   puroBatchTokenID: string;
//   listings: Listing[];
//   category?: string;
//   satelliteImage?: {
//     url: string;
//     caption: string;
//   };
//   selectedVintage?: string;
//   displayPrice?: string;
//   pdfUrl?: string;
// }

// export interface Image {
//   url: string;
//   caption: string;
// }

// export interface Geometry {
//   type: string;
//   coordinates: number[];
// }

// export interface Methodology {
//   id: string;
//   category: string;
//   name: string;
// }

// export interface Stats {
//   totalBridged: number;
//   totalRetired: number;
//   totalSupply: number;
//   totalListingsSupply: number;
//   totalPoolsSupply: number;
//   availableTonnes: number;
// }
