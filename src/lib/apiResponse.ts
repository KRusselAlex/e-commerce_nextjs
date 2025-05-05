/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

type ApiResponse = {
    success: boolean;
    message?: string;
    data?: any;
    error?: {
        code: number;
        details: any;
    };
};

export function sendResponse(
    statusCode: number,
    success: boolean,
    message?: string,
    data?: any,
    error?: { code: number; details: any}
) {
    const response: ApiResponse = { success };

    if (message) response.message = message;
    if (data) response.data = data;
    if (error) response.error = error;

    return NextResponse.json(response, { status: statusCode });
}