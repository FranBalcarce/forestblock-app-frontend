import { useEffect, useMemo, useState } from 'react';
import type { Project, Image as ProjectImage } from '@/types/project';
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

function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  if (isRecord(data)) {
    const items = data.items;
    const results = data.results;
    const innerData = data.data;

    if (Array.isArray(items)) return items as T[];
    if (Array.isArray(results)) return results as T[];
    if (Array.isArray(innerData)) return innerData as T[];
  }

  return [];
}

function toImageArray(rawImages: unknown): ProjectImage[] {
  if (!Array.isArray(rawImages)) return [];

  const out: ProjectImage[] = [];
  for (const img of rawImages) {
    if (typeof img === 'string') {
      out.push({ url: img, caption: '' });
      continue;
    }
    if (isRecord(img)) {
      const url =
        typeof img.url === 'string'
          ? img.url
          : typeof img.src === 'string'
          ? img.src
          : typeof img.imageUrl === 'string'
          ? img.imageUrl
          : '';

      const caption = typeof img.caption === 'string' ? img.caption : '';
      if (url) out.push({ url, caption });
    }
  }
  return out;
}

function toCoverImage(rawCover: unknown, fallbackImages: ProjectImage[]): ProjectImage {
  if (isRecord(rawCover)) {
    const url =
      typeof rawCover.url === 'string'
        ? rawCover.url
        : typeof rawCover.src === 'string'
        ? rawCover.src
        : typeof rawCover.imageUrl === 'string'
        ? rawCover.imageUrl
        : '';

    const caption = typeof rawCover.caption === 'string' ? rawCover.caption : '';
    if (url) return { url, caption };
  }

  // fallback a la primera imagen
  if (fallbackImages.length > 0) return { url: fallbackImages[0].url, caption: '' };

  // cover vacío (para que no rompa el type Project)
  return { url: '', caption: '' };
}

function normalizeProject(raw: unknown): Project {
  const base: RecordUnknown = isRecord(raw) ? raw : {};

  const images = toImageArray(base.images);
  const coverImage = toCoverImage(base.coverImage, images);

  // armamos el objeto “como Project”, manteniendo todo lo que venga del backend
  const p = {
    ...(base as unknown as Project),
    images,
    coverImage,
  };

  // descripción usable (card y detalle)
  const desc =
    (p.short_description && p.short_description.trim() !== '' ? p.short_description : '') ||
    (p.long_description && p.long_description.trim() !== '' ? p.long_description : '') ||
    (p.description && p.description.trim() !== '' ? p.description : '') ||
    'No description available';

  const selectedVintage = Array.isArray(p.vintages) && p.vintages.length > 0 ? p.vintages[0] : '';

  // price base (si viene en el proyecto)
  const displayPrice =
    typeof p.price === 'string' && p.price.trim() !== ''
      ? p.price
      : typeof (base.price as unknown) === 'number'
      ? String(base.price)
      : '0';

  return {
    ...p,
    description: desc,
    selectedVintage,
    displayPrice,
  };
}

const getProjectIdFromPrice = (pr: Price): string | undefined =>
  pr.listing?.creditId?.projectId ?? pr.carbonPool?.creditId?.projectId;

function computeDisplayPriceForProject(projectKey: string, prices: Price[]): string | undefined {
  const matches = prices.filter((p) => getProjectIdFromPrice(p) === projectKey);
  if (matches.length === 0) return undefined;

  const min = matches.reduce(
    (acc, cur) => (cur.purchasePrice < acc.purchasePrice ? cur : acc),
    matches[0]
  );
  return min.purchasePrice.toFixed(2);
}

const useMarketplace = (id?: string): UseMarketplace => {
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

  // PRICES
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.prices);
        setPrices(unwrapArray<Price>(res.data));
      } catch (err) {
        console.error('Error fetching prices', err);
        setPrices([]);
      } finally {
        setIsPricesLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // LIST PROJECTS
  useEffect(() => {
    if (id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.projects);
        const rawArr = unwrapArray<unknown>(res.data);
        const normalized = rawArr.map((r) => normalizeProject(r));
        setProjects(normalized);
      } catch (err) {
        console.error('Error fetching projects', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  // SINGLE PROJECT
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axiosPublicInstance.get<unknown>(ENDPOINTS.projectById(id));

        // a veces viene { item: {...} }
        const raw =
          isRecord(res.data) && 'item' in res.data ? (res.data as RecordUnknown).item : res.data;

        setProject(normalizeProject(raw));
      } catch (err) {
        console.error('Error fetching project', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // INYECTAR displayPrice desde /prices (si hay)
  useEffect(() => {
    if (prices.length === 0) return;

    setProjects((prev) =>
      prev.map((p) => {
        const real = computeDisplayPriceForProject(p.key, prices);
        return { ...p, displayPrice: real ?? p.displayPrice ?? '0' };
      })
    );

    setProject((prev) => {
      if (!prev) return prev;
      const real = computeDisplayPriceForProject(prev.key, prices);
      return { ...prev, displayPrice: real ?? prev.displayPrice ?? '0' };
    });
  }, [prices]);

  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .map((p) => p.category)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
      )
    );
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(t));
    }

    if (selectedCountries.length) {
      list = list.filter((p) => selectedCountries.includes(p.country));
    }

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category || ''));
    }

    if (selectedVintages.length) {
      list = list.filter((p) => p.vintages?.some((v) => selectedVintages.includes(v)));
    }

    if (selectedUNSDG.length) {
      list = list.filter((p) =>
        (p.sustainableDevelopmentGoals || []).some((sdg) => selectedUNSDG.includes(sdg))
      );
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.displayPrice || 0) - Number(b.displayPrice || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.displayPrice || 0) - Number(a.displayPrice || 0));
    }

    return list;
  }, [
    projects,
    searchTerm,
    selectedCountries,
    selectedCategories,
    selectedVintages,
    selectedUNSDG,
    sortBy,
  ]);

  const handleRetire = (params: RetireParams) => {
    console.log('RETIRE / BUY:', params);
    // acá conectás el flujo real (checkout)
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
