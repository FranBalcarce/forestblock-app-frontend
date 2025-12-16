import { useEffect, useMemo, useState } from 'react';
import { Project } from '@/types/project';
import { UseMarketplace, RetireParams } from '@/types/marketplace';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/**
 * Endpoints según tu backend Express:
 * server.js -> app.use("/api", apiRoutes)
 * index.js -> router.use("/carbon", carbonRoutes)
 */
const ENDPOINTS = {
  projects: '/api/carbon/carbonProjects',
  projectById: (id: string) => `/api/carbon/carbonProjects/${encodeURIComponent(id)}`,
  prices: '/api/carbon/prices',
};

/** Helpers sin `any` */
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

/**
 * Saca projectId/key desde el objeto "price" aunque cambie el shape
 * - listing.creditId.projectId
 * - carbonPool.creditId.projectId
 * - listing.project.key (fallback)
 * - projectId (fallback)
 */
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

/**
 * Lee un precio numérico desde el objeto "price" aunque cambie el shape
 * - purchasePrice (number)
 * - baseUnitPrice (number)
 * - listing.singleUnitPrice (string -> number)
 */
function getNumericPriceFromPrice(pr: unknown): number | null {
  if (!isRecord(pr)) return null;

  if (typeof pr.purchasePrice === 'number' && Number.isFinite(pr.purchasePrice)) {
    return pr.purchasePrice;
  }

  if (typeof pr.baseUnitPrice === 'number' && Number.isFinite(pr.baseUnitPrice)) {
    return pr.baseUnitPrice;
  }

  const listing = pr.listing;
  if (isRecord(listing) && typeof listing.singleUnitPrice === 'string') {
    const n = Number(listing.singleUnitPrice);
    if (Number.isFinite(n)) return n;
  }

  return null;
}

/**
 * Devuelve el mínimo precio encontrado para un projectKey (string con 2 decimales)
 */
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
 * Normaliza un proyecto sin tocar imágenes:
 * - description / displayPrice / selectedVintage
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  // prices como unknown[] para no romper si Carbonmark cambia el shape
  const [prices, setPrices] = useState<unknown[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);

  /* =========================
     FETCH PRICES (1 vez)
  ========================== */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.prices);
        setPrices(unwrapArray<unknown>(res.data));
      } catch (err) {
        console.error('Error fetching prices', err);
        setPrices([]);
      } finally {
        setIsPricesLoading(false);
      }
    };

    fetchPrices();
  }, []);

  /* =========================
     FETCH PROJECTS (LIST)
  ========================== */
  useEffect(() => {
    if (id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.projects);
        const list = unwrapArray<Project>(res.data);

        // normalizamos usando prices (si ya llegaron)
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

  /* =========================
     FETCH SINGLE PROJECT
  ========================== */
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<Project>(ENDPOINTS.projectById(id));
        const data = res.data;
        setProject(normalizeProject(data, prices));
      } catch (err) {
        console.error('Error fetching project', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, prices]);

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

    // (si querés filtrar por ODS, acá es donde va, pero no lo toco porque no me pasaste esa lógica)

    if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.displayPrice ?? 0) - Number(b.displayPrice ?? 0));
    }

    if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.displayPrice ?? 0) - Number(a.displayPrice ?? 0));
    }

    return list;
  }, [projects, searchTerm, selectedCountries, selectedCategories, selectedVintages, sortBy]);

  /* =========================
     HANDLE RETIRE (BUY)
  ========================== */
  const handleRetire = (params: RetireParams) => {
    // Acá va tu flujo real de compra/retire
    console.log('RETIRE / BUY:', params);
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

    // OJO: tu tipo dice Price[] pero acá devolvemos unknown[]
    // Esto es apropósito para que no se rompa por cambios del API.
    // Si querés, después lo tipamos fino cuando me pegues 1 item real de /prices.
    prices: prices as unknown as any,
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
