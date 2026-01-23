'use client';

import { useEffect, useMemo, useState } from 'react';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';
import { Project } from '@/types/project';
import { Price, UseMarketplace, RetireParams, SortBy } from '@/types/marketplace';

/* ---------------------------------------------
 Helpers
--------------------------------------------- */

function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (typeof data === 'object' && data && 'data' in data && Array.isArray((data as any).data)) {
    return (data as any).data;
  }
  return [];
}

/* ---------------------------------------------
 Hook
--------------------------------------------- */

export default function useMarketplace(id?: string): UseMarketplace {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const [prices, setPrices] = useState<Price[]>([]);
  const [isPricesLoading, setIsPricesLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('price_asc');

  /* ---------------------------------------------
     Fetch projects
  --------------------------------------------- */

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axiosPublicInstance.get('/projects');
        const data = unwrapArray<Project>(res.data);
        setProjects(data);

        if (id) {
          setProject(data.find((p) => p.key === id) ?? null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [id]);

  /* ---------------------------------------------
     Fetch prices (SOLO listings con supply)
     🔑 Carbonmark recommendation: minSupply=100
  --------------------------------------------- */

  useEffect(() => {
    async function fetchPrices() {
      setIsPricesLoading(true);
      try {
        const res = await axiosPublicInstance.get(
          'https://v18.api.carbonmark.com/prices?minSupply=100'
        );

        const raw = unwrapArray<Price>(res.data);

        const valid = raw.filter(
          (p) => p.type === 'listing' && p.supply > 0 && !!p.listing?.creditId?.projectId
        );

        setPrices(valid);
      } finally {
        setIsPricesLoading(false);
      }
    }

    fetchPrices();
  }, []);

  /* ---------------------------------------------
     Filtrar proyectos DISPONIBLES
  --------------------------------------------- */

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      prices.some((price) => price.listing?.creditId?.projectId === project.key)
    );
  }, [projects, prices]);

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
    filteredProjects,
    loading,

    availableCategories: [],
    selectedCountries: [],
    setSelectedCountries: () => {},
    selectedCategories: [],
    setSelectedCategories: () => {},
    selectedVintages: [],
    setSelectedVintages: () => {},
    selectedUNSDG: [],
    setSelectedUNSDG: () => {},

    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,

    projects,
    project,
    prices,
    isPricesLoading,
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
