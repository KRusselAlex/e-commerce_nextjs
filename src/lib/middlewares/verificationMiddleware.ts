import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { sendResponse } from '@/lib/apiResponse';

const exemptRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verify-email'];

export async function verificationMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip verification check for exempted routes
    if (exemptRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const userId = request.headers.get('userId');
    if (!userId) {
        return sendResponse(401, false, 'Unauthorized: User ID missing', null, {
            code: 401,
            details: 'User ID is required in headers',
        });
    }

    try {
        const { db } = await connectToDatabase();

        // Convert userId to ObjectId
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user || !user.isVerified) {
            return sendResponse(403, false, 'Unauthorized: Email not verified', null, {
                code: 403,
                details: 'Please verify your email before accessing this resource',
            });
        }

        return NextResponse.next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return sendResponse(500, false, 'Server error', null, {
            code: 500,
            details: errorMessage,
        });
    }
}
