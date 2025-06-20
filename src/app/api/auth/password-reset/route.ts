// /app/api/auth/reset-password/route.ts
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/lib/authUtils";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function POST(req: NextRequest) {
    try {
        const { password, token } = await req.json();
        console.log("pasword et tokene :s")
        console.log(password, token)

        if (!password || !token) {
            return sendResponse(400, false, "Password and token are required.");
        }

        const { email } = jwt.verify(token, JWT_SECRET) as { email: string };

        const { db } = await connectToDatabase();

        const resetRecord = await db.collection("password_resets").findOne({ token });
        if (!resetRecord || resetRecord.email !== email) {
            return sendResponse(400, false, "Invalid or expired token.");
        }

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return sendResponse(404, false, "User not found.");
        }

        const hashedPassword = await hashPassword(password);
        await db.collection("users").updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        // Delete used token
        await db.collection("password_resets").deleteOne({ token });

        return sendResponse(200, true, "Password reset successful. You can now log in.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Server error";
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}
