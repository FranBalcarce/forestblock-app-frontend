import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LuLayoutDashboard, LuLayoutGrid } from 'react-icons/lu';
import { FaStar } from 'react-icons/fa';
import { IoMdCart, IoLogoWhatsapp } from 'react-icons/io';
import { MdOutlineForest } from 'react-icons/md';
import { IoCloudyOutline, IoVideocam } from 'react-icons/io5';
import { loom_video } from '@/constants';
import type { MenuItem } from '@/components/Sidebar/types';

export function useMenuItems(): MenuItem[] {
  const { user } = useAuth();
  const companyId = user?.manglaiCompanyId;

  const items = useMemo<MenuItem[]>(() => {
    // evita /dashboard/undefined mientras carga el user
    const d = (p: string) => (companyId ? `${p}/${companyId}` : p);

    return [
      // -------- FOREST-TRACK (0..1)
      {
        href: d('/dashboard'),
        label: 'Dashboard',
        icon: <LuLayoutDashboard size={20} />,
        nestedRoutes: [],
        queryKeys: [],
        children: [
          {
            // 👇 ahora apunta directo a la ruta estática
            href: '/dashboard/summary',
            label: 'Resumen',
            icon: <LuLayoutGrid size={20} />,
            nestedRoutes: [],
            queryKeys: [],
          },
        ],
      },
      {
        href: '/calculate',
        label: 'Calcular huella',
        icon: <IoCloudyOutline size={20} />,
        nestedRoutes: [],
        queryKeys: [],
      },

      // -------- FORESTX (2..3)
      {
        href: '/marketplace',
        label: 'Marketplace',
        icon: <IoMdCart size={20} />,
        nestedRoutes: ['/retireCheckout', '/retirementSteps'],
        queryKeys: ['listingId', 'paymentId', 'index'],
      },
      {
        href: '/retirements',
        label: 'Créditos retirados',
        icon: <MdOutlineForest size={20} />,
        nestedRoutes: [],
        queryKeys: [],
      },

      // -------- NEW FEATURE (4..5)
      {
        href: '/new-feature',
        label: 'Proyectos en desarrollo',
        icon: <FaStar size={20} />,
        nestedRoutes: ['/new-feature/preorder'],
        queryKeys: [],
      },

      // -------- INFO (6..)
      {
        href: loom_video,
        label: 'Videotutoriales',
        icon: <IoVideocam size={20} />,
        nestedRoutes: [],
        queryKeys: [],
        target: '_blank',
      },
      {
        href: 'http://wa.me/1168392460',
        label: 'Contacto',
        icon: <IoLogoWhatsapp size={20} />,
        nestedRoutes: [],
        queryKeys: [],
        target: '_blank',
      },
    ];
  }, [companyId]);

  return items;
}

export const useIsActive = (
  pathname: string,
  searchParams: URLSearchParams
): ((item: MenuItem) => boolean) => {
  return (item: MenuItem): boolean => {
    if (item.href && pathname.startsWith(item.href)) return true;

    if (
      item.nestedRoutes.some((route) => pathname.startsWith(route)) &&
      (item.queryKeys.length === 0 || item.queryKeys.some((key) => !!searchParams.get(key)))
    ) {
      return true;
    }

    if (item.children) {
      return item.children.some((child) => child.href && pathname.startsWith(child.href));
    }
    return false;
  };
};

// // src/utils/menuConfig.ts
// import { useMemo } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { LuLayoutDashboard, LuLayoutGrid, LuPlug } from 'react-icons/lu';
// import { FaCarSide, FaRegBuilding, FaStar, FaRocket } from 'react-icons/fa';
// import { IoMdCart, IoLogoWhatsapp } from 'react-icons/io';
// import { MdOutlineForest } from 'react-icons/md';
// import { IoCloudyOutline, IoVideocam } from 'react-icons/io5';
// import { loom_video } from '@/constants';
// import type { MenuItem } from '@/components/Sidebar/types';

// export function useMenuItems(): MenuItem[] {
//   const { user } = useAuth();
//   const companyId = user?.manglaiCompanyId;

//   return useMemo<MenuItem[]>(
//     () => [
//       // FOREST-TRACK (0..1)
//       {
//         href: `/dashboard/${companyId}`,
//         label: 'Dashboard',
//         icon: <LuLayoutDashboard size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//         children: [
//           {
//             href: `/dashboard/summary/${companyId}`,
//             label: 'Resumen',
//             icon: <LuLayoutGrid size={20} />,
//             nestedRoutes: [],
//             queryKeys: [],
//           },
//           {
//             href: `/dashboard/buildings/${companyId}`,
//             label: 'Edificios',
//             icon: <FaRegBuilding size={20} />,
//             nestedRoutes: [],
//             queryKeys: [],
//           },
//           {
//             href: `/dashboard/vehicles/${companyId}`,
//             label: 'Vehículos',
//             icon: <FaCarSide size={20} />,
//             nestedRoutes: [],
//             queryKeys: [],
//           },
//           {
//             href: `/dashboard/consumptions/${companyId}`,
//             label: 'Consumos',
//             icon: <LuPlug size={20} />,
//             nestedRoutes: [],
//             queryKeys: [],
//           },
//         ],
//       },
//       {
//         href: '/calculate',
//         label: 'Calcular huella',
//         icon: <IoCloudyOutline size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//       },

//       // FORESTX (2..3)
//       {
//         href: '/marketplace',
//         label: 'Marketplace',
//         icon: <IoMdCart size={20} />,
//         nestedRoutes: ['/retireCheckout', '/retirementSteps'],
//         queryKeys: ['listingId', 'paymentId', 'index'],
//       },
//       {
//         href: '/retirements',
//         label: 'Créditos retirados',
//         icon: <MdOutlineForest size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//       },

//       // NEW FEATURE (4..5)  👈 NUEVOS
//       {
//         href: '/new-feature',
//         label: 'New Feature',
//         icon: <FaStar size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//       },
//       {
//         href: '/new-feature/future',
//         label: 'Proyectos futuros',
//         icon: <FaRocket size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//       },

//       // INFO (6..)
//       {
//         href: loom_video,
//         label: 'Videotutoriales',
//         icon: <IoVideocam size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//         target: '_blank',
//       },
//       {
//         href: 'http://wa.me/1168392460',
//         label: 'Contacto',
//         icon: <IoLogoWhatsapp size={20} />,
//         nestedRoutes: [],
//         queryKeys: [],
//         target: '_blank',
//       },
//     ],
//     [companyId]
//   );
// }

// export const useIsActive = (
//   pathname: string,
//   searchParams: URLSearchParams
// ): ((item: MenuItem) => boolean) => {
//   return (item: MenuItem): boolean => {
//     if (item.href && pathname.startsWith(item.href)) return true;
//     if (
//       item.nestedRoutes.some((route) => pathname.startsWith(route)) &&
//       item.queryKeys.some((key) => !!searchParams.get(key))
//     ) {
//       return true;
//     }
//     if (item.children) {
//       return item.children.some((child) => pathname.startsWith(child.href!));
//     }
//     return false;
//   };
// };
