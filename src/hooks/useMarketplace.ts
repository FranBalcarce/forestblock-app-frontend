import { useEffect, useMemo, useState } from 'react';
import type { Project } from '@/types/project';
import type { Price, UseMarketplace, RetireParams } from '@/types/marketplace';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/**
 * Endpoints del backend Express (relativos al baseURL de axiosPublicInstance)
 * baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
 *
 * Ej en local:
 * NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
 * => GET http://localhost:5000/api/carbon/carbonProjects
 */
const ENDPOINTS = {
  projects: '/api/carbon/carbonProjects',
  projectById: (id: string) => `/api/carbon/carbonProjects/${encodeURIComponent(id)}`,
  prices: '/api/carbon/prices',
};

// --- helpers types ---
type Maybe<T> = T | null | undefined;

// Carbonmark/Backend a veces devuelve { items: [...] } o directamente [...]
function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
  }
  return [];
}

function safeString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function safeNumberString(v: unknown, fallback = '0'): string {
  // acepta "0.58" o 0.58
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return v;
  return fallback;
}

// Normaliza imágenes para tu type Project (Image[] y coverImage Image)
function normalizeProjectImages(p: Project): Project {
  // En tu type:
  // images: Image[]
  // coverImage: Image
  // Pero algunos proyectos pueden venir sin images o con satelliteImage etc.
  const imagesArr = Array.isArray((p as any).images) ? ((p as any).images as any[]) : [];
  const normalizedImages = imagesArr
    .map((img) => {
      // acepta string u objeto
      if (typeof img === 'string') return { url: img, caption: '' };
      if (img && typeof img === 'object') {
        const o = img as Record<string, unknown>;
        const url = typeof o.url === 'string' ? o.url : typeof o.src === 'string' ? o.src : '';
        const caption = typeof o.caption === 'string' ? o.caption : '';
        if (url) return { url, caption };
      }
      return null;
    })
    .filter((x): x is { url: string; caption: string } => !!x);

  // coverImage puede venir como {url} o vacío
  let coverImage = (p as any).coverImage;
  if (!coverImage || typeof coverImage !== 'object') {
    coverImage = normalizedImages[0]
      ? { url: normalizedImages[0].url, caption: '' }
      : { url: '', caption: '' };
  } else {
    const o = coverImage as Record<string, unknown>;
    const url = typeof o.url === 'string' ? o.url : typeof o.src === 'string' ? o.src : '';
    const caption = typeof o.caption === 'string' ? o.caption : '';
    coverImage = { url, caption };
  }

  return {
    ...p,
    images: normalizedImages as any,
    coverImage: coverImage as any,
  };
}

// Price -> projectId (tu backend ya te los devuelve así en listing/carbonPool)
const getProjectIdFromPrice = (pr: Price): string | undefined => {
  return pr.listing?.creditId?.projectId ?? pr.carbonPool?.creditId?.projectId;
};

// Devuelve el “mejor precio” para mostrar en cards: el menor purchasePrice para el proyecto
function computeDisplayPriceForProject(projectKey: string, prices: Price[]): string | undefined {
  const matches = prices.filter((p) => getProjectIdFromPrice(p) === projectKey);
  if (!matches.length) return undefined;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [selectedUNSDG, setSelectedUNSDG] = useState<string[]>([]);

  /* =========================
     FETCH PRICES (SIEMPRE)
  ========================== */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const res = await axiosPublicInstance.get(ENDPOINTS.prices);
        const arr = unwrapArray<Price>(res.data);
        setPrices(arr);
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

        const res = await axiosPublicInstance.get(ENDPOINTS.projects);
        const arr = unwrapArray<Project>(res.data);

        const normalized = arr.map((raw: Project) => {
          const p0 = normalizeProjectImages(raw);

          // descripción para card
          const desc =
            safeString((p0 as any).short_description) ||
            safeString((p0 as any).description) ||
            'No description available';

          // vintage default
          const vintages = Array.isArray(p0.vintages) ? p0.vintages : [];
          const selectedVintage = vintages[0] ?? '';

          // precio base (si viene del proyecto)
          const basePrice = safeNumberString((p0 as any).price, '0');

          return {
            ...p0,
            description: desc,
            selectedVintage,
            displayPrice: basePrice, // después lo sobreescribimos con prices si hay
          };
        });

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

  /* =========================
     FETCH SINGLE PROJECT
  ========================== */
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);

        const res = await axiosPublicInstance.get(ENDPOINTS.projectById(id));
        // a veces viene { item: {...} } o directo
        const data =
          res.data && typeof res.data === 'object'
            ? (('item' in res.data ? (res.data as any).item : res.data) as Project)
            : (res.data as Project);

        const p0 = normalizeProjectImages(data);

        const desc =
          safeString((p0 as any).long_description) ||
          safeString((p0 as any).description) ||
          'No description available';

        const vintages = Array.isArray(p0.vintages) ? p0.vintages : [];
        const selectedVintage = vintages[0] ?? '';

        const basePrice = safeNumberString((p0 as any).price, '0');

        setProject({
          ...p0,
          description: desc,
          selectedVintage,
          displayPrice: basePrice,
        });
      } catch (err) {
        console.error('Error fetching project', err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  /* =========================
     INYECTAR displayPrice REAL DESDE /prices
     (esto arregla el $0.00 en las cards)
  ========================== */
  useEffect(() => {
    if (!prices.length) return;

    // lista
    setProjects((prev) =>
      prev.map((p) => {
        const real = computeDisplayPriceForProject(p.key, prices);
        return {
          ...p,
          displayPrice: real ?? p.displayPrice ?? safeNumberString((p as any).price, '0'),
        };
      })
    );

    // detalle
    setProject((prev) => {
      if (!prev) return prev;
      const real = computeDisplayPriceForProject(prev.key, prices);
      return {
        ...prev,
        displayPrice: real ?? prev.displayPrice ?? safeNumberString((prev as any).price, '0'),
      };
    });
  }, [prices]);

  /* =========================
     AVAILABLE CATEGORIES
  ========================== */
  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .map((p) => p.category)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
      )
    );
  }, [projects]);

  /* =========================
     FILTERED PROJECTS
  ========================== */
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

    // (si después querés sumar UNSDG, lo hacemos; ahora lo dejo sin romper)
    if (selectedUNSDG.length) {
      list = list.filter((p) =>
        (p.sustainableDevelopmentGoals || []).some((sdg) => selectedUNSDG.includes(sdg))
      );
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.displayPrice || 0) - Number(b.displayPrice || 0));
    }

    if (sortBy === 'price_desc') {
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

  /* =========================
     HANDLE RETIRE (BUY)
     (por ahora log; tu flujo real lo conectás al checkout)
  ========================== */
  const handleRetire = (params: RetireParams) => {
    console.log('RETIRE / BUY:', params);
    // Acá va tu flujo real (ej: router.push a checkout)
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
