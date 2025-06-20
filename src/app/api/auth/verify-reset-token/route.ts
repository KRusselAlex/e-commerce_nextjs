
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";


export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
        return redirectToError("Missing token in URL");
    }

    try {
        const { db } = await connectToDatabase();

        const record = await db.collection("password_resets").findOne({ token });

        if (!record) {
            return redirectToError("Invalid or expired token.");
        }

        // Optionally: check token age, e.g., 1 hour expiration
        // const expired = new Date(record.createdAt).getTime() + 3600000 < Date.now();
        // if (expired) return redirectToError("Token has expired.");

        // Redirect to password reset form (frontend page with token in query param)
        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/new-password/${token}`;
        return new Response(null, {
            status: 302,
            headers: {
                Location: successUrl,
            },
        });
    } catch (error) {
        return redirectToError("An unexpected error occurred. " + error);
    }
}

function redirectToError(message: string) {
    const errorUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/error/${encodeURIComponent(message)}`;
    return new Response(null, {
        status: 302,
        headers: {
            Location: errorUrl,
        },
    });
}
