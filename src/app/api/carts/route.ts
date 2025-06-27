import { sendResponse } from "@/lib/apiResponse";
import { connectToDatabase } from "@/lib/dbConnect";
import { CartItem } from "@/types/cart";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("Raw request body:", body);

        const { userId, productId, quantity = 1 } = body;

        if (!userId || !productId || quantity < 1) {
            console.warn("Validation failed: Missing required fields");
            return sendResponse(400, false, "Missing required fields", null, {
                code: 400,
                details: "userId, productId are required and quantity must be >= 1",
            });
        }

        const { db } = await connectToDatabase();

        const userObjectId = new ObjectId(userId);
        const productObjectId = new ObjectId(productId);

        console.log("Fetching user with ID:", userObjectId);
        const user = await db.collection("users").findOne({ _id: userObjectId });

        if (!user) {
            console.error("User not found for ID:", userObjectId);
            return sendResponse(404, false, "User not found", null, {
                code: 404,
                details: "The specified user does not exist.",
            });
        }

        console.log("Fetching product with ID:", productObjectId);
        const product = await db.collection("products").findOne({
            _id: productObjectId,
        });

        if (!product) {
            console.error("Product not found for ID:", productObjectId);
            return sendResponse(404, false, "Product not found", null, {
                code: 404,
                details: "The specified product does not exist.",
            });
        }

        // 🔍 Fetch the first image associated with this product
        const imageDoc = await db
            .collection("images")
            .findOne({ productId: productObjectId }, { sort: { createdAt: 1 } }); // get oldest image

        console.log("Looking for existing cart for user:", userObjectId);
        let cart = await db.collection("carts").findOne({ userId: userObjectId });

        if (!cart) {
            console.log("No existing cart found. Creating a new one.");
            const newCart = {
                userId: userObjectId,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await db.collection("carts").insertOne(newCart);
            cart = { ...newCart, _id: result.insertedId };
        }

        // 🔍 DEBUGGING: Log the current cart structure
        console.log("Current cart object:", JSON.stringify(cart, null, 2));

        console.log("Checking if cart.items exists:", cart?.items);
        if (!Array.isArray(cart.items)) {
            console.error("cart.items is not an array or is undefined:", cart.items);
            return sendResponse(500, false, "Invalid cart structure", null, {
                code: 500,
                details: "cart.items is not an array",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item: CartItem) => item.productId.toString() === productId
        );

        console.log("Item index in cart:", itemIndex);

        if (itemIndex > -1) {
            console.log("Updating existing item quantity...");
            cart.items[itemIndex].quantity += quantity;
        } else {
            console.log("Adding new item to cart...");
            cart.items.push({
                productId: productObjectId,
                quantity,
                name: product.name,
                price: product.price,
                image: imageDoc?.url || "/placeholder.png", // ✅ Use image.url from images collection
            });
        }

        console.log("Saving updated cart:", cart);

        await db.collection("carts").updateOne(
            { _id: cart._id },
            { $set: { items: cart.items, updatedAt: new Date() } }
        );

        console.log("Cart successfully updated");

        return sendResponse(200, true, "Cart updated successfully", {
            cartId: cart._id,
            items: cart.items,
        });
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        console.error("Caught error:", errorMessage);
        console.error("Full error object:", error);

        return sendResponse(500, false, "Failed to update cart", null, {
            code: 500,
            details: errorMessage,
        });
    }
}
// GET: Fetch all cart items
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const carts = await db.collection("carts").find({}).toArray();

        const formattedCarts = carts.map((cart) => ({
            ...cart,
            _id: cart._id.toString(),
            userId: cart.userId.toString(),
            productId: cart.productId.toString(),
        }));

        return sendResponse(200, true, "Cart items fetched successfully", formattedCarts);
    } catch (error) {
        return sendResponse(500, false, "Failed to fetch cart items", null, {
            code: 500,
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

