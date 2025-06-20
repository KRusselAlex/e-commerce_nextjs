import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { Image } from '@/types/image';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
    try {
        const { db } = await connectToDatabase();
        const { productId } = params;

        if (!ObjectId.isValid(productId)) {
            return sendResponse(400, false, 'Invalid Product ID');
        }

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