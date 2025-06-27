
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

// export async function GET(
//     request: NextRequest
// ) {
//     try {
//         const url = new URL(request.url);
//         const userId = url.pathname.split("/").pop();

//         if (!userId || !ObjectId.isValid(userId)) {
//             return sendResponse(400, false, "Invalid user ID", null, {
//                 code: 400,
//                 details: "Valid user ID is required.",
//             });
//         }

//         const userObjectId = new ObjectId(userId);

//         const { db } = await connectToDatabase();

//         // Query orders collection for this user
//         const orders = await db
//             .collection("orders")
//             .find({ userId: userObjectId })
//             .sort({ createdAt: -1 }) // newest first
//             .toArray();

//         if (!orders || orders.length === 0) {
//             return sendResponse(200, true, "No orders found for this user", []);
//         }

//         // Format response: convert ObjectIds to strings
//         const formattedOrders = orders.map((order) => ({
//             ...order,
//             _id: order._id.toString(),
//             userId: order.userId.toString(),
//             createdAt: order.createdAt?.toISOString(),
//             updatedAt: order.updatedAt?.toISOString(),
//         }));

//         return sendResponse(200, true, "Orders fetched successfully", formattedOrders);
//     } catch (error: unknown) {
//         let errorMessage = "Unknown error";

//         if (error instanceof Error) {
//             errorMessage = error.message;
//         } else if (typeof error === "string") {
//             errorMessage = error;
//         }

//         console.error("Caught error:", errorMessage);
//         return sendResponse(500, false, "Failed to fetch orders", null, {
//             code: 500,
//             details: errorMessage,
//         });
//     }
// }


export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split("/").pop();

        if (!userId || !ObjectId.isValid(userId)) {
            return sendResponse(400, false, "Invalid user ID", null, {
                code: 400,
                details: "Valid user ID is required.",
            });
        }

        const userObjectId = new ObjectId(userId);
        const { db } = await connectToDatabase();

        // Use aggregation to fetch orders + client data
        const orders = await db
            .collection("orders")
            .aggregate([
                {
                    $match: {
                        userId: userObjectId,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "client",
                    },
                },
                {
                    $unwind: {
                        path: "$client",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        referenceId: 1,
                        userId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        status: 1,
                        items: 1,
                        totalAmount: 1,
                        // client fields
                        "client._id": 1,
                        "client.name": 1,
                        "client.email": 1,

                    },
                },
            ])
            .toArray();

        if (!orders || orders.length === 0) {
            return sendResponse(200, true, "No orders found for this user", []);
        }

        // Format ObjectIds and Dates
        const formattedOrders = orders.map((order) => ({
            ...order,
            _id: order._id?.toString(),
            userId: order.userId?.toString(),
            createdAt: order.createdAt?.toISOString(),
            updatedAt: order.updatedAt?.toISOString(),
            client: order.client
                ? {
                    ...order.client,
                    _id: order.client._id?.toString(),
                }
                : null,
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
