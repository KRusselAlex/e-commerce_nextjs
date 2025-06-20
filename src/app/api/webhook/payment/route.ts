
import { sendResponse } from "@/lib/apiResponse";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getOrderIdFromPaymentId, updatePaymentAndOrderStatus } from "@/lib/paymentService";
import { formatZodErrors } from "@/lib/formatZodErrors";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const WebhookSchema = z.object({
            paymentId: z.string().refine((val) => ObjectId.isValid(val), "Invalid payment ID"),
            status: z.enum(["pending", "paid", "failed", "refunded"]),
            method: z.string().optional(),
        });

        const validationResult = WebhookSchema.safeParse(body);

        if (!validationResult.success) {
            return sendResponse(400, false, "Validation failed", null, {
                code: 400,
                details: formatZodErrors(validationResult.error.errors),
            });
        }

        const { paymentId, status, method } = validationResult.data;

        // 🔍 Get orderId from paymentId
        const orderId = await getOrderIdFromPaymentId(paymentId);

        // ✅ Update both in one transaction
        await updatePaymentAndOrderStatus(paymentId, status, status, method);

        return sendResponse(200, true, "Payment and order updated successfully", {
            paymentId,
            orderId,
            status,
            method,
        });
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        return sendResponse(500, false, "Webhook handler failed", null, {
            code: 500,
            details: errorMessage,
        });
    }
  }