import { supabase } from '../supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dni?: string;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No se pudo iniciar sesión');

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    name: perfil?.nombre ?? email.split('@')[0],
    phone: perfil?.telefono ?? undefined,
    dni: perfil?.dni ?? undefined,
  };
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone: string,
  dni: string
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No se pudo crear la cuenta');

  const { error: perfilError } = await supabase.from('perfiles').insert({
    id: data.user.id,
    nombre: name,
    telefono: phone || null,
    dni: dni || null,
  });

  if (perfilError) throw new Error(perfilError.message);

  return {
    id: data.user.id,
    email: data.user.email ?? email,
    name,
    phone: phone || undefined,
    dni: dni || undefined,
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
    .single();

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: perfil?.nombre ?? session.user.email?.split('@')[0] ?? 'Usuario',
    phone: perfil?.telefono ?? undefined,
    dni: perfil?.dni ?? undefined,
  };
}
