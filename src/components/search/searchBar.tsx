"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProductCard from "./productCard";
import { useProductStore } from "@/store/productStore"; // Adjust path if needed

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
  }, [products, loading, fetchProducts]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        <Search className="w-5 h-5 transition-transform duration-300 hover:scale-125" />
      </button>

      <div
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full z-30 bg-fourthly shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="mb-4 text-gray-600"
          >
            ✖ Close
          </button>
          <input
            type="text"
            placeholder="Search for a product..."
            className="w-full border text-black p-2 rounded mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 overflow-hidden h-[75vh] overflow-y-auto">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id?.toString() || product.name}
                name={product.name}
                price={`${product.price} F CFA`}
                image={
                  product?.images && product.images.length > 0
                    ? product.images[0]
                    : "/placeholder.jpg"
                }
                id={product._id ? product._id.toString() : ""}
              />
            ))}
            {!loading && filteredProducts.length === 0 && (
              <p className="text-center text-black">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
