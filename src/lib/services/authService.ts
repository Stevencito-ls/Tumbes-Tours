import { supabase } from '../supabase';
import type { Database } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dni?: string;
}

type PerfilRow = Database['public']['Tables']['perfiles']['Row'];

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No se pudo iniciar sesión');

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', data.user.id)
    .single() as { data: PerfilRow | null };

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    name: perfil?.nombre ?? email.split('@')[0],
    phone: perfil?.telefono ?? undefined,
    dni: perfil?.dni ?? undefined,
  };
}

export type SignUpResult =
  | { user: AuthUser; pending?: false }
  | { pending: true; email: string };

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone: string,
  dni: string
): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error(error.message);

  // Cuando la confirmación por correo está activada, `data.user` puede ser null
  // hasta que el usuario confirme su email. En ese caso devolvemos un objeto
  // indicando `pending: true` para que la UI muestre instrucciones.
  if (!data.user) {
    return { pending: true, email };
  }

  const { error: perfilError } = await supabase.from('perfiles').insert([
    {
      id: data.user.id,
      nombre: name,
      telefono: phone ?? null,
      dni: dni ?? null,
    },
  ] as any);

  if (perfilError) throw new Error(perfilError.message);

  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? email,
      name,
      phone: phone || undefined,
      dni: dni || undefined,
    },
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', session.user.id)
    .single() as { data: PerfilRow | null };

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: perfil?.nombre ?? session.user.email?.split('@')[0] ?? 'Usuario',
    phone: perfil?.telefono ?? undefined,
    dni: perfil?.dni ?? undefined,
  };
}
