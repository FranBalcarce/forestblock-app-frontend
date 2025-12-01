// src/components/RootClient.tsx
'use client';

import React from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { RetireProvider } from '@/context/RetireContext';
import { ModalProvider } from '@/context/ModalContext';
import AuthGuard from '@/app/AuthGuard';
import DesktopSidebar from '@/components/Sidebar/DesktopSidebar';

type Props = {
  children: React.ReactNode;
};

const RootClient: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <RetireProvider>
        <ModalProvider>
          <AuthGuard>
            <div className="flex">
              <DesktopSidebar />
              <main className="flex-1">{children}</main>
            </div>
          </AuthGuard>
        </ModalProvider>
      </RetireProvider>
    </AuthProvider>
  );
};

export default RootClient;
