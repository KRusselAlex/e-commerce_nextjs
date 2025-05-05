import { NextRequest} from 'next/server';
import { sendResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
    try {
        // Extract the refresh token from cookies
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return sendResponse(400, false, 'No refresh token found', null, {
                code: 400,
                details: 'User is not logged in.',
            });
        }

        const response = sendResponse(200, true, 'Logout successful');

        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),

            path: 'api/auth/refresh', 
        });


        return response;
    } catch (error) {
        return sendResponse(500, false, 'Failed to logout', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
