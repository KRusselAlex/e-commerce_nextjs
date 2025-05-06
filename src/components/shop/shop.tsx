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

const products = [
  {
    id: 1,
    name: "Microscope optique",
    category: "Microscopes",
    price: 500,
    date: "2024-01-01",
    image: "/gojod.jpeg",
  },
  {
    id: 2,
    name: "Pipettes automatiques",
    category: "Accessoires de laboratoire",
    price: 150,
    date: "2024-01-05",
    image: "/gojod.jpeg",
  },
  {
    id: 3,
    name: "Centrifugeuse",
    category: "Centrifugeuses",
    price: 1200,
    date: "2024-02-01",
    image: "/gojod.jpeg",
  },
  {
    id: 4,
    name: "Agitateur magnétique",
    category: "Agitateurs",
    price: 300,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
  {
    id: 5,
    name: "Balance analytique",
    category: "Balances",
    price: 800,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
  {
    id: 6,
    name: "Spectrophotomètre",
    category: "Spectrophotomètres",
    price: 2500,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
  {
    id: 7,
    name: "Bain-marie",
    category: "Bains-marie",
    price: 600,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
  {
    id: 8,
    name: "Hotte aspirante",
    category: "Sécurité",
    price: 3500,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
  {
    id: 9,
    name: "PH-mètre",
    category: "Mesure",
    price: 200,
    date: "2024-02-10",
    image: "/gojod.jpeg",
  },
];

const categories = ["Tous", ...new Set(products.map((p) => p.category))];

export default function ShopSection() {
  const [category, setCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortByDate, setSortByDate] = useState("Nouveautés");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  let filteredProducts =
    category === "Tous"
      ? products
      : products.filter((p) => p.category === category);

  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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

          {displayedProducts.map((product) => (
            <Card
              key={product.id}
              className="p-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href={`/shop/${product.id}`} passHref legacyBehavior>
                <a className="w-full h-full flex justify-center items-center overflow-hidden rounded-lg">
                  <div className="w-full h-[250px] relative bg-white rounded-lg">
                    <Image
                      src={product.image}
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
          ))}
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
