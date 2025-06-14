"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface ProductViewProps {
  productId: string;
}

const relatedProducts = [
  {
    id: 2,
    name: "Centrifugeuse de laboratoire",
    category: "Centrifugeuses",
    price: 1200,
    image: "/gojod.jpeg",
  },
  {
    id: 3,
    name: "Agitateur magnétique",
    category: "Agitateurs",
    price: 300,
    image: "/gojod.jpeg",
  },
  {
    id: 4,
    name: "Balance analytique",
    category: "Balances",
    price: 800,
    image: "/gojod.jpeg",
  },
];

export default function ProductView({ productId }: ProductViewProps) {
  const products = useProductStore((state) => state.products);
  const getProductById = useProductStore((state) => state.getProductById);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const product = getProductById(productId);

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || "/placeholder.png"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // If products list is empty, fetch
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const openModal = (img: string) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="bg-fourthly">
      <div className="px-2 md:px-16 py-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            <div className="w-full h-96 flex justify-center items-center overflow-hidden rounded-lg shadow-lg">
              <Image
                src={selectedImage}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full"
                onClick={() => openModal(selectedImage)}
              />
            </div>
            <div className="flex justify-center md:justify-start mt-4 gap-2">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className="w-20 h-20 border rounded-lg overflow-hidden hover:shadow-md"
                >
                  <Image
                    src={img}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center items-center md:items-start">
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-3">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mb-4">
              ${product.price}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="text-lg font-medium">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border p-2 rounded-md"
                min={1}
              />
            </div>

            <div className="flex gap-4">
              <Button
                className={`${
                  addedToCart ? "bg-gray-400" : "bg-blue-600"
                } text-white px-6 py-2 transition-all duration-200 rounded-md hover:bg-blue-700`}
                onClick={handleAddToCart}
                aria-label="Add to cart"
                disabled={addedToCart}
              >
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-start">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProducts.map((product) => (
              <Card
                key={product.id}
                className="p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Link
                  href={`/shop/${product.id}`}
                  className="w-full h-52 flex justify-center items-center overflow-hidden rounded-lg"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="w-full h-full"
                  />
                </Link>
                <CardContent className="mt-2 text-center">
                  <h2 className="text-lg">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Image Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-full max-h-full overflow-auto relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl"
              >
                &times;
              </button>
              <Image
                src={modalImage}
                alt={product.name}
                width={800}
                height={800}
                className="object-contain w-full max-h-[90vh]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
