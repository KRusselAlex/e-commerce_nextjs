import { create } from "zustand";
import {
    getCartByUserId,
    getCartItemById,
    addToCart as apiAddToCart,
    updateCartItem,
    removeCartItem as apiRemoveCartItem,
    clearCartByUserId,
} from "@/lib/api"; // Adjust path if needed

interface CartItem {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

interface CartStore {
    cartItems: CartItem[];
    fetchCart: (userId: string) => Promise<void>;
    getCartItem: (cartItemId: string) => Promise<CartItem | null>;
    addToCart: (productId: string, userId: string, quantity: number) => Promise<void>;
    updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
    removeFromCart: (userId: string, cartItemId: string) => Promise<void>;
    clearCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
    cartItems: [],

    fetchCart: async (userId) => {
        try {
            const items = await getCartByUserId(userId); // already returns `items[]`
            set({ cartItems: items });
        } catch (error) {
            console.error("❌ Failed to fetch cart by user ID:", error);
        }
    },

    getCartItem: async (cartItemId) => {
        try {
            const { data } = await getCartItemById(cartItemId);
            return data; // assuming it returns single cart item shaped like CartItem
        } catch (error) {
            console.error("❌ Failed to fetch cart item by ID:", error);
            return null;
        }
    },

    addToCart: async (productId, userId, quantity) => {
        try {
            const { data } = await apiAddToCart(productId, userId, quantity);
            // You might need to refetch cart instead for full sync
            set((state) => ({
                cartItems: [...state.cartItems, {
                    productId: data.productId,
                    quantity: data.quantity,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                }],
            }));
        } catch (error) {
            console.error("❌ Failed to add to cart:", error);
        }
    },

    updateCartItem: async (cartItemId, quantity) => {
        try {
            const { data } = await updateCartItem(cartItemId, quantity);
            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.productId === data.productId
                        ? { ...item, quantity: data.quantity }
                        : item
                ),
            }));
        } catch (error) {
            console.error("❌ Failed to update cart item:", error);
        }
    },

    removeFromCart: async (userId, cartItemId) => {
        try {
            await apiRemoveCartItem(userId, cartItemId);

        } catch (error) {
            console.error("❌ Failed to remove cart item:", error);
        }
    },

    clearCart: async (userId) => {
        try {
            await clearCartByUserId(userId);
            set({ cartItems: [] });
        } catch (error) {
            console.error("❌ Failed to clear cart:", error);
        }
    },
}));
