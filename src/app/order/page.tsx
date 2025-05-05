import Footer from "@/components/footer/footer";
import HeroSection from "@/components/home/hero/hero";
import ProductSection from "@/components/home/product/product";
import Navbar from "@/components/navbar/navbar";

export default function Orders() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/jinx.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <Navbar />
        <HeroSection />
      </div>
      <ProductSection />
      <Footer />
    </div>
  );
}