"use client";

import * as React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DressCard from "@/components/card/card";
import { useProductStore } from "@/store/productStore"; // adjust the path if needed

export default function CarouselProduct() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const { products, fetchProducts, loading } = useProductStore();

  const [refreshed, setRefreshed] = React.useState(false);

  // Fetch products on mount
  React.useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
  }, []);

  // If products are still empty after first load, try once more
  React.useEffect(() => {
    if (!refreshed && !loading && products.length === 0) {
      setRefreshed(true);
      fetchProducts();
    }
  }, [products, loading]);

  // Auto-slide
  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [api]);

  const displayedProducts = [...products].slice(-10).reverse();

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent>
          {displayedProducts.map((product, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-0 md:px-1"
            >
              <DressCard
                imageUrl={
                  product?.images && product.images.length > 0
                    ? product.images[0]
                    : "/placeholder.jpg"
                }
                title={product.name}
                price={product.price + " F CFA"}
                id={product._id ? String(product._id) : ""}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Show navigation on large screens */}
        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
