// src/app/layout.tsx
import './globals.css';
import 'leaflet/dist/leaflet.css';

import type { Metadata } from 'next';
import { Suspense } from 'react';
import RootClient from '@/components/RootClient';

export const metadata: Metadata = {
  title: 'Forestblock',
  description: 'Reduce tu impacto con nuestro mercado de carbono sostenible.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Suspense fallback={null}>
          <RootClient>{children}</RootClient>
        </Suspense>
      </body>
    </html>
  );
}

// import "./globals.css";
// import "leaflet/dist/leaflet.css";
// import { AuthProvider } from "@/context/AuthContext";
// import { RetireProvider } from "@/context/RetireContext";
// import { ModalProvider } from "@/context/ModalContext";
// import { aeonik, neueMontreal } from "@/fonts";
// import AuthGuard from "./AuthGuard";

// export const metadata = {
//   title: "Forestblock",
//   description: "Reduce tu impacto con nuestro mercado de carbono sostenible.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={`${aeonik.variable} ${neueMontreal.variable}`}>
//       <body>
//         <AuthProvider>
//           <RetireProvider>
//             <ModalProvider>
//               <AuthGuard>{children}</AuthGuard>
//             </ModalProvider>
//           </RetireProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
