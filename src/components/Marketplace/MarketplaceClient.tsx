'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import TopBar from '@/components/TopBar/TopBar';
import HeaderSection from '@/components/Marketplace/HeaderSection';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';

import useMarketplace from '@/hooks/useMarketplace';
import useMarketplaceFilters from '@/hooks/useMarketplaceFilters';

import { SDG_TITLES, hardcodedVintages } from '@/constants';

// ProjectList solo cliente
const ProjectList = dynamic(() => import('@/components/Marketplace/ProjectList'), { ssr: false });

const MarketplaceClient: React.FC = () => {
  const {
    filteredProjects,
    projects,
    loading,

    searchTerm,
    setSearchTerm,

    sortBy,
    setSortBy,

    availableCategories,
    selectedCountries,
    setSelectedCountries,
    selectedCategories,
    setSelectedCategories,
    selectedVintages,
    setSelectedVintages,
    selectedUNSDG,
    setSelectedUNSDG,
  } = useMarketplace();

  const countries = projects.length ? [...new Set(projects.map((p) => p.country))] : [];

  const { mobileFiltersOpen, setMobileFiltersOpen, onCloseMobileFilters } = useMarketplaceFilters({
    selectedCountries,
    onFilterChange: setSelectedCountries,
    selectedCategories,
    onCategoryChange: setSelectedCategories,
    selectedVintages,
    onVintageChange: setSelectedVintages,
    selectedUNSDG,
    onUNSDGChange: setSelectedUNSDG,
  });

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />

      <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex flex-col lg:flex-row gap-6 bg-backgroundGray py-10 px-3 rounded-b-3xl">
        {/* Sidebar desktop */}
        <div className="hidden lg:block lg:w-1/5 lg:sticky lg:top-6">
          <FilterSidebar
            countries={countries}
            selectedCountries={selectedCountries}
            onFilterChange={setSelectedCountries}
            categories={availableCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            vintages={hardcodedVintages}
            selectedVintages={selectedVintages}
            onVintageChange={setSelectedVintages}
            unsdgList={SDG_TITLES}
            selectedUNSDG={selectedUNSDG}
            onUNSDGChange={setSelectedUNSDG}
            isMobileFiltersOpen={mobileFiltersOpen}
            onCloseMobileFilters={onCloseMobileFilters}
          />
        </div>

        {/* Listado */}
        <div className="lg:w-3/4">
          <ProjectList
            loading={loading}
            projects={filteredProjects}
            sortBy={sortBy}
            setSortBy={setSortBy}
            openFilters={() => setMobileFiltersOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceClient;
