import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { ObjectId } from "mongodb";
import { userSchema } from "@/lib/validationSchemas";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { hashPassword } from "@/lib/authUtils";
import { NextRequest } from "next/server";


// GET one user by ID
export async function GET(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const userId = url.pathname.split("/").pop();

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID", null, {
                code: 400,
                details: "Valid user ID is required.",
            });
        }


        const user = await db.collection("users").findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return sendResponse(404, false, "User not found");
        }

        return sendResponse(200, true, "User fetched successfully", user);
    } catch (error) {
        return sendResponse(500, false, "Error fetching user", null, {
            details: error instanceof Error ? error.message : "Unknown error",
            code: 500,
        });
    }
}

// UPDATE user by ID
export async function PUT(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const userId = url.pathname.split("/").pop();

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID");
        }

        const body = await request.json();
        const result = userSchema.partial().safeParse(body); // Allow partial updates

        if (!result.success) {
            const formattedErrors = formatZodErrors(result.error.errors);
            return sendResponse(400, false, "Validation failed", null, {
                details: formattedErrors,
                code: 500
            });
        }

        const updateData = {
            ...result.data,
            updatedAt: new Date(),
        };

        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

        const updateResult = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (updateResult.matchedCount === 0) {
            return sendResponse(404, false, "User not found");
        }

        return sendResponse(200, true, "User updated successfully");
    } catch (error) {
        return sendResponse(500, false, "Error updating user", null, {
            details: error instanceof Error ? error.message : "Unknown error",
            code: 500
        });
    }
}

// DELETE user by ID
export async function DELETE(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const userId = url.pathname.split("/").pop();

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID");
        }


        const deleteResult = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

        if (deleteResult.deletedCount === 0) {
            return sendResponse(404, false, "User not found");
        }

        return sendResponse(200, true, "User deleted successfully");
    } catch (error) {
        return sendResponse(500, false, "Error deleting user", null, {
            details: error instanceof Error ? error.message : "Unknown error",
            code: 500
        });
    }
}
