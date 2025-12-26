import type { ReactNode } from 'react';

export interface HeroBannerProps {
  title: ReactNode;
  children?: ReactNode; // 👈 ahora opcional
  showSearchbar?: boolean;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  backgroundUrl?: string; // 👈 nueva prop para la imagen
}

// export interface HeroBannerProps {
//   title: React.ReactNode;
//   children: React.ReactNode;
//   showSearchbar?: boolean;
//   searchTerm?: string;
//   setSearchTerm?: (term: string) => void;
// }
