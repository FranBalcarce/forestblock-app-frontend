'use client';

import React, { FC } from 'react';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import { loom_video } from '@/constants';
import { useRouter } from 'next/navigation';
import Button from './Button';

type HeaderSectionProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const HeaderSection: FC<HeaderSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const router = useRouter();

  return (
    <HeroBanner
      title={
        <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
          Reduce tu impacto con nuestro <br />
          <span className="text-mintGreen">mercado de carbono</span> sostenible
        </h1>
      }
      showSearchbar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <Button variant="primary" onClick={() => window.open(loom_video, '_blank')}>
        ¿Cómo funciona?
      </Button>

      <Button variant="secondary" onClick={() => router.push('/calculate')}>
        Calculadora de huella
      </Button>
    </HeroBanner>
  );
};

export default HeaderSection;
