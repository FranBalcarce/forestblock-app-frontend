'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { AuthContextType, DecodedToken } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// User tal como puede venir del backend (con distintos nombres de campo)
type BackendUser = User & {
  manglai_company_id?: string | null;
  companyId?: string | null;
  company_id?: string | null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const login = ({ token, user }: { token: string; user: User }) => {
    const backendUser = user as BackendUser;

    // 🔹 Normalizamos el campo de compañía para que SIEMPRE exista manglaiCompanyId
    const normalizedUser: User = {
      ...backendUser,
      manglaiCompanyId:
        backendUser.manglaiCompanyId ??
        backendUser.manglai_company_id ??
        backendUser.companyId ??
        backendUser.company_id ??
        null,
    };

    localStorage.setItem('forestblockToken', token);
    localStorage.setItem('forestblockUser', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setIsAuthenticated(true);

    const decoded: DecodedToken = jwtDecode(token);
    const expirationTime = decoded.exp * 1000 - Date.now();

    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    logoutTimeoutRef.current = setTimeout(() => logout(), expirationTime);

    if (redirectUrl) {
      router.push(redirectUrl);
      setRedirectUrl(null);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('forestblockToken');
    localStorage.removeItem('forestblockUser');
    localStorage.removeItem('project');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/marketplace');
    setMenuOpen(false);
  }, [router]);

  const verifySession = useCallback(() => {
    const token = localStorage.getItem('forestblockToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem('forestblockUser') || '{}') as User;

      setUser(savedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error decoding token:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        isLoading,
        setRedirectUrl,
        redirectUrl,
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";
// import { User } from "@/types/user";
// import { AuthContextType, DecodedToken } from "./types";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
//   const [menuOpen, setMenuOpen] = useState<boolean>(false);

//   const login = ({ token, user }: { token: string; user: User }) => {
//     localStorage.setItem("forestblockToken", token);
//     localStorage.setItem("forestblockUser", JSON.stringify(user));
//     setUser(user);
//     setIsAuthenticated(true);

//     const decoded: DecodedToken = jwtDecode(token);
//     const expirationTime = decoded.exp * 1000 - Date.now();

//     if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
//     logoutTimeoutRef.current = setTimeout(() => logout(), expirationTime);

//     if (redirectUrl) {
//       router.push(redirectUrl);
//       setRedirectUrl(null);
//     }
//   };

//   const logout = useCallback(() => {
//     localStorage.removeItem("forestblockToken");
//     localStorage.removeItem("forestblockUser");
//     localStorage.removeItem("project");
//     setUser(null);
//     setIsAuthenticated(false);
//     router.push("/marketplace");
//     setMenuOpen(false);
//   }, [router]);

//   const verifySession = useCallback(() => {
//     const token = localStorage.getItem("forestblockToken");
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       if (decoded.exp * 1000 < Date.now()) {
//         logout();
//         return;
//       }

//       const savedUser = JSON.parse(
//         localStorage.getItem("forestblockUser") || "{}"
//       );
//       setUser(savedUser);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       logout();
//     } finally {
//       setIsLoading(false);
//     }
//   }, [logout]);

//   useEffect(() => {
//     verifySession();
//   }, [verifySession]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         logout,
//         isAuthenticated,
//         isLoading,
//         setRedirectUrl,
//         redirectUrl,
//         menuOpen,
//         setMenuOpen,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
