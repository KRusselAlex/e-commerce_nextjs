import { z } from 'zod';


// Define a schema for the product
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().min(1, 'Description must be at least 1 characters'),
    price: z.number().positive('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    stockQuantity: z.number().int().nonnegative('Stock quantity must be a non-negative integer'),
});

export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%^&*]/, "Must contain at least one special character"),

});




export type RegisterInput = z.infer<typeof userSchema>;

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

export const imageSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    // We now expect the file to be uploaded via FormData, not URL directly
});

export const categorySchema = z.object({
    parentId: z.string().optional().nullable(),
    name: z.string().min(1, 'Category name is required'),
});

const objectIdRegex = /^[a-f\d]{24}$/i;

export const cartSchema = z.object({
    userId: z.string().refine((val) => objectIdRegex.test(val), {
        message: "Invalid ObjectId format for userId",
    }),
    productId: z.string().refine((val) => objectIdRegex.test(val), {
        message: "Invalid ObjectId format for productId",
    }),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
});
