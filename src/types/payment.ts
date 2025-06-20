// types/payment.ts
import { ObjectId } from "mongodb";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface Payment {
    _id?: ObjectId;
    orderId: ObjectId; // Reference to the order
    referenceId: string; // Human-readable ID like PAY-12345
    amount: number;
    currency: string | "CFA"; 
    status: PaymentStatus;
    method?: string; // e.g., "stripe", "paypal", "cash_on_delivery"
    externalId?: string; // e.g., Stripe Payment Intent ID ("pi_xxx")
    metadata?: Record<string, unknown>; // Optional extra info
    createdAt?: Date;
    updatedAt?: Date;
}