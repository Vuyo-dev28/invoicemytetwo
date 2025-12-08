
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define public paths that should not be protected
const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/pricing',
    '/signup/business-details', // ✅ Allow access to business details page
    '/about',
    '/support',
    '/products',
    '/privacy/', 
    '/reset-password',
    '/update-password',
    '/auth/callback',
    '/admin/login',
    '/admin/dashboard',
    '/api/admin/login',
     '/api/dashboard-data',
];

function isPublicPath(path: string): boolean {
    return publicPaths.some(p => {
        if (typeof p === 'string') {
            return p === path;
        }
        return p.test(path);
    });
}

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const { pathname } = request.nextUrl;

    // If the user is not logged in and the path is not public, redirect to login
    if (!session && !isPublicPath(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user is logged in, redirect them based on the path
    if (session) {
        if (pathname === '/login' || pathname === '/signup') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // If they are on the business details page, let them stay
        if (pathname === '/signup/business-details') {
            return response;
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
