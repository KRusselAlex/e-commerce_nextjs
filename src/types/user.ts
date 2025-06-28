import { ObjectId } from 'mongodb';

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "inactive" | "suspended";
export interface UserTypes {
    _id?: ObjectId;
    email: string;
    isVerified: boolean;
    role: UserRole;
    status: UserStatus;
    password?: string;
    verificationToken?: string;
    verificationExpires?: Date;
    name: string;
    phone?: string;
    address?: string;
    avatar?: string; // URL to the user's avatar imag
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserRegisterInput {
    name: string;
    email: string;
    password: string;
}
export interface UserLoginInput {
    email: string;
    password: string;
}