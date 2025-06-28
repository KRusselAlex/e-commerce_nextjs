// types/order.ts
import { ObjectId } from "mongodb";
import { CartItem } from "@/types/cart";
import { PaymentStatus } from "./payment";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem extends Omit<CartItem, "productId"> {
  productId: string;
}

export interface Order {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  referenceId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: ShippingAddress; // ✅ new field
  paymentStatus: PaymentStatus;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled" | string;
  createdAt?: Date;
  updatedAt?: Date;
}
