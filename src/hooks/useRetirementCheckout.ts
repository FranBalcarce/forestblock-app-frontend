'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import qs from 'qs';
import type { AxiosError } from 'axios';

import { useRetire } from '@/context/RetireContext';
import { useAuth } from '@/context/AuthContext';

import { PRICE_MULTIPLIER } from '@/constants';

import type { Price } from '@/types/marketplace';

import axiosInstance from '@/utils/axios/axiosInstance';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/* ------------------------------------------------------------------ */
/* helpers seguros                                                     */
/* ------------------------------------------------------------------ */

type UnknownRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is UnknownRecord => typeof v === 'object' && v !== null;

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (isRecord(payload) && Array.isArray(payload.items)) return payload.items as T[];
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

/* ------------------------------------------------------------------ */

export const useRetireCheckout = (index?: string | null) => {
  const searchParams = useSearchParams();

  const projectIds = searchParams.get('projectIds');
  const priceParam = searchParams.get('priceParam') ?? searchParams.get('price');
  const selectedVintage = searchParams.get('selectedVintage');

  const { user } = useAuth();
  const { tonnesToRetire, setTonnesToRetire, project, setProject, setTotalSupply } = useRetire();

  const [listing, setListing] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* FETCH LISTING + PROJECT                                             */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const fetchListing = async () => {
      if (!projectIds) {
        setError('Listing ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosPublicInstance.get<unknown>('/api/carbon/prices', {
          params: { projectIds },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
        });

        const prices = unwrapArray<Price>(response.data);

        const targetFinal = Number(priceParam);
        const targetRaw = targetFinal / PRICE_MULTIPLIER;
        const targetVintage = selectedVintage ? Number(selectedVintage) : null;

        const found =
          prices.find((p) => {
            const priceMatch = p.purchasePrice === targetRaw;

            if (targetVintage !== null) {
              const v = p.listing?.creditId?.vintage;
              return priceMatch && v === targetVintage;
            }

            return priceMatch;
          }) ?? (index ? prices[Number(index)] : null);

        if (!found) {
          setError('No se encontró un listing válido.');
          return;
        }

        setListing({
          ...found,
          purchasePrice: found.purchasePrice * PRICE_MULTIPLIER,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load listing data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProject = async () => {
      if (!projectIds) return;

      try {
        const response = await axiosPublicInstance.get('/api/carbon/carbonProjects', {
          params: { projectIds },
        });

        if (!response.data) return;

        setProject(response.data);
        setTotalSupply(response.data?.stats?.totalSupply ?? 0);
      } catch (err) {
        console.error('Error fetching project', err);
      }
    };

    fetchProject();
    fetchListing();
  }, [projectIds, index, priceParam, selectedVintage, setProject, setTotalSupply]);

  /* ------------------------------------------------------------------ */

  const calculateTotalCost = () => (listing ? tonnesToRetire * listing.purchasePrice : 0);

  const handleStripeCheckout = async (formData: object) => {
    const amount = calculateTotalCost();

    if (amount <= 0) return alert('Monto inválido');
    if (amount < 0.5) return alert('Mínimo 0.50 USD');

    try {
      const payment = await axiosInstance.post('payments/generate-payment', {
        amount,
        tonnesToRetire,
        userId: user?._id,
        type: 'stripe',
        formData,
      });

      const session = await axiosInstance.post('/payments/create-checkout-session', {
        pricePerUnit: listing?.purchasePrice,
        quantity: tonnesToRetire,
        paymentId: payment.data.paymentData.paymentId,
        name: listing?.listing?.id ?? listing?.listing?.creditId?.projectId,
      });

      if (session.data?.url) {
        window.location.href = session.data.url;
      }
    } catch (error) {
      const msg =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Error en pago';
      alert(msg);
    }
  };

  return {
    listing,
    tonnesToRetire,
    setTonnesToRetire,
    loading,
    error,
    calculateTotalCost,
    handleStripeCheckout,
    project,
  };
};
