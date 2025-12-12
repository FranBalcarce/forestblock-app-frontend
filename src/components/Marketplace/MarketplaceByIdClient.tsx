'use client';

import React, { useEffect } from 'react';

type Props = {
  id: string;
};

const MarketplaceByIdClient: React.FC<Props> = ({ id }) => {
  useEffect(() => {
    console.log('✅ MarketplaceByIdClient id:', id);
  }, [id]);

  return <div>ID del proyecto: {id}</div>;
};

export default MarketplaceByIdClient;
