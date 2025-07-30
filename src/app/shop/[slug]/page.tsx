"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./style.css";
import ProductView from "@/components/shop/product/product";
import { useRouter, useParams } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { useEffect, useState } from "react";
import { ProductTypes } from "@/types/product";

export default function Product() {
  const router = useRouter();
  const { slug } = useParams();

  const { getProductById, fetchProducts } = useProductStore();
  const [product, setProduct] = useState<ProductTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || (Array.isArray(slug) && slug.length === 0)) {
      router.push("/notfound");
      return;
    }

    const id = Array.isArray(slug) ? slug[0] : slug;

    // Try to get product from store, or fetch all if not found
    const existingProduct = getProductById(id);
    if (existingProduct) {
      setProduct(existingProduct);
      setLoading(false);
    } else {
      fetchProducts().then(() => {
        const fetchedProduct = getProductById(id);
        if (!fetchedProduct) {
          router.push("/notfound");
        } else {
          setProduct(fetchedProduct);
        }
        setLoading(false);
      });
    }
  }, [slug, getProductById, fetchProducts, router]);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (!product)
    return (
      <div className="text-center text-red-500 py-10">Produit introuvable</div>
    );

  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center p-2 items-center">
          <h1 className="text-xl md:text-4xl font-bold text-center mb-4">
            Product
          </h1>
          <p className="text-center mb-8">
            Discover the Story Behind A&apos;Space D: Where Anime Meets Fashion
          </p>
        </div>
      </div>

      {/* ✅ pass actual product object */}
      <ProductView
        product={{
          ...product,
          _id: product._id?.toString() ?? "",
        }}
      />

      <Footer />
    </div>
  );
}
