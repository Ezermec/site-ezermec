import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from '@/lib/config';

/**
 * Proxy (antigo "middleware") que mantém a sessão do Supabase atualizada nos
 * cookies. Hoje o site é público (sem login), mas isto já deixa a base pronta
 * para proteger rotas de admin (ex.: /painel) quando a autenticação existir.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Atualiza a sessão (no-op enquanto não há usuário autenticado).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Executa em todas as rotas, exceto assets estáticos e imagens.
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};
