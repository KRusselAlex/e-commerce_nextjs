import Footer from "@/components/footer/footer";
import FAQsSection from "@/components/home/faqs/faqs";
import HeroSection from "@/components/home/hero/hero";
import NewProductSection from "@/components/home/newProduct/newProduct";
import ProductSection from "@/components/home/product/product";
import ServicesSection from "@/components/home/service/service";
import TestimonialCarousel from "@/components/home/testimony/testimony";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/p.jpg')",
          backgroundSize: "cover",
          height: "100vh",
        }}
        className="pt-0"
      >
        <Navbar />
        <HeroSection />
      </div>
      <ProductSection />
      <NewProductSection />
      <ServicesSection />
      <ProductSection />
      <TestimonialCarousel />
      <FAQsSection />
      <Footer />
    </div>
  );
}
