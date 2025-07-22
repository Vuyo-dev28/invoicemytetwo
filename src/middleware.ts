
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define public paths that should not be protected
const publicPaths = [
    '/',
    '/login',
    '/signup', // ✅ Allow unauthenticated users to visit /signup
    // '/signup/company-name',
    '/auth/callback'
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

    // If the user is logged in and tries to access login/signup, redirect to dashboard
    if (session && (pathname === '/login' || pathname === '/signup/company-name')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
