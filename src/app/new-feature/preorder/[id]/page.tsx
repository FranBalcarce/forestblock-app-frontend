'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function PreorderFormPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Esto es solo demo, podés reemplazar por una llamada real
    alert(`Interés enviado ✅\nProyecto: ${id}\nNombre: ${form.name}`);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2 text-forestGreen">Interés en proyecto futuro</h1>
      <p className="mb-8 text-black/70">
        Completa tus datos y te contactaremos cuando el proyecto <strong>{id}</strong> esté
        disponible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-lg border border-black/5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-black/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-forestGreen focus:outline-none"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border border-black/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-forestGreen focus:outline-none"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Empresa (opcional)</label>
          <input
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            className="w-full border border-black/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-forestGreen focus:outline-none"
            placeholder="Mi empresa S.A."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensaje</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className="w-full border border-black/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-forestGreen focus:outline-none"
            placeholder="Escribe tus dudas o comentarios…"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-forestGreen text-white py-3 rounded-lg text-lg font-medium hover:bg-forestGreen/90 transition"
        >
          Enviar interés
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/new-feature" className="text-forestGreen hover:underline">
          ← Volver
        </Link>
      </div>
    </div>
  );
}
