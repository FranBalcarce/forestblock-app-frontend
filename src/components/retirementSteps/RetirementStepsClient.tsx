'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRetire } from '@/context/RetireContext';
import useRetirementSteps from '@/hooks/useRetirementSteps';
import ErrorMessage from '@/app/retirementSteps/ui/ErrorMessage';
import CompletedDetails from '@/app/retirementSteps/ui/CompletedDetails';
import TopBar from '@/components/TopBar/TopBar';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';

const RetirementStepsClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get('paymentId') || '';
  const sessionId = searchParams.get('session_id');

  const { setProject } = useRetire();

  const { orderDetails, error, executeFullProcess } = useRetirementSteps(paymentId, sessionId);

  /**
   * 🔹 Cargar proyecto desde localStorage
   */
  useEffect(() => {
    const storedProject = localStorage.getItem('project');
    if (storedProject) {
      setProject(JSON.parse(storedProject));
    }
  }, [setProject]);

  /**
   * 🔹 Ejecutar proceso final (retiro + certificados)
   *     El pago YA está confirmado a esta altura
   */
  useEffect(() => {
    if (!paymentId) return;
    executeFullProcess();
  }, [paymentId, executeFullProcess]);

  return (
    <div className="flex min-h-screen bg-white flex-col w-full py-5 px-5">
      <TopBar />

      {error ? (
        <div
          className="flex items-center justify-center flex-col gap-3"
          data-testid="error-message"
        >
          <p className="text-center text-customRed">{error}</p>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-mintGreen text-forestGreen font-semibold px-4 py-2 rounded-md"
          >
            IR AL MARKETPLACE
          </button>
        </div>
      ) : !paymentId ? (
        <ErrorMessage message="Error: Missing payment ID in the URL." />
      ) : orderDetails ? (
        <div className="bg-backgroundGray p-5 rounded-xl min-h-screen">
          <CompletedDetails details={orderDetails} />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <LoaderScreenDynamic />
        </div>
      )}
    </div>
  );
};

export default RetirementStepsClient;
