import { ObjectId } from 'mongodb';

// 🔹 One item in the cart
export interface CartItem {
    productId: ObjectId;         // Reference to the Product ID in DB
    quantity: number;            // Number of units
    name: string;                // Product name at time of addition
    price: number;               // Price at time of addition
    image?: string;              // Optional: Image URL or path
    totalPrice?: number;         // Optional: price * quantity
}

// 🔹 Full cart object stored in MongoDB
export interface Cart {
    _id?: ObjectId;              // MongoDB-generated ID
    userId: ObjectId;            // Reference to the User ID
    items: CartItem[];           // Array of products in the cart
    createdAt?: Date;            // Timestamp when cart was created
    updatedAt?: Date;            // Timestamp when cart was last updated
}