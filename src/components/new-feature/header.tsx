'use client';

import React from 'react';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import Button from '@/components/Marketplace/Button';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function NewHeader({ searchTerm, setSearchTerm }: HeaderProps) {
  const router = useRouter();

  return (
    <HeroBanner
      title={
        <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
          Proyectos en Desarrollo: <br />
          <span className="text-mintGreen font-aeonik">
            Oportunidades de Inversión Temprana en Carbono
          </span>
        </h1>
      }
      showSearchbar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      backgroundUrl="/images/new-feature-banner.jpg" // 👈 usa el banner nuevo
    >
      <Button variant="primary" onClick={() => router.push('/new-feature/como-funciona')}>
        ¿Como funciona?
      </Button>

      <Button
        variant="secondary"
        onClick={() => router.push('https://www.forestblock.tech/contact/contacto')}
      >
        Contactar equipo
      </Button>
    </HeroBanner>
  );
}

// 'use client';

// import React from 'react';
// import HeroBanner from '@/components/HeroBanner/HeroBanner';
// import Button from '@/components/Marketplace/Button';
// import { useRouter } from 'next/navigation';

// type HeaderProps = {
//   searchTerm: string;
//   setSearchTerm: (value: string) => void;
// };

// export default function NewHeader({ searchTerm, setSearchTerm }: HeaderProps) {
//   const router = useRouter();

//   return (
//     <HeroBanner
//       title={
//         <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
//           Proyectos en Desarrollo: <br />
//           <span className="text-mintGreen font-aeonik">
//             Oportunidades de Inversión Temprana en Carbono
//           </span>
//         </h1>
//       }
//       showSearchbar
//       searchTerm={searchTerm}
//       setSearchTerm={setSearchTerm}
//     >
//       <Button variant="primary" onClick={() => router.push('/new-feature/como-funciona')}>
//         ¿Como funciona?
//       </Button>

//       <Button
//         variant="secondary"
//         onClick={() => router.push('https://www.forestblock.tech/contact/contacto')}
//       >
//         Contactar equipo
//       </Button>
//     </HeroBanner>
//   );
// }
