import { create } from "zustand";
import { ObjectId } from "mongodb";
import { Category } from "@/types/category";


interface CategoryStore {
    categories: Category[];
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addCategory: (category: Category) => void;
    updateCategory: (id: ObjectId | string, updated: Partial<Category>) => void;
    removeCategory: (id: ObjectId | string) => void;
    setCategories: (categories: Category[]) => void;
    fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    loading: false,
    error: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
    updateCategory: (id, updated) =>
        set((state) => ({
            categories: state.categories.map((c) =>
                (c._id?.toString() ?? c._id) === id.toString()
                    ? { ...c, ...updated }
                    : c
            ),
        })),
    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter(
                (c) => (c._id?.toString() ?? c._id) !== id.toString()
            ),
        })),
    setCategories: (categories) => set({ categories }),
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            const data = await res.json();
            console.log("Fetched categories:", data.data);
            set({ categories: data?.data, loading: false });
        } catch (err: any) {
            set({ error: err.message || "Unknown error", loading: false });
        }
    },
}));