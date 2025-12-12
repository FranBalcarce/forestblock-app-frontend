'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import useMarketplace from '@/hooks/useMarketplace';

/**
 * Devuelve una URL de imagen válida venga como venga el payload
 */
const getImageSrc = (img: unknown): string | null => {
  if (!img) return null;

  if (typeof img === 'string') return img;

  if (Array.isArray(img)) {
    for (const item of img) {
      const src = getImageSrc(item);
      if (src) return src;
    }
    return null;
  }

  if (typeof img === 'object') {
    const o = img as Record<string, unknown>;
    const direct = o.url ?? o.src ?? o.imageUrl;
    if (typeof direct === 'string') return direct;

    for (const k of ['banner', 'thumbnail', 'cover', 'image', 'main']) {
      const src = getImageSrc(o[k]);
      if (src) return src;
    }
  }

  return null;
};

export default function MarketplaceByIdClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { project, prices, isPricesLoading, loading } = useMarketplace(id);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10 text-black/60">Cargando proyecto…</div>;
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="mb-4">Proyecto no encontrado.</p>
        <button onClick={() => router.back()} className="text-forestGreen underline">
          Volver
        </button>
      </div>
    );
  }

  // 🔥 Match de precio tolerante (Carbonmark v18 friendly)
  const priceItem = prices?.find((p: unknown) => {
    const o = p as Record<string, unknown>;
    const pid =
      o.projectKey ??
      o.projectId ??
      (o.project as Record<string, unknown> | undefined)?.key ??
      (o.project as Record<string, unknown> | undefined)?.id ??
      o.key ??
      o.id;

    return String(pid) === String(project.key);
  }) as Record<string, unknown> | undefined;

  const price =
    typeof priceItem?.purchasePrice === 'number'
      ? priceItem.purchasePrice
      : typeof priceItem?.price === 'number'
      ? priceItem.price
      : undefined;

  const imageSrc = getImageSrc(project.images);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Volver */}
      <button
        onClick={() => router.back()}
        className="mb-4 rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10"
      >
        ← Volver
      </button>

      {/* Card */}
      <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
        {/* Imagen */}
        <div className="relative h-56 md:h-72 bg-black/5">
          {imageSrc ? (
            <Image src={imageSrc} alt={project.name} fill priority style={{ objectFit: 'cover' }} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-black/40">
              Sin imagen
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">{project.name}</h1>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-black/5">{project.country}</span>
            {project.vintages?.[0] && (
              <span className="px-3 py-1 rounded-full bg-black/5">
                Vintage {project.vintages[0]}
              </span>
            )}
            {project.methodologies?.[0]?.category && (
              <span className="px-3 py-1 rounded-full bg-mintGreen text-forestGreen">
                {project.methodologies[0].category}
              </span>
            )}
          </div>

          {project.description && (
            <p className="text-black/70 leading-relaxed">{project.description}</p>
          )}

          {/* Precio */}
          <div className="pt-4 border-t border-black/5">
            {isPricesLoading ? (
              <span className="text-black/50">Cargando precio…</span>
            ) : typeof price === 'number' ? (
              <span className="text-lg font-semibold text-forestGreen">
                ${price.toFixed(2)} / tCO₂e
              </span>
            ) : (
              <span className="text-black/40">Precio no disponible</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
