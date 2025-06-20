// lib/sendEdgeResponse.ts
import { NextResponse } from 'next/server';

export function sendEdgeResponse(status: number, message: string) {
    const response = NextResponse.json(
        {
            success: false,
            message,
        },
        {
            status,
        }
    );
    return response;
}
