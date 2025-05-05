import React, { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./productCard";

const fakeProducts = [
  { id: 1, name: "T-shirt Anime", price: "€29.99", image: "/gojod.jpeg" },
  { id: 2, name: "Sweatshirt Manga", price: "€49.99", image: "/gojod.jpeg" },
  { id: 3, name: "Casquette Otaku", price: "€19.99", image: "/gojod.jpeg" },
];

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredProducts = fakeProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="">
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
            placeholder="Rechercher un produit..."
            className="w-full border p-2 rounded mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
            {filteredProducts.length === 0 && <p>Aucun produit trouvé.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
