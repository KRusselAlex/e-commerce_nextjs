export interface Cart {
    _id?: string;         // Optional: MongoDB will generate this
    userId: string;       // ID of the user who owns the cart
    productId: string;    // ID of the product added to the cart
    quantity: number;     // Number of units of the product in the cart
    createdAt?: Date;     // Optional: Timestamp when the item was added
    updatedAt?: Date;     // Optional: Timestamp when the item was last updated
}
