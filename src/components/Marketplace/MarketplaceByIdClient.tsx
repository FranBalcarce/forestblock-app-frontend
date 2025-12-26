import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Project } from '@/types/project';
import type { Price, UseMarketplace, RetireParams } from '@/types/marketplace';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/* ======================= ENDPOINTS ======================= */
const ENDPOINTS = {
  projects: '/api/carbon/carbonProjects',
  prices: '/api/carbon/prices',
};

/* ======================= HELPERS ======================= */
type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord => typeof v === 'object' && v !== null;

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (isRecord(payload) && Array.isArray(payload.items)) return payload.items as T[];
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

function getProjectKeyFromPrice(p: Price): string | undefined {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
}

function computeMinPriceForProject(projectKey: string, prices: Price[]): number | null {
  const filtered = prices.filter((p) => getProjectKeyFromPrice(p) === projectKey);
  if (!filtered.length) return null;

  let min: number | null = null;
  for (const pr of filtered) {
    const val = pr.purchasePrice ?? pr.baseUnitPrice;
    if (typeof val !== 'number' || !Number.isFinite(val)) continue;
    if (min === null || val < min) min = val;
  }
  return min;
}

function normalizeProject(p: Project, prices: Price[]): Project {
  const minPrice = computeMinPriceForProject(p.key, prices);

  return {
    ...p,
    images: p.images ?? [],
    description: p.short_description || p.description || 'No description available',
    displayPrice: minPrice !== null ? minPrice.toFixed(2) : String(p.price ?? '0'),
    selectedVintage: p.vintages?.[0],
  };
}

/* ======================= MAIN HOOK ======================= */

const useMarketplace = (id?: string): UseMarketplace => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPricesLoading, setIsPricesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);

  /* ==================== 1) Load Prices ==================== */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.prices);
        setPrices(unwrapArray<Price>(res.data));
      } catch (err) {
        console.error('❌ Error fetching prices', err);
        setPrices([]);
      } finally {
        setIsPricesLoading(false);
      }
    };
    fetchPrices();
  }, []);

  /* ==================== 2) Load Projects ==================== */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.projects);
        const list = unwrapArray<Project>(res.data).map((p) => normalizeProject(p, prices));

        setProjects(list);
        if (id) setProject(list.find((p) => p.key === id) ?? null);
      } catch (err) {
        console.error('❌ Error fetching projects', err);
        setProjects([]);
        if (id) setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [id, prices]);

  /* ==================== Filtering & Sorting ==================== */
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(s));
    }

    if (selectedCountries.length) {
      list = list.filter((p) => selectedCountries.includes(p.country));
    }

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category ?? ''));
    }

    if (selectedVintages.length) {
      list = list.filter((p) => p.vintages?.some((v) => selectedVintages.includes(v)));
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.displayPrice) - Number(b.displayPrice));
    }
    if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.displayPrice) - Number(a.displayPrice));
    }

    return list;
  }, [projects, searchTerm, selectedCountries, selectedCategories, selectedVintages, sortBy]);

  const availableCategories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter((c): c is string => !!c);
    return Array.from(new Set(cats));
  }, [projects]);

  /* ==================== Retire Handler ==================== */
  const handleRetire = (params: RetireParams) => {
    const currentProject = project ?? projects.find((p) => p.key === params.id) ?? null;

    if (typeof window !== 'undefined' && currentProject) {
      localStorage.setItem('project', JSON.stringify(currentProject));
      localStorage.setItem('selectedVintage', params.selectedVintage ?? '0');
      localStorage.setItem('quantity', String(params.quantity));
    }

    const sp = new URLSearchParams({
      index: String(params.index),
      selectedVintage: params.selectedVintage ?? '0',
      quantity: String(params.quantity),
      price: params.priceParam,
      methodologyName: currentProject?.methodologies?.[0]?.name ?? 'Sin metodología',
    });

    router.push(`/retireCheckout?${sp.toString()}`);
  };

  return {
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
    setProjects,
    project,
    handleRetire,
    prices,
    isPricesLoading,
  };
};

export default useMarketplace;

// 'use client';

// import React from 'react';
// import { useSearchParams } from 'next/navigation';
// import ProjectInfo from '@/components/ProjectInfo/ProjectInfo';
// import useMarketplace from '@/hooks/useMarketplace';
// import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
// import { Price } from '@/types/marketplace';

// type Props = { id: string };

// const getProjectIdFromPrice = (p: Price): string | undefined => {
//   return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
// };

// export default function MarketplaceByIdClient({ id }: Props) {
//   const searchParams = useSearchParams();
//   const priceParam = searchParams.get('price');

//   const { project, handleRetire, prices, isPricesLoading } = useMarketplace(id);

//   if (!project) return <LoaderScreenDynamic />;

//   const matches = prices?.filter((p) => getProjectIdFromPrice(p) === project.key) ?? [];

//   const selectedPriceObj = priceParam
//     ? matches.find((p) => String(p.purchasePrice) === String(priceParam))
//     : null;

//   const displayPrice = selectedPriceObj
//     ? selectedPriceObj.purchasePrice.toFixed(2)
//     : project.displayPrice ?? project.price ?? '';

//   const selectedVintage = selectedPriceObj
//     ? selectedPriceObj.listing?.creditId?.vintage?.toString() ||
//       selectedPriceObj.carbonPool?.creditId?.vintage?.toString() ||
//       ''
//     : project.selectedVintage ?? '';

//   return (
//     <div className="flex gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
//       <ProjectInfo
//         project={project}
//         handleRetire={handleRetire}
//         matches={matches}
//         selectedVintage={selectedVintage}
//         displayPrice={displayPrice}
//         priceParam={priceParam}
//         isPricesLoading={isPricesLoading}
//       />
//     </div>
//   );
// }
