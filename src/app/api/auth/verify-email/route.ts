import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return sendResponse(400, false, 'Invalid verification token');
        }

        const user = await db.collection('users').findOne({ verificationToken: token });

        if (!user) {
            return sendResponse(400, false, 'Invalid or expired token');
        }

        if (new Date(user.verificationExpires) < new Date()) {
            return sendResponse(400, false, 'Verification token has expired');
        }

        // Update user status
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { isVerified: true }, $unset: { verificationToken: "", verificationExpires: "" } }
        );

        return sendResponse(200, true, 'Email verified successfully');
    } catch (error) {
        return sendResponse(500, false, 'Failed to verify email', null, { code: 500, details: error });
    }
}
