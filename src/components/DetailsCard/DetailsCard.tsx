import React from 'react';
import Link from 'next/link';
import { DetailsCardProps } from './types';
import { formatNumber } from '@/utils/formatNumber';

const DetailsCard: React.FC<DetailsCardProps> = ({ listing }) => {
  // supply puede ser number/string según tu formatNumber, así que lo manejamos safe
  const supplyFormatted = formatNumber(listing?.supply ?? 0);

  const tokenSymbol = listing?.listing?.token?.symbol ?? listing?.carbonPool?.token?.symbol ?? '';

  const tokenAddress =
    listing?.listing?.token?.address ?? listing?.carbonPool?.token?.address ?? '';

  return (
    <div className="p-6 bg-white border-gray-200 rounded-xl max-w-lg flex flex-col gap-5">
      <h3 className="text-[23px] font-medium text-forestGreen font-aeonik">Detalles del activo</h3>

      <div>
        <p className="text-[17px] text-customGray font-neueMontreal">Token a retirar</p>
        <p className="text-forestGreen font-medium text-[17px] font-neueMontreal">
          {tokenSymbol || '-'}
        </p>
      </div>

      <div>
        <p className="text-[17px] text-customGray font-neueMontreal">Disponible para retirar</p>
        <p className="text-forestGreen font-medium font-neueMontreal text-[17px]">
          {String(supplyFormatted)} toneladas
        </p>
      </div>

      <div>
        {tokenAddress ? (
          <Link
            href={`https://polygonscan.com/token/${tokenAddress}`}
            passHref
            target="_blank"
            className="text-[12px] text-customGray underline font-neueMontreal"
          >
            Ver en PolygonScan
          </Link>
        ) : (
          <span className="text-[12px] text-customGray font-neueMontreal">
            Sin address disponible
          </span>
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
