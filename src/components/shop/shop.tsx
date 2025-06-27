"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCategoryStore } from "@/store/categorieStore";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import Loading from "../loading/loading";
import dayjs from "dayjs";
import ProductCard from "./productCards";

export default function ShopSection() {
  const [category, setCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortByDate, setSortByDate] = useState("Nouveautés");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 6;

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

  const filteredProducts = useMemo(() => {
    const now = dayjs();
    const thirtyDaysAgo = now.subtract(30, "day");

    return products
      .filter((product) => {
        const matchCategory =
          category === "Tous" ||
          categories.find((cat) => cat.name === category)?._id?.toString() ===
            product.category?.toString();

        const matchPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        const matchDate =
          sortByDate === "Nouveautés"
            ? dayjs(product.createdAt).isAfter(thirtyDaysAgo)
            : true;

        const matchSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchCategory && matchPrice && matchDate && matchSearch;
      })
      .sort((a, b) =>
        sortByDate === "Nouveautés"
          ? dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
          : dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
      );
  }, [products, category, priceRange, sortByDate, categories, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const paginatedProducts = products;

  return (
    <div className="bg-fourthly px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Barre de recherche + filtres */}
        <div className="grid md:grid-cols-4 gap-4 mb-8 items-start">
          <Card className="p-4 col-span-1">
            <h2 className="text-lg font-semibold mb-3">Filtres</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Rechercher un produit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300"
              />

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
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

              <div>
                <p className="text-sm mb-1">
                  Prix : {priceRange[0]}€ - {priceRange[1]}€
                </p>
                <Slider
                  min={0}
                  max={4000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              <Select value={sortByDate} onValueChange={setSortByDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nouveautés">Plus récents</SelectItem>
                  <SelectItem value="Anciens">Plus anciens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Produits */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <Loading />
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
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
    </div>
  );
}
