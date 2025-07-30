"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/store/categorieStore";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import Loading from "../loading/loading";
import ProductCard from "./productCards";
import dayjs from "dayjs";
import { RotateCcw } from "lucide-react";

export default function ShopSection() {
  const [category, setCategory] = useState("Tous");
  const [sortByDate, setSortByDate] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 12;

  const { fetchCart } = useCartStore();
  const { products, fetchProducts, loading, error } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  useEffect(() => {
    if (user?.id) fetchCart(user.id);
    if (products.length === 0) fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  const resetFilters = () => {
    setCategory("Tous");
    setSortByDate("Tous");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const now = dayjs();
    const thirtyDaysAgo = now.subtract(30, "day");

    return products
      .filter((product) => {
        const matchCategory =
          category === "Tous" ||
          categories.find((cat) => cat.name === category)?._id?.toString() ===
            product.category?.toString();

        console.log("mathcca", matchCategory);

        const matchDate =
          sortByDate === "Nouveautés"
            ? dayjs(product.createdAt).isAfter(thirtyDaysAgo)
            : sortByDate === "Anciens"
            ? dayjs(product.createdAt).isBefore(thirtyDaysAgo)
            : true;

        const matchSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchCategory && matchDate && matchSearch;
      })
      .sort((a, b) =>
        sortByDate === "Nouveautés"
          ? dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
          : sortByDate === "Anciens"
          ? dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
          : 0
      );
  }, [products, category, sortByDate, categories, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="bg-white px-4 md:px-10 py-10 ">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap mb-10">
          {/* Search Input */}
          <input
            type="text"
            placeholder=" Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[250px] rounded-md max-w-[500px] px-4 py-2   ring-2 focus:outline-none text-primary focus:border-primary transition-colors"
          />

          {/* Filters aligned right on desktop */}
          <div className="flex flex-wrap gap-4 items-center justify-start md:justify-end w-full md:w-auto">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Catégorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id?.toString()} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Trier par</label>
              <Select value={sortByDate} onValueChange={setSortByDate}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous</SelectItem>
                  <SelectItem value="Nouveautés">Plus récents</SelectItem>
                  <SelectItem value="Anciens">Plus anciens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex gap-1 items-center text-sm text-gray-600 hover:text-black"
            >
              <RotateCcw size={18} />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-3">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <p className="text-red-500 col-span-full text-center">
              Une erreur est survenue.
            </p>
          ) : paginatedProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              Aucun produit trouvé.
            </p>
          ) : (
            paginatedProducts.map((product) => (
              <ProductCard
                key={product._id?.toString()}
                _id={product._id ? product._id.toString() : ""}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.images?.[0]}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i + 1 === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* Search + Filters */}
    </section>
  );
}
