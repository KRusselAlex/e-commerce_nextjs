
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse"; // Optional helper
import { hashPassword } from "@/lib/authUtils";
import { UserTypes } from "@/types/user";
import { userSchema } from "@/lib/validationSchemas";
import { formatZodErrors } from "@/lib/formatZodErrors";


export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const users = await db.collection("users")
            .find({})
            .project({ password: 0 }) // 👈 exclude passwords for security
            .toArray();

        return sendResponse(200, true, "Users fetched successfully", users);
        // Or without helper: return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return sendResponse(500, false, "Failed to fetch users", null, {
            details: error instanceof Error ? error.message : "Unknown error",
            code: 500
        });
    }
}


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


        return sendResponse(201, true, 'User registered successfully', result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}