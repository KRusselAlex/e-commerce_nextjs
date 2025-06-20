"use client";

import { create } from "zustand";

type OrderItem = {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
};

type Order = {
    _id: string;
    userId: string;
    referenceId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
};

type OrderStore = {
    orders: Order[];
    setOrders: (orders: Order[]) => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    setOrders: (orders) => set({ orders }),
}));
