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
    <Card className="flex flex-col h-[400px]  transition-shadow hover:shadow-xl bg-white">
      <Link
        href={`/shop/${_id}`}
        className="relative w-full h-56 rounded-t-md overflow-hidden block"
      >
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          className="object-cover"
        />
      </Link>

      <CardContent className="mt-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-md font-semibold line-clamp-2 text-gray-900">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          )}
        </div>

        <div className=" text-right">
          <span className="text-lg font-bold text-green-700">{price} €</span>
        </div>
      </CardContent>
    </Card>
  );
}
