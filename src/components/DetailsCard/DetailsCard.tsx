import React from 'react';
import Link from 'next/link';
import { DetailsCardProps } from './types';
import { formatNumber } from '@/utils/formatNumber';

const DetailsCard: React.FC<DetailsCardProps> = ({ listing }) => {
  const supply = formatNumber(listing?.supply || 0);

  const tokenSymbol =
    listing?.listing?.token?.symbol ?? listing?.carbonPool?.token?.symbol ?? 'N/A';

  const tokenAddress =
    listing?.listing?.token?.address ?? listing?.carbonPool?.token?.address ?? '';

  return (
    <div className="p-6 bg-white border-gray-200 rounded-xl max-w-lg flex flex-col gap-5">
      <h3 className="text-[23px] font-medium text-forestGreen font-aeonik">Detalles del activo</h3>

      <div>
        <p className="text-[17px] text-customGray font-neueMontreal">Token a retirar</p>
        <p className="text-forestGreen font-medium text-[17px] font-neueMontreal">{tokenSymbol}</p>
      </div>

      <div>
        <p className="text-[17px] text-customGray font-neueMontreal">Disponible para retirar</p>
        <p className="text-forestGreen font-medium font-neueMontreal text-[17px]">
          {typeof supply === 'number' ? formatNumber(supply) : supply} toneladas
        </p>
      </div>

      <div>
        <Link
          href={`https://polygonscan.com/token/${tokenAddress}`}
          target="_blank"
          className="text-[12px] text-customGray underline font-neueMontreal"
        >
          Ver en PolygonScan
        </Link>
      </div>
    </div>
  );
};

export default DetailsCard;
