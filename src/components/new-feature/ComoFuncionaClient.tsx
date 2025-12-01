'use client';

import { useRouter } from 'next/navigation';
import HeroBanner from '@/components/HeroBanner/HeroBanner';

const ComoFuncionaClient: React.FC = () => {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Flecha de volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-forestGreen hover:text-forestGreen/70 mb-4 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-left"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver
      </button>

      {/* Hero */}
      <HeroBanner
        title={
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mintGreen">
              Nuevos proyectos
            </span>
            <h1 className="text-[26px] md:text-[40px] font-bold font-aeonik leading-tight">
              Proyectos en Desarrollo
              <br />
              <span className="text-mintGreen">Oportunidades de Inversión Temprana en Carbono</span>
            </h1>
          </div>
        }
        showSearchbar={false}
      >
        <p className="max-w-xl text-sm md:text-base text-white/80">
          Entendé los modelos de comercialización disponibles para invertir en proyectos de carbono
          antes de su emisión oficial y elegí el que mejor encaja con tu perfil de riesgo.
        </p>
      </HeroBanner>

      {/* Intro */}
      <section className="mt-10 space-y-4 bg-gradient-to-br from-mintGreen/5 via-white to-sageGreen/5 rounded-3xl p-5 md:p-6 border border-black/5">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-mintGreen" />
          Cómo funciona esta fase de inversión
        </h2>
        <p className="leading-relaxed text-black/80">
          Los proyectos en desarrollo permiten entrar temprano en iniciativas de carbono con alto
          potencial de impacto. Según tu estrategia climática y financiera, podés estructurar el
          acuerdo como compra futura de créditos, participación en flujos o equity.
        </p>
        <p className="leading-relaxed text-black/80">
          Abajo vas a encontrar los principales <strong>modelos de comercialización</strong> que
          usamos en Forestblock, con una explicación simple, para quién es cada uno y qué tipo de
          oportunidades abre.
        </p>
      </section>

      {/* Modelos */}
      <section className="mt-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg md:text-xl font-semibold">
            Modelos de comercialización disponibles
          </h2>
          <div className="flex flex-wrap gap-2 text-xs md:text-[13px]">
            <span className="rounded-full bg-mintGreen/15 text-forestGreen px-3 py-1">
              Horizonte 1–10+ años
            </span>
            <span className="rounded-full bg-emerald-50 text-forestGreen px-3 py-1">
              Riesgo y retorno graduables
            </span>
          </div>
        </div>

        {/* CARD BASE */}
        {/* 1. VERPA */}
        <article className="rounded-3xl border border-black/5 bg-white shadow-sm shadow-black/5 overflow-hidden">
          <div className="border-b border-black/5 bg-gradient-to-r from-forestGreen via-emerald-700 to-emerald-500 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">
                Modelo 1 · Bajo riesgo
              </p>
              <h3 className="text-base md:text-lg font-semibold">
                VERPA (Verified Emission Reductions Purchase Agreement)
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Compra futura de créditos verificados
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 p-5 md:p-6">
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-forestGreen">
                ¿Qué es?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Es un contrato legalmente vinculante donde acordás comprar créditos de carbono
                verificados una vez que el proyecto complete su ciclo de validación y emisión
                oficial. Es el modelo más seguro y transparente.
              </p>

              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-forestGreen">
                ¿Cómo funciona?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Firmás un acuerdo con términos específicos: volumen de créditos, precio fijo, fecha
                estimada de entrega y condiciones de pago. Una vez que el proyecto emite
                oficialmente sus créditos, recibís los
                <strong> VCUs (Verified Carbon Units)</strong> según lo pactado.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4 md:p-5">
              <h4 className="text-sm font-semibold text-forestGreen mb-1">¿Para quién es ideal?</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-black/80">
                <li>
                  <strong>Corporaciones con objetivos de sostenibilidad</strong> que necesitan
                  créditos verificados con garantía legal.
                </li>
                <li>
                  <strong>Fondos ESG y de impacto</strong> que requieren trazabilidad completa y
                  documentación robusta.
                </li>
                <li>
                  <strong>Empresas medianas y grandes</strong> que pueden comprometer presupuestos a
                  mediano y largo plazo.
                </li>
              </ul>
              <p className="mt-2 text-xs text-emerald-900/80">
                <strong>Timeline típico:</strong> 3–7 años. Alta seguridad jurídica y visibilidad de
                precio.
              </p>
            </div>
          </div>
        </article>

        {/* 2. Forward Contracts */}
        <article className="rounded-3xl border border-black/5 bg-white shadow-sm shadow-black/5 overflow-hidden">
          <div className="border-b border-black/5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">
                Modelo 2 · Flexibilidad y precio
              </p>
              <h3 className="text-base md:text-lg font-semibold">
                Forward Contracts (Contratos a Futuro)
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Derecho (no obligación) de compra
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 p-5 md:p-6">
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                ¿Qué es?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Es un contrato financiero que te otorga el derecho (pero no la obligación) de
                comprar créditos de carbono a un precio fijo en una fecha futura específica. Combina
                flexibilidad con seguridad de precio.
              </p>

              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                ¿Cómo funciona?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Reservás una cantidad de créditos futuros a un precio predeterminado (generalmente
                con descuento respecto al mercado spot). No hacés el pago completo de entrada. En la
                fecha de vencimiento, ejecutás la compra o la transferencia de derechos.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-amber-50 border border-amber-100 p-4 md:p-5">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">¿Para quién es ideal?</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-black/80">
                <li>
                  <strong>Traders de carbono</strong> que buscan arbitraje entre precios actuales y
                  futuros.
                </li>
                <li>
                  <strong>Empresas con presupuesto variable</strong> que no pueden comprometer
                  fondos inmediatamente.
                </li>
                <li>
                  <strong>Fondos especulativos de carbono</strong> interesados en retorno
                  financiero.
                </li>
                <li>
                  <strong>Intermediarios y brokers</strong> que revenden derechos a otros
                  inversores.
                </li>
                <li>
                  <strong>Startups de tech climático</strong> con crecimiento proyectado.
                </li>
              </ul>

              <div className="mt-2 space-y-1 text-xs text-amber-900/80">
                <p>
                  <strong>Oportunidades:</strong> menor desembolso inicial, flexibilidad
                  contractual, potencial de ganancia si los precios suben.
                </p>
                <p>
                  <strong>Timeline típico:</strong> 1–3 años. Más corto que VERPA, con mayor nivel
                  de especulación.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* 3. Carbon Streaming */}
        <article className="rounded-3xl border border-black/5 bg-white shadow-sm shadow-black/5 overflow-hidden">
          <div className="border-b border-black/5 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">
                Modelo 3 · Ingresos recurrentes
              </p>
              <h3 className="text-base md:text-lg font-semibold">
                Carbon Streaming (Financiamiento Continuo)
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Participación en producción futura
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 p-5 md:p-6">
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                ¿Qué es?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Un modelo de financiamiento donde aportás capital al proyecto a cambio de recibir
                una <strong>porción porcentual de todos los créditos generados</strong> durante la
                vida útil del proyecto (15–30 años, típicamente).
              </p>

              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                ¿Cómo funciona?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Hacés un desembolso inicial (o en fases) que financia el desarrollo. A cambio,
                recibís automáticamente un porcentaje de todos los créditos emitidos cada año, sin
                necesidad de nuevas compras. Es similar a un “streaming” de ingresos de carbono.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-sky-50 border border-sky-100 p-4 md:p-5">
              <h4 className="text-sm font-semibold text-sky-900 mb-1">¿Para quién es ideal?</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-black/80">
                <li>
                  <strong>Inversores de largo plazo</strong> que buscan ingresos pasivos
                  recurrentes.
                </li>
                <li>
                  <strong>Fondos de pensiones y seguros</strong> con horizonte de 15–30 años.
                </li>
                <li>
                  <strong>Family offices</strong> interesados en retorno sostenido.
                </li>
                <li>
                  <strong>Instituciones financieras</strong> con carteras diversificadas.
                </li>
                <li>
                  <strong>Inversores profesionales</strong> que valoran flujos de caja sostenibles.
                </li>
              </ul>

              <div className="mt-2 space-y-1 text-xs text-sky-900/80">
                <p>
                  <strong>Oportunidades:</strong> ingresos pasivos por décadas, menor riesgo que
                  equity puro, diversificación de cartera climática.
                </p>
                <p>
                  <strong>Timeline típico:</strong> desembolso inicial + 15–30 años de flujos.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* 4. Equity Investment */}
        <article className="rounded-3xl border border-black/5 bg-white shadow-sm shadow-black/5 overflow-hidden">
          <div className="border-b border-black/5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 px-5 md:px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">
                Modelo 4 · Alto potencial de retorno
              </p>
              <h3 className="text-base md:text-lg font-semibold">
                Equity Investment (Inversión en Capital)
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              Participación accionaria en el proyecto
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 p-5 md:p-6">
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-800">
                ¿Qué es?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Invertís capital directamente en la entidad que desarrolla el proyecto. Pasás a ser
                accionista y participás en ganancias, toma de decisiones y exposición a toda la
                operación del proyecto.
              </p>

              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-800">
                ¿Cómo funciona?
              </p>
              <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
                Adquirís participación accionaria (<em>equity stake</em>). Tus retornos provienen de
                múltiples fuentes: venta de créditos de carbono, ingresos secundarios (servicios
                ecosistémicos, turismo de carbono, biomasa) y apreciación del valor de la empresa.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-900 text-white border border-slate-700 p-4 md:p-5">
              <h4 className="text-sm font-semibold mb-1">¿Para quién es ideal?</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-sm text-slate-100">
                <li>
                  <strong>Inversores de venture capital</strong> que buscan retornos de capital a
                  5–10 años.
                </li>
                <li>
                  <strong>Empresas con portafolio de sostenibilidad</strong> que integran proyectos
                  en su cadena de valor.
                </li>
                <li>
                  <strong>Aceleradoras de startups climáticas</strong> enfocadas en climate tech.
                </li>
                <li>
                  <strong>Inversores ángeles</strong> con apetito de riesgo moderado–alto.
                </li>
                <li>
                  <strong>Fondos de Private Equity climáticos</strong> expuestos a activos
                  naturales.
                </li>
              </ul>

              <div className="mt-2 space-y-1 text-xs text-slate-200/90">
                <p>
                  <strong>Oportunidades:</strong> exposición a múltiples fuentes de ingresos, mayor
                  potencial de retorno, influencia en decisiones estratégicas.
                </p>
                <p>
                  <strong>Timeline típico:</strong> 5–10+ años, alineado con crecimiento del
                  proyecto y la empresa.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Cierre */}
      <section className="mt-10 mb-6">
        <div className="rounded-3xl border border-dashed border-forestGreen/30 bg-mintGreen/5 px-5 py-4 md:px-6 md:py-5">
          <p className="leading-relaxed text-sm md:text-[15px] text-black/80">
            Cada modelo se puede combinar y adaptar según el perfil de tu organización. Desde
            Forestblock podemos ayudarte a diseñar una estructura que balancee{' '}
            <strong>riesgo, plazo, retorno e impacto climático</strong> para tu estrategia de
            descarbonización.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ComoFuncionaClient;

