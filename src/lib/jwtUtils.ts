import jwt from 'jsonwebtoken';

// Ensure secrets are defined
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
    throw new Error('JWT_SECRET or REFRESH_SECRET is not defined in the environment variables.');
}

const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_EXPIRES_IN || '7d';

// Generate Access Token
export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

// Generate Refresh Token
export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// Verify Access Token
export function verifyAccessToken(token: string): { userId: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET as string) as { userId: string };
    } catch (error) {
        console.log('Access Token Error:', error);
        return null;
    }
}

// Verify Refresh Token
export function verifyRefreshToken(token: string): { userId: string } | null {
    try {
        return jwt.verify(token, REFRESH_SECRET as string) as { userId: string };
    } catch (error) {
        console.log('Refresh Token Error:', error);
        return null;
    }
}
