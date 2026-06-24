import { supabase } from '../supabase';
import type { Booking, Destination } from '../../app/App';

// Mapa de estados de la BD (español) al tipo de la app
const estadoMap: Record<string, Booking['status']> = {
  pendiente: 'pending',
  confirmado: 'confirmed',
  cancelado: 'cancelled',
};

const estadoPagoMap: Record<string, Booking['paymentStatus']> = {
  pendiente: 'pending',
  completado: 'completed',
  fallido: 'failed',
};

// Mapa inverso: tipo de app → valor en BD
const estadoMapInverso: Record<Booking['status'], string> = {
  pending: 'pendiente',
  confirmed: 'confirmado',
  cancelled: 'cancelado',
};

const estadoPagoMapInverso: Record<Booking['paymentStatus'], string> = {
  pending: 'pendiente',
  completed: 'completado',
  failed: 'fallido',
};

export interface CreateBookingData {
  id: string;
  destinationId: string;
  userId: string;
  travelers: number;
  startDate: string;
  totalPrice: number;
  specialRequests?: string;
}

export async function createBooking(data: CreateBookingData): Promise<void> {
  const { error } = await supabase.from('reservas').insert({
    id: data.id,
    destino_id: data.destinationId,
    usuario_id: data.userId,
    viajeros: data.travelers,
    fecha_inicio: data.startDate,
    precio_total: data.totalPrice,
    estado: 'pendiente',
    estado_pago: 'pendiente',
    solicitudes_especiales: data.specialRequests || null,
  });

  if (error) throw new Error(error.message);
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      destinos (*)
    `)
    .eq('usuario_id', userId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((r) => {
    const dest = r.destinos as unknown as {
      id: string; nombre: string; pais: string; descripcion: string;
      precio: number; duracion: string; imagen: string; incluidos: string[]; calificacion: number;
    };

    const destination: Destination = {
      id: dest.id,
      name: dest.nombre,
      country: dest.pais,
      description: dest.descripcion,
      price: dest.precio,
      duration: dest.duracion,
      image: dest.imagen,
      included: dest.incluidos,
      rating: dest.calificacion,
    };

    return {
      id: r.id,
      destinationId: r.destino_id,
      destination,
      userId: r.usuario_id,
      travelers: r.viajeros,
      startDate: r.fecha_inicio,
      totalPrice: r.precio_total,
      status: estadoMap[r.estado] ?? 'pending',
      paymentStatus: estadoPagoMap[r.estado_pago] ?? 'pending',
      createdAt: r.fecha_creacion,
    };
  });
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status'],
  paymentStatus: Booking['paymentStatus']
): Promise<void> {
  const { error } = await supabase
    .from('reservas')
    .update({
      estado: estadoMapInverso[status],
      estado_pago: estadoPagoMapInverso[paymentStatus],
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}
