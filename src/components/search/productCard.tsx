import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  id,
}) => {
  return (
    <div className="flex items-center border rounded-xl shadow-sm p-2 bg-white hover:shadow-md transition">
      <Link
        href={`/shop/${id}`}
        passHref
        legacyBehavior
        className="cursor-pointer"
      >
        <div className="relative w-20 cursor-pointer h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image src={image} alt={name} layout="fill" objectFit="cover" />
        </div>
      </Link>

      <div className="ml-4 flex-1">
        <h3 className="text-md font-semibold text-black">{name}</h3>
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
