import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return redirectToError("Invalid verification token");
        }

        const user = await db.collection('users').findOne({ verificationToken: token });

        if (!user) {
            return redirectToError("Invalid or expired token");
        }

        if (new Date(user.verificationExpires) < new Date()) {
            return redirectToError("Verification token has expired");
        }

        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { isVerified: true }, $unset: { verificationToken: "", verificationExpires: "" } }
        );

        return new Response(null, {
            status: 302,
            headers: {
                Location: `${process.env.NEXT_PUBLIC_BASE_URL}/email-verified`,
            },
        });

    } catch (error) {
        console.error("Email verification error:", error);
        return redirectToError("Something went wrong during email verification." + error);
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
