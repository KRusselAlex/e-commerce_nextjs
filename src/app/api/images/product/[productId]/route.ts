import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { Image } from '@/types/image';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();

        const url = new URL(request.url);
        const productId = url.pathname.split("/").pop();



        const objectId = new ObjectId(productId);

        // Fetch all images for this product
        const images = await db.collection<Image>('images')
            .find({ productId: objectId })
            .toArray();

        // if (!images.length) {
        //     return sendResponse(404, false, 'No images found for this product');
        // }

        return sendResponse(200, true, 'Images fetched successfully', images);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch images';
        return sendResponse(500, false, errorMessage);
    }
}