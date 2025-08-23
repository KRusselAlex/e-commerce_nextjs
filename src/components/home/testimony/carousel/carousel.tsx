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
import TestimonialCard from "../card/card";

interface Testimonial {
  name: string;
  title: string;
  text: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Jean Dupont",
    title: "CEO of the company",
    text: "This is the best service I have ever used. It truly transformed our business.",
    image: "/profile.png",
    rating: 4,
  },
  {
    name: "Jean Dupont",
    title: "CEO of the company",
    text: "This is the best service I have ever used. It truly transformed our business.",
    image: "/profile.png",
    rating: 5,
  },
  {
    name: "Jean Dupont",
    title: "CEO of the company",
    text: "This is the best service I have ever used. It truly transformed our business.",
    image: "/profile.png",
    rating: 3,
  },
  {
    name: "Jean Dupont",
    title: "CEO of the company",
    text: "This is the best service I have ever used. It truly transformed our business.",
    image: "/profile.png",
    rating: 5,
  },
  {
    name: "Jeanne Martin",
    title: "Product Manager",
    text: "Incredible experience. The support team is very responsive and the product is top-notch.",
    image: "/profile.png",
    rating: 1,
  },
  {
    name: "Samuel Wilson",
    title: "Software Engineer",
    text: "I highly recommend it to anyone looking to quickly and efficiently scale their product.",
    image: "/profile.png",
    rating: 4,
  },
];

export default function CarouselTestimonial() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="px-0">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 lg:basis-1/3  py-2"
            >
              <TestimonialCard
                image={testimonial.image}
                title={testimonial.title}
                name={testimonial.name}
                text={testimonial.text}
                rating={testimonial.rating}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden lg:block ">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
