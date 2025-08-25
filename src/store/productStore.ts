import { create } from "zustand";
import { ObjectId } from "mongodb";
import { ProductTypes } from "@/types/product";

interface ProductStore {
    products: ProductTypes[];
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addProduct: (product: ProductTypes) => void;
    updateProduct: (id: ObjectId | string, updated: Partial<ProductTypes>) => void;
    removeProduct: (id: ObjectId | string) => void;
    setProducts: (products: ProductTypes[]) => void;
    fetchProducts: () => Promise<void>;
    getProductById: (id: ObjectId | string) => ProductTypes | undefined; // 👈 new method
}


export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addProduct: async (product) => {
        set({ loading: true, error: null });
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            if (!res.ok) throw new Error("Failed to add product");
            const data = await res.json();
            set((state) => ({
                products: [...state.products, data.data.product],
                loading: false,
            }));
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            set({ error: errorMessage, loading: false });
        }
    },
    updateProduct: (id, updated) =>
        set((state) => ({
            products: state.products.map((p) =>
                (p._id?.toString() ?? p._id) === id.toString()
                    ? { ...p, ...updated }
                    : p
            ),
        })),
    removeProduct: (id) =>
        set((state) => ({
            products: state.products.filter(
                (p) => (p._id?.toString() ?? p._id) !== id.toString()
            ),
        })),
    setProducts: (products) => set({ products }),
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/products`);
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            console.log("Fetched products:", data.data.products);
            set({ products: data?.data?.products?.reverse() || [], loading: false });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            set({ error: errorMessage, loading: false });
        }
    },
    getProductById: (id) =>
        get().products.find(
            (p) => (p._id?.toString() ?? p._id) === id.toString()
        ),
}));
