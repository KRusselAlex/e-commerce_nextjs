"use client";

import CustomButton from "@/components/button/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const content = {
  title:
    "Discover Scientific Excellence: Your Shop for Laboratory Products and Equipment!",
  buttonText: "Start Now",
};

export default function HeroSection() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto justify-center items-center min-h-screen">
        <h1 className="text-3xl md:text-4xl lg:text-5xl px-2 text-white font-bold text-center">
          {content.title}
        </h1>
        <div className="flex justify-center">
          <Link href="/shop">
            <CustomButton
              icon={<ChevronRight size={20} />}
              className="bg-primary text-white hover:bg-secondary hover:text-white"
            >
              {content.buttonText}
            </CustomButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
