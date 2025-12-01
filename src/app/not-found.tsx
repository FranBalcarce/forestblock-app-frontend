// src/app/not-found.tsx

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-backgroundGray p-6">
      <h1 className="text-[32px] md:text-[40px] font-aeonik font-bold text-forestGreen mb-4">
        Página no encontrada
      </h1>
      <p className="text-base md:text-lg text-black/70 mb-6 text-center max-w-md">
        La página que estás buscando no existe o fue movida.
      </p>
      <a
        href="/"
        className="px-4 py-2 rounded-xl border border-forestGreen text-forestGreen hover:bg-forestGreen hover:text-white transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}