// 'use client';

// import { useRouter } from 'next/navigation';
// import HeroBanner from '@/components/HeroBanner/HeroBanner';

// const ComoFuncionaClient: React.FC = () => {
//   const router = useRouter();

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
//       {/* Flecha de volver */}
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-forestGreen hover:text-forestGreen/70 mb-4 transition"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="lucide lucide-chevron-left"
//         >
//           <polyline points="15 18 9 12 15 6" />
//         </svg>
//         Volver
//       </button>

//       {/* Banner reutilizando HeroBanner */}
//       <HeroBanner
//         title={
//           <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
//             Proyectos en Desarrollo:
//             <br />
//             <span className="text-mintGreen">Oportunidades de Inversión Temprana en Carbono</span>
//           </h1>
//         }
//         showSearchbar={false}
//       >
//         <></>
//       </HeroBanner>

//       {/* Intro general */}
//       <section className="mt-10 space-y-4">
//         <h2 className="text-xl md:text-2xl font-semibold mb-2">¿De qué se trata?</h2>
//         <p className="leading-relaxed text-black/80">
//           Descubrí diferentes formas de invertir en proyectos de carbono antes de su emisión
//           oficial. En esta sección te mostramos los principales modelos de comercialización y para
//           qué tipo de inversor está pensado cada uno, para que puedas elegir el que mejor se ajusta
//           a tus objetivos y tolerancia al riesgo.
//         </p>
//         <p className="leading-relaxed text-black/80">
//           A continuación, te explicamos <strong>cómo funciona</strong> cada modelo, con ejemplos de
//           uso y las oportunidades que abre para tu estrategia climática y financiera.
//         </p>
//       </section>

