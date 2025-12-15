'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useMarketplace from '@/hooks/useMarketplace';

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

type Props = { id: string };

export default function MarketplaceByIdClient({ id }: Props) {
  const router = useRouter();
  const { project, prices, isPricesLoading, handleRetire } = useMarketplace(id);

  const imageSrc = useMemo(() => getImageSrc(project?.images), [project]);

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <button
          onClick={() => router.back()}
          className="mb-4 rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
        >
          ← Volver
        </button>
        <div className="rounded-3xl border border-black/5 bg-white shadow-sm p-6">
          <p className="text-black/70">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  // precio: en tu modelo actual el precio de proyecto viene en project.price,
  // y prices es otra lista (si la usás para checkout).
  const displayPrice = project?.price ? Number(project.price) : null;

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
            <Image
              src={imageSrc}
              alt={project.name}
              fill
              priority
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-black/40">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-semibold">{project.name}</h1>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {project.country ? (
              <span className="px-3 py-1 rounded-full bg-black/5">{project.country}</span>
            ) : null}
            {project.region ? (
              <span className="px-3 py-1 rounded-full bg-black/5">{project.region}</span>
            ) : null}
            {project.updatedAt ? (
              <span className="px-3 py-1 rounded-full bg-black/5">
                Actualizado: {new Date(project.updatedAt).toLocaleDateString('es-AR')}
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-black/70 whitespace-pre-line">
            {project.description ||
              // v18 a veces viene short_description / long_description
              (project as any)?.short_description ||
              (project as any)?.long_description ||
              'Sin descripción.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {displayPrice !== null ? (
              <div className="text-sm text-black/70">
                <span className="font-medium text-black">Precio:</span> ${displayPrice.toFixed(2)}
              </div>
            ) : null}

            <button
              type="button"
              disabled={isPricesLoading}
              onClick={() =>
                handleRetire({
                  id: project.key,
                  index: 0,
                  priceParam: project.price,
                  selectedVintage: project.vintages?.[0] ?? '',
                })
              }
              className="rounded-full px-4 py-2 bg-forestGreen text-white text-sm font-medium hover:bg-forestGreen/90 transition disabled:opacity-60"
            >
              {isPricesLoading ? 'Cargando precio...' : 'Comprar / Retirar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
