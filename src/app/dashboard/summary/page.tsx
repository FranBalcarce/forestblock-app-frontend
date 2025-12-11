'use client';

import React from 'react';
import Link from 'next/link';
import DataCard from '@/components/DataCard/DataCard';
import { useRetirementsSummary } from '@/hooks/useRetirementsSummary';

const DashboardSummaryPage: React.FC = () => {
  const { summary, loading, error } = useRetirementsSummary();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center">
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-gray-100 bg-white/60 p-6 text-sm text-gray-500 shadow-sm">
          Cargando el resumen de tu impacto...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center">
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-red-100 bg-red-50/80 p-6 text-sm text-red-600 shadow-sm">
          Ocurrió un error al cargar tu resumen. Por favor volvé a intentar en unos minutos.
        </div>
      </div>
    );
  }

  // ---- EMPTY STATE ----
  if (!summary) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center">
        <div className="w-full max-w-5xl mx-auto rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-600">
              Resumen de impacto
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-forestGreen">
              Todavía no tenés retiros registrados
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl">
              Cuando compres y retires créditos de carbono, vas a ver acá el resumen de tu impacto:
              toneladas compensadas, órdenes de retiro y la fecha de tu último movimiento.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center rounded-full bg-mintGreen px-6 py-3 text-sm font-medium text-forestGreen shadow-sm hover:shadow-md transition-shadow"
          >
            Ir al marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ---- SUMMARY CON DATOS ----
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
    <div className="min-h-[calc(100vh-120px)] flex items-center">
      <section className="w-full max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-600">
              Resumen de impacto
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-forestGreen">
              Tu impacto climático en un vistazo
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Acá podés ver cuántas toneladas de CO₂e compensaste, cuántas órdenes de retiro
              generaste y cuándo fue tu último retiro.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Datos actualizados automáticamente
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            title="Créditos compensados"
            value={totalTonnes.toFixed(2)}
            unit="t CO₂e"
            variant="primary"
          />

          <DataCard title="Órdenes de retiro" value={String(totalOrders)} unit="" />

          <DataCard title="Último retiro" value={formattedDate} unit="" />
        </div>
      </section>
    </div>
  );
};

export default DashboardSummaryPage;

// 'use client';

// import React from 'react';
// import { useAuth } from '@/context/AuthContext';
// import LoaderScreenDynamic from '@/components/LoaderScreen/LoaderScreenDynamic';
// import TopBar from '@/components/TopBar/TopBar';
// import UserAlerts from '@/components/UserAlerts/UserAlerts';
// import DashboardSummary from '@/components/DashboardSummary/DashboardSummary';
// import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
// import Evolution from '@/components/Evolution/Evolution';
// import DashboardTabs from '@/components/DashboardTabs/DashboardTabs';
// import ScopeTab from '@/components/ScopeTab/ScopeTab';
// import TabContent from '@/components/DashboardTabs/TabContent';

// import { useDashboardData } from '@/hooks/useDashboardData';
// import { useBuildings } from '@/hooks/useBuildings';
// import useCategories from '@/hooks/useCategories';
// import useEmployees from '@/hooks/useEmployees';
// import { useScopeData } from '@/hooks/useScopeData';
// import { useDashboardTransformations } from '@/hooks/useDashboardTransformations';
// import useDashboardConfig from '@/hooks/useDashboardConfig';

// import { TabType } from '@/components/DashboardTabs/types';
// import DataError from '@/components/DataError/DataError';
// import { CHART_COLORS } from '@/constants';
// import { usePersistedYear } from '@/hooks/usePersistedYear';
// import { useKlimapiResults } from '@/hooks/useKlimapiResults';
// import KlimapiResults from '@/components/KlimapiResults/KlimapiResults';

// const DashboardPage: React.FC = () => {
//   const { user, isLoading } = useAuth();

//   const { results } = useKlimapiResults();

//   const { availableYears, selectedYear, handleYearChange, startDate, endDate } =
//     usePersistedYear(10);

//   const [activeTab, setActiveTab] = React.useState<TabType>('alcance');

//   const { categories: dynamicCategories, error: catError } = useCategories();
//   const {
//     data: buildings,
//     error: buildingError,
//     isLoading: buildingsLoading,
//   } = useBuildings(user?.manglaiCompanyId);
//   const { employees } = useEmployees(user?.manglaiCompanyId);

//   const {
//     data,
//     error,
//     isLoading: dataLoading,
//   } = useDashboardData(user?.manglaiCompanyId, startDate, endDate);

//   const monthlyRawData = data?.emissions?.emissions?.monthly ?? {};
//   const dashboardCategories = data?.emissions?.emissions?.category ?? {};
//   const scopes = data?.emissions?.emissions?.scope ?? {};

//   const totalEmissions: number = data?.emissions?.emissions?.total?.emissions || 0;
//   const count: number = employees?.length || 0;

//   const scopeData = useScopeData({
//     monthlyRawData,
//     dashboardCategories,
//     scopes,
//     selectedYear,
//   });

//   const transformations = useDashboardTransformations({
//     monthlyRawData,
//     dashboardCategories,
//     scopes,
//     dynamicCategories,
//     buildings,
//     selectedYear,
//     scopeData,
//   });

//   const { dataForTab, extraPropsForTab, currentScopeChartData } = useDashboardConfig(
//     activeTab,
//     transformations
//   );

//   if (isLoading || !user || dataLoading || buildingsLoading) {
//     return <LoaderScreenDynamic />;
//   }

//   if (error) return <DataError message={error} />;
//   if (catError) return <DataError message={catError} />;
//   if (buildingError) return <DataError message={buildingError} />;

//   return (
//     <div className="min-h-screen p-3">
//       <TopBar />
//       <UserAlerts />
//       {user?.manglaiCompanyId && (
//         <div className="flex-1 p-5 md:p-10 bg-backgroundGray rounded-xl">
//           <DashboardHeader
//             title="Resumen"
//             availableYears={availableYears}
//             selectedYear={selectedYear}
//             onYearChange={handleYearChange}
//           />

//           <DashboardSummary
//             totalEmissions={totalEmissions}
//             count={count}
//             totalConsumptions={data?.consumptions?.totalEmissions}
//           />

//           <Evolution yearComparisonData={scopeData.yearComparisonData} />

//           <h2 className="font-aeonik font-medium text-[15px] md:text-[23px] text-forestGreen mb-5">
//             Emisiones por {activeTab}
//           </h2>
//           <DashboardTabs
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             currentScopeChartData={currentScopeChartData}
//             hasScopeChartData={transformations.hasMonthlyDataAlcance}
//             monthlyDataAlcance={transformations.monthlyDataAlcance}
//             monthlyChartComponent={
//               <TabContent activeTab={activeTab} data={dataForTab} extraProps={extraPropsForTab} />
//             }
//             COLORS={CHART_COLORS[activeTab]}
//             hasMonthlyData={transformations.hasMonthlyDataAlcance}
//           />

//           <ScopeTab
//             scopes={scopes}
//             dashboardCategories={dashboardCategories}
//             totalEmissions={totalEmissions}
//           />
//           <h2 className="font-aeonik font-medium text-[15px] md:text-[23px] text-forestGreen mb-5">
//             Toneladas de CO₂e a compensar
//           </h2>
//           <KlimapiResults results={results} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;
