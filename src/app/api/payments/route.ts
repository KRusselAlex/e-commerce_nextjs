// app/api/payments/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { z } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { generatePaymentReference } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { PaymentStatus } from "@/types/payment";

const createPaymentSchema = z.object({
    orderId: z.string().refine((val) => ObjectId.isValid(val), "Invalid orderId"),
    amount: z.number().positive(),
    // currency: z.string().length(3),
    status: z.enum(["pending", "paid", "failed", "refunded", "cancelled"]),
    externalId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
});

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const payments = await db.collection("payments").find({}).toArray();

        if (!payments || payments.length === 0) {
            return sendResponse(200, true, "No payments found", []);
        }

        const formattedPayments = payments.map((payment) => ({
            ...payment,
            _id: payment._id?.toString(),
            orderId: payment.orderId.toString(),
            createdAt: payment.createdAt?.toISOString(),
            updatedAt: payment.updatedAt?.toISOString(),
        }));

        return sendResponse(200, true, "Payments fetched successfully", formattedPayments);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to fetch payments", null, {
            code: 500,
            details: errorMessage,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validationResult = createPaymentSchema.safeParse(body);

        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, "Validation failed", null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const data = validationResult.data;

        const { db } = await connectToDatabase();

        // ✅ Verify that the order exists
        const orderId = new ObjectId(data.orderId);
        const order = await db.collection("orders").findOne({ _id: orderId });

        if (!order) {
            return sendResponse(404, false, "Order not found", null, {
                code: 404,
                details: "No order found with the provided ID.",
            });
        }

        // ✅ Generate reference ID and insert payment
        const referenceId = generatePaymentReference();

        const newPayment = {
            orderId: orderId,
            referenceId,
            amount: data.amount,
            currency: "CFA",
            method: null,
            status: data.status as PaymentStatus,
            externalId: data.externalId,
            metadata: data.metadata ?? {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("payments").insertOne(newPayment);

        const createdPayment = {
            ...newPayment,
            _id: result.insertedId.toString(),
            orderId: data.orderId,
        };

        return sendResponse(201, true, "Payment created successfully", createdPayment);
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Failed to create payment", null, {
            code: 500,
            details: errorMessage,
        });
    }
  }