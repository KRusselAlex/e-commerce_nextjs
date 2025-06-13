import { useState } from "react";
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
import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import Loading from "../loading/loading";

export default function ShopSection() {
  const [category, setCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortByDate, setSortByDate] = useState("Nouveautés");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    useProductStore.getState().fetchProducts();
    useCategoryStore.getState().fetchCategories();
  }, []);

  const products = useProductStore((state) => state.products) || [];
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);

  const categories = useCategoryStore((state) => state.categories);

  // Map category names to their ObjectIds for filtering
  const categoryMap = categories.reduce<{ [name: string]: string }>(
    (acc, cat) => {
      acc[cat.name] = cat._id?.toString() ?? "";
      return acc;
    },
    {}
  );

  let filteredProducts =
    category === "Tous"
      ? Array.isArray(products)
        ? products
        : []
      : Array.isArray(products)
      ? products.filter((p) => p.category === categoryMap[category])
      : [];

  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts.sort((a, b) => {
    const dateA = new Date(a.createdAt ?? "").getTime();
    const dateB = new Date(b.createdAt ?? "").getTime();
    return sortByDate === "Nouveautés" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-fourthly">
      <div className="mx-auto max-w-7xl py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
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
                    <SelectItem key={cat._id} value={cat.name}>
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

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-red-500 text-center">
              Une erreur est survenue lors du chargement des produits.
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-gray-500 text-center">
              Aucun produit trouvé pour les critères sélectionnés.
            </div>
          ) : (
            displayedProducts.map((product) => (
              <Card
                key={product._id?.toString() ?? product.name}
                className="p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={`/shop/${product._id}`} passHref legacyBehavior>
                  <a className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                    <div className="w-full h-[250px] relative bg-white rounded-lg">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </a>
                </Link>
                <CardContent className="mt-2 text-center">
                  <h2 className="text-lg">{product.name}</h2>
                  <p className="text-gray-600">{product.price}€</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
