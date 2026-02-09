import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the path/url
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login';

    // Check for the auth cookie
    // Note: In a real app, you'd verify the token signature/validity
    const token = request.cookies.get('auth_token')?.value;

    // 1. If user is on a public path (login) and has a token, redirect to dashboard
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // 2. If user is not on a public path and has NO token, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Reference for matching logic to avoid loops or blocking static assets:
    // We'll filter in the config matcher below.
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> We might want to protect these too, but let's start with pages. 
         *      Actually, for a real app, protect API too. But for this MVP landing page requirement, 
         *      protecting the UI is key. Let's protect everything except static files.
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
