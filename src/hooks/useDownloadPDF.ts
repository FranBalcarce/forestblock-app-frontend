import { PDFParams } from '@/types/useRetirements';
import { axiosPublicInstance } from '@/utils/axios/axiosPublicInstance';

const useDownloadPDF = () => {
  const downloadCertificatePDF = async (paramsData: PDFParams): Promise<void | string> => {
    try {
      const response = await axiosPublicInstance.post<{ url: string }>('/api/carbon/sharePDF', {
        params: paramsData,
      });
      if (typeof window !== 'undefined') {
        const { url } = response.data;
        window.open(url, '_blank');
        return url;
      } else {
        console.warn('No se puede descargar el PDF en el servidor.');
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw error;
    }
  };
  return downloadCertificatePDF;
};

export default useDownloadPDF;
