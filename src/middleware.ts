import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the request is for the admin area or admin APIs
    if (request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/api/payment-settings') ||
        request.nextUrl.pathname.startsWith('/api/create-payment')) {

        // For demo purposes, we'll check for a specific cookie
        // In a real app, you would verify a session token or JWT
        const authCookie = request.cookies.get('admin_auth')

        if (!authCookie || authCookie.value !== 'true') {
            // Redirect to login page if not authenticated
            // Note: You'll need to create a login page at /login
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/payment-settings',
        '/api/create-payment',
    ],
}
