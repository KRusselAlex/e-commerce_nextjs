// app/api/orders/[id]/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";

const updateOrderSchema = z.object({
    status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]).optional(),
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    // Add more updatable fields as needed
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return sendResponse(400, false, "Invalid order ID", null, {
                code: 400,
                details: "Valid order ID is required.",
            });
        }

        const { db } = await connectToDatabase();
        const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

        if (!order) {
            return sendResponse(404, false, "Order not found", null, {
                code: 404,
                details: "No order found with the provided ID.",
            });
        }

        const formattedOrder = {
            ...order,
            _id: order._id.toString(),
            userId: order.userId.toString(),
            createdAt: order.createdAt?.toISOString(),
            updatedAt: order.updatedAt?.toISOString(),
        };

        return sendResponse(200, true, "Order fetched successfully", formattedOrder);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to fetch order", null, {
            code: 500,
            details: errorMessage,
        });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return sendResponse(400, false, "Invalid order ID", null, {
                code: 400,
                details: "Valid order ID is required.",
            });
        }

        const body = await request.json();

        const validationResult = updateOrderSchema.safeParse(body);
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, "Validation failed", null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const updateData = validationResult.data;
        const updateFields = {
            ...updateData,
            updatedAt: new Date(),
        };

        const { db } = await connectToDatabase();
        const result = await db.collection("orders").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return sendResponse(404, false, "Order not found", null, {
                code: 404,
                details: "No order found with the provided ID.",
            });
        }

        return sendResponse(200, true, "Order updated successfully");
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to update order", null, {
            code: 500,
            details: errorMessage,
        });
    }
}


// Schéma Zod pour valider uniquement le status
const updateStatusSchema = z.object({
    status: z.enum(["pending" , "processing", "shipped" , "completed" , "cancelled"]),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return sendResponse(400, false, "Invalid order ID", null, {
                code: 400,
                details: "Valid order ID is required.",
            });
        }

        const body = await request.json();

        const validationResult = updateStatusSchema.safeParse(body);
        if (!validationResult.success) {
            return sendResponse(400, false, "Invalid status value", null, {
                code: 400,
                details: validationResult.error.format(),
            });
        }

        const { status } = validationResult.data;

        const { db } = await connectToDatabase();

        const result = await db.collection("orders").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return sendResponse(404, false, "Order not found", null, {
                code: 404,
                details: "No order found with the provided ID.",
            });
        }

        return sendResponse(200, true, "Order status updated successfully");
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : "Unknown error";

        console.error("Error updating status:", errorMessage);
        return sendResponse(500, false, "Server error", null, {
            code: 500,
            details: errorMessage,
        });
    }
}
