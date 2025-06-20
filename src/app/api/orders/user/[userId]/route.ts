
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID", null, {
                code: 400,
                details: "Valid user ID is required.",
            });
        }

        const userObjectId = new ObjectId(userId);

        const { db } = await connectToDatabase();

        // Query orders collection for this user
        const orders = await db
            .collection("orders")
            .find({ userId: userObjectId })
            .sort({ createdAt: -1 }) // newest first
            .toArray();

        if (!orders || orders.length === 0) {
            return sendResponse(200, true, "No orders found for this user", []);
        }

        // Format response: convert ObjectIds to strings
        const formattedOrders = orders.map((order) => ({
            ...order,
            _id: order._id.toString(),
            userId: order.userId.toString(),
            createdAt: order.createdAt?.toISOString(),
            updatedAt: order.updatedAt?.toISOString(),
        }));

        return sendResponse(200, true, "Orders fetched successfully", formattedOrders);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to fetch orders", null, {
            code: 500,
            details: errorMessage,
        });
    }
}