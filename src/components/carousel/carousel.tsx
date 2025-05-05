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
import DressCard from "@/components/card/card"; // Import the DressCard component

const dresses = [
  {
    imageUrl: "/o.jpeg",
    title: "Elegant Evening Gown",
    price: "$199.99",
  },
  {
    imageUrl: "/p.jpeg",
    title: "Elegant Evening Gown",
    price: "$199.99",
  },
  {
    imageUrl: "/o.jpeg",
    title: "Elegant Evening Gown",
    price: "$199.99",
  },
  {
    imageUrl: "/p.jpeg",
    title: "Summer Floral Dress",
    price: "$89.99",
  },
  {
    imageUrl: "/o.jpeg",
    title: "Classic Black Dress",
    price: "$129.99",
  },
];

export default function CarouselProduct() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // Automatically change slide every 5 seconds
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="">
          {dresses.map((dress, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-0 md:px-1"
            >
              <DressCard
                imageUrl={dress.imageUrl}
                title={dress.title}
                price={dress.price}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons (Hidden on Mobile) */}
        <div className="hidden lg:block ">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
