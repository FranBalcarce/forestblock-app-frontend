'use client';

import React, { useState } from 'react';
import useRetirements from '@/hooks/useRetirements';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar/TopBar';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';
import { useAuth } from '@/context/AuthContext';
import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';

const Table: React.FC<{
  headers: string[];
  children: React.ReactNode;
  className?: string;
}> = ({ headers, children, className }) => (
  <div className={`rounded-xl overflow-hidden ${className}`}>
    <div className="bg-forestGreen text-white p-4 grid grid-cols-1 md:grid-cols-3 font-aeonik font-medium">
      <span className="text-left">{headers[0]}</span>
      <span className="md:text-right text-left">{headers[1]}</span>
      <span className="md:text-right text-left">{headers[2]}</span>
    </div>
    <ul className="bg-white">{children}</ul>
  </div>
);

const RetirementsClient: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { retirements, loading } = useRetirements();
  const [showAll, setShowAll] = useState(false);

  const sortedRetirements = retirements
    ? [...retirements].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const visibleRetirements = showAll ? sortedRetirements : sortedRetirements?.slice(0, 2);

  const totalAmount =
    retirements?.reduce((acc, r) => acc + r.order?.quote?.quantity_tonnes, 0) || 0;

  if (loading) return <LoaderScreenDynamic />;

  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />

      <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl">
        <h1 className="text-[28px] md:text-[40px] font-aeonik font-bold text-forestGreen">
          Retiros de carbono
        </h1>
        <h2 className="text-[16px] md:text-[20px] text-forestGreen font-aeonik">
          para el beneficiario <span className="text-sageGreen underline">{user?.email}</span>
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="md:col-span-2">
            <Table headers={['Proyecto', 'Cantidad', 'Fecha']}>
              {visibleRetirements?.map((retirement, i) => (
                <li
                  key={i}
                  className="p-5 hover:bg-gray-100 cursor-pointer grid grid-cols-1 md:grid-cols-3 font-medium font-aeonik border-b border-gray-200 last:border-b-0 text-[16px] md:text-[19px]"
                  onClick={() => router.push(`/retirements/${retirement._id}`)}
                >
                  <span className="text-forestGreen md:w-[50%]">
                    {retirement.project.name || 'Sin nombre'}
                  </span>
                  <span className="md:text-right text-left">
                    {retirement?.order?.quote?.quantity_tonnes?.toFixed(2)}t
                  </span>
                  <span className="md:text-right text-left">
                    {new Date(retirement.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </li>
              ))}
            </Table>

            {retirements?.length > 2 && (
              <button
                className="mt-6 text-sageGreen flex items-center p-5 text-[16px] md:text-[18px] font-aeonik font-medium"
                onClick={() => setShowAll(!showAll)}
              >
                <LiaExternalLinkAltSolid className="mr-2" />
                {showAll ? 'VER MENOS' : 'VER TODOS LOS RETIROS'}
              </button>
            )}
          </div>

          <div className="w-full">
            <Table headers={['Resumen de retiros', '', '']}>
              <li className="py-5 px-5 grid grid-cols-1 xl:grid-cols-2 border-b border-gray-200 last:border-b-0">
                <span className="font-aeonik text-customGray text-[16px] md:text-[19px]">
                  Total de toneladas de carbono retiradas:
                </span>
                <span className="text-sageGreen xl:text-right text-center text-[28px] md:text-[33px] font-neueMontreal font-medium">
                  {totalAmount?.toFixed(2)}t
                </span>
              </li>
              <li className="py-5 px-5 grid grid-cols-1 xl:grid-cols-2 border-b border-gray-200 last:border-b-0">
                <span className="font-aeonik text-customGray text-[16px] md:text-[19px]">
                  Total de transacciones de retiro:
                </span>
                <span className="text-sageGreen xl:text-right text-center text-[28px] md:text-[33px] font-neueMontreal font-medium">
                  {retirements?.length || 0}
                </span>
              </li>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementsClient;
