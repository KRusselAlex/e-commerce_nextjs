import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { productSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { ProductTypes } from '@/types/product';

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await db.collection('products')
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination metadata
        const totalCount = await db.collection('products').countDocuments();

        return sendResponse(200, true, 'Products fetched successfully', {
            products,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}


export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const requestBody = await request.json();

        const validationResult = productSchema.safeParse(requestBody);

        // If validation fails, return an error response
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors,
            });
        }

        const newProduct: ProductTypes = validationResult.data;
        newProduct.createdAt = new Date();
        newProduct.updatedAt = new Date();

        const result = await db.collection('products').insertOne(newProduct);

        const insertedProduct = await db
            .collection('products')
            .findOne({ _id: result.insertedId });

        if (!insertedProduct) {
            return sendResponse(500, false, 'Failed to fetch inserted product', null, {
                code: 500,
                details: 'Failed to fetch inserted product',
            });
        }

        return sendResponse(201, true, 'Product created successfully', insertedProduct);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
        return sendResponse(500, false, errorMessage, null, {
            code: 500,
            details: errorMessage,
        });
    }
}