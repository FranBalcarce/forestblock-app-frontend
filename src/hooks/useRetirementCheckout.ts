'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import qs from 'qs';
import type { AxiosError } from 'axios';

import { useRetire } from '@/context/RetireContext';
import { useAuth } from '@/context/AuthContext';

import { MAX_MONITORING_TIME, POLLING_INTERVAL, PRICE_MULTIPLIER } from '@/constants';

import type { Price } from '@/types/marketplace';
import type { PaymentDetails } from '@/types/retirement';

import axiosInstance from '@/utils/axios/axiosInstance';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

/* ------------------------------------------------------------------ */
/* helpers seguros (NO any)                                            */
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectIds = searchParams.get('projectIds');
  const priceParam = searchParams.get('priceParam') ?? searchParams.get('price');
  const selectedVintage = searchParams.get('selectedVintage');

  const { user } = useAuth();
  const { tonnesToRetire, setTonnesToRetire, project, setProject, setTotalSupply } = useRetire();

  const [listing, setListing] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [monitoring, setMonitoring] = useState(false);
  const [amountReceived, setAmountReceived] = useState(0);

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
        const response = await axiosPublicInstance.get<unknown>('/carbon/prices', {
          params: { projectIds },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
        });

        const prices = unwrapArray<Price>(response);

        const targetFinal = Number(priceParam);
        const targetRaw = targetFinal / PRICE_MULTIPLIER;
        const targetVintage = selectedVintage ? Number(selectedVintage) : null;

        const listingFound =
          prices.find((p) => {
            const raw = typeof p.purchasePrice === 'number' ? p.purchasePrice : p.baseUnitPrice;

            const priceMatch = raw === targetRaw;

            if (targetVintage !== null) {
              const v = p.listing?.creditId?.vintage ?? p.carbonPool?.creditId?.vintage;
              return priceMatch && v === targetVintage;
            }

            return priceMatch;
          }) ?? (index !== null && index !== undefined ? prices[Number(index)] : null);

        if (!listingFound) {
          setError('No se encontró un listing válido.');
          setListing(null);
          return;
        }

        setListing({
          ...listingFound,
          purchasePrice:
            (listingFound.purchasePrice ?? listingFound.baseUnitPrice) * PRICE_MULTIPLIER,
        });
      } catch (err) {
        setError('Failed to load listing data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProject = async () => {
      if (!projectIds) return;

      try {
        const response = await axiosPublicInstance.get<unknown>(
          `/carbon/carbonProjects/${projectIds}`
        );

        if (!isRecord(response)) return;

        const data = response.data;
        if (!isRecord(data)) return;

        setTotalSupply(isRecord(data.stats) ? (data.stats.totalSupply as number) : 0);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project', err);
      }
    };

    fetchProject();
    fetchListing();
  }, [projectIds, index, priceParam, selectedVintage, setProject, setTotalSupply]);

  /* ------------------------------------------------------------------ */
  /* PAYMENTS                                                           */
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
        name: listing?.listing?.id ?? listing?.carbonPool?.creditId?.projectId,
      });

      if (session.data?.url) window.location.href = session.data.url;
    } catch (error) {
      const msg =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Error en pago';
      alert(msg);
    }
  };

  /* ------------------------------------------------------------------ */

  return {
    listing,
    tonnesToRetire,
    setTonnesToRetire,
    loading,
    error,
    handleStripeCheckout,
    formSubmitted,
    paymentDetails,
    paymentStatus,
    calculateTotalCost,
    amountReceived,
    project,
  };
};
