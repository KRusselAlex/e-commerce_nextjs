// File: app/api/cart/user/[userId]/route.ts
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split('/').pop(); // Extract userId from path

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID", null, {
                code: 400,
                details: "Valid user ID is required.",
            });
        }

        const { db } = await connectToDatabase();

        const carts = await db.collection("carts").find({
            userId: new ObjectId(userId),
        }).toArray();

        

        return sendResponse(200, true, "User cart items fetched successfully", carts);
    } catch (error) {
        return sendResponse(500, false, "Failed to fetch user cart items", null, {
            code: 500,
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split("/").pop();

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID", null, {
                code: 400,
                details: "Valid user ID is required.",
            });
        }

        const { db } = await connectToDatabase();

        const result = await db
            .collection("carts")
            .deleteMany({ userId: new ObjectId(userId) });

        return sendResponse(200, true, "Cart cleared successfully", {
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return sendResponse(500, false, "Failed to clear cart", null, {
            code: 500,
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
  