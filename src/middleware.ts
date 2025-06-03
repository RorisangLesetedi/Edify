import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Check if accessing auth pages while logged in
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if accessing protected pages while logged out
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If logged in, check role-based access
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role;
    const path = request.nextUrl.pathname;

    // Redirect if trying to access wrong role's dashboard
    if (path.startsWith('/dashboard/')) {
      const roleFromPath = path.split('/')[2]; // e.g., /dashboard/admin -> admin
      if (role !== roleFromPath) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
}; 