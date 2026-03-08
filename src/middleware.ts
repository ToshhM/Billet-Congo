import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes protégées et rôles requis
const protectedRoutes = {
    '/admin': ['ADMIN'],
    '/account': ['USER', 'ADMIN'],
    '/checkout': ['USER', 'ADMIN'],
    '/scanner': ['ADMIN', 'SCANNER'],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('congo_session');

    // Vérifier si la route nécessite une protection
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
            if (!sessionCookie) {
                // Rediriger vers le login s'il n'y a pas de session
                const url = new URL('/login', request.url);
                url.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(url);
            }

            // Pour l'instant on lit les infos d'une manière basique (mock)
            // En vrai, il faudrait décoder le JWT vérifier la DB via un appel isolé ou Edge Function
            const isAdminRoute = pathname.startsWith('/admin');
            if (isAdminRoute && !sessionCookie.value.includes('usr-admin')) {
                // Fallback de sécurité mock : Si on veut aller sur /admin mais que le cookie n'inclut pas 'usr-admin'
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    // Rediriger de /login vers dashboard s'il est déjà connecté
    if (pathname === '/login' || pathname === '/register') {
        if (sessionCookie) {
            if (sessionCookie.value.includes('usr-admin')) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            if (sessionCookie.value.includes('usr-scanner')) {
                return NextResponse.redirect(new URL('/scanner', request.url));
            }
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
