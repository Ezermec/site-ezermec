import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from '@/lib/config';

/**
 * Proxy (antigo "middleware") que mantém a sessão do Supabase atualizada nos
 * cookies e protege as rotas do painel administrativo (/painel).
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

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const isPainelRoute = pathname.startsWith('/painel');
  const isLoginRoute = pathname === '/painel/login';

  if (isPainelRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/painel/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/painel';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Executa em todas as rotas, exceto assets estáticos e imagens.
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};
