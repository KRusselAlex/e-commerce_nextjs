import { connectToDatabase } from '@/lib/dbConnect';
import { sendResponse } from '@/lib/apiResponse';
import { productSchema } from '@/lib/validationSchemas';
import { formatZodErrors } from '@/lib/formatZodErrors';
import { ProductTypes } from '@/types/product';
import { ObjectId } from 'mongodb';

// Example: product.ts
export interface ProductDocument {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    category: string | ObjectId;
    stockQuantity: number;
    // Other fields...
    images?: string[];
}

export interface ImageDocument {
    _id: ObjectId;
    productId: ObjectId;
    url: string;
}


export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        // const skip = (page - 1) * limit;

        const products = await db.collection<ProductDocument>('products')
            .find({})
            // .skip(skip)
            // .limit(limit)
            .toArray();

        const productIds = products.map((product) => product._id);

        const images = await db.collection<ImageDocument>('images')
            .find({ productId: { $in: productIds } })
            .toArray();

        const imagesByProductId: Record<string, string[]> = {};
        images.forEach((img) => {
            const pid = img.productId.toString();
            if (!imagesByProductId[pid]) imagesByProductId[pid] = [];
            if (img.url) imagesByProductId[pid].push(img.url);
        });

        const productsWithImages = products.map((product) => ({
            ...product,
            images: imagesByProductId[product._id.toString()] || [],
        }));

        const totalCount = await db.collection('products').countDocuments();

        return sendResponse(200, true, 'Products fetched successfully', {
            products: productsWithImages,
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

        const ProductName = validationResult.data?.name

        const existingProduct = await db
            .collection("products")
            .findOne({ name: ProductName });
        console.log("exist", existingProduct)

        if (existingProduct) {
            throw new Error(`A product with the name "${ProductName}" already exists.`);
        }

        const newProduct: ProductTypes = {
            ...validationResult.data,
            category: new ObjectId(validationResult.data.category),
            createdAt: new Date(),
            updatedAt: new Date()

        }


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