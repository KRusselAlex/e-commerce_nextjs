import { ObjectId } from 'mongodb';


export interface Image {
    _id?: ObjectId;  // Optional because MongoDB will generate this
    productId: ObjectId; // ID of the product this image belongs to
    url: string;
    publicId?: string; // URL or file path of the image
    createdAt?: Date; // Optional, can be set by the database
    updatedAt?: Date; // Optional, can be set by the database
}