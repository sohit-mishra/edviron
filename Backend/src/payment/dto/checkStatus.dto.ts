export class CashfreePaymentResponseDto{
  cf_payment_id: number;
  order_id: string;
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED';
  payment_message: string;
  payment_amount: number;
  error_details?: any;
  bank_reference?: string | null;
  payment_time: string;

}