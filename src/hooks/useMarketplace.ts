'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Project } from '@/types/project';
import type { Price, UseMarketplace, RetireParams } from '@/types/marketplace';

import axios from 'axios';

const ENDPOINTS = {
  projects: '/api/carbon/carbonProjects',
  projectById: (id: string) => `/api/carbon/carbonProjects/${encodeURIComponent(id)}`,
  prices: '/api/carbon/prices',
};

type RecordUnknown = Record<string, unknown>;

function isRecord(v: unknown): v is RecordUnknown {
  return typeof v === 'object' && v !== null;
}

function unwrapArray<T = unknown>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (isRecord(payload) && Array.isArray(payload.items)) return payload.items as T[];
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

// OJO: en prod, si no seteaste NEXT_PUBLIC_API_BASE_URL, esto devuelve '' y axios pega al MISMO DOMINIO.
function getApiBaseURL(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';

  return raw.replace(/\/$/, '');
}

function getProjectStableId(p: Project): string {
  // En tu data real suele ser p.key (ej: "VCS-191")
  const anyP = p as unknown as Record<string, unknown>;
  const key = typeof (p as Project).key === 'string' ? (p as Project).key : undefined;

  const id =
    typeof anyP.id === 'string'
      ? (anyP.id as string)
      : typeof anyP.projectId === 'string'
      ? (anyP.projectId as string)
      : undefined;

  return key || id || '';
}

function getProjectKeyFromPrice(pr: unknown): string | undefined {
  if (!isRecord(pr)) return undefined;

  const listing = pr.listing;
  if (isRecord(listing)) {
    const creditId = listing.creditId;
    if (isRecord(creditId) && typeof creditId.projectId === 'string') return creditId.projectId;

    const project = listing.project;
    if (isRecord(project) && typeof project.key === 'string') return project.key;
  }

  const carbonPool = pr.carbonPool;
  if (isRecord(carbonPool)) {
    const creditId = carbonPool.creditId;
    if (isRecord(creditId) && typeof creditId.projectId === 'string') return creditId.projectId;
  }

  if (typeof pr.projectId === 'string') return pr.projectId;

  return undefined;
}

function getNumericPriceFromPrice(pr: unknown): number | null {
  if (!isRecord(pr)) return null;

  if (typeof pr.purchasePrice === 'number' && Number.isFinite(pr.purchasePrice))
    return pr.purchasePrice;
  if (typeof pr.baseUnitPrice === 'number' && Number.isFinite(pr.baseUnitPrice))
    return pr.baseUnitPrice;

  const listing = pr.listing;
  if (isRecord(listing) && typeof listing.singleUnitPrice === 'string') {
    const n = Number(listing.singleUnitPrice);
    if (Number.isFinite(n)) return n;
  }

  return null;
}

function computeDisplayPriceForProject(
  projectKey: string,
  pricesRaw: unknown[]
): string | undefined {
  if (!projectKey) return undefined;

  const matches = pricesRaw.filter((p) => getProjectKeyFromPrice(p) === projectKey);
  if (matches.length === 0) return undefined;

  let min: number | null = null;
  for (const m of matches) {
    const val = getNumericPriceFromPrice(m);
    if (val == null) continue;
    if (min == null || val < min) min = val;
  }

  return min == null ? undefined : min.toFixed(2);
}

function normalizeProject(p: Project, pricesRaw: unknown[]): Project {
  const stableId = getProjectStableId(p);
  const displayFromPrices = computeDisplayPriceForProject(stableId, pricesRaw);

  const anyP = p as unknown as Record<string, unknown>;
  const fallbackPrice =
    typeof anyP.price === 'string'
      ? (anyP.price as string)
      : typeof anyP.price === 'number'
      ? String(anyP.price)
      : '0';

  return {
    ...p,
    images: p.images ?? [],
    description: p.short_description || p.description || 'No description available',
    displayPrice: displayFromPrices ?? (p.displayPrice as string) ?? fallbackPrice,
    selectedVintage: (p as Project).vintages?.[0],
  };
}

