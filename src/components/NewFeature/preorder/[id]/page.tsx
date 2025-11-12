'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function PreorderFormPage() {
  // Tipado correcto en App Router (sin genéricos)
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  // Campos controlados (opcional, útil para luego enviar al backend)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar al backend / API (fetch/axios)
    // Ejemplo:
    // await fetch('/api/preorder', { method: 'POST', body: JSON.stringify({ id, name, email, company, message }) })
    alert('¡Gracias! Registramos tu interés (demo).');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Interés en proyecto futuro</h1>

      <p className="mb-6 text-black/70">
        Proyecto seleccionado: <span className="font-medium text-black">{id}</span>
      </p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="border rounded-lg px-3 py-2"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="border rounded-lg px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          className="border rounded-lg px-3 py-2"
          placeholder="Empresa (opcional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <textarea
          className="border rounded-lg px-3 py-2"
          placeholder="Mensaje"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className="rounded-xl px-4 py-2 bg-forestGreen text-white hover:bg-forestGreen/90 transition"
        >
          Enviar interés
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="/new-feature"
          className="text-forestGreen underline hover:text-forestGreen/70 transition"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}

// Este usa login
// 'use client';

// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// export default function PreorderFormPage() {
//   const { id } = useParams<{ id: string }>();

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">Interés en proyecto futuro</h1>
//       <p className="mb-6 text-black/70">
//         Proyecto seleccionado: <span className="font-medium">{id}</span>
//       </p>

//       <form className="grid gap-4">
//         <input className="border rounded-lg px-3 py-2" placeholder="Nombre completo" />
//         <input className="border rounded-lg px-3 py-2" placeholder="Email" />
//         <input className="border rounded-lg px-3 py-2" placeholder="Empresa (opcional)" />
//         <textarea className="border rounded-lg px-3 py-2" placeholder="Mensaje" rows={4} />
//         <button type="submit" className="rounded-xl px-4 py-2 bg-forestGreen text-white">
//           Enviar interés
//         </button>
//       </form>

//       <div className="mt-6">
//         <Link href="/new-feature" className="text-forestGreen underline">
//           Volver
//         </Link>
//       </div>
//     </div>
//   );
// }
