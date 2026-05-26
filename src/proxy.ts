import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Routes protégées et rôles requis
const protectedRoutes = {
    '/admin': ['ADMIN'],
    '/organisateur': ['ADMIN', 'PROMOTER'],
    '/account': ['CLIENT', 'ADMIN', 'PROMOTER', 'SCANNER'],
    '/checkout': ['CLIENT', 'ADMIN', 'PROMOTER', 'SCANNER'],
    '/scanner': ['ADMIN', 'SCANNER'],
};

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('congo_session');

    // Vérifier si la route nécessite une protection
    let userPayload = null;
    if (sessionCookie) {
        try {
            const { payload } = await jose.jwtVerify(sessionCookie.value, JWT_SECRET);
            userPayload = payload;
        } catch {
            // Token invalide -> possiblement un vieux cookie de démo
            // On laisse l'utilisateur passer si ce n'est pas une route protégée, 
            // sinon on le redirigera plus bas car userPayload sera null.
        }
    }

    const isProtectedRoute = Object.keys(protectedRoutes).some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        if (!userPayload) {
            const url = new URL('/auth/login', request.url);
            url.searchParams.set('callbackUrl', pathname);
            const response = NextResponse.redirect(url);
            // Optionnel: Nettoyer le cookie corrompu pour éviter les boucles
            response.cookies.delete('congo_session');
            return response;
        }

        // Vérification des rôles
        const requiredRoles = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))?.[1] || [];
        const userRole = userPayload.role as string;

        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Rediriger de /auth/login ou /register vers dashboard/account s'il est déjà connecté
    if ((pathname === '/auth/login' || pathname === '/auth/register') && userPayload) {
        const userRole = userPayload.role as string;
        if (userRole === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        if (userRole === 'SCANNER') {
            return NextResponse.redirect(new URL('/scanner', request.url));
        }
        return NextResponse.redirect(new URL('/account', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default proxy;
