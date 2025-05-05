import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <div className="flex items-center border rounded-xl shadow-sm p-2 bg-white hover:shadow-md transition">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={image} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-md font-semibold">{name}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Tag className="w-4 h-4 mr-1" />
          {price}
        </div>
      </div>
      <Button size="sm" className="ml-2 flex items-center text-white gap-1">
        <ShoppingCart className="w-4 h-4" />
        Ajouter
      </Button>
    </div>
  );
};

export default ProductCard;
