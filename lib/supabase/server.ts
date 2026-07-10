import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from '@/lib/config';

/**
 * Cliente Supabase para uso no servidor (Server Components, Route Handlers,
 * Server Actions). Integra com os cookies do Next para gerenciar sessão —
 * pronto para quando a autenticação de admin for adicionada.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Chamado a partir de um Server Component — pode ser ignorado se
          // houver middleware atualizando a sessão do usuário.
        }
      },
    },
  });
}
