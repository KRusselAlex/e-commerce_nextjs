import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/apiResponse";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { Category } from "@/types/category";
import { ObjectId } from "mongodb";
import { categorySchema } from "@/lib/validationSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validationResult = categorySchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error.errors);
      return sendResponse(400, false, "Validation failed", null, {
        code: 400,
        details: formattedErrors,
      });
    }

    const { parentId, name } = validationResult.data;

   
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(parentId!);

    const existingCategory = await db
      .collection("categories")
      .findOne({ name });

    if (existingCategory) {
      throw new Error(`A category with the name "${name}" already exists.`);
    }

    console.log(objectId)
    if (parentId) {
      const parentExists = await db
        .collection("categories")
        .findOne({ _id: objectId });

      if (!parentExists) {
        return sendResponse(404, false, "categories  not found", null, {
          code: 404,
          details: `No category found with ID: ${objectId}`,
        });
      }
    }


    const newCategory: Omit<Category, "_id"> = {
      parentId: parentId ? objectId : null,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(newCategory);

    const createdCategory = {
      ...newCategory,
      _id: result.insertedId,
    };

    return sendResponse(
      201,
      true,
      "Category created successfully",
      createdCategory
    );
  } catch (error) {
    return sendResponse(500, false, "Failed to create category", null, {
      code: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// GET all categories
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db.collection("categories").find({}).toArray();

    return sendResponse(
      200,
      true,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    return sendResponse(500, false, "Failed to fetch categories", null, {
      code: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
