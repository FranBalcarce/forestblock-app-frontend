import { Suspense } from 'react';
import RetirementStepsClient from '@/components/retirementSteps/RetirementStepsClient';

export const dynamic = 'force-dynamic';

export default function RetirementStepsPage() {
  return (
    <Suspense fallback={null}>
      <RetirementStepsClient />
    </Suspense>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import { useRetireCheckout } from "@/hooks/useRetirementCheckout";
// import { useRetire } from "@/context/RetireContext";
// import useRetirementSteps from "@/hooks/useRetirementSteps";
// import ErrorMessage from "./ui/ErrorMessage";
// import CompletedDetails from "./ui/CompletedDetails";
// import TopBar from "@/components/TopBar/TopBar";
// import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";

// const RetirementSteps: React.FC = () => {
//   const { changePaymentStatus } = useRetireCheckout();
//   const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean | null>(
//     null
//   );

//   const { setProject } = useRetire();
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const paymentId = searchParams.get("paymentId") || "";
//   const router = useRouter();

//   const { orderDetails, error, executeFullProcess, createRetirementRecord } =
//     useRetirementSteps(paymentId, sessionId);

//   useEffect(() => {
//     const confirmPayment = async () => {
//       if (paymentId && sessionId) {
//         const isConfirmed = await changePaymentStatus(
//           paymentId,
//           "CONFIRMED",
//           sessionId || ""
//         );
//         setIsPaymentConfirmed(isConfirmed);
//       }
//     };
//     confirmPayment();
//   }, [changePaymentStatus, paymentId, sessionId, createRetirementRecord]);

//   useEffect(() => {
//     if (isPaymentConfirmed) {
//       executeFullProcess();
//     }
//   }, [isPaymentConfirmed, executeFullProcess, createRetirementRecord]);

//   useEffect(() => {
//     const storedProject = localStorage.getItem("project");
//     if (storedProject) {
//       setProject(JSON.parse(storedProject));
//     }
//   }, [setProject]);

//   return (
//     <div className="flex min-h-screen bg-white flex-col w-full py-5 px-5">
//       <TopBar />
//       {error ? (
//         <div
//           className="flex items-center justify-center flex-col gap-3"
//           data-testid="error-message"
//         >
//           <p className="text-center text-customRed">{error}</p>
//           <button
//             onClick={() => {
//               router.push("/marketplace");
//             }}
//             className="bg-mintGreen text-forestGreen font-semibold px-4 py-2 rounded-md"
//           >
//             IR AL MARKETPLACE
//           </button>
//         </div>
//       ) : !paymentId ? (
//         <ErrorMessage message="Error: Missing payment ID in the URL." />
//       ) : orderDetails ? (
//         <div className="bg-backgroundGray p-5 rounded-xl min-h-screen">
//           <CompletedDetails details={orderDetails} />
//         </div>
//       ) : (
//         <div className="flex items-center justify-center flex-1">
//           <LoaderScreenDynamic />
//         </div>
//       )}
//     </div>
//   );
// };

// export default RetirementSteps;
