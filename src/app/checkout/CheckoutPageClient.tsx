"use client";

import CheckoutForm from "@/components/payment/payment";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/api";
// import { ProductTypes } from "@/types/product";

type BuyNowProduct = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode");
  const productId = searchParams.get("productId");
  const qty = parseInt(searchParams.get("qty") || "1");

  const [product, setProduct] = useState<BuyNowProduct | null>(null);

  console.log("product id:", productId);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (mode === "buy-now" && productId) {
          const response = await getProductById(productId);
          setProduct(response.data as BuyNowProduct);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [productId, mode]);

  if (!user)
    return <p className="text-center text-red-500 mt-10">Login required.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <CheckoutForm
        userId={user.id}
        product={mode === "buy-now" ? product ?? undefined : undefined}
        quantity={mode === "buy-now" ? qty : undefined}
      />
    </div>
  );
}
