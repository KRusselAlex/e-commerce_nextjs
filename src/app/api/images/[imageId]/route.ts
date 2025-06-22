import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { Image } from '@/types/image';
import { ObjectId } from 'mongodb';
import cloudinary from '@/lib/cloudinaryConfig';

export async function DELETE(
    request: NextRequest
) {
    try {
        const { db } = await connectToDatabase();

        const url = new URL(request.url);
        const imageId = url.pathname.split("/").pop();


        const imageObjectId = new ObjectId(imageId);

        // Step 1: Find the image in the DB
        const image = await db.collection<Image>('images').findOne({
            _id: imageObjectId,
        });

        if (!image) {
            return sendResponse(404, false, 'Image not found');
        }

        // Step 2: Delete from Cloudinary (if publicId exists)
        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId, (error, result) => {
                console.log(result);
                if (error) {
                    console.error('Cloudinary deletion error:', error);
                }
            });
        }

        // Step 3: Delete from MongoDB
        const deleteResult = await db
            .collection('images')
            .deleteOne({ _id: imageObjectId });

        if (deleteResult.deletedCount === 0) {
            return sendResponse(500, false, 'Failed to delete image from database');
        }

        return sendResponse(200, true, 'Image deleted successfully');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
        return sendResponse(500, false, errorMessage);
    }
}