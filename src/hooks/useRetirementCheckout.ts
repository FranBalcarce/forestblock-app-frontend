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

/** Helpers para soportar payloads tipo: [] | {items: []} | {data: []} */
type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord => typeof v === 'object' && v !== null;

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (isRecord(payload) && Array.isArray(payload.items)) return payload.items as T[];
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

export const useRetireCheckout = (index?: string | null) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // En tu app esto a veces viene como "priceParam" y otras como "price"
  const projectIds = searchParams.get('projectIds');
  const priceParam = searchParams.get('priceParam') ?? searchParams.get('price');
  const selectedVintage = searchParams.get('selectedVintage');

  const { user } = useAuth();

  const { tonnesToRetire, setTonnesToRetire, project, setProject, setTotalSupply } = useRetire();

  const [listing, setListing] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [monitoring, setMonitoring] = useState<boolean>(false);
  const [amountReceived, setAmountReceived] = useState<number>(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!projectIds) {
        setError('Listing ID is missing.');
        setLoading(false);
        return;
      }

      try {
        // ✅ Traemos prices (v18) — puede venir array directo o envuelto
        const response = await axiosPublicInstance.get<unknown>('/carbon/prices', {
          params: { projectIds },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
        });

        const allPrices = unwrapArray<Price>(response);

        // Tu UI suele mandar el precio con markup ya aplicado.
        // Entonces comparamos contra RAW (dividiendo por el multiplicador).
        const targetFinal = Number(priceParam);
        const targetRaw = Number.isFinite(targetFinal) ? targetFinal / PRICE_MULTIPLIER : NaN;

        const targetVintage =
          selectedVintage !== undefined && selectedVintage !== null
            ? Number(selectedVintage)
            : null;

        const matches = (item: Price) => {
          const raw =
            typeof item.purchasePrice === 'number' ? item.purchasePrice : item.baseUnitPrice;

          const matchesPrice = Number.isFinite(targetRaw) ? raw === targetRaw : false;

          if (targetVintage !== null && Number.isFinite(targetVintage)) {
            const v = item.listing?.creditId?.vintage ?? item.carbonPool?.creditId?.vintage ?? null;

            return matchesPrice && v === targetVintage;
          }

          return matchesPrice;
        };

        let listingData = allPrices.find(matches);

        // fallback: si no matchea por precio, usá el índice que llega por query
        if (!listingData && index != null) {
          const idx = Number(index);
          if (Number.isFinite(idx) && allPrices[idx]) listingData = allPrices[idx];
        }

        if (listingData) {
          // Guardamos el precio FINAL (con markup) para que calculateTotalCost funcione
          const raw =
            typeof listingData.purchasePrice === 'number'
              ? listingData.purchasePrice
              : listingData.baseUnitPrice;

          const updatedListing: Price = {
            ...listingData,
            purchasePrice: raw * PRICE_MULTIPLIER,
          };

          setListing(updatedListing);
        } else {
          setListing(null);
          setError('No se encontró un precio/listing válido para este proyecto.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load listing data. Please try again. ' + String(err));
      } finally {
        setLoading(false);
      }
    };

    const fetchProject = async () => {
      try {
        if (!projectIds) return;

        // cache local
        if (typeof window !== 'undefined') {
          const storedProject = localStorage.getItem('project');
          if (storedProject) setProject(JSON.parse(storedProject));
        }

        const response = await axiosPublicInstance.get(`/carbon/carbonProjects/${projectIds}`);
        const data = (response as any)?.data ?? response;

        setTotalSupply(data?.stats?.totalSupply);
        setProject(data);

        if (typeof window !== 'undefined') {
          const projectToStore = {
            ...data,
            selectedVintage: selectedVintage ?? '0',
          };
          localStorage.setItem('project', JSON.stringify(projectToStore));
        }
      } catch (e) {
        console.error('Error fetching project details:', e);
      }
    };

    fetchProject();
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIds, index, priceParam, selectedVintage]);

  const changePaymentStatus = async (
    paymentId: string,
    status: string,
    stripeSessionId: string
  ): Promise<boolean> => {
    try {
      const updatePaymentStatus = await axiosInstance.put('payments/change-payment-status', {
        paymentId,
        status,
        stripeSessionId,
      });

      if (updatePaymentStatus?.data.status === 'CONFIRMED') return true;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const calculateTotalCost = () =>
    listing?.purchasePrice ? tonnesToRetire * listing.purchasePrice : 0;

  const handleStripeCheckout = async (formData: object) => {
    const amount = calculateTotalCost();

    if (amount <= 0) {
      alert('Please enter a valid number of tonnes to retire.');
      return;
    }

    if (amount < 0.5) {
      alert('El importe total debe ser de al menos 0,50 USD');
      return;
    }

    try {
      const paymentResponse = await axiosInstance.post('payments/generate-payment', {
        amount: calculateTotalCost(),
        tonnesToRetire,
        userId: user?._id,
        type: 'stripe',
        formData,
      });

      const response = await axiosInstance.post('/payments/create-checkout-session', {
        pricePerUnit: listing?.purchasePrice,
        quantity: tonnesToRetire,
        paymentId: paymentResponse?.data.paymentData.paymentId,
        name: listing?.listing ? listing.listing.id : listing?.carbonPool?.creditId?.projectId,
      });

      if (typeof window !== 'undefined' && response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.log('Error creating Stripe Checkout session:', response);
      }
    } catch (error) {
      console.log('Error creating Stripe Checkout session: ', error);
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        (error as Error).message ||
        'Ocurrió un error';
      alert(errorMessage);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    selectedPayment: string | null,
    formData: { beneficiary: string; message: string }
  ) => {
    e.preventDefault();

    if (selectedPayment === null) {
      alert('Debes seleccionar un medio de pago :)');
      return;
    }

    if (tonnesToRetire <= 0 || tonnesToRetire > (listing?.supply ?? 0)) {
      setError('Please enter a valid number of tonnes to retire.');
      return;
    }

    if (selectedPayment === 'usdt') {
      try {
        const response = await axiosInstance.post('payments/generate-payment', {
          amount: calculateTotalCost(),
          listingId: listing?.listing?.id, // en v18: si existe listing.id
          tonnesToRetire,
          userId: user?._id,
          type: 'usdt',
        });

        const orderData = {
          paymentData: response.data,
          beneficiaryName: formData?.beneficiary,
          retirementMessage: formData?.message,
        };

        setPaymentDetails(response.data);
        setFormSubmitted(true);
        setMonitoring(true);

        localStorage.setItem('pendingPayment', JSON.stringify(orderData));

        setError(null);
      } catch (err) {
        setError('Failed to create payment. Please try again. ' + String(err));
      }
    } else if (selectedPayment === 'credit-card') {
      handleStripeCheckout(formData);
    }
  };

  useEffect(() => {
    if (!monitoring) return;

    const startTime = Date.now();
    const interval = setInterval(async () => {
      try {
        if (!paymentDetails?.paymentData?.paymentId) {
          clearInterval(interval);
          setMonitoring(false);
          alert('Error: Missing payment ID. Please try again.');
          return;
        }

        const response = await axiosInstance.get(`payments/check-payment-status`, {
          params: { paymentId: paymentDetails.paymentData.paymentId },
        });

        const { status, amountReceived } = response.data;

        setPaymentStatus(status);
        setAmountReceived(amountReceived);

        if (['CONFIRMED', 'FAILED'].includes(status)) {
          clearInterval(interval);
          setMonitoring(false);

          if (status === 'CONFIRMED') {
            router.push(
              `/retirementSteps?paymentId=${paymentDetails.paymentData.paymentId}&selectedVintage=${selectedVintage}`
            );
          } else {
            alert('Payment failed. Please try again.');
          }
        } else if (Date.now() - startTime >= MAX_MONITORING_TIME) {
          clearInterval(interval);
          setMonitoring(false);
          alert('Monitoring timed out. Payment status not confirmed.');
        }
      } catch {
        clearInterval(interval);
        setMonitoring(false);
        alert('Error monitoring payment status. Please try again.');
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [monitoring, paymentDetails, router, selectedVintage]);

  useEffect(() => {
    const storedPayment = localStorage.getItem('pendingPayment');
    if (storedPayment) {
      const parsedPayment = JSON.parse(storedPayment);
      setPaymentDetails(parsedPayment.paymentData);
      setFormSubmitted(true);
      setMonitoring(true);
    }
  }, []);

  return {
    listing,
    tonnesToRetire,
    setTonnesToRetire,
    loading,
    error,
    handleSubmit,
    formSubmitted,
    paymentDetails,
    paymentStatus,
    calculateTotalCost,
    amountReceived,
    changePaymentStatus,
    project,
  };
};
