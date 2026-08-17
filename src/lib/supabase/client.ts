import { createBrowserClient } from '@supabase/ssr';
import { getEnvVariables } from '@/lib/env';

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnvVariables();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