const useMarketplace = (id?: string): UseMarketplace => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  // guardamos crudo para no romper si cambia el shape
  const [pricesRaw, setPricesRaw] = useState<unknown[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);

  // axios local (baseURL = '' => mismo dominio)
  const api = useMemo(() => {
    const baseURL = getApiBaseURL();

    return axios.create({
      baseURL,
      timeout: 180000,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  /* =========================
     FETCH PRICES (1 vez)
  ========================== */
  useEffect(() => {
    let alive = true;

    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await api.get<unknown>(ENDPOINTS.prices);

        const list = unwrapArray<unknown>(res.data);
        if (alive) setPricesRaw(list);
      } catch (err) {
        console.error('Error fetching prices', err);
        if (alive) setPricesRaw([]);
      } finally {
        if (alive) setIsPricesLoading(false);
      }
    };

    fetchPrices();
    return () => {
      alive = false;
    };
  }, [api]);

  /* =========================
     FETCH PROJECTS (LIST)
  ========================== */
  useEffect(() => {
    if (id) return;

    let alive = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get<unknown>(ENDPOINTS.projects);
        const list = unwrapArray<Project>(res.data);

        const normalized = list.map((p) => normalizeProject(p, pricesRaw));
        if (alive) setProjects(normalized);
      } catch (err) {
        console.error('Error fetching projects', err);
        if (alive) setProjects([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      alive = false;
    };
  }, [api, id, pricesRaw]);

  /* =========================
     FETCH SINGLE PROJECT
  ========================== */
  useEffect(() => {
    if (!id) return;

    let alive = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await api.get<Project>(ENDPOINTS.projectById(id));
        const normalized = normalizeProject(res.data, pricesRaw);
        if (alive) setProject(normalized);
      } catch (err) {
        console.error('Error fetching project', err);
        if (alive) setProject(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      alive = false;
    };
  }, [api, id, pricesRaw]);

  /* =========================
     FILTERED PROJECTS
  ========================== */
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
      list.sort((a, b) => Number(a.displayPrice ?? 0) - Number(b.displayPrice ?? 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.displayPrice ?? 0) - Number(a.displayPrice ?? 0));
    }

    return list;
  }, [projects, searchTerm, selectedCountries, selectedCategories, selectedVintages, sortBy]);

  /* =========================
     HANDLE RETIRE (BUY)
  ========================== */
  const handleRetire = (params: RetireParams) => {
    // 1) Guardamos el proyecto para que /retirementSteps lo lea después (como ya hacés)
    const currentProject =
      project ??
      projects.find((p) => getProjectStableId(p) === params.id) ??
      projects.find((p) => (p as Project).key === params.id) ??
      null;

    if (typeof window !== 'undefined') {
      if (currentProject) localStorage.setItem('project', JSON.stringify(currentProject));
      localStorage.setItem('selectedVintage', params.selectedVintage || '0');
    }

    // 2) Mandamos a checkout (tu ruta es /retireCheckout)
    const sp = new URLSearchParams();
    sp.set('index', String(params.index));
    sp.set('selectedVintage', params.selectedVintage || '0');

    // price para que el checkout tenga contexto (y para debug)
    if (params.priceParam) sp.set('price', params.priceParam);

    // methodologyName lo usa tu RetireCheckoutClient
    const anyP = currentProject as unknown as Record<string, unknown> | null;
    const methodologyName =
      anyP && typeof anyP.methodology === 'string'
        ? (anyP.methodology as string)
        : anyP && typeof anyP.methodologyName === 'string'
        ? (anyP.methodologyName as string)
        : 'Sin metodología';

    sp.set('methodologyName', methodologyName);

    router.push(`/retireCheckout?${sp.toString()}`);
  };

  const availableCategories = useMemo(() => {
    const cats = projects
      .map((p) => p.category)
      .filter((c): c is string => typeof c === 'string' && c.length > 0);
    return Array.from(new Set(cats));
  }, [projects]);

  // casteo final: tu UI espera Price[]
  const prices = pricesRaw as unknown as Price[];

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

// import { useEffect, useState } from "react";
// import { Price, RetireParams, UseMarketplace } from "@/types/marketplace";
// import { Project } from "@/types/project";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { useModal } from "@/context/ModalContext";
// import { LATAM_COUNTRIES, PRICE_MULTIPLIER } from "@/constants";
// import qs from "qs";
// import { useRetire } from "../context/RetireContext";
// import { axiosPublicInstance } from "@/utils/axios/axiosPublicInstance";

// const useMarketplace = (id?: string): UseMarketplace => {
//   const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);
//   const [prices, setPrices] = useState<Price[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [availableCategories, setAvailableCategories] = useState<string[]>([]);
//   const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
//   const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [sortBy, setSortBy] = useState<string>("price-desc");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [project, setProject] = useState<Project | null>(null);
//   const { isAuthenticated, setRedirectUrl } = useAuth();
//   const { openModal } = useModal();
//   const { setTotalSupply } = useRetire();

//   const router = useRouter();

//   const handleRetire = ({
//     id,
//     index,
//     priceParam,
//     selectedVintage,
//   }: RetireParams) => {
//     if (!id) {
//       console.error("handleRetire: 'id' is empty or undefined. Aborting.");
//       return;
//     }

//     const methodologyName =
//       project?.methodologies?.[0]?.name || "Sin metodología";

//     const encodedMethodologyName = encodeURIComponent(methodologyName);
//     const url = `/retireCheckout?index=${index}&projectIds=${id}&priceParam=${priceParam}&methodologyName=${encodedMethodologyName}&selectedVintage=${selectedVintage}`;

//     if (!isAuthenticated) {
//       setRedirectUrl(url);
//       openModal("login");
//       return;
//     }
//     try {
//       router.push(url);
//     } catch (error) {
//       console.error("Error during redirection:", error);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       const fetchProject = async () => {
//         try {
//           const response = await axiosPublicInstance.get(
//             `/carbon/carbonProjects/${id}`
//           );

