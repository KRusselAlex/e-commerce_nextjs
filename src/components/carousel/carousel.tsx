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


const equipments = [
  {
    imageUrl: "/o.jpeg",
    title: "Centrifugeuse de laboratoire",
    price: "780,000 F CFA",
  },
  {
    imageUrl: "/p.jpeg",
    title: "Microscope optique",
    price: "325,000 F CFA",
  },
  {
    imageUrl: "/o.jpeg",
    title: "Balance analytique",
    price: "520,000 F CFA",
  },
  {
    imageUrl: "/p.jpeg",
    title: "PH-mètre numérique",
    price: "130,000 F CFA",
  },
  {
    imageUrl: "/o.jpeg",
    title: "Agitateur magnétique",
    price: "195,000 F CFA",
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
          {equipments.map((dress, index) => (
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
