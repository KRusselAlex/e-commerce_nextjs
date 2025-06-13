import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { userSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { hashPassword } from '@/lib/authUtils';
import { sendVerificationEmail } from '@/lib/emailUtils';
import { UserTypes } from '@/types/user';
import crypto from 'crypto';


// Register a new user
export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const requestBody = await request.json();

        // Validate the request body
        const validationResult = userSchema.safeParse(requestBody);
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const { email, password, name } = validationResult.data;

        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return sendResponse(409, false, 'User already exists', null, {
                code: 409,
                details: 'User with this email already exists',
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24); // Expires in 24 hours

        // Create a new user
        const newUser: UserTypes = {
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            verificationToken,
            verificationExpires,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);
        const userId = result.insertedId.toString();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return sendResponse(201, true, 'User registered successfully. Please check your email to verify your account.', { userId });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}
