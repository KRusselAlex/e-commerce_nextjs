"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./style.css";
import PaymentSection from "@/components/payment/payment";

export default function Contact() {
  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
        <div className="flex flex-col h-full w-full justify-center  p-2 items-center">
          <h1 className=" text-xl md:text-4xl font-bold text-center mb-4">
            Contact US
          </h1>
          <p className="text-center  mb-8">
            Any question or remarks? Just write us a message!
          </p>
        </div>
      </div>
      <PaymentSection />
      <Footer />
    </div>
  );
}
