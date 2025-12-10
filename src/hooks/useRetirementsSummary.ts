'use client';

import { useEffect, useState } from 'react';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';
import { useAuth } from '@/context/AuthContext';

type RetirementsSummary = {
  totalTonnesRetired: number;
  totalOrders: number;
  lastRetirementDate: string | null;
};

export const useRetirementsSummary = () => {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<RetirementsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!isAuthenticated || !user?.walletAddress) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axiosPublicInstance.get<RetirementsSummary>('/retirements/summary', {
          params: { walletAddress: user.walletAddress },
        });

        setSummary(response.data);
      } catch (err) {
        console.error('Error fetching retirements summary:', err);
        setError('No se pudo cargar el resumen');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isAuthenticated, user?.walletAddress]);

  return { summary, loading, error };
};
