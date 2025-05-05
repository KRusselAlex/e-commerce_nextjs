import { verifyRefreshToken, generateAccessToken } from '@/lib/jwtUtils';
import { sendResponse } from '@/lib/apiResponse';

export async function POST(request: Request) {
    try {
        // Get refresh token from HTTP-only cookie
        const refreshToken = request.headers.get('cookie')?.split('refreshToken=')[1]?.split(';')[0];

        if (!refreshToken) {
            return sendResponse(401, false, 'Refresh token missing', null, { code: 401, details: 'No refresh token provided' });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return sendResponse(403, false, 'Invalid refresh token', null, { code: 403, details: 'Token is invalid or expired' });
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken({ userId: decoded.userId });

        return sendResponse(200, true, 'Token refreshed', { accessToken: newAccessToken });

    } catch (error) {
        return sendResponse(500, false, 'Failed to refresh token', null, { code: 500, details: error instanceof Error ? error.message : 'Unknown error'});
    }
}
