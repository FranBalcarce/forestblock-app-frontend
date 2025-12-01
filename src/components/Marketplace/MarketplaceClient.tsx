'use client';

import React from 'react';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';
import useMarketplace from '@/hooks/useMarketplace';
import { SDG_TITLES, hardcodedVintages } from '@/constants/index';
import HeaderSection from '@/components/Marketplace/HeaderSection';
import ProjectList from '@/components/Marketplace/ProjectList';
import TopBar from '@/components/TopBar/TopBar';
import useMarketplaceFilters from '@/hooks/useMarketplaceFilters';

const MarketplaceClient: React.FC = () => {
  const {
    filteredProjects,
    loading,
    availableCategories,
    selectedCountries,
    setSelectedCountries,
    selectedCategories,
    setSelectedCategories,
    selectedVintages,
    setSelectedVintages,
    selectedUNSDG,
    setSelectedUNSDG,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    projects,
  } = useMarketplace();

  const countries = projects?.length ? [...new Set(projects.map((p) => p.country))] : [];

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
        <div className="hidden lg:block lg:w-1/5 lg:sticky lg:top-6 h-full">
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

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-neueMontreal font-medium text-forestGreen">Filtrar por:</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-2xl font-bold text-gray-800"
            >
              &times;
            </button>
          </div>
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
      )}
    </div>
  );
};

export default MarketplaceClient;
