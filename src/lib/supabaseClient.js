import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Estas son variables de entorno
// Debes crear un archivo .env en la raíz del proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase no configurado. Por favor configura las variables de entorno.');
  console.warn('Lee CONFIGURAR-SUPABASE.md para instrucciones.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
