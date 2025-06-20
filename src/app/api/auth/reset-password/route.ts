import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { sendEmailPasswordForget } from "@/lib/emailUtils";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return sendResponse(400, false, "Email is required");
        }

        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return sendResponse(404, false, "No user found with this email");
        }

        // Remove old tokens
        await db.collection("password_resets").deleteMany({ email });

        // Create token valid for 1 hour
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        await db.collection("password_resets").insertOne({
            email,
            token,
            createdAt: new Date(),
        });

        await sendEmailPasswordForget(email, token);

        return sendResponse(200, true, "Check your email for the reset link.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}
