// lib/paymentService.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

/**
 * Gets orderId from paymentId
 */
export async function getOrderIdFromPaymentId(paymentId: string): Promise<string> {
    const { db } = await connectToDatabase();
    const payment = await db.collection("payments").findOne(
        { _id: new ObjectId(paymentId) },
        { projection: { orderId: 1 } }
    );

    if (!payment) {
        throw new Error("Payment not found");
    }

    return payment.orderId.toString();
}

/**
 * Updates payment + order atomically
 */
export async function updatePaymentAndOrderStatus(
    paymentId: string,
    newPaymentStatus: string,
    newOrderStatus: string,
    method?: string
) {
    const { db } = await connectToDatabase();

    const paymentUpdateData: { status: string; updatedAt: Date; method?: string } = {
        status: newPaymentStatus,
        updatedAt: new Date(),
    };

    if (method) {
        paymentUpdateData.method = method;
    }

    // Update payment
    const paymentResult = await db.collection("payments").updateOne(
        { _id: new ObjectId(paymentId) },
        { $set: paymentUpdateData }
    );

    // Get orderId from payment
    const paymentDoc = await db.collection("payments").findOne({
        _id: new ObjectId(paymentId),
    });

    if (!paymentDoc) {
        throw new Error("Payment document not found");
    }

    // Update order
    const orderResult = await db.collection("orders").updateOne(
        { _id: new ObjectId(paymentDoc.orderId) },
        { $set: { paymentStatus: newOrderStatus, updatedAt: new Date() } }
    );

    if (paymentResult.modifiedCount === 0 || orderResult.modifiedCount === 0) {
        throw new Error("Update failed");
    }
  }