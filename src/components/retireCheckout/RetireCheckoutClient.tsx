'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRetireCheckout } from '@/hooks/useRetirementCheckout';
import RetireForm from '@/components/RetirementForm/RetirementForm';
import TopBar from '@/components/TopBar/TopBar';
import PriceCard from '@/components/PriceCard/page';
import { useRetire } from '@/context/RetireContext';
import DetailsCard from '@/components/DetailsCard/DetailsCard';
import CheckoutHeader from '@/components/CheckoutHeader/CheckoutHeader';
import Instructions from '@/app/retireCheckout/ui/Instructions';
import PaymentStatus from '@/app/retireCheckout/ui/PaymentStatus';
import PaymentDetailsSection from '@/app/retireCheckout/ui/PaymentDetailsSection';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';

const RetireCheckoutClient: React.FC = () => {
  // 👇 mantenemos el estado porque lo usa el form
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const methodologyName = searchParams.get('methodologyName') || 'Sin metodología';
  const index = searchParams.get('index');
  const selectedVintage = searchParams.get('selectedVintage');

  const {
    listing,
    loading,
    error,
    handleSubmit,
    formSubmitted,
    paymentDetails,
    paymentStatus,
    calculateTotalCost,
    amountReceived,
    project,
  } = useRetireCheckout(index);

  const router = useRouter();
  const { tonnesToRetire, setTonnesToRetire, setBeneficiary, setMessage } = useRetire();

  useEffect(() => {
    localStorage.setItem('selectedVintage', selectedVintage ?? '0');
  }, [selectedVintage]);

  if (loading) return <LoaderScreenDynamic />;
  if (error) return <p className="text-red-500">{error}</p>;

  const onGoBack = () => {
    router.back();
  };

  const handleFormSubmit = (
    e: React.FormEvent,
    selectedPayment: string | null,
    formData: { beneficiary: string; message: string }
  ) => {
    e.preventDefault();

    // 👇 acá SÍ usamos paymentMethod para que ESLint no se queje
    const methodToUse = selectedPayment ?? paymentMethod;

    setBeneficiary(formData.beneficiary);
    setMessage(formData.message);
    handleSubmit(e, methodToUse, formData);
  };

  return (
    <div className="p-3 md:p-5 flex flex-col min-h-screen">
      <TopBar />
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 p-5 bg-backgroundGray rounded-3xl">
        <div className="bg-white rounded-3xl">
          {!paymentDetails ? (
            <CheckoutHeader
              onGoBack={onGoBack}
              methodologyName={methodologyName}
              project={project}
            />
          ) : (
            <PaymentDetailsSection
              listing={listing}
              paymentDetails={paymentDetails}
              paymentStatus={paymentStatus}
              amountReceived={amountReceived}
              methodologyName={methodologyName}
              project={project}
              index={index}
            />
          )}

          <div className="flex flex-col p-5 gap-5 mt-5">
            {!paymentDetails && <Instructions />}
            {!formSubmitted && (
              <RetireForm handleSubmit={handleFormSubmit} setPaymentMethod={setPaymentMethod} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {!formSubmitted && !paymentDetails && (
            <div className="flex flex-col gap-5">
              <PriceCard
                listing={listing}
                tonnesToRetire={tonnesToRetire}
                setTonnesToRetire={setTonnesToRetire}
                totalCost={calculateTotalCost()}
              />
              <DetailsCard listing={listing} />
            </div>
          )}

          {formSubmitted && paymentDetails && (
            <div className="flex flex-col gap-5">
              <PriceCard
                listing={listing}
                tonnesToRetire={tonnesToRetire}
                setTonnesToRetire={setTonnesToRetire}
                totalCost={calculateTotalCost()}
                disabled
              />
              <div className="p-6 bg-white rounded-xl max-w-lg flex flex-col gap-5">
                <h4 className="text-[23px] font-medium text-forestGreen font-aeonik">
                  Información de pago
                </h4>
                <PaymentStatus paymentStatus={paymentStatus} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetireCheckoutClient;
