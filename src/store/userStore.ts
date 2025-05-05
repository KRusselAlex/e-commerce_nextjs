import { create } from "zustand";

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
}

interface UserStore {
    user: {
        name: string;
        email: string;
        password: string;
    };
    orders: Order[];
}

export const useUserStore = create<UserStore>(() => ({
    user: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
    },
    orders: [
        { id: "1001", date: "2025-02-01", total: 120.5, status: "Shipped" },
        { id: "1002", date: "2025-01-25", total: 75.99, status: "Processing" },
        { id: "1003", date: "2025-01-20", total: 45.0, status: "Delivered" },
    ],
}));
