import React from 'react';
import { Stats } from '@/types/project';
import InfoTooltip from './InfoTooltip';

const StatsCard = ({ stats }: { stats: Stats }) => {
  const totalSupply = stats.totalSupply ?? 0;
  const availableSupply = stats.availableTonnes ?? 0;

  const retiredCredits = Math.max(totalSupply - availableSupply, 0);
  const progressPercentage = totalSupply > 0 ? (retiredCredits / totalSupply) * 100 : 0;

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg">
      <h3 className="text-[14px] sm:text-[18px] md:text-[23px] font-aeonik font-medium mb-3">
        Datos sobre este proyecto
      </h3>

      {/* Barra de progreso */}
      <div className="relative h-1 bg-mintGreen rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-forestGreen transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Créditos retirados */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-forestGreen" />
          <InfoTooltip
            text="Créditos Retirados:"
            tooltipText="Cantidad de los créditos de este activo que se han retirado."
          />
          <span className="ml-auto text-[14px] sm:text-[16px] md:text-[23px] font-aeonik font-medium">
            {retiredCredits.toFixed(0)}
          </span>
        </div>

        {/* Suministro restante */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-mintGreen" />
          <InfoTooltip
            text="Suministro Restante:"
            tooltipText="Cantidad de los créditos de este activo que aún están disponibles."
          />
          <span className="ml-auto text-[14px] sm:text-[16px] md:text-[23px] font-aeonik font-medium">
            {availableSupply.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
