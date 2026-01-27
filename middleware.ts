import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/sell', '/marketplace', '/profile', '/messages', '/kyc']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    )

    if (isProtectedRoute && !token) {
        // Redirect to register/login flow
        const url = new URL('/register', request.url)
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
    }

    // Redirect logged in users away from auth pages
    if (pathname === '/register' && token) {
        return NextResponse.redirect(new URL('/marketplace', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sell/:path*',
        '/marketplace/:path*',
        '/profile/:path*',
        '/messages/:path*',
        '/kyc/:path*',
        '/register'
    ]
}

export default middleware
