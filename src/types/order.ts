// types/order.ts
import { ObjectId } from "mongodb";
import { CartItem } from "@/types/cart";
import { PaymentStatus } from "./payment";

export interface OrderItem extends Omit<CartItem, "productId"> {
  productId: string; // Use string for readability in frontend/UI
}

export interface Order {
  _id?: ObjectId | string; // Use ObjectId for backend, string for frontend
  userId: ObjectId | string; // Use ObjectId for backend, string for frontend
  referenceId: string; // Human-readable ID like ORDER-12345
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled" | string;
  createdAt?: Date;
  updatedAt?: Date;
}