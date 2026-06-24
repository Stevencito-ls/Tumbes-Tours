export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          nombre: string;
          telefono: string | null;
          dni: string | null;
          fecha_creacion: string;
        };
        Insert: {
          id: string;
          nombre: string;
          telefono?: string | null;
          dni?: string | null;
          fecha_creacion?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          telefono?: string | null;
          dni?: string | null;
        };
      };
      destinos: {
        Row: {
          id: string;
          nombre: string;
          pais: string;
          descripcion: string;
          precio: number;
          duracion: string;
          imagen: string;
          incluidos: string[];
          calificacion: number;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          pais: string;
          descripcion: string;
          precio: number;
          duracion: string;
          imagen: string;
          incluidos: string[];
          calificacion: number;
          fecha_creacion?: string;
        };
        Update: {
          nombre?: string;
          pais?: string;
          descripcion?: string;
          precio?: number;
          duracion?: string;
          imagen?: string;
          incluidos?: string[];
          calificacion?: number;
        };
      };
      reservas: {
        Row: {
          id: string;
          destino_id: string;
          usuario_id: string;
          viajeros: number;
          fecha_inicio: string;
          precio_total: number;
          estado: 'pendiente' | 'confirmado' | 'cancelado';
          estado_pago: 'pendiente' | 'completado' | 'fallido';
          solicitudes_especiales: string | null;
          fecha_creacion: string;
        };
        Insert: {
          id: string;
          destino_id: string;
          usuario_id: string;
          viajeros: number;
          fecha_inicio: string;
          precio_total: number;
          estado?: 'pendiente' | 'confirmado' | 'cancelado';
          estado_pago?: 'pendiente' | 'completado' | 'fallido';
          solicitudes_especiales?: string | null;
          fecha_creacion?: string;
        };
        Update: {
          estado?: 'pendiente' | 'confirmado' | 'cancelado';
          estado_pago?: 'pendiente' | 'completado' | 'fallido';
          solicitudes_especiales?: string | null;
        };
      };
      pagos: {
        Row: {
          id: string;
          reserva_id: string;
          usuario_id: string;
          monto: number;
          metodo_pago: 'tarjeta' | 'paypal' | 'transferencia';
          estado: 'pendiente' | 'completado' | 'fallido';
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          reserva_id: string;
          usuario_id: string;
          monto: number;
          metodo_pago: 'tarjeta' | 'paypal' | 'transferencia';
          estado?: 'pendiente' | 'completado' | 'fallido';
          fecha_creacion?: string;
        };
        Update: {
          estado?: 'pendiente' | 'completado' | 'fallido';
        };
      };
    };
  };
}
