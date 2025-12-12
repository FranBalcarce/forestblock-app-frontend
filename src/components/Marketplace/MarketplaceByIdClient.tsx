'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

type Props = {
  id: string;
};

export default function MarketplaceByIdClient({ id }: Props) {
  const router = useRouter();

  /**
   * ⚠️ ACÁ después vas a usar:
   * const { project } = useMarketplace(id)
   * Esto es SOLO para que ahora compile y se vea algo
   */
  const project = {
    key: id,
    name: `Proyecto ${id}`,
    description: 'Descripción del proyecto (demo)',
    images: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' }],
    country: 'Argentina',
    year: 2024,
    tipo: 'Forestry',
  };

  const imageSrc = getImageSrc(project.images);

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
          <p className="mt-3 text-black/70">{project.description}</p>
        </div>
      </div>
    </div>
  );
}
