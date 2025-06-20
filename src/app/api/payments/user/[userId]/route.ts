// app/api/payments/[id]/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { z } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { ObjectId } from "mongodb";


const updatePaymentSchema = z.object({
    status: z.enum(["pending", "paid", "failed", "refunded", "cancelled"]).optional(),
    externalId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return sendResponse(400, false, "Invalid payment ID", null, {
                code: 400,
                details: "Valid payment ID is required.",
            });
        }

        const { db } = await connectToDatabase();
        const payment = await db.collection("payments").findOne({ _id: new ObjectId(id) });

        if (!payment) {
            return sendResponse(404, false, "Payment not found", null, {
                code: 404,
                details: "No payment found with the provided ID.",
            });
        }

        const formattedPayment = {
            ...payment,
            _id: payment._id?.toString(),
            orderId: payment.orderId.toString(),
            createdAt: payment.createdAt?.toISOString(),
            updatedAt: payment.updatedAt?.toISOString(),
        };

        return sendResponse(200, true, "Payment fetched successfully", formattedPayment);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to fetch payment", null, {
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
            return sendResponse(400, false, "Invalid payment ID", null, {
                code: 400,
                details: "Valid payment ID is required.",
            });
        }

        const body = await request.json();

        const validationResult = updatePaymentSchema.safeParse(body);
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
        const result = await db.collection("payments").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return sendResponse(404, false, "Payment not found", null, {
                code: 404,
                details: "No payment found with the provided ID.",
            });
        }

        return sendResponse(200, true, "Payment updated successfully");
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to update payment", null, {
            code: 500,
            details: errorMessage,
        });
    }
}