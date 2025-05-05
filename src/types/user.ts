import { ObjectId } from 'mongodb';

export interface UserTypes {
    _id?: ObjectId; 
    email: string;
    isVerified: boolean;
    password: string;
    verificationToken?: string,
    verificationExpires?:Date,
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}