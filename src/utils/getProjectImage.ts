/**
 * Imágenes fallback por categoría
 */
const categoryImages: Record<string, string> = {
  Agriculture: '/images/categories/agriculture.png',
  'Blue Carbon': '/images/categories/blue_carbon.png',
  'Energy Efficiency': '/images/categories/energy_efficiency.png',
  Forestry: '/images/categories/forestry.png',
  'Industrial Processing': '/images/categories/industrial_processing.png',
  Other: '/images/categories/other.png',
  'Renewable Energy': '/images/categories/renewable_energy.png',
};

/**
 * Tipo mínimo requerido para poder obtener imagen
 */
export type ProjectWithImages = {
  coverImage?: unknown;
  satelliteImage?: unknown;
  images?: unknown;
  methodologies?: { category?: string }[];
  tipo?: string; // para DevProject
};

/**
 * Extrae una URL válida desde cualquier formato
 */
function extractImageUrl(img: unknown): string | null {
  if (!img) return null;

  if (typeof img === 'string') return img;

  if (Array.isArray(img)) {
    for (const item of img) {
      const url = extractImageUrl(item);
      if (url) return url;
    }
    return null;
  }

  if (typeof img === 'object') {
    const obj = img as Record<string, unknown>;
    const direct = obj.url ?? obj.src ?? obj.imageUrl ?? obj.cover ?? obj.thumbnail;

    if (typeof direct === 'string') return direct;
  }

  return null;
}

/**
 * Obtiene la mejor imagen posible
 */
export function getProjectImage(project: ProjectWithImages): string {
  const cover = extractImageUrl(project.coverImage);
  if (cover) return cover;

  const satellite = extractImageUrl(project.satelliteImage);
  if (satellite) return satellite;

  const images = extractImageUrl(project.images);
  if (images) return images;

  // Marketplace usa methodologies
  const category = project.methodologies?.[0]?.category || project.tipo;

  if (category && categoryImages[category]) {
    return categoryImages[category];
  }

  return '/images/categories/other.png';
}

// import { Project } from "@/types/project";

// const categoryImages: Record<string, string> = {
//   Agriculture: "/images/categories/agriculture.png",
//   "Blue Carbon": "/images/categories/blue_carbon.png",
//   "Energy Efficiency": "/images/categories/energy_efficiency.png",
//   Forestry: "/images/categories/forestry.png",
//   "Industrial Processing": "/images/categories/industrial_processing.png",
//   Other: "/images/categories/other.png",
//   "Renewable Energy": "/images/categories/renewable_energy.png",
// };

// export function getProjectImage(project: Project): string {
//   return (
//     project.coverImage?.url ||
//     (project.images?.length > 0 && project.images[0].url) ||
//     categoryImages[project.methodologies?.[0]?.category] ||
//     "/images/categories/other.png"
//   );
// }
