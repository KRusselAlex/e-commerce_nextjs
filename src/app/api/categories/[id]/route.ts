import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { formatZodErrors } from '@/lib/formatZodErrors';

// Category Validation Schema
const categorySchema = z.object({
    parentId: z.string().optional().nullable(),
    name: z.string().min(1, 'Category name is required'),
});

// GET: Fetch category by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { db } = await connectToDatabase();

        const category = await db.collection('categories').findOne({
            _id: new ObjectId(params.id),
        });

        if (!category) {
            return sendResponse(404, false, 'Category not found', null, {
                code: 404,
                details: 'No category found with the provided ID',
            });
        }

        return sendResponse(200, true, 'Category fetched successfully', category);
    } catch (error) {
        return sendResponse(500, false, 'Failed to fetch category', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

// PUT: Update category by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { db } = await connectToDatabase();
        const body = await request.json();

        const validationResult = categorySchema.safeParse(body);
        if (!validationResult.success) {
            const formattedErrors = formatZodErrors(validationResult.error.errors);
            return sendResponse(400, false, 'Validation failed', null, {
                code: 400,
                details: formattedErrors,
            });
        }

        // ID validation
        const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
        if (!params.id || !isValidObjectId(params.id)) {
            return sendResponse(400, false, 'Invalid ID format', null, {
                code: 400,
                details: 'The provided ID is not a valid MongoDB ObjectId.',
            });
        }

        const { parentId, name } = validationResult.data;

        const updatedCategory = {
            parentId: parentId || null,
            name,
            updatedAt: new Date(),
        };

        const result = await db.collection('categories').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: updatedCategory }
        );

        if (result.matchedCount === 0) {
            return sendResponse(404, false, 'Category not found', null, {
                code: 404,
                details: 'No category found with the provided ID',
            });
        }

        return sendResponse(200, true, 'Category updated successfully', updatedCategory);
    } catch (error) {
        return sendResponse(500, false, 'Failed to update category', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
  

// DELETE: Delete category by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { db } = await connectToDatabase();

        const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
        if (!params.id || !isValidObjectId(params.id)) {
            return sendResponse(400, false, 'Invalid ID format', null, {
                code: 400,
                details: 'The provided ID is not a valid MongoDB ObjectId.',
            });
        }

        const result = await db.collection('categories').deleteOne({
            _id: new ObjectId(params.id),
        });

        if (result.deletedCount === 0) {
            return sendResponse(404, false, 'Category not found', null, {
                code: 404,
                details: 'No category found with the provided ID',
            });
        }

        return sendResponse(200, true, 'Category deleted successfully');
    } catch (error) {
        return sendResponse(500, false, 'Failed to delete category', null, {
            code: 500,
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}