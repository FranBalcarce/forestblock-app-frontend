'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useMarketplace from '@/hooks/useMarketplace';
import type { Price } from '@/types/marketplace';

/* ---------------------------------------------------
 Helpers
--------------------------------------------------- */

const getImageSrc = (img: unknown): string | null => {
  if (!img) return null;

  if (typeof img === 'string') return img;

  if (Array.isArray(img)) {
    for (const item of img) {
      const s = getImageSrc(item);
      if (s) return s;
    }
    return null;
  }

  if (typeof img === 'object') {
    const o = img as Record<string, unknown>;
    const direct = o.url ?? o.src ?? o.imageUrl;
    if (typeof direct === 'string') return direct;

    for (const k of ['banner', 'thumbnail', 'cover', 'image', 'main']) {
      const s = getImageSrc(o[k]);
      if (s) return s;
    }
  }

  return null;
};

const getPriceProjectId = (p: Price): string | null => {
  return p.listing?.creditId?.projectId ?? p.carbonPool?.creditId.projectId ?? null;
};

/* ---------------------------------------------------
 Props
--------------------------------------------------- */

type Props = {
  id: string;
};

/* ---------------------------------------------------
 Component
--------------------------------------------------- */

export default function MarketplaceByIdClient({ id }: Props) {
  const router = useRouter();

  const { project, prices, loading } = useMarketplace(id);

  const imageSrc = useMemo(() => (project ? getImageSrc(project.images) : null), [project]);

  const price = useMemo(() => {
    if (!project) return null;

    const found = prices.find((p) => getPriceProjectId(p) === project.key);

    return found ? found.purchasePrice : null;
  }, [prices, project]);

  /* ---------------------------------------------------
   States
  --------------------------------------------------- */

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Cargando proyecto…</div>;
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="mb-4">Proyecto no encontrado.</p>
        <button
          onClick={() => router.back()}
          className="rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
        >
          Volver
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------
   Render
  --------------------------------------------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
      >
        ← Volver
      </button>

      <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <div className="relative h-56 md:h-72 bg-black/5">
          {imageSrc ? (
            <Image src={imageSrc} alt={project.name} fill priority style={{ objectFit: 'cover' }} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-black/40">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-semibold">{project.name}</h1>

          {project.description && <p className="mt-3 text-black/70">{project.description}</p>}

          {price !== null && (
            <div className="mt-4 text-lg font-semibold text-forestGreen">
              Precio: ${price.toFixed(2)} / tCO₂
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
