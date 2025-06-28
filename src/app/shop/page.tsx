"use client";
"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import ShopSection from "@/components/shop/shop";
import "./style.css";

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="heroNavs bg-primary text-white">
        <Navbar />
      </header>

      <main className="flex-grow ">
        <ShopSection />
      </main>

      <Footer />
    </div>
  );
}
