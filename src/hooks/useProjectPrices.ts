import { useEffect, useMemo, useState } from 'react';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/* =====================
   TYPES
===================== */

export type BackendPrice = {
  price: number;
  supply: number;
  creditId: {
    projectId: string;
    vintage?: number;
    standard?: string;
  };
};

/* =====================
   HOOK
===================== */

export function useProjectPrices(projectId?: string) {
  const [prices, setPrices] = useState<BackendPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchPrices = async () => {
      try {
        setLoading(true);

        const res = await axiosPublicInstance.get<unknown>(
          `/api/carbon/prices?projectIds=${projectId}&minSupply=1`
        );

        const data = Array.isArray(res.data) ? (res.data as BackendPrice[]) : [];

        setPrices(data);
      } catch (e) {
        console.error('Error fetching project prices', e);
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [projectId]);

  /* =====================
     DERIVED
  ===================== */

  const cheapestPrice = useMemo(() => {
    if (!prices.length) return null;
    return Math.min(...prices.map((p) => p.price));
  }, [prices]);

  return {
    prices,
    cheapestPrice,
    loading,
  };
}
