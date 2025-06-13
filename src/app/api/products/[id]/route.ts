import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { productSchema } from '@/lib/validationSchemas';
import { ProductTypes } from '@/types/product';
import cloudinary from '@/lib/cloudinaryConfig';

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { db } = await connectToDatabase();
        const id = context.params.id;


        // Step 1: Find the product by _id
        const product = await db.collection('products').findOne({
            _id: new ObjectId(id),
        });



        if (!product) {
            return sendResponse(404, false, 'Product not found', null, {
                code: 404,
                details: 'No product found with the provided ID',
            });
        }


        // Step 2: Find all images that match productId
        const images = await db.collection('images').find({
            productId: product._id,
        }).toArray();



        const categoryEntier = await db.collection('categories').findOne({
            _id: product.category,
        });

        // const categoryEntier = await db.collection('category').findOne({
        //     _id: product.category,
        // });

        // const category = categoryEntier?.name
        // console.log("cat name", category)
        const category = categoryEntier?.name
        console.log("cat name", category)


        // Step 3: Return product + associated images
        const productWithImages = {
            ...product,
            category,
            images,
        };

        return sendResponse(200, true, 'Product and images fetched successfully', productWithImages);
    } catch (error) {
        return sendResponse(500, false, 'Failed to fetch product and images', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
// Update a product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { db } = await connectToDatabase();
        const requestBody = await request.json();

        // Validate request body
        const validationResult = productSchema.safeParse(requestBody);
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors,
            });
        }

        // Prepare update data with timestamp
        const updatedProduct = {
            ...validationResult.data,
            updatedAt: new Date(),
        };

        // Update product in the database
        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: updatedProduct }
        );

        // Check if product was found and updated
        if (result.matchedCount === 0) {
            return sendResponse(404, false, 'Product not found', null, {
                code: 404,
                details: 'No product found with the provided ID',
            });
        }

        // Return success response
        return sendResponse(200, true, 'Product updated successfully', updatedProduct);
    } catch (error) {
        return sendResponse(500, false, 'Failed to update product', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

// Delete a product by ID and its associated images
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { db } = await connectToDatabase();
        const productId = new ObjectId(params.id);

        // Fetch all images for the product
        const images = await db.collection('images').find({ productId }).toArray();

        // Destroy each image from Cloudinary
        for (const image of images) {
            if (image.publicId) {
                await cloudinary.uploader.destroy(image.publicId);
            }
        }

        // Delete images from DB
        await db.collection('images').deleteMany({ productId });

        // Delete the product
        const result = await db.collection('products').deleteOne({ _id: productId });

        if (result.deletedCount === 0) {
            return sendResponse(404, false, 'Product not found', null, {
                code: 404,
                details: 'No product found with the provided ID',
            });
        }

        return sendResponse(200, true, 'Product and associated images deleted successfully');
    } catch (error) {
        return sendResponse(500, false, 'Failed to delete product and images', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}


export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const requestBody = await request.json();

        const validationResult = productSchema.safeParse(requestBody);
        const categoryId = validationResult.data?.category
        const objectId = new ObjectId(categoryId)

        // If validation fails, return an error response
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors, 
            });
        }

        // Check if product exists
        const categoryExists = await db.collection('categories').findOne({ _id: objectId });


        if (!categoryExists) {
            return sendResponse(404, false, 'category not found', null, {
                code: 404,
                details: `No category found with ID: ${objectId}`,
            });
        }


        const newProduct: ProductTypes = {
            ...validationResult.data,
            category: objectId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };


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




export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result; // { result: 'ok' } if successful
    } catch (error) {
        throw new Error(`Failed to delete image: ${error}`);
    }
}
