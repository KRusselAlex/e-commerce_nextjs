import { ObjectId } from 'mongodb';


export interface UserTypes {
    id?: ObjectId | string; 
    email: string;
    isVerified?: boolean;
    role: string;
    status: string;
    password?: string;
    verificationToken?: string,
    verificationExpires?:Date,
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}