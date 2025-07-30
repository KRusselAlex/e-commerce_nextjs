"use client";

import React from "react";
import CarouselTestimonial from "./carousel/carousel";

export default function TestimonialCarousel() {
  return (
    <section className="flex flex-col space-y-5 justify-center  py-6 md:py-10 lg:py-20 min-h-screen  bg-textColor">
      <h2 className="text-center text-3xl text-white font-bold mb-8">
        What Our Clients Say
      </h2>
      <div className=" w-full flex justify-center">
        <CarouselTestimonial />
      </div>
    </section>
  );
}
