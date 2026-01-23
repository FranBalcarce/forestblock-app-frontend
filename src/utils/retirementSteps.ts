import { OrderDetails, PaymentDetails, QuoteDetails } from '@/types/retirement';
import axiosInstance from './axios/axiosInstance';

export const handleError = (err: unknown, defaultMessage: string): string => {
  console.error(err);
  return err instanceof Error ? err.message : defaultMessage;
};

export const fetchPaymentDetails = async (paymentId: string): Promise<PaymentDetails> => {
  try {
    const response = await axiosInstance.get<PaymentDetails>(`/payments/${paymentId}`);
    return response.data;
  } catch (err) {
    throw new Error(handleError(err, 'Failed to fetch payment details.'));
  }
};

export const createQuote = async (
  paymentId: string,
  tonnesToRetire: number
): Promise<QuoteDetails> => {
  try {
    const response = await axiosInstance.post<QuoteDetails>(`/api/carbon/generate-quote`, {
      paymentId,
      quantityTonnes: tonnesToRetire,
    });
    return response.data;
  } catch (err) {
    throw new Error(handleError(err, 'Failed to generate quote.'));
  }
};

export const createOrder = async (
  paymentId: string,
  beneficiaryName: string,
  retirementMessage: string,
  quoteId: string,
  walletAddress: string
): Promise<OrderDetails> => {
  try {
    const response = await axiosInstance.post<OrderDetails>(`/api/carbon/create-order`, {
      paymentId,
      quoteId,
      beneficiaryName,
      retirementMessage,
      consumptionMetadata: {
        country_of_consumption_code: 'string',
        consumption_period_start: 0,
        consumption_period_end: 0,
      },
      beneficiaryAddress: walletAddress,
    });

    return response.data;
  } catch (err) {
    throw new Error(handleError(err, 'Failed to create order.'));
  }
};
