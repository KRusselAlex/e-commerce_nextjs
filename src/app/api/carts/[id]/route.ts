// app/api/carts/[id]/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";

const updateCartSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().int().positive(),
        image: z.string(),
    })).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return sendResponse(400, false, "Invalid cart ID", null, {
                code: 400,
                details: "Valid cart ID is required.",
            });
        }

        const { db } = await connectToDatabase();
        const cart = await db.collection("carts").findOne({ _id: new ObjectId(id) });

        if (!cart) {
            return sendResponse(404, false, "Cart not found", null, {
                code: 404,
                details: "No cart found with the provided ID.",
            });
        }

        const formattedCart = {
            ...cart,
            _id: cart._id.toString(),
            userId: cart.userId.toString(),
            items: Array.isArray(cart.items) ? cart.items : [],
            createdAt: cart.createdAt?.toISOString(),
            updatedAt: cart.updatedAt?.toISOString(),
        };

        return sendResponse(200, true, "Cart fetched successfully", formattedCart);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to fetch cart", null, {
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
            return sendResponse(400, false, "Invalid cart ID", null, {
                code: 400,
                details: "Valid cart ID is required.",
            });
        }

        const body = await request.json();

        const validationResult = updateCartSchema.safeParse(body);
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
        const result = await db.collection("carts").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return sendResponse(404, false, "Cart not found", null, {
                code: 404,
                details: "No cart found with the provided ID.",
            });
        }

        return sendResponse(200, true, "Cart updated successfully");
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to update cart", null, {
            code: 500,
            details: errorMessage,
        });
    }
}

