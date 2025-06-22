import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { userSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { hashPassword } from '@/lib/authUtils';
import { UserTypes } from '@/types/user';


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

        // Check if the user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return sendResponse(409, false, 'User already exists', null, {
                code: 409,
                details: 'User with this email already exists',
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser: UserTypes = {
            email,
            password: hashedPassword,
            name,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: 'user',
            status: 'active'
        };

        const result = await db.collection('users').insertOne(newUser);


        return sendResponse(201, true, 'User registered successfully',result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}