//           let data = response.data;
//           if (data && typeof data.price === "string") {
//             const currentPrice = parseFloat(data.price);
//             if (!isNaN(currentPrice)) {
//               data = {
//                 ...data,
//                 price: (currentPrice * PRICE_MULTIPLIER).toString(),
//               };
//             }
//           }
//           setTotalSupply(data?.stats?.totalSupply);
//           setProject(data);
//           if (data?.location?.geometry?.coordinates) {
//             const [lat, lng] =
//               data.location.geometry.coordinates.map(parseFloat);
//             if (!isNaN(lat) && !isNaN(lng)) {
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching project details:", error);
//         }
//       };

//       fetchProject();
//     }
//   }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosPublicInstance.get<Project[]>(
//           "/carbon/carbonProjects",
//           {
//             params: {
//               minSupply: 1,
//               country: [...LATAM_COUNTRIES, "Indonesia"],
//             },
//             paramsSerializer: (params) =>
//               qs.stringify(params, { arrayFormat: "repeat" }),
//           }
//         );

//         const data = response.data;
//         const updatedData = data.map((project) => {
//           const currentPrice = parseFloat(project.price);
//           if (isNaN(currentPrice)) return project;

//           const newPrice = (currentPrice * PRICE_MULTIPLIER).toString();
//           return {
//             ...project,
//             price: newPrice,
//           };
//         });

//         const uniqueCategories = Array.from(
//           new Set(
//             updatedData.flatMap(
//               (project) =>
//                 project.methodologies?.map((method) => method.category) || []
//             )
//           )
//         );
//         setProjects(updatedData);
//         setFilteredProjects(updatedData);
//         setAvailableCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     const fetchPrices = async () => {
//       try {
//         if (projects.length > 0) {
//           const priceResponse = await axiosPublicInstance.get(
//             "/carbon/prices",
//             {
//               params: {
//                 projectIds: projects?.map((project) => project.key),
//                 minSupply: 1,
//               },
//               paramsSerializer: (params) =>
//                 qs.stringify(params, { arrayFormat: "repeat" }),
//             }
//           );
//           const prices = priceResponse?.data;
//           const updatedPrices = prices?.map((priceItem: Price) => ({
//             ...priceItem,
//             purchasePrice: priceItem?.purchasePrice * PRICE_MULTIPLIER,
//           }));
//           setPrices(updatedPrices);
//           setIsPricesLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching prices:", error);
//       }
//     };

//     fetchPrices();
//   }, [projects]);

//   useEffect(() => {
//     let updatedProjects = [...projects];

//     if (selectedCountries.length > 0) {
//       updatedProjects = updatedProjects.filter((project) =>
//         selectedCountries.includes(project.country)
//       );
//     }

//     if (selectedCategories.length > 0) {
//       updatedProjects = updatedProjects.filter((project) =>
//         project.methodologies?.some((method) =>
//           selectedCategories.includes(method.category)
//         )
//       );
//     }

//     if (selectedVintages.length > 0) {
//       updatedProjects = updatedProjects.filter((project) =>
//         project.vintages.some((vintage) => selectedVintages.includes(vintage))
//       );
//     }

//     if (selectedUNSDG.length > 0) {
//       updatedProjects = updatedProjects.filter((project) =>
//         project.sustainableDevelopmentGoals?.some((sdg) =>
//           selectedUNSDG.includes(sdg)
//         )
//       );
//     }

//     if (searchTerm) {
//       updatedProjects = updatedProjects.filter((project) =>
//         project.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortBy === "price-asc") {
//       updatedProjects.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//     } else if (sortBy === "price-desc") {
//       updatedProjects.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
//     } else if (sortBy === "name") {
//       updatedProjects.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortBy === "recently-update") {
//       updatedProjects.sort(
//         (a, b) =>
//           new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//       );
//     } else if (sortBy === "newest") {
//       updatedProjects.sort((a, b) => {
//         const aMax = Math.max(...a.vintages.map((v) => Number(v)));
//         const bMax = Math.max(...b.vintages.map((v) => Number(v)));
//         return bMax - aMax;
//       });
//     } else if (sortBy === "oldest") {
//       updatedProjects.sort((a, b) => {
//         const aMin = Math.min(...a.vintages.map((v) => Number(v)));
//         const bMin = Math.min(...b.vintages.map((v) => Number(v)));
//         return aMin - bMin;
//       });
//     }

//     setFilteredProjects(updatedProjects);
//   }, [
//     selectedCountries,
//     selectedCategories,
//     selectedVintages,
//     selectedUNSDG,
//     searchTerm,
//     sortBy,
//     projects,
//   ]);

//   return {
//     filteredProjects,
//     loading,
//     availableCategories,
//     selectedCountries,
//     setSelectedCountries,
//     selectedCategories,
//     setSelectedCategories,
//     selectedVintages,
//     setSelectedVintages,
//     selectedUNSDG,
//     setSelectedUNSDG,
//     searchTerm,
//     setSearchTerm,
//     sortBy,
//     setSortBy,
//     projects,
//     project,
//     handleRetire,
//     prices,
//     isPricesLoading,
//   };
// };

// export default useMarketplace;
