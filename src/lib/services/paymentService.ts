import { supabase } from '../supabase';

export type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia';

export interface CreatePaymentData {
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: MetodoPago;
}

export async function createPayment(data: CreatePaymentData): Promise<void> {
  const { error } = await supabase.from('pagos').insert({
    reserva_id: data.bookingId,
    usuario_id: data.userId,
    monto: data.amount,
    metodo_pago: data.paymentMethod,
    estado: 'completado',
  });

  if (error) throw new Error(error.message);
}
