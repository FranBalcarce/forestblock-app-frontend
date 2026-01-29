'use client';

import { useEffect, useMemo, useState } from 'react';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

import type { Project } from '@/types/project';
import type { UseMarketplace, RetireParams, SortBy, SellableProject } from '@/types/marketplace';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

type ApiListResponse<T> = T[] | { items: T[] } | { data: T[] };

function unwrapArray<T>(response: ApiListResponse<T> | unknown): T[] {
  if (Array.isArray(response)) return response;

  if (typeof response === 'object' && response !== null) {
    if ('items' in response && Array.isArray((response as any).items)) {
      return (response as any).items;
    }

    if ('data' in response && Array.isArray((response as any).data)) {
      return (response as any).data;
    }
  }

  return [];
}

/* ---------------------------------------------
   Hook
--------------------------------------------- */

export default function useMarketplace(id?: string): UseMarketplace {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sellableProjects, setSellableProjects] = useState<SellableProject[]>([]);
  const [project, setProject] = useState<SellableProject | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('price_asc');

  /* ---------------------------------------------
     Fetch marketplace
  --------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function fetchMarketplace() {
      setLoading(true);

      try {
        // 1️⃣ Traemos proyectos base
        const projectRes = await axiosPublicInstance.get('/api/carbon/carbonProjects');
        const rawProjects = unwrapArray<Project>(projectRes.data);

        if (!mounted) return;

        setProjects(rawProjects);

        // 2️⃣ Pedimos precios en paralelo
        const enriched = (
          await Promise.all(
            rawProjects.map(async (project) => {
              try {
                const pricesRes = await axiosPublicInstance.get(`/api/carbon/prices`, {
                  params: {
                    projectIds: project.projectID ?? project.key,
                    minSupply: 1,
                  },
                });

                const listings = unwrapArray<{
                  price: number;
                  supply: number;
                }>(pricesRes.data);

                if (!listings.length) return null;

                const cheapest = listings.reduce((a, b) => (b.price < a.price ? b : a));

                return {
                  ...project,
                  minPrice: cheapest.price,
                  availableSupply: cheapest.supply,
                } satisfies SellableProject;
              } catch {
                return null;
              }
            })
          )
        ).filter(Boolean) as SellableProject[];

        if (!mounted) return;

        setSellableProjects(enriched);

        // 3️⃣ Proyecto por ID (detalle)
        if (id) {
          setProject(enriched.find((p) => p.key === id) ?? null);
        }
      } catch (err) {
        console.error('❌ Error fetching marketplace', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMarketplace();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ---------------------------------------------
     Filtering + Sorting
  --------------------------------------------- */

  const filteredProjects = useMemo(() => {
    let result = [...sellableProjects];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [sellableProjects, searchTerm, sortBy]);

  /* ---------------------------------------------
     Retire
  --------------------------------------------- */

  const handleRetire = (params: RetireParams) => {
    const sp = new URLSearchParams();
    sp.set('id', params.id);
    sp.set('index', String(params.index));
    sp.set('price', params.priceParam);
    sp.set('selectedVintage', params.selectedVintage);
    sp.set('quantity', String(params.quantity));

    window.location.href = `/retireCheckout?${sp.toString()}`;
  };

  /* ---------------------------------------------
     Return
  --------------------------------------------- */

  return {
    projects,
    filteredProjects,
    project,
    loading,

    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,

    // filtros (por ahora no activos)
    availableCategories: [],
    selectedCountries: [],
    setSelectedCountries: () => {},
    selectedCategories: [],
    setSelectedCategories: () => {},
    selectedVintages: [],
    setSelectedVintages: () => {},
    selectedUNSDG: [],
    setSelectedUNSDG: () => {},

    // legacy (ya no usados)
    prices: [],
    isPricesLoading: false,

    handleRetire,
  };
}

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
