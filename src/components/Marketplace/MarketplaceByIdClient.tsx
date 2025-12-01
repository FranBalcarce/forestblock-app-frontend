'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const MarketplaceByIdClient: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <div>ID del proyecto: {id}</div>;
};

export default MarketplaceByIdClient;
