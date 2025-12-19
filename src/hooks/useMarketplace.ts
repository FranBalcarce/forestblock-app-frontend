import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Project } from '@/types/project';
import type { Price, UseMarketplace, RetireParams } from '@/types/marketplace';
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

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (isRecord(payload) && Array.isArray(payload.items)) return payload.items as T[];
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

function readString(obj: RecordUnknown, key: string): string | undefined {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

function readNumber(obj: RecordUnknown, key: string): number | undefined {
  const v = obj[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function readNumberFromString(obj: RecordUnknown, key: string): number | undefined {
  const v = obj[key];
  if (typeof v !== 'string') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function getProjectIdFromPriceLike(p: Price): string | undefined {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId?.projectId;
}

/**
 * Normaliza prices que pueden venir en camelCase o snake_case.
 * Si no puede construir un Price válido, devuelve null.
 */
function normalizePrice(raw: unknown): Price | null {
  if (!isRecord(raw)) return null;

  const sourceId =
    readString(raw, 'sourceId') ??
    readString(raw, 'source_id') ??
    readString(raw, 'asset_price_source_id') ??
    '';

  const typeRaw = readString(raw, 'type') ?? readString(raw, 'asset_type') ?? undefined;

  const type: Price['type'] =
    typeRaw === 'listing' || typeRaw === 'carbon_pool'
      ? typeRaw
      : isRecord(raw.listing)
      ? 'listing'
      : 'carbon_pool';

  const purchasePrice =
    readNumber(raw, 'purchasePrice') ??
    readNumber(raw, 'purchase_price') ??
    readNumberFromString(raw, 'purchasePrice') ??
    readNumberFromString(raw, 'purchase_price');

  const baseUnitPrice =
    readNumber(raw, 'baseUnitPrice') ??
    readNumber(raw, 'base_unit_price') ??
    readNumberFromString(raw, 'baseUnitPrice') ??
    readNumberFromString(raw, 'base_unit_price');

  const supply =
    readNumber(raw, 'supply') ??
    readNumber(raw, 'available_supply') ??
    readNumberFromString(raw, 'supply') ??
    0;

  const minFillAmount =
    readNumber(raw, 'minFillAmount') ??
    readNumber(raw, 'min_fill_amount') ??
    readNumberFromString(raw, 'minFillAmount') ??
    readNumberFromString(raw, 'min_fill_amount') ??
    0;

  // listing / carbonPool (puede venir snake_case)
  const listingRaw = raw['listing'];
  const carbonPoolRaw = raw['carbonPool'] ?? raw['carbon_pool'];

  const listing: Price['listing'] | undefined = isRecord(listingRaw)
    ? (() => {
        const credit = listingRaw['creditId'] ?? listingRaw['credit_id'];
        const creditId =
          isRecord(credit) && (readString(credit, 'projectId') ?? readString(credit, 'project_id'))
            ? {
                projectId:
                  readString(credit, 'projectId') ?? readString(credit, 'project_id') ?? '',
                vintage:
                  readNumber(credit, 'vintage') ?? readNumberFromString(credit, 'vintage') ?? 0,
              }
            : undefined;

        const tokenRaw = listingRaw['token'];
        const token = isRecord(tokenRaw)
          ? {
              id: readString(tokenRaw, 'id') ?? '',
              address: readString(tokenRaw, 'address') ?? '',
              decimals: readNumber(tokenRaw, 'decimals') ?? 0,
              tokenStandard:
                readString(tokenRaw, 'tokenStandard') ??
                readString(tokenRaw, 'token_standard') ??
                '',
              name: readString(tokenRaw, 'name') ?? '',
              isExAnte: Boolean(tokenRaw['isExAnte'] ?? tokenRaw['is_ex_ante']),
              symbol: readString(tokenRaw, 'symbol') ?? '',
              tokenId: readNumber(tokenRaw, 'tokenId') ?? readNumber(tokenRaw, 'token_id') ?? 0,
            }
          : {
              id: '',
              address: '',
              decimals: 0,
              tokenStandard: '',
              name: '',
              isExAnte: false,
              symbol: '',
              tokenId: 0,
            };

        return {
          id: readString(listingRaw, 'id') ?? '',
          creditId,
          token,
          sellerId: readString(listingRaw, 'sellerId') ?? readString(listingRaw, 'seller_id') ?? '',
        };
      })()
    : undefined;

  const carbonPool: Price['carbonPool'] | undefined = isRecord(carbonPoolRaw)
    ? (() => {
        const credit = carbonPoolRaw['creditId'] ?? carbonPoolRaw['credit_id'];
        if (!isRecord(credit)) return undefined;

        const projectId = readString(credit, 'projectId') ?? readString(credit, 'project_id');
        if (!projectId) return undefined;

        const creditIdValue =
          readString(credit, 'creditId') ?? readString(credit, 'credit_id') ?? '';
        const vintage =
          readNumber(credit, 'vintage') ?? readNumberFromString(credit, 'vintage') ?? 0;

        const tokenRaw = carbonPoolRaw['token'];
        const token = isRecord(tokenRaw)
          ? {
              id: readString(tokenRaw, 'id') ?? '',
              address: readString(tokenRaw, 'address') ?? '',
              decimals: readNumber(tokenRaw, 'decimals') ?? 0,
              tokenStandard:
                readString(tokenRaw, 'tokenStandard') ??
                readString(tokenRaw, 'token_standard') ??
                '',
              name: readString(tokenRaw, 'name') ?? '',
              isExAnte: Boolean(tokenRaw['isExAnte'] ?? tokenRaw['is_ex_ante']),
              symbol: readString(tokenRaw, 'symbol') ?? '',
              tokenId: readNumber(tokenRaw, 'tokenId') ?? readNumber(tokenRaw, 'token_id') ?? 0,
            }
          : {
              id: '',
              address: '',
              decimals: 0,
              tokenStandard: '',
              name: '',
              isExAnte: false,
              symbol: '',
              tokenId: 0,
            };

        return {
          creditId: {
            projectId,
            vintage,
            creditId: creditIdValue,
          },
          token,
        };
      })()
    : undefined;

  // Si no hay nada usable para precio, descartamos
  if (purchasePrice === undefined && baseUnitPrice === undefined) return null;

  return {
    sourceId,
    type,
    purchasePrice: purchasePrice ?? baseUnitPrice ?? 0,
    baseUnitPrice: baseUnitPrice ?? purchasePrice ?? 0,
    supply,
    minFillAmount,
    listing,
    carbonPool,
  };
}

function computeDisplayPriceForProject(
  projectKey: string,
  pricesList: Price[]
): string | undefined {
  const matches = pricesList.filter((p) => getProjectIdFromPriceLike(p) === projectKey);
  if (matches.length === 0) return undefined;

  let min: number | null = null;
  for (const m of matches) {
    const val = Number(m.purchasePrice ?? m.baseUnitPrice ?? 0);
    if (!Number.isFinite(val) || val <= 0) continue;
    if (min == null || val < min) min = val;
  }
  return min == null ? undefined : min.toFixed(2);
}

function normalizeProject(p: Project, pricesList: Price[]): Project {
  const displayFromPrices = computeDisplayPriceForProject(p.key, pricesList);

  return {
    ...p,
    images: p.images ?? [],
    description: p.short_description || p.description || 'No description available',
    displayPrice: displayFromPrices ?? (typeof p.price === 'string' ? p.price : '0'),
    selectedVintage: p.vintages?.[0],
  };
}

const useMarketplace = (id?: string): UseMarketplace => {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const [prices, setPrices] = useState<Price[]>([]);

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

        const rawList = unwrapArray<unknown>(res.data);
        const normalized = rawList
          .map((x) => normalizePrice(x))
          .filter((x): x is Price => x !== null);

        setPrices(normalized);
      } catch (err) {
        console.error('Error fetching prices', err);
        setPrices([]);
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

        setProjects(list.map((p) => normalizeProject(p, prices)));
      } catch (err) {
        console.error('Error fetching projects', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id, prices]);

  // =========================
  // FETCH SINGLE PROJECT
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<Project>(ENDPOINTS.projectById(id));
        setProject(normalizeProject(res.data, prices));
      } catch (err) {
        console.error('Error fetching project', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, prices]);

  // =========================
  // FILTERED PROJECTS
  // =========================
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter((p) => (p.name ?? '').toLowerCase().includes(s));
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
  // HANDLE RETIRE (RESTORE FLOW)
  // =========================
  const handleRetire = (params: RetireParams) => {
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          ...params,
          quantity: (params as unknown as { quantity?: number }).quantity ?? 1,
          createdAt: Date.now(),
        };
        localStorage.setItem('pendingRetirement', JSON.stringify(payload));
      }

      router.push('/retirementSteps');
      // router.push("/retireCheckout");
    } catch (e) {
      console.error('Error handling retire', e);
    }
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
