"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import Link from "next/link";
import { useCategoryStore } from "@/store/categorieStore";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import Loading from "../loading/loading";

export default function ShopSection() {
  const [category, setCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortByDate, setSortByDate] = useState("Nouveautés");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  useEffect(() => {
    if (user && user.id) {
      useCartStore.getState().fetchCart(user.id);
    }
    useProductStore.getState().fetchProducts();
    useCategoryStore.getState().fetchCategories();
  }, []);

  const products = useProductStore((state) => state.products) || [];
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const categories = useCategoryStore((state) => state.categories) || [];

  // Mapping category name => ID
  const categoryMap = categories.reduce<{ [name: string]: string }>(
    (acc, cat) => {
      if (cat.name && cat._id) {
        acc[cat.name] = String(cat._id);
      }
      return acc;
    },
    {}
  );

  // Debug: affichage des catégories
  console.log("📦 Produits (bruts):", products);
  console.log("📂 Catégories:", categories);
  console.log("🗺️ Map des catégories:", categoryMap);
  console.log("📌 Catégorie sélectionnée:", category);
  console.log("🛠 ID de catégorie attendue:", categoryMap[category]);

  // Étape 1 : Filtrer par catégorie
  // let filteredProducts = Array.isArray(products)
  //   ? category === "Tous"
  //     ? products
  //     : products.filter((p) => {
  //         const expectedCategoryId = categoryMap[category];
  //         if (!expectedCategoryId) {
  //           console.warn(`Catégorie introuvable dans la map: ${category}`);
  //           return false;
  //         }
  //         const productCategoryId =
  //           typeof p.category === "object" ? p.category._id : p.category;
  //         return String(productCategoryId) === String(expectedCategoryId);
  //       })
  //   : [];

  let filteredProducts = Array.isArray(products)
    ? category === "Tous"
      ? products
      : products.filter((p) => {
          const expectedCategoryId = categoryMap[category];
          if (!expectedCategoryId) {
            console.warn(`❌ Catégorie non trouvée pour: ${category}`);
            return false;
          }
          return String(p.category) === expectedCategoryId;
        })
    : [];

  console.log("✅ Après filtrage par catégorie:", filteredProducts);

  // Étape 2 : Filtrer par prix
  filteredProducts = filteredProducts.filter((p) => {
    const price = Number(p.price);
    return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
  });

  console.log("💰 Après filtrage par prix:", filteredProducts);

  // Étape 3 : Trier par date
  filteredProducts.sort((a, b) => {
    const dateA = new Date(a.createdAt ?? "").getTime();
    const dateB = new Date(b.createdAt ?? "").getTime();
    return sortByDate === "Nouveautés" ? dateB - dateA : dateA - dateB;
  });

  // Étape 4 : Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("📦 Produits affichés:", displayedProducts);

  return (
    <div className="bg-fourthly">
      <div className="mx-auto max-w-7xl py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
          {/* Filtres */}
          <Card className="p-4 row-span-1 h-full">
            <h2 className="text-lg font-semibold mb-3">Filtres</h2>
            <div className="flex flex-col gap-4">
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="Tous">
                    Tous
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id?.toString()} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <p className="mb-2">
                  Plage de prix : {priceRange[0]}€ - {priceRange[1]}€
                </p>
                <Slider
                  min={0}
                  max={4000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>

              <Select onValueChange={setSortByDate} value={sortByDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nouveautés">Plus récent</SelectItem>
                  <SelectItem value="Anciens">Plus ancien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Affichage des produits */}
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-red-500 text-center col-span-3">
              Une erreur est survenue lors du chargement des produits.
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-gray-500 text-center col-span-3">
              Aucun produit trouvé pour les critères sélectionnés.
            </div>
          ) : (
            displayedProducts.map((product) => (
              <Card
                key={product._id?.toString() ?? product.name}
                className="flex flex-col justify-between h-[410px] p-3 shadow-lg hover:shadow-xl transition-all bg-white"
              >
                <Link href={`/shop/${product._id}`} passHref legacyBehavior>
                  <a className="block h-[220px] w-full relative overflow-hidden rounded-lg">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="rounded-lg object-cover"
                    />
                  </a>
                </Link>

                <CardContent className="mt-3 flex flex-col justify-between flex-grow">
                  <div className="flex flex-col items-start gap-1 text-left">
                    <h2 className="text-md font-semibold line-clamp-2 text-gray-900">
                      {product.name}
                    </h2>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-lg font-bold text-green-700">
                      {product.price} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
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
      </div>
    </div>
  );
}
