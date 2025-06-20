
//// PRODUCTS ////

import { ProductTypes } from "@/types/product";
import axiosInstance from "./axiosInstance";
import { Category } from "@/types/category";
import { UserRegisterInput, UserTypes } from "@/types/user";


export const getProducts = () => axiosInstance.get("/products");
export const getProductById = (id: string) => axiosInstance.get(`/products/${id}`);
export const createProduct = (data: ProductTypes) => axiosInstance.post("/products", data);
export const updateProduct = (id: string, data: ProductTypes) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id: string) => axiosInstance.delete(`/products/${id}`);

//// IMAGES ////

export const getImagesByProductId = (productId: string) =>
    axiosInstance.get(`/images/product/${productId}`);

export const uploadImages = (formData: FormData) =>
    axiosInstance.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteImage = (imageId: string) => axiosInstance.delete(`/images/${imageId}`);

//// CARTS ////

export const getCart = () => axiosInstance.get("/carts");
export const getCartByUserId = async (userId: string) => {
    const res = await axiosInstance.get(`/carts/user/${userId}`);
    const cartData = res.data?.data?.[0]; // extract first cart from response
    return cartData?.items || []; // return only the items array
};
export const getCartItemById = (cartItemId: string) => axiosInstance.get(`/carts/${cartItemId}`);
export const addToCart = (productId: string, userId: string, quantity: number) =>
    axiosInstance.post("/carts", { productId, userId, quantity });
export const updateCartItem = (cartItemId: string, quantity: number) =>
    axiosInstance.put(`/carts/${cartItemId}`, { quantity });
export const removeCartItem = (cartItemId: string) => axiosInstance.delete(`/carts/${cartItemId}`);
export const clearCart = () => axiosInstance.delete("/carts/clear");
// In your api client
export const clearCartByUserId = (userId: string) =>
    axiosInstance.delete(`/carts/user/${userId}`);


//// CATEGORIES ////

export const getCategories = () => axiosInstance.get("/categories");
export const getCategoryById = (id: string) => axiosInstance.get(`/categories/${id}`);
export const createCategory = (data: Category) => axiosInstance.post("/categories", data);
export const updateCategory = (id: string, data: Category) => axiosInstance.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => axiosInstance.delete(`/categories/${id}`);

//// USERS ////

export const getUsers = () => axiosInstance.get("/users");
export const getUserById = (id: string) => axiosInstance.get(`/users/${id}`);
export const createUser = (data: UserTypes) => axiosInstance.post("/users", data);
export const updateUser = (id: string, data: UserTypes) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id: string) => axiosInstance.delete(`/users/${id}`);

//// AUTH ////

export const login = (credentials: { email: string; password: string }) =>
    axiosInstance.post("/auth/login", credentials);

export const register = (data: UserRegisterInput) => axiosInstance.post("/auth/register", data);
export const resetPassword = (email: string) => axiosInstance.post("/auth/reset-password", { email });
export const resetPasswordConfirm = (token: string, password: string) => axiosInstance.post("/auth/password-reset", { token, password });
export const logout = () => {
    localStorage.removeItem("userFeudjoToken");

    axiosInstance.post("/auth/logout")
};

//// ORDERS ////
export interface OrderRequest {
    userId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity?: number; // optional, defaults to 1
}
export const getOrders = () => axiosInstance.get("/orders");
export const getOrderById = (id: string) => axiosInstance.get(`/orders/${id}`);
export const getOrderByUserId = (userId: string) => axiosInstance.get(`/orders/user/${userId}`);
export const createOrder = (data: OrderRequest) => axiosInstance.post("/orders", data);
export const createCartOrder = (userId: string) => axiosInstance.post("/orders", { userId });
export const updateOrder = (id: string, status: string) => axiosInstance.put(`/orders/${id}`, { status });
export const deleteOrder = (id: string) => axiosInstance.delete(`/orders/${id}`);
