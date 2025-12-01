'use client';

import Link from 'next/link';
import TopBar from '@/components/TopBar/TopBar';

export default function CancelClient() {
  return (
    <div className="p-3 flex flex-col min-h-screen">
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-10 bg-backgroundGray rounded-xl mt-5">
        <h1 className="text-[28px] md:text-[40px] font-aeonik font-bold text-forestGreen mb-5">
          Pago Cancelado ❌
        </h1>
        <p className="text-lg text-forestGreen mb-8 text-center">
          Parece que has cancelado tu pago. Si necesitas ayuda, contáctanos.
        </p>
        <Link
          href="/marketplace"
          className="underline text-forestGreen text-xl hover:text-forestGreen/80"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
