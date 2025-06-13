import { ObjectId } from 'mongodb';

export interface ProductTypes {
    _id?: ObjectId; // Optional because MongoDB will generate this
    name: string;
    description: string;
    price: number;
    category: ObjectId | string;
    stockQuantity: number;
    images?: string[];
    createdAt?: Date; // Optional, can be set by the database
    updatedAt?: Date; // Optional, can be set by the database
}