"use client";
"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import ShopSection from "@/components/shop/shop";
import "./style.css";

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center  p-2 items-center">
          <h1 className=" text-xl md:text-4xl font-bold text-center mb-4">
            Catalogue
          </h1>
          <p className="text-center  mb-8">
            Découvrez notre sélection de produits de qualité, soigneusement
            choisis pour répondre à vos besoins et envies.
          </p>
        </div>
      </header>

      <main className="flex-grow  ">
        <ShopSection />
      </main>

      <Footer />
    </div>
  );
}
