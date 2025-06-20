import { Image } from "@/types/image";
import { create } from "zustand";
import { ObjectId } from 'mongodb';


interface ImageStore {
    images: Image[];
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addImage: (image: Image) => void;
    updateImage: (id: ObjectId | string, updated: Partial<Image>) => void;
    removeImage: (id: ObjectId | string) => void;
    setImages: (images: Image[]) => void;
    fetchImages: (productId?: ObjectId | string) => Promise<void>;
}

export const useImageStore = create<ImageStore>((set) => ({
    images: [],
    loading: false,
    error: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addImage: (image) =>
        set((state) => ({ images: [...state.images, image] })),
    updateImage: (id, updated) =>
        set((state) => ({
            images: state.images.map((img) =>
                (img._id?.toString() ?? img._id) === id.toString()
                    ? { ...img, ...updated }
                    : img
            ),
        })),
    removeImage: (id) =>
        set((state) => ({
            images: state.images.filter(
                (img) => (img._id?.toString() ?? img._id) !== id.toString()
            ),
        })),
    setImages: (images) => set({ images }),
    fetchImages: async (productId) => {
        set({ loading: true, error: null });
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            let url = `${baseUrl}/api/images`;
            if (productId) {
                url += `?productId=${productId}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch images");
            const data = await res.json();
            set({ images: data?.data, loading: false });
        } catch (err: unknown) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            } else {
                set({ error: "Unknown error", loading: false });
            }
        }
    },
}));