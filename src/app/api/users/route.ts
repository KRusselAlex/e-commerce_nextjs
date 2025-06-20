
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse"; // Optional helper


export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const users = await db.collection("users")
            .find({})
            .project({ password: 0 }) // 👈 exclude passwords for security
            .toArray();

        return sendResponse(200, true, "Users fetched successfully", users);
        // Or without helper: return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return sendResponse(500, false, "Failed to fetch users", null, {
            details: error instanceof Error ? error.message : "Unknown error",
            code: 500
        });
    }
}
