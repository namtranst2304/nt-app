import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects private routes by checking for a valid JWT in cookies
export async function middleware(request: NextRequest) {
  // Only protect routes under /dashboard, /profile, /api/api1-5, etc.
  const protectedPaths = [
    // '/dashboard',
    // '/profile',
    // '/api/api1',
    // '/api/api2',
    // '/api/api3',
    // '/api/api4',
    // '/api/api5',
    // '/api/api6', // Temporarily disabled for weather testing
    // '/content',
    // '/settings',
    // '/history',
    // '/favorites',
    // '/playlists',
  ];
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  // Get JWT from cookie
  const jwt = request.cookies.get('jwt')?.value;
  if (!jwt) {
    // Not authenticated, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optionally: Validate JWT by calling backend API
  // (for demo, just allow if cookie exists)
  // You can implement a fetch to /api/v1/auth/validate if needed

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/dashboard/:path*',
    // '/profile/:path*',
    // '/api/api1/:path*',
    // '/api/api2/:path*',
    // '/api/api3/:path*',
    // '/api/api4/:path*',
    // '/api/api5/:path*',
    // '/api/api6/:path*', // Temporarily disabled for weather testing
    // '/content/:path*',
    // '/settings/:path*',
    // '/history/:path*',
    // '/favorites/:path*',
    // '/playlists/:path*',
  ],
};
