'use client';

import React from 'react';

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  return <div>ID del proyecto: {id}</div>;
}
