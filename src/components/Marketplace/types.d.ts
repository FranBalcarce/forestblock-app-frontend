import { Dispatch, SetStateAction } from 'react';
import { Project } from '@/types/project';

export interface HeaderSectionProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export interface ProjectListProps {
  loading: boolean;
  projects: Project[];
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
}
