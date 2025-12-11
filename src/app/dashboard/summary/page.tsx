'use client';

import React from 'react';
import DataCard from '@/components/DataCard/DataCard';
import { useRetirementsSummary } from '@/hooks/useRetirementsSummary';

const DashboardSummary: React.FC = () => {
  const { summary, loading, error } = useRetirementsSummary();

  // ---------------------------
  // Loading / error
  // ---------------------------
  if (loading) {
    return (
      <div className="w-full flex justify-center mt-12 text-sm text-gray-500">
        Cargando resumen...
      </div>
    );
  }

  if (error) {
    return <div className="w-full flex justify-center mt-12 text-sm text-red-500">{error}</div>;
  }

  // ---------------------------
  // Datos seguros
  // ---------------------------
  const totalTonnes = summary?.totalTonnesRetired ?? 0;
  const totalOrders = summary?.totalOrders ?? 0;

  const formattedDate = summary?.lastRetirementDate
    ? new Date(summary.lastRetirementDate).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—';

  // Para el mini-gráfico (evitamos división por 0)
  const maxValue = Math.max(totalTonnes, totalOrders, 1);
  const tonnesHeight = (totalTonnes / maxValue) * 100;
  const ordersHeight = (totalOrders / maxValue) * 100;

  return (
    <div className="w-full px-4 md:px-10 mt-12 mb-10 flex justify-center">
      {/* CONTENEDOR GRANDE FLOTANTE */}
      <div className="bg-emerald-50/80 backdrop-blur-md shadow-lg rounded-3xl p-8 md:p-12 border border-emerald-100 max-w-6xl w-full">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            Resumen de impacto
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold text-forestGreen mt-2">
            Tu impacto climático en un vistazo
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
            Acá podés ver cuántas toneladas de CO₂e compensaste, cuántas órdenes de retiro generaste
            y cuándo fue tu último retiro.
          </p>
        </div>

        {/* CARDS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <DataCard
            title="Créditos compensados"
            value={totalTonnes.toFixed(2)}
            unit="t CO₂e"
            variant="primary"
          />

          <DataCard title="Órdenes de retiro" value={String(totalOrders)} />

          <DataCard title="Último retiro" value={formattedDate} />
        </div>

        {/* MINI GRÁFICO + TEXTO EXPLICATIVO */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Gráfico de barras simple */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-forestGreen mb-3">Comparación rápida</h3>
            <div className="h-40 rounded-2xl bg-white/80 border border-emerald-100 px-6 pb-4 pt-6 flex items-end gap-8 shadow-sm">
              {/* Eje Y (línea tenue) */}
              <div className="absolute h-40 -mt-6 border-l border-gray-100" />

              {/* Barra Créditos */}
              <div className="flex flex-col items-center justify-end gap-2 flex-1">
                <div
                  className="w-10 rounded-t-2xl bg-emerald-500/90 shadow-md transition-all"
                  style={{ height: `${Math.max(tonnesHeight, 8)}%` }} // mínimo 8% para que se vea algo
                />
                <span className="text-xs font-medium text-forestGreen">Créditos</span>
                <span className="text-[11px] text-gray-500">{totalTonnes.toFixed(2)} t CO₂e</span>
              </div>

              {/* Barra Órdenes */}
              <div className="flex flex-col items-center justify-end gap-2 flex-1">
                <div
                  className="w-10 rounded-t-2xl bg-emerald-300 shadow-md transition-all"
                  style={{ height: `${Math.max(ordersHeight, 8)}%` }}
                />
                <span className="text-xs font-medium text-forestGreen">Órdenes</span>
                <span className="text-[11px] text-gray-500">{totalOrders}</span>
              </div>
            </div>
          </div>

          {/* Texto al lado del gráfico */}
          <div className="text-sm text-gray-700">
            <p className="font-medium text-forestGreen mb-2">Cómo leer este gráfico</p>
            <p className="mb-2">
              Cada barra representa el total de créditos compensados y la cantidad de órdenes de
              retiro generadas. Cuando empieces a compensar tu huella, vas a ver cómo estas barras
              crecen con tu impacto positivo.
            </p>
            <p className="text-xs text-gray-500">
              Este gráfico es un resumen visual rápido; los valores exactos siempre están
              disponibles en las tarjetas de arriba.
            </p>
          </div>
        </div>

        {/* INDICADOR DE ACTUALIZACIÓN */}
        <div className="flex justify-end mt-8">
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Datos actualizados automáticamente
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;

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
