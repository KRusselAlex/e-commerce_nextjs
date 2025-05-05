import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/middlewares/authMiddleware';
import { verificationMiddleware } from '@/lib/middlewares/verificationMiddleware';

export async function middleware(request: NextRequest) {
    // First, check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse.status !== 200) return authResponse;

    // Then, check email verification
    const verificationResponse = await verificationMiddleware(request);
    if (verificationResponse.status !== 200) return verificationResponse;

    return NextResponse.next();
}

// Apply middleware only to API routes
export const config = {
    matcher: '/api/:path*',
};
