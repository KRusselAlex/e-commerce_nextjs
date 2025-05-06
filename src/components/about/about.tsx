// components/AboutUs.js
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "./style.css";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="bg-fourthly py-10">
      <div className="container mx-auto px-6 text-center">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Team Members", value: "15+" },
            { label: "Total Sales", value: "10K+" },
            { label: "Partners", value: "30+" },
            { label: "Clients", value: "50K+" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="shadow-lg p-6 card hover:border-2 text-textColor hover:border-white hover:bg-thirdly hover:text-white bg-white"
            >
              <CardContent className="text-center">
                <h3 className="text-3xl font-bold text-primary">
                  {stat.value}
                </h3>
                <p className="text-lg ">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Us Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Left Column: Image and Text */}
          <div className="text-center md:text-left">
            <Image
              src="/l.jpeg"
              alt="Anime Style Dresses"
              width={500}
              height={300}
              className="rounded-lg w-full  shadow-lg mb-6 h-96"
            />
            <p className="text-lg text-gray-700 mb-6">
              A&apos;Space D blends the world of fashion with anime culture. We
              provide high-quality dresses that match your style, alongside
              accessories that elevate your anime fandom.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Our Future Goals
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We aim to expand our product line, collaborate with renowned anime
              brands, and open physical stores in major cities to bring our
              unique fashion closer to you.
            </p>
          </div>

          {/* Right Column: Mission Statement & Team */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-semibold text-primary mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Our mission is to provide unique, stylish, and comfortable
              anime-inspired fashion that stands out. We empower customers to
              feel confident in their style while embracing their favorite
              stories.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Meet Our Team
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Our passionate team consists of designers, anime enthusiasts, and
              customer service specialists dedicated to making your shopping
              experience exceptional.
            </p>
          </div>
        </div>

        {/* Partners Carousel */}
        <div className="mt-12">
          <h3 className="text-3xl font-semibold text-primary mb-6">
            Our Partners
          </h3>
          <Carousel>
            <CarouselContent>
              {["/gojod.jpeg", "/gojod.jpeg", "/gojod.jpeg", "/gojod.jpeg"].map(
                (src, i) => (
                  <CarouselItem
                    key={i}
                    className="flex h-40 justify-center basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-0 md:px-1"
                  >
                    <Image
                      src={src}
                      alt="Partner Logo"
                      width={200}
                      height={100}
                      className="rounded-lg shadow-lg"
                    />
                  </CarouselItem>
                )
              )}
            </CarouselContent>
            <div className="hidden lg:block ">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <div className="mt-12 flex w-full justify-center items-center">
          <div className="p-12 w-full bg-primary rounded-lg shadow-xl">
            <h4 className="text-2xl text-white font-semibold mb-4">
              Join the A&apos;Space Community
            </h4>
            <p className="text-lg text-white mb-6">
              Stay updated with the latest trends in anime fashion and
              accessories. Get exclusive deals and more!
            </p>
            <Link
              href="/shop"
              className="bg-white text-primary py-3 px-8 rounded-full font-semibold hover:bg-thirdly hover:text-white transition-all duration-300"
            >
              Explore Our Shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
