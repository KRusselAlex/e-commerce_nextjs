import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { Image } from '@/types/image';
import { ObjectId } from 'mongodb';
import cloudinary from '@/lib/cloudinaryConfig';

export async function POST(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const formData = await request.formData();

        const productId = formData.get('productId') as string;
        const files = formData.getAll('file') as File[];

        if (!productId || !files.length) {
            return sendResponse(400, false, 'Product ID and at least one image file are required');
        }

        const objectId = new ObjectId(productId);

        const productExists = await db.collection('products').findOne({ _id: objectId });
        if (!productExists) {
            return sendResponse(404, false, 'Product not found');
        }

        const uploadedImages: Image[] = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'product_images',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(buffer);
            });

            const cloudinaryResult = uploadResult as {
                secure_url: string;
                public_id: string; // <-- Add this
            };

            const newImage: Image = {
                productId: objectId,
                url: cloudinaryResult.secure_url,
                publicId: cloudinaryResult.public_id, // <-- Store this
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await db.collection('images').insertOne(newImage);
            const insertedImage = await db.collection('images').findOne({ _id: result.insertedId });

            if (insertedImage) {
                const image: Image = {
                    productId: insertedImage.productId,
                    url: insertedImage.url,
                    createdAt: insertedImage.createdAt,
                    updatedAt: insertedImage.updatedAt,
                };
                uploadedImages.push(image);
            }
        }

        return sendResponse(201, true, 'Images uploaded successfully', uploadedImages);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        return sendResponse(500, false, errorMessage);
    }
}
