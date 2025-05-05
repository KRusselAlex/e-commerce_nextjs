import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { loginSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { comparePassword } from '@/lib/authUtils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwtUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const requestBody = await request.json();

        // Validate request body
        const validationResult = loginSchema.safeParse(requestBody);
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const { email, password } = validationResult.data;

        // Find user in DB
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return sendResponse(404, false, 'User not found', null, {
                code: 404,
                details: 'User with this email does not exist',
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return sendResponse(401, false, 'Invalid credentials', null, {
                code: 401,
                details: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ userId: user._id.toString() });
        const refreshToken = generateRefreshToken({ userId: user._id.toString() });

       
        const response = NextResponse.json({ success: true, accessToken });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 604800,
            secure: process.env.NODE_ENV === 'production',
            path: 'api/auth/refresh',
        });


        return response;
    } catch (error) {
        return sendResponse(500, false, 'Failed to login user', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
