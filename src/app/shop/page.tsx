"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import ShopSection from "@/components/shop/shop";
import "./style.css";

export default function Shop() {
  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center  p-2 items-center">
          <h1 className=" text-xl md:text-4xl font-bold text-center mb-4">
            SHOP
          </h1>
          <p className="text-center  mb-8">
            DOUR PRODUCTs
          </p>
        </div>
      </div>
      <ShopSection />

      <Footer />
    </div>
  );
}
