import { z } from 'zod';

// Define a schema for the product
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    stockQuantity: z.number().int().nonnegative('Stock quantity must be a non-negative integer'),
});

export const userSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[!@#$%^&*]/, { message: 'Password must contain at least one special character !@#$%^&*  ' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});