//       {/* MODELOS DE COMERCIALIZACIÓN */}
//       <section className="mt-10 space-y-10">
//         <h2 className="text-xl md:text-2xl font-semibold">Modelos de comercialización</h2>

//         {/* 1. VERPA */}
//         <article className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-black/5 space-y-4">
//           <h3 className="text-lg md:text-xl font-semibold">
//             1. VERPA (Verified Emission Reductions Purchase Agreement)
//           </h3>
//           <p className="text-sm uppercase tracking-wide text-forestGreen font-semibold">
//             Acuerdo de Compra de Reducciones Verificadas
//           </p>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Qué es?</h4>
//             <p className="leading-relaxed text-black/80">
//               Es un contrato legalmente vinculante donde acordás comprar créditos de carbono
//               verificados una vez que el proyecto complete su ciclo de validación y emisión oficial.
//               Es el modelo más seguro y transparente.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Cómo funciona?</h4>
//             <p className="leading-relaxed text-black/80">
//               Firmás un acuerdo con términos específicos: volumen de créditos, precio fijo, fecha
//               estimada de entrega y condiciones de pago. Una vez que el proyecto emite oficialmente
//               sus créditos, recibís los
//               <strong> VCUs (Verified Carbon Units)</strong> según lo pactado.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Para quién es ideal</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>
//                 <strong>Corporaciones con objetivos de sostenibilidad:</strong> necesitan créditos
//                 verificados con garantía legal.
//               </li>
//               <li>
//                 <strong>Fondos ESG y de impacto:</strong> requieren trazabilidad completa y
//                 documentación robusta.
//               </li>
//               <li>
//                 <strong>Empresas medianas y grandes:</strong> pueden comprometer presupuestos a
//                 mediano y largo plazo.
//               </li>
//             </ul>
//           </div>
//         </article>

