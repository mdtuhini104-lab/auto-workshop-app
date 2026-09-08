import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, api routes, public pages
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Rewrite /customer-statements to /workshop/customer-statements
  if (pathname === '/customer-statements' || pathname === '/customer-statements/') {
    return NextResponse.rewrite(new URL('/workshop/customer-statements', request.url));
  }

  // Ensure unauthorized page redirects back to dashboard if user is logged in
  if (pathname === '/unauthorized') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
