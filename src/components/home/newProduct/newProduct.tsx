"use client";

import CustomButton from "@/components/button/button";
import CarouselSection from "@/components/home/newProduct/carouselProduct/carouselProduct";
import { ChevronRight } from "lucide-react";

const images = ["/meta.jpeg", "/l.jpeg", "/l.jpeg"];
const content = {
  title: "Category Of Product",
  description: "Here we show our variety of accesosires.",
  buttonText: "Visit Shop",
};

export default function NewProductSection() {
  return (
    <div className="h-full">
      <CarouselSection images={images}>
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl mt-4 text-center">
            {content.description}
          </p>
          <div className="flex justify-center">
            <CustomButton
              icon={<ChevronRight size={20} />}
              className="bg-fourthly text-textColor hover:bg-primary hover:text-white"
            >
              {content.buttonText}
            </CustomButton>
          </div>
        </div>
      </CarouselSection>
    </div>
  );
}
