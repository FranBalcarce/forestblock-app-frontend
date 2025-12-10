'use client';

import React from 'react';
import DataCard from '@/components/DataCard/DataCard';
import { useRetirementsSummary } from '@/hooks/useRetirementsSummary';

type DashboardSummaryProps = {
  totalEmissions: number;
  count: number;
  totalConsumptions?: number;
};

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalEmissions,
  count,
  totalConsumptions,
}) => {
  const { summary, loading, error } = useRetirementsSummary();

  if (loading) {
    return <div className="mb-10 text-sm text-gray-500">Cargando resumen de tus créditos...</div>;
  }

  if (error) {
    return <div className="mb-10 text-sm text-red-500">{error}</div>;
  }

  if (!summary) {
    return (
      <div className="mb-10 text-sm text-gray-500">
        Todavía no tenés retiros registrados. Cuando compres y retires créditos, vas a ver acá el
        resumen de tu impacto ✨
      </div>
    );
  }

  const totalTonnes = summary.totalTonnesRetired ?? 0;
  const totalOrders = summary.totalOrders ?? 0;

  const formattedDate = summary.lastRetirementDate
    ? new Date(summary.lastRetirementDate).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* 🔹 Props nuevas que vienen de page.tsx */}
      <DataCard
        title="Emisiones totales"
        value={totalEmissions.toFixed(2)}
        unit="t CO₂e"
        variant="primary"
      />

      <DataCard title="Cantidad" value={String(count)} />

      <DataCard title="Consumos totales" value={String(totalConsumptions ?? 0)} />

      {/* 🔹 Los datos originales del summary */}
      <DataCard
        title="Créditos compensados"
        value={totalTonnes.toFixed(2)}
        unit="t CO₂e"
        variant="primary"
      />

      <DataCard title="Órdenes de retiro" value={String(totalOrders)} unit="" />

      <DataCard title="Último retiro" value={formattedDate} unit="" />
    </div>
  );
};

export default DashboardSummary;

// import React from "react";
// import DataCard from "@/components/DataCard/DataCard";

// interface DashboardSummaryProps {
//   totalEmissions: number;
//   count: number;
//   totalConsumptions: number | undefined;
// }

// const DashboardSummary: React.FC<DashboardSummaryProps> = ({
//   totalEmissions,
//   count,
//   totalConsumptions,
// }) => (
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//     <DataCard
//       title="Emisiones totales"
//       value={totalEmissions.toFixed(2)}
//       unit="t CO₂e"
//       variant="primary"
//     />
//     <DataCard
//       title="Emisiones por empleado"
//       value={(totalEmissions / count).toFixed(2)}
//       unit="t CO₂e"
//     />
//     <DataCard
//       title="Total de consumos"
//       value={totalConsumptions?.toFixed(2)}
//       unit="kWh"
//     />
//   </div>
// );

// export default DashboardSummary;
