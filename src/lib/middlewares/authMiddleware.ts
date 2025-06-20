// middleware.ts (or middleware helper)
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/lib/jwtUtils';
import { sendEdgeResponse } from '@/lib/sendEdgeResponse';

const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/password-reset'];

export async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return sendEdgeResponse(401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            throw new Error('Invalid token');
        }

        // Add userId header for downstream handlers
        const response = NextResponse.next();
        response.headers.set('userId', decoded.userId);
        return response;
    } catch (error) {
        // Attempt refresh if refreshToken cookie exists
        console.error('Access token verification failed:', error);
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (!refreshToken) {
            return sendEdgeResponse(401, 'Unauthorized: Invalid token and no refresh token');
        }

        try {
            const refreshDecoded = verifyRefreshToken(refreshToken);
            if (!refreshDecoded) {
                throw new Error('Invalid refresh token');
            }
            const newAccessToken = generateAccessToken({ userId: refreshDecoded?.userId });

            const response = NextResponse.next();
            response.headers.set('Authorization', `Bearer ${newAccessToken}`);
            response.headers.set('userId', refreshDecoded.userId);
            return response;
        } catch (refreshError) {
            console.error('Refresh token verification failed:', refreshError);
            return sendEdgeResponse(401, 'Session expired. Please log in again.');
        }
    }
}
