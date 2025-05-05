"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./style.css";
import ProductView from "@/components/shop/product/product";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing the left arrow icon
import { useRouter, useParams } from "next/navigation";

export default function Product() {
  const router = useRouter(); // Using the router hook
  let { slug } = useParams();
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    slug = "alex";
  }

  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center p-2 items-center">
          <div
            className="  cursor-pointer text-xl"
            onClick={() => router.back()} // Go back to the previous page
          >
            <AiOutlineArrowLeft />
          </div>
          <h1 className="text-xl md:text-4xl font-bold text-center mb-4">
            Product
          </h1>
          <p className="text-center mb-8">
            Discover the Story Behind A&apos;Space D: Where Anime Meets Fashion
          </p>
        </div>
      </div>
      <ProductView productId={Array.isArray(slug) ? slug[0] : slug ?? ""} />
      <Footer />
    </div>
  );
}
