import { Project } from '@/types/project';

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
 * Extrae una URL válida desde cualquier formato de imagen de Carbonmark v18
 */
function extractImageUrl(img: unknown): string | null {
  if (!img) return null;

  // string directo
  if (typeof img === 'string') return img;

  // array de imágenes
  if (Array.isArray(img)) {
    for (const item of img) {
      const url = extractImageUrl(item);
      if (url) return url;
    }
    return null;
  }

  // objeto imagen
  if (typeof img === 'object') {
    const obj = img as Record<string, unknown>;

    // campos comunes en Carbonmark
    const direct = obj.url || obj.src || obj.imageUrl || obj.cover || obj.thumbnail;

    if (typeof direct === 'string') return direct;
  }

  return null;
}

/**
 * Obtiene la mejor imagen posible para un proyecto
 * (compatible Carbonmark v18)
 */
export function getProjectImage(project: Project): string {
  // 1️⃣ coverImage
  const cover = extractImageUrl(project.coverImage);
  if (cover) return cover;

  // 2️⃣ satelliteImage
  const satellite = extractImageUrl(project.satelliteImage);
  if (satellite) return satellite;

  // 3️⃣ images[]
  const images = extractImageUrl(project.images);
  if (images) return images;

  // 4️⃣ fallback por categoría
  const category = project.methodologies?.[0]?.category;
  if (category && categoryImages[category]) {
    return categoryImages[category];
  }

  // 5️⃣ fallback final
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
