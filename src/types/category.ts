import { ObjectId } from 'mongodb';


export interface Category {
    _id?: ObjectId | string; // Optional because MongoDB will generate this
    parentId: ObjectId | null; // ID of the product this image belongs to
    name: string; // URL or file path of the image
    createdAt?: Date; // Optional, can be set by the database
    updatedAt?: Date; // Optional, can be set by the database
}