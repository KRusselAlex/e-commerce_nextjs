"use client";

import { useState, ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface CarouselSectionProps {
  images: string[];
  children?: ReactNode;
}

export default function CarouselSection({
  images,
  children,
}: CarouselSectionProps) {
  const [index, setIndex] = useState(0);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setIndex((prevIndex) => (prevIndex + 1) % images.length);
  //     }, 5000);
  //     return () => clearInterval(interval);
  //   }, [images.length]);

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex);
    console.log("slide index", slideIndex);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Carousel
        className="absolute inset-0 w-full h-full"
        opts={{ loop: false }}
      >
        <div className="relative w-full h-full">
          <CarouselContent
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${index * 100}%)`,
            }}
          >
            {images.map((img, i) => (
              <CarouselItem key={i} className="w-full h-full flex-shrink-0">
                <div
                  className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${img})`,
                  }}
                ></div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>

      <div className="absolute bottom-3 flex gap-2 justify-center bg-gray-300 p-0.5 rounded-full">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-3 w-3 rounded-full transition-colors  ${
              index === i ? "bg-primary" : "bg-thirdly"
            }`}
          ></button>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute z-10 flex flex-col items-center text-white md:w-2/3 lg:w-2/4">
        {children}
      </div>
    </div>
  );
}