//         {/* 2. Forward Contracts */}
//         <article className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-black/5 space-y-4">
//           <h3 className="text-lg md:text-xl font-semibold">
//             2. Forward Contracts (Contratos a Futuro)
//           </h3>
//           <p className="text-sm uppercase tracking-wide text-forestGreen font-semibold">
//             Compra de Derechos Futuros sobre Créditos
//           </p>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Qué es?</h4>
//             <p className="leading-relaxed text-black/80">
//               Es un contrato financiero que te otorga el derecho (pero no la obligación) de comprar
//               créditos de carbono a un precio fijo en una fecha futura específica. Combina
//               flexibilidad con seguridad de precio.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Cómo funciona?</h4>
//             <p className="leading-relaxed text-black/80">
//               Reservás una cantidad de créditos futuros a un precio predeterminado (generalmente con
//               descuento respecto al mercado spot). No hacés el pago completo de entrada. En la fecha
//               de vencimiento, ejecutás la compra o la transferencia de derechos.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Para quién es ideal</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>
//                 <strong>Traders de carbono:</strong> buscan arbitraje entre precios actuales y
//                 futuros.
//               </li>
//               <li>
//                 <strong>Empresas con presupuesto variable:</strong> no pueden comprometer fondos
//                 inmediatamente.
//               </li>
//               <li>
//                 <strong>Fondos especulativos de carbono:</strong> interesados en retorno financiero.
//               </li>
//               <li>
//                 <strong>Intermediarios y brokers:</strong> revenden derechos a otros inversores.
//               </li>
//               <li>
//                 <strong>Startups de tech climático:</strong> con crecimiento proyectado.
//               </li>
//             </ul>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Oportunidades</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>Menor desembolso inicial (solo depósito o prima).</li>
//               <li>Flexibilidad contractual y opcionalidad.</li>
//               <li>Potencial de ganancia si los precios suben.</li>
//               <li>Ideal para inversores con presupuesto limitado.</li>
//             </ul>
//             <p className="text-sm text-black/70">
//               <strong>Timeline típico:</strong> 1–3 años; más corto que VERPA, con mayor nivel de
//               especulación.
//             </p>
//           </div>
//         </article>

