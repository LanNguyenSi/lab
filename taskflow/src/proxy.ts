import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const isPublicRoute =
      req.nextUrl.pathname === '/' ||
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register');

    if (isPublicRoute && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/login') ||
          req.nextUrl.pathname.startsWith('/register') ||
          req.nextUrl.pathname.startsWith('/api/auth') ||
          req.nextUrl.pathname.startsWith('/api/register')
        ) {
          return true;
        }

        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
