import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { userSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { hashPassword} from '@/lib/authUtils';
import { verifyAccessToken } from '@/lib/jwtUtils';
import { UserTypes } from '@/types/user';
import { ObjectId } from 'mongodb';

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
            isVerified:true,
            createdAt: new Date(),
            updatedAt: new Date(),
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


// Get user profile (protected route)
export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();

        // Extract the token from the Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(401, false, 'Unauthorized', null, {
                code: 401,
                details: 'No token provided',
            });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = verifyAccessToken(token);

        if (!decodedToken) {
            return sendResponse(401, false, 'Unauthorized', null, {
                code: 401,
                details: 'Invalid token',
            });
        }

        const userId = decodedToken.userId;

        // Fetch the user from the database
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return sendResponse(404, false, 'User not found', null, {
                code: 404,
                details: 'User not found',
            });
        }

        // Remove sensitive data (password) before sending the response
        const userData = Object.fromEntries(
            Object.entries(user).filter(([key]) => key !== 'password')
        );

        return sendResponse(200, true, 'User profile fetched successfully', userData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}

// Update user profile (protected route)
// export async function PUT(request: Request) {
//     try {
//         const { db } = await connectToDatabase();
//         const requestBody = await request.json();

//         // Validate the request body
//         const validationResult = userSchema.safeParse(requestBody);
//         if (!validationResult.success) {
//             const formattedErrors = formatZodErrors(validationResult.error.errors);
//             return sendResponse(400, false, 'Validation failed', null, {
//                 code: 400,
//                 details: formattedErrors,
//             });
//         }

//         const { email, password, name } = validationResult.data;

//         // Hash the new password if provided
//         const hashedPassword = password ? await hashPassword(password) : undefined;

//         // Update the user
//         const updateData = {
//             email,
//             name,
//             updatedAt: new Date(),
//             ...(hashedPassword && { password: hashedPassword }),
//         };

//         const result = await db
//             .collection('users')
//             .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

//         if (result.matchedCount === 0) {
//             return sendResponse(404, false, 'User not found', null, {
//                 code: 404,
//                 details: 'User not found',
//             });
//         }

//         return sendResponse(200, true, 'User profile updated successfully', null);
//     } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Failed to update user profile';
//         return sendResponse(500, false, errorMessage, null, {
//             code: 500,
//             details: errorMessage,
//         });
//     }
// }

// Delete user account (protected route)
export async function DELETE(request: Request) {
    try {
        const { db } = await connectToDatabase();

        // Extract the token from the Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(401, false, 'Unauthorized', null, {
                code: 401,
                details: 'No token provided',
            });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = verifyAccessToken(token);

        if (!decodedToken) {
            return sendResponse(401, false, 'Unauthorized', null, {
                code: 401,
                details: 'Invalid token',
            });
        }

        const userId = decodedToken.userId;

        // Delete the user
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return sendResponse(404, false, 'User not found', null, {
                code: 404,
                details: 'User not found',
            });
        }

        return sendResponse(200, true, 'User account deleted successfully', null);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user account';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}