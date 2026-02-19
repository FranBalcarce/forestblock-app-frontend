'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Divider from '@/components/Divider/Divider';
import { CiCalendar } from 'react-icons/ci';
import FormattedDate from './FormattedDate';
import CertificateHeader from './CertificateHeader';
import TonnesDisplay from './TonnesDisplay';
import BeneficiaryInfo from './BeneficiaryInfo';
import ShareAndDownload from './ShareAndDownload';
import TransactionDetails from './TransactionDetails';
import ProjectInfo from './ProjectInfo';
import ActionButtons from './ActionButtons';
import { LeftDetailsProps } from '../types';

const LeftDetails = ({
  project,
  beneficiary_name,
  retirement_message,
  externalQuote,
  order,
  downloadCertificatePDF,
  retirementId,
}: LeftDetailsProps) => {
  const router = useRouter();

  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* 🔥 FIX VINTAGES SAFE */
  let computedVintageIndex: number | null = null;

  if (
    project?.selectedVintage !== undefined &&
    project?.selectedVintage !== null &&
    Array.isArray(project?.vintages)
  ) {
    computedVintageIndex = project.vintages.indexOf(String(project.selectedVintage));
  }

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const url = await downloadCertificatePDF({
        beneficiaryName: beneficiary_name,
        retirementMessage: retirement_message,
        createdAt: externalQuote?.created_at || '',
        quantityTonnes: externalQuote?.quantity_tonnes || 0,
        retirementId: retirementId || order?.quote?.uuid,
        projectName: project?.name || '',
        projectMethodology: project?.methodologies?.[0]?.category || '',
        projectMethodologyType: project?.methodologies?.[0]?.name || '',
        projectType: project?.methodologies?.[0]?.id || '',
        projectUrl: project?.url || '',
      });

      setCertificateUrl(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <CiCalendar className="w-6 h-6 text-customGray" />
        <FormattedDate date={externalQuote?.created_at} />
      </div>

      <CertificateHeader />
      <Divider customClassName="w-full" />

      <div className="text-start flex flex-col gap-4">
        <TonnesDisplay quantity={externalQuote?.quantity_tonnes} />
        <Divider customClassName="w-full" />

        <BeneficiaryInfo
          beneficiary_name={beneficiary_name}
          retirement_message={retirement_message}
        />

        <ShareAndDownload
          onDownload={handleDownloadPDF}
          loading={loading}
          shareUrl={certificateUrl || project?.pdfUrl}
        />
      </div>

      <Divider customClassName="w-full" />
      <TransactionDetails order={order} />
      <Divider customClassName="w-full" />

      <ProjectInfo project={project} computedVintageIndex={computedVintageIndex} />

      <ActionButtons
        onMyRetirements={() => router.push('/retirements')}
        onRetireMore={() => router.push('/marketplace')}
      />
    </div>
  );
};

export default LeftDetails;
