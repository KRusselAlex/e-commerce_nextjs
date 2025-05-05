import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { productSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { ProductTypes } from '@/types/product';
// import { ObjectId } from 'mongodb';
// import { NextRequest} from 'next/server';

// // Get a single product
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const { db } = await connectToDatabase();
//         const product = await db.collection('products').findOne({ _id: new ObjectId(params.id) });

//         if (!product) {
//             return sendResponse(404, false, 'Product not found', null, {
//                 code: 404,
//                 details: 'No product found with the provided ID',
//             });
//         }

//         return sendResponse(200, true, 'Product fetched successfully', product);
//     } catch (error) {
//         return sendResponse(500, false, 'Failed to fetch product', null, {
//             code: 500,
//             details: error instanceof Error ? error.message : 'Unknown error',
//         });
//     }
// }

// // Update a product
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const { db } = await connectToDatabase();
//         const requestBody = await request.json();

//         const validationResult = productSchema.safeParse(requestBody);
//         if (!validationResult.success) {
//             const formattedErrors = formatZodErrors(validationResult.error.errors);
//             return sendResponse(400, false, 'Validation failed', null, {
//                 code: 400,
//                 details: formattedErrors,
//             });
//         }

//         const updatedProduct = {
//             ...validationResult.data,
//             updatedAt: new Date(),
//         };

//         const result = await db.collection('products').updateOne(
//             { _id: new ObjectId(params.id) },
//             { $set: updatedProduct }
//         );

//         if (result.matchedCount === 0) {
//             return sendResponse(404, false, 'Product not found', null, {
//                 code: 404,
//                 details: 'No product found with the provided ID',
//             });
//         }

//         return sendResponse(200, true, 'Product updated successfully', updatedProduct);
//     } catch (error) {
//         return sendResponse(500, false, 'Failed to update product', null, {
//             code: 500,
//             details: error instanceof Error ? error.message : 'Unknown error',
//         });
//     }
// }

// // Delete a product
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const { db } = await connectToDatabase();
//         const result = await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });

//         if (result.deletedCount === 0) {
//             return sendResponse(404, false, 'Product not found', null, {
//                 code: 404,
//                 details: 'No product found with the provided ID',
//             });
//         }

//         return sendResponse(200, true, 'Product deleted successfully');
//     } catch (error) {
//         return sendResponse(500, false, 'Failed to delete product', null, {
//             code: 500,
//             details: error instanceof Error ? error.message : 'Unknown error',
//         });
//     }
// }


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