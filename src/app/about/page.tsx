"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./style.css";
import AboutUs from "@/components/about/about";

export default function Contact() {
  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center  p-2 items-center">
          <h1 className=" text-xl md:text-4xl font-bold text-center mb-4">
            About US
          </h1>
          <p className="text-center  mb-8">
            Discover the Story Behind A&apos;Space D: Where Anime Meets Fashion
          </p>
        </div>
      </div>
      <AboutUs />
      <Footer />
    </div>
  );
}
