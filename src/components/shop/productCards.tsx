"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export default function ProductCard({
  _id,
  name,
  description,
  price,
  image,
}: ProductCardProps) {
  return (
    <Card className="group flex flex-col h-[400px] bg-white border rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link
        href={`/shop/${_id}`}
        className="relative w-full h-56 bg-gray-100 block"
      >
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          className="object-cover transition-opacity group-hover:opacity-90"
        />
      </Link>

      <CardContent className="p-4 flex flex-col justify-between flex-grow">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-green-700">
            {price.toFixed(2)} CFA
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
