import CarouselProduct from "@/components/carousel/carousel";

export default function ProductSection() {
  return (
    <section className="flex flex-col space-y-5 justify-center px-3 py-6 md:py-10 lg:py-20   bg-fourthly">
      <h3 className="mb-4 text-3xl text-center font-bold ">
        Our Recent Product
      </h3>
      <div className="border-b border-gray-300 pb-20 w-full">
        <CarouselProduct />
      </div>
    </section>
  );
}
