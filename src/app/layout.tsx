// src/app/layout.tsx
import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';

import { AuthProvider } from '@/context/AuthContext';
import { RetireProvider } from '@/context/RetireContext';
import { ModalProvider } from '@/context/ModalContext'; // 👈 IMPORTANTE
import AuthGuard from './AuthGuard';
import DesktopSidebar from '@/components/Sidebar/DesktopSidebar';

export const metadata: Metadata = {
  title: 'Forestblock',
  description: 'Reduce tu impacto con nuestro mercado de carbono sostenible.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <RetireProvider>
            <ModalProvider>
              {' '}
              {/* 👈 envuelve todo lo que usa useModal */}
              <AuthGuard>
                <div className="flex">
                  <DesktopSidebar />
                  <main className="flex-1">{children}</main>
                </div>
              </AuthGuard>
            </ModalProvider>
          </RetireProvider>
        </AuthProvider>
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
