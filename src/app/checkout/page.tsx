"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import "./style.css";
import PaymentSection from "@/components/payment/payment";

export default function Checkout() {
  return (
    <div>
      <div className="heroNav bg-primary text-white">
        <Navbar />
        <div className="h-12"></div>
      </div>
      <PaymentSection />
      <Footer />
    </div>
  );
}