//         {/* 3. Carbon Streaming */}
//         <article className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-black/5 space-y-4">
//           <h3 className="text-lg md:text-xl font-semibold">
//             3. Carbon Streaming (Financiamiento Continuo)
//           </h3>
//           <p className="text-sm uppercase tracking-wide text-forestGreen font-semibold">
//             Participación en la Producción Futura de Créditos
//           </p>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Qué es?</h4>
//             <p className="leading-relaxed text-black/80">
//               Es un modelo donde aportás capital al proyecto a cambio de recibir una{' '}
//               <strong>parte porcentual de los créditos generados</strong> durante toda la vida útil
//               del proyecto (habitualmente 15–30 años).
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Cómo funciona?</h4>
//             <p className="leading-relaxed text-black/80">
//               Hacés un desembolso inicial (o en fases) que financia el desarrollo del proyecto. A
//               cambio, recibís automáticamente un porcentaje de todos los créditos emitidos, año tras
//               año, sin necesidad de nuevas compras. Es similar a un “streaming” de ingresos de
//               carbono.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Para quién es ideal</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>
//                 <strong>Inversores de largo plazo:</strong> buscan ingresos pasivos recurrentes.
//               </li>
//               <li>
//                 <strong>Fondos de pensiones y seguros:</strong> con horizonte de 15–30 años.
//               </li>
//               <li>
//                 <strong>Family offices:</strong> interesados en retorno sostenido.
//               </li>
//               <li>
//                 <strong>Instituciones financieras:</strong> con carteras diversificadas.
//               </li>
//               <li>
//                 <strong>Inversores profesionales:</strong> que valoran flujos de caja estables.
//               </li>
//             </ul>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Oportunidades</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>Ingresos pasivos recurrentes por décadas.</li>
//               <li>Crecimiento con la escala del proyecto.</li>
//               <li>Menor riesgo que equity puro (secured cashflow).</li>
//               <li>Diversificación de cartera climática.</li>
//               <li>Impacto ambiental garantizado a largo plazo.</li>
//             </ul>
//             <p className="text-sm text-black/70">
//               <strong>Timeline típico:</strong> desembolso inicial + 15–30 años de flujos.
//             </p>
//           </div>
//         </article>

//         {/* 4. Equity Investment */}
//         <article className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-black/5 space-y-4">
//           <h3 className="text-lg md:text-xl font-semibold">
//             4. Equity Investment (Inversión en Capital)
//           </h3>
//           <p className="text-sm uppercase tracking-wide text-forestGreen font-semibold">
//             Participación Accionaria en el Proyecto
//           </p>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Qué es?</h4>
//             <p className="leading-relaxed text-black/80">
//               Invertís capital directamente en la entidad que desarrolla el proyecto. Pasás a ser
//               accionista y participás en ganancia, decisiones y exposición a toda la operación del
//               proyecto.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">¿Cómo funciona?</h4>
//             <p className="leading-relaxed text-black/80">
//               Adquirís participación accionaria (<em>equity stake</em>) en el proyecto o la empresa.
//               Tus retornos vienen de múltiples fuentes: venta de créditos de carbono, ingresos
//               secundarios (servicios ecosistémicos, turismo de carbono, biomasa), y posible
//               apreciación del valor de la compañía.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Para quién es ideal</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>
//                 <strong>Inversores de venture capital:</strong> buscan retorno de capital a 5–10
//                 años.
//               </li>
//               <li>
//                 <strong>Empresas con portafolio de sostenibilidad:</strong> integran proyectos en su
//                 cadena de valor.
//               </li>
//               <li>
//                 <strong>Aceleradoras de startups climáticas:</strong> focadas en climate tech.
//               </li>
//               <li>
//                 <strong>Inversores ángel:</strong> con apetito de riesgo moderado–alto.
//               </li>
//               <li>
//                 <strong>Fondos de Private Equity climáticos:</strong> expuestos a activos naturales.
//               </li>
//             </ul>
//           </div>

//           <div className="space-y-3">
//             <h4 className="font-semibold">Oportunidades</h4>
//             <ul className="list-disc pl-5 space-y-1 text-black/80">
//               <li>Exposición a múltiples fuentes de ingresos (no solo carbono).</li>
//               <li>Potencial de retorno más alto que otros modelos.</li>
//               <li>Influencia en decisiones estratégicas del proyecto.</li>
//               <li>Apreciación de valor a medida que el proyecto crece.</li>
//               <li>Menor riesgo que startups tech puras (activos tangibles).</li>
//             </ul>
//           </div>
//         </article>
//       </section>

//       {/* Cierre */}
//       <section className="mt-10 mb-4">
//         <p className="leading-relaxed text-black/80">
//           Seleccioná el modelo que mejor se ajuste a tus objetivos de impacto y retorno, y comenzá a
//           participar en el mercado de carbono desde las primeras etapas de cada proyecto. Desde
//           Forestblock podemos ayudarte a estructurar la estrategia que combine riesgo, plazo e
//           impacto climático de la forma más eficiente para tu organización.
//         </p>
//       </section>
//     </div>
//   );
// };

// export default ComoFuncionaClient;
