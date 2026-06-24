import { supabase } from '../supabase';
import type { Destination } from '../../app/App';

export async function getDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from('destinos')
    .select('*')
    .order('fecha_creacion', { ascending: true });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    name: d.nombre,
    country: d.pais,
    description: d.descripcion,
    price: d.precio,
    duration: d.duracion,
    image: d.imagen,
    included: d.incluidos,
    rating: d.calificacion,
  }));
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const { data, error } = await supabase
    .from('destinos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.nombre,
    country: data.pais,
    description: data.descripcion,
    price: data.precio,
    duration: data.duracion,
    image: data.imagen,
    included: data.incluidos,
    rating: data.calificacion,
  };
}
