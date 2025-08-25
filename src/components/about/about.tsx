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
      <div className=" max-w-7xl w-full  mx-auto px-6 text-center">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Technical Experts", value: "15+" },
            { label: "Equipment Sold", value: "10K+" },
            { label: "Approved Suppliers", value: "30+" },
            { label: "Labs Equipped", value: "50K+" },
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

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Left Column */}
          <div className="text-center md:text-left">
            <Image
              src="/gojod.jpeg"
              alt="Professional laboratory equipment"
              width={500}
              height={300}
              className="rounded-lg w-full shadow-lg mb-6 h-96 object-cover"
            />
            <p className="text-lg text-gray-700 mb-6">
              LabTech Solutions provides certified laboratory equipment for
              research, clinical analysis, and quality control. We offer
              precision instruments that meet international ISO and CE
              standards.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Our Vision
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              To develop a complete range of technical solutions, expand our
              network of manufacturing partners, and establish demonstration
              centers in major scientific hubs.
            </p>
          </div>

          {/* Right Column */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-semibold text-primary mb-4">
              Our Commitment
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We guarantee equipment with complete certifications, clear
              validation procedures, and specialized technical support. Our
              after-sales service intervenes within 24 hours across the entire
              territory.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Our Expertise
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Our team includes instrumentation engineers, qualified
              technicians, and quality assurance specialists to guide you in
              choosing your equipment.
            </p>
          </div>
        </div>

        {/* Technical Partners */}
        <div className="mt-12">
          <h3 className="text-3xl font-semibold text-primary mb-6">
            Our Partner Manufacturers
          </h3>
          <Carousel>
            <CarouselContent>
              {["/gojod.jpeg", "/gojod.jpeg", "/gojod.jpeg", "/gojod.jpeg"].map(
                (src, i) => (
                  <CarouselItem
                    key={i}
                    className="flex  h-40 justify-center basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-0 md:px-1"
                  >
                    <Image
                      src={src}
                      alt="Logo fabricant"
                      width={200}
                      height={100}
                      className="rounded-lg shadow-lg object-cover "
                    />
                  </CarouselItem>
                )
              )}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        {/* CTA */}
        <div className="mt-12 flex w-full justify-center items-center">
          <div className="p-12 w-full bg-primary rounded-lg shadow-xl">
            <h4 className="text-2xl text-white font-semibold mb-4">
              Turnkey Solutions for Laboratories
            </h4>
            <p className="text-lg text-white mb-6">
              Benefit from our expertise for the complete equipping of your
              laboratory with personalized solutions and adapted financing.
            </p>
            <Link
              href="/shop"
              className="bg-white text-primary py-3 px-8 rounded-full font-semibold hover:bg-thirdly hover:text-white transition-all duration-300"
            >
              View the Complete Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
