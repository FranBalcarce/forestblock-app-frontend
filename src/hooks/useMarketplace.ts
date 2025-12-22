import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Project } from '@/types/project';
import type { Match, Price, UseMarketplace, RetireParams } from '@/types/marketplace';

import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

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

// ---------- helpers para PRICES (v18) ----------
function readString(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

function readNumber(obj: unknown, key: string): number | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

/**
 * En prices, el projectId viene como "VCS-844" dentro de:
 *   price.listing.creditId.projectId
 * o price.carbonPool.creditId.projectId
 */
function getProjectKeyFromPrice(pr: unknown): string | undefined {
  if (!isRecord(pr)) return undefined;

  const listing = pr.listing;
  if (isRecord(listing)) {
    const creditId = listing.creditId;
    if (isRecord(creditId)) {
      const pid = readString(creditId, 'projectId') ?? readString(creditId, 'project_id');
      if (pid) return pid; // ej "VCS-844"
    }
  }

  const carbonPool = pr.carbonPool;
  if (isRecord(carbonPool)) {
    const creditId = carbonPool.creditId;
    if (isRecord(creditId)) {
      const pid = readString(creditId, 'projectId') ?? readString(creditId, 'project_id');
      if (pid) return pid; // ej "VCS-844"
    }
  }

  // fallback por si algún día viene a nivel raíz
  const rootPid = readString(pr, 'projectId') ?? readString(pr, 'project_id');
  return rootPid;
}

function getNumericPriceFromPrice(pr: unknown): number | null {
  if (!isRecord(pr)) return null;

  const purchasePrice = readNumber(pr, 'purchasePrice');
  if (purchasePrice != null) return purchasePrice;

  const baseUnitPrice = readNumber(pr, 'baseUnitPrice');
  if (baseUnitPrice != null) return baseUnitPrice;

  // fallback legacy
  const listing = pr.listing;
  if (isRecord(listing)) {
    const s = readString(listing, 'singleUnitPrice');
    if (s) {
      const n = Number(s);
      if (Number.isFinite(n)) return n;
    }
  }

  return null;
}

function computeDisplayPriceForProject(
  projectKey: string,
  pricesRaw: unknown[]
): string | undefined {
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

/**
 * Normaliza Project:
 * - images siempre array
 * - description fallback
 * - displayPrice desde prices (min), si no existe => p.price
 * - selectedVintage: el primero si hay vintages
 */
function normalizeProject(p: Project, pricesRaw: unknown[]): Project {
  const displayFromPrices = computeDisplayPriceForProject(p.key, pricesRaw);

  return {
    ...p,
    images: p.images ?? [],
    description: p.short_description || p.description || 'No description available',
    displayPrice: displayFromPrices ?? p.price ?? '0',
    selectedVintage: p.vintages?.[0],
  };
}

const useMarketplace = (id?: string): UseMarketplace => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const [pricesRaw, setPricesRaw] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);

  // =========================
  // FETCH PRICES (1 vez)
  // =========================
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.prices);
        setPricesRaw(unwrapArray<unknown>(res.data));
      } catch (err) {
        console.error('Error fetching prices', err);
        setPricesRaw([]);
      } finally {
        setIsPricesLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // =========================
  // FETCH PROJECTS (LIST)
  // =========================
  useEffect(() => {
    if (id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.projects);
        const list = unwrapArray<Project>(res.data);

        setProjects(list.map((p) => normalizeProject(p, pricesRaw)));
      } catch (err) {
        console.error('Error fetching projects', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id, pricesRaw]);

  // =========================
  // FETCH SINGLE PROJECT
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<Project>(ENDPOINTS.projectById(id));
        setProject(normalizeProject(res.data, pricesRaw));
      } catch (err) {
        console.error('Error fetching project', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, pricesRaw]);

  // =========================
  // FILTERED PROJECTS
  // =========================
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
    }

    if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.displayPrice ?? 0) - Number(a.displayPrice ?? 0));
    }

    return list;
  }, [projects, searchTerm, selectedCountries, selectedCategories, selectedVintages, sortBy]);

  // =========================
  // HANDLE RETIRE (BUY)
  // =========================
  const handleRetire = (params: RetireParams) => {
    // Guardamos project para que RetireCheckout lo use
    const currentProject = project ?? projects.find((p) => p.key === params.id) ?? null;

    if (typeof window !== 'undefined' && currentProject) {
      localStorage.setItem('project', JSON.stringify(currentProject));
      localStorage.setItem('selectedVintage', params.selectedVintage || '0');
    }

    const sp = new URLSearchParams();
    sp.set('index', String(params.index));
    sp.set('selectedVintage', params.selectedVintage || '0');

    // methodologyName: viene como array en tu JSON, así que lo saco del primero si existe
    const firstMethName = currentProject?.methodologies?.[0]?.name ?? 'Sin metodología';
    sp.set('methodologyName', firstMethName);

    router.push(`/retireCheckout?${sp.toString()}`);
  };

  const availableCategories = useMemo(() => {
    const cats = projects
      .map((p) => p.category)
      .filter((c): c is string => typeof c === 'string' && c.length > 0);
    return Array.from(new Set(cats));
  }, [projects]);

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

    // tu UI espera Price[]; esto es seguro porque la data viene del endpoint
    prices: pricesRaw as unknown as Price[],
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
