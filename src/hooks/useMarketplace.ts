import { useEffect, useState } from 'react';
import { Price, RetireParams, UseMarketplace } from '@/types/marketplace';
import { Project } from '@/types/project';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { LATAM_COUNTRIES, PRICE_MULTIPLIER } from '@/constants';
import qs from 'qs';
import { useRetire } from '../context/RetireContext';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

type CarbonmarkListResponse<T> = {
  items: T[];
};

const unwrapItems = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object' && 'items' in raw) {
    const r = raw as CarbonmarkListResponse<T>;
    if (Array.isArray(r.items)) return r.items;
  }
  return [];
};

const safeNumber = (value: unknown): number | null => {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) : NaN;
  return Number.isFinite(n) ? n : null;
};

const useMarketplace = (id?: string): UseMarketplace => {
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);
  const [prices, setPrices] = useState<Price[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price-desc');
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project | null>(null);

  const { isAuthenticated, setRedirectUrl } = useAuth();
  const { openModal } = useModal();
  const { setTotalSupply } = useRetire();
  const router = useRouter();

  const handleRetire = ({ id, index, priceParam, selectedVintage }: RetireParams) => {
    if (!id) return;

    const methodologyName = project?.methodologies?.[0]?.name || 'Sin metodología';
    const encodedMethodologyName = encodeURIComponent(methodologyName);

    const url = `/retireCheckout?index=${index}&projectIds=${id}&priceParam=${priceParam}&methodologyName=${encodedMethodologyName}&selectedVintage=${selectedVintage}`;

    if (!isAuthenticated) {
      setRedirectUrl(url);
      openModal('login');
      return;
    }

    router.push(url);
  };

  // -------------------------------------------------------------
  // 1) GET PROJECT BY ID
  // -------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await axiosPublicInstance.get<Project>(`/carbon/carbonProjects/${id}`);
        let data = response.data;

        // Ajuste de precio
        const n = safeNumber((data as unknown as { price?: unknown })?.price);
        if (n !== null) {
          data = { ...(data as Project), price: (n * PRICE_MULTIPLIER).toString() };
        }

        // stats puede venir en v18, si existe lo guardamos
        const totalSupply = (data as unknown as { stats?: { totalSupply?: number } })?.stats
          ?.totalSupply;
        if (typeof totalSupply === 'number') setTotalSupply(totalSupply);

        setProject(data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setProject(null);
      }
    };

    fetchProject();
  }, [id, setTotalSupply]);

  // -------------------------------------------------------------
  // 2) GET ALL PROJECTS
  //   Tu backend ya devuelve ARRAY (porque lo unwrappea en controller/service)
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosPublicInstance.get<Project[]>('/carbon/carbonProjects', {
          params: {
            minSupply: 1,
            country: [...LATAM_COUNTRIES, 'Indonesia'],
          },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
        });

        const list = Array.isArray(response.data)
          ? response.data
          : unwrapItems<Project>(response.data);

        const updated = list.map((proj) => {
          const n = safeNumber((proj as unknown as { price?: unknown })?.price);
          if (n === null) return proj;
          return { ...proj, price: (n * PRICE_MULTIPLIER).toString() };
        });

        const uniqueCategories = Array.from(
          new Set(updated.flatMap((p) => p.methodologies?.map((m) => m.category) || []))
        );

        setProjects(updated);
        setFilteredProjects(updated);
        setAvailableCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
        setAvailableCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // -------------------------------------------------------------
  // 3) GET PRICES
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        if (projects.length === 0) return;

        const response = await axiosPublicInstance.get<Price[] | { items: Price[] }>(
          '/carbon/prices',
          {
            params: {
              projectIds: projects.map((p) => p.key),
              minSupply: 1,
            },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
          }
        );

        const list = Array.isArray(response.data)
          ? response.data
          : unwrapItems<Price>(response.data);

        const updated = list.map((priceItem) => ({
          ...priceItem,
          purchasePrice: priceItem.purchasePrice * PRICE_MULTIPLIER,
        }));

        setPrices(updated);
        setIsPricesLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setPrices([]);
        setIsPricesLoading(false);
      }
    };

    fetchPrices();
  }, [projects]);

  // -------------------------------------------------------------
  // 4) FILTERS + SORTING
  // -------------------------------------------------------------
  useEffect(() => {
    let updated = [...projects];

    if (selectedCountries.length)
      updated = updated.filter((p) => selectedCountries.includes(p.country));

    if (selectedCategories.length)
      updated = updated.filter((p) =>
        p.methodologies?.some((m) => selectedCategories.includes(m.category))
      );

    if (selectedVintages.length)
      updated = updated.filter((p) => p.vintages?.some((v) => selectedVintages.includes(v)));

    if (selectedUNSDG.length)
      updated = updated.filter((p) =>
        p.sustainableDevelopmentGoals?.some((sdg) => selectedUNSDG.includes(sdg))
      );

    if (searchTerm)
      updated = updated.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortBy === 'price-asc') updated.sort((a, b) => +a.price - +b.price);
    if (sortBy === 'price-desc') updated.sort((a, b) => +b.price - +a.price);
    if (sortBy === 'name') updated.sort((a, b) => a.name.localeCompare(b.name));

    if (sortBy === 'recently-update') {
      updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    setFilteredProjects(updated);
  }, [
    selectedCountries,
    selectedCategories,
    selectedVintages,
    selectedUNSDG,
    searchTerm,
    sortBy,
    projects,
  ]);

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
