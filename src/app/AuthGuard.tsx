'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Rutas públicas (no requieren login)
const PUBLIC: (string | RegExp)[] = [
  '/',
  '/calculate',
  '/marketplace',
  '/new-feature',
  '/new-feature/future',
  /^\/new-feature\/preorder(\/.*)?$/,
  '/_next',
  '/assets',
];

const isAllowed = (path: string, rules: (string | RegExp)[]) =>
  rules.some((r) => (typeof r === 'string' ? path.startsWith(r) : r.test(path)));

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname() || '/';
  const router = useRouter();

  const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

  useEffect(() => {
    // en dev no hacemos nada
    if (isDev) return;

    // Permitidas sin auth
    if (isAllowed(pathname, PUBLIC)) return;

    // Si no está autenticado y la ruta no es pública → redirige
    if (!isAuthenticated) {
      router.replace('/marketplace');
    }
  }, [isAuthenticated, pathname, router, isDev]);

  // En todos los casos renderizamos los children
  return <>{children}</>;
}

// "use client";

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
// import DesktopSidebar from "@/components/Sidebar/DesktopSidebar";
// import useDynamicTitle from "@/hooks/useDynamicTitle";

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { isLoading, isAuthenticated } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useDynamicTitle();

//   useEffect(() => {
//     if (isLoading) {
//       return;
//     }

//     const publicRoutes = ["/marketplace", "/calculate"];
//     const publicRoutePatterns = [/^\/marketplace\/.+$/, /^\/calculate\/.+$/];

//     const isPublicRoute =
//       publicRoutes.includes(pathname) ||
//       publicRoutePatterns.some((pattern) => pattern.test(pathname));

//     if (!isAuthenticated && !isPublicRoute) {
//       router.push("/marketplace");
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   if (isLoading) {
//     return <LoaderScreenDynamic />;
//   }

//   const pathNamesWithoutSidebard = [""];

//   return (
//     <div className="flex min-h-screen bg-white">
//       {!pathNamesWithoutSidebard.includes(pathname) && <DesktopSidebar />}
//       <div className="flex-1 overflow-y-hidden lg:overflow-y-visible bg-white">
//         {children}
//       </div>
//     </div>
//   );
// }
