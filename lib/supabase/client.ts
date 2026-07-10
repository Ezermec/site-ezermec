import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from '@/lib/config';

/** Cliente Supabase para uso no browser (Client Components). */
export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
