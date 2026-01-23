import { PollingResponse } from '@/types/retirement';
import { axiosPublicInstance } from './axios/axiosPublicInstance';
import { handleError } from './retirementSteps';

const pollOrderStatus = (
  quoteId: string,
  onSuccess: (data: PollingResponse) => void,
  onError: (errorMsg: string) => void,
  abortSignal?: AbortSignal
): void => {
  const pollingInterval = 5000;
  const maxPollingTime = 60000;
  const startTime = Date.now();

  const interval = setInterval(async () => {
    // Si se ha abortado, limpiar el intervalo y salir
    if (abortSignal?.aborted) {
      clearInterval(interval);
      return;
    }
    try {
      const response = await axiosPublicInstance.get<PollingResponse[]>('/api/carbon/orders', {
        params: { quote_uuid: quoteId },
      });
      const data = response.data;
      if (data[0]?.status === 'COMPLETED') {
        clearInterval(interval);
        onSuccess(data[0]);
        return;
      }
      if (Date.now() - startTime >= maxPollingTime) {
        clearInterval(interval);
        onError('Polling timed out. Order status not confirmed.');
      }
    } catch (err) {
      clearInterval(interval);
      onError(handleError(err, 'Error while polling order status.'));
    }
  }, pollingInterval);
};

export default pollOrderStatus;
