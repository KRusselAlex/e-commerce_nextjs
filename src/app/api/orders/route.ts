// app/api/orders/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { generateOrderReference } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { CartItem } from "@/types/cart";

interface OrderItemRoute {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}
  

const buyNowSchema = z.object({
    userId: z.string().refine((val) => ObjectId.isValid(val), "Invalid userId"),
    productId: z.string().refine((val) => ObjectId.isValid(val), "Invalid productId"),
    name: z.string(),
    price: z.number(),
    image: z.string(),
    quantity: z.number().int().positive().optional().default(1),
});

const cartSchema = z.object({
    userId: z.string().refine((val) => ObjectId.isValid(val), "Invalid userId"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate if it's a "Buy Now" request
        const buyNowResult = buyNowSchema.safeParse(body);
        const cartResult = cartSchema.safeParse(body);

        let orderItems = [];
        let userId: ObjectId;

        const { db } = await connectToDatabase();

        if (buyNowResult.success) {
            const data = buyNowResult.data;

            userId = new ObjectId(data.userId);
            orderItems = [
                {
                    productId: data.productId,
                    name: data.name,
                    price: data.price,
                    quantity: data.quantity || 1,
                    image: data.image,
                },
            ];
        } else if (cartResult.success) {
            const data = cartResult.data;
            userId = new ObjectId(data.userId);

            const cart = await db.collection("carts").findOne({ userId });

            if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
                return sendResponse(404, false, "Cart not found or empty", null, {
                    code: 404,
                    details: "No active cart found for this user.",
                });
            }

            orderItems = cart.items.map((item: CartItem) => ({
                ...item,
                productId: item.productId.toString(),
            }));
        } else {
            const formattedErrors = formatZodErrors([
                ...(buyNowResult.error?.errors || []),
                ...(cartResult.error?.errors || []),
            ]);
            return sendResponse(400, false, "Validation failed", null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const totalAmount = orderItems.reduce(
            (sum: number, item: OrderItemRoute ) => sum + item.price * item.quantity,
            0
        );

        const referenceId = generateOrderReference();

        const orderData = {
            userId,
            referenceId,
            items: orderItems,
            totalAmount,
            status: "pending",
            paymentStatus: "pending", 
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection("orders").insertOne(orderData);

        // 🧹 Clear cart if it exists
        await db.collection("carts").deleteOne({ userId });

        return sendResponse(201, true, "Order created successfully", {
            referenceId,
            totalAmount,
            itemCount: orderItems.length,
        });
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to create order", null, {
            code: 500,
            details: errorMessage,
        });
    }
}


export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();

        if (!orders || orders.length === 0) {
            return sendResponse(200, true, "No orders found", []);
        }

        // Format response (convert ObjectIds to strings)
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