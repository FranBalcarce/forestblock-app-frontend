'use client';

import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type DevProject = {
  key: string;
  name: string;
  image: string;
  country: string;
  year: number;
  tipo: string;
  description: string;
};

const DEV_PROJECTS: DevProject[] = [
  {
    key: 'nf-azul-001',
    name: 'Captura Azul (Blue Carbon) – Piloto',
    image: '/images/projects/blue-carbon.jpg',
    country: 'Argentina',
    year: 2024,
    tipo: 'Blue carbon',
    description:
      'Proyecto piloto de captura y almacenamiento de carbono azul en ecosistemas costeros. Enfocado en restauración de humedales y monitoreo científico de la captura de CO₂.',
  },
  {
    key: 'nf-eff-002',
    name: 'Eficiencia Energética PyME – Fase 1',
    image: '/images/projects/eficiencia.jpg',
    country: 'Argentina',
    year: 2024,
    tipo: 'Eficiencia energética',
    description:
      'Programa de eficiencia energética para PyMEs, que incluye auditorías, mejoras en iluminación, motores y sistemas de climatización, con foco en reducción de consumo eléctrico y emisiones.',
  },
];

export default function DevProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = typeof id === 'string' ? id : '';

  const project = useMemo(() => DEV_PROJECTS.find((p) => p.key === projectId), [projectId]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="mb-4">Proyecto no encontrado.</p>
        <Link href="/new-feature" className="text-forestGreen underline">
          Volver a proyectos en desarrollo
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Gracias! Registramos tu interés (demo).');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Header con imagen, estilo marketplace */}
      <div className="mb-8 rounded-3xl overflow-hidden relative">
        <div className="relative h-64 md:h-80">
          <Image
            src={project.image}
            alt={project.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur">
            Proyectos en desarrollo
          </span>
          <h1 className="text-2xl md:text-4xl font-aeonik font-semibold text-white">
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/15 text-white">{project.country}</span>
            <span className="px-3 py-1 rounded-full bg-white/15 text-white">{project.year}</span>
            <span className="px-3 py-1 rounded-full bg-mintGreen text-forestGreen">
              {project.tipo}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido: descripción + formulario al costado */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Descripción</h2>
          <p className="leading-relaxed text-black/80 whitespace-pre-line">{project.description}</p>
        </section>

        <aside className="bg-white rounded-3xl p-5 shadow-sm border border-black/5">
          <h2 className="text-lg font-semibold mb-2">Formulario de interés</h2>
          <p className="text-sm text-black/70 mb-4">
            Dejanos tus datos y el equipo de Forestblock se contactará con vos para seguir el
            proceso de este proyecto en desarrollo.
          </p>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 text-sm"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="border rounded-lg px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              className="border rounded-lg px-3 py-2 text-sm"
              placeholder="Empresa (opcional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <textarea
              className="border rounded-lg px-3 py-2 text-sm min-h-[100px]"
              placeholder="Contanos brevemente qué te interesa de este proyecto"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              className="mt-1 rounded-full px-4 py-2 bg-forestGreen text-white text-sm font-medium hover:bg-forestGreen/90 transition"
            >
              Enviar formulario
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push('/new-feature')}
            className="mt-4 text-sm text-forestGreen underline"
          >
            Volver a proyectos en desarrollo
          </button>
        </aside>
      </div>
    </div>
  );
}
