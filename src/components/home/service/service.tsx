import React from "react";
import {
  FaMicroscope,
  FaFlask,
  FaHeadphonesAlt,
  FaShippingFast,
} from "react-icons/fa";
import CardServices from "./card/card";

const services = [
  {
    icon: <FaMicroscope size={40} />,
    title: "Laboratory Equipment",
    description:
      "Discover microscopes, centrifuges, and other advanced devices for your scientific needs.",
    iconColor: "text-green-500",
  },
  {
    icon: <FaFlask size={40} />,
    title: "Chemicals and Consumables",
    description:
      "A wide range of reagents, glassware, and materials for chemistry, biology, and physics.",
    iconColor: "text-yellow-500",
  },
  {
    icon: <FaHeadphonesAlt size={40} />,
    title: "Dedicated Customer Service",
    description:
      "Have a question? Our support team is always ready to help you with expert advice.",
    iconColor: "text-blue-500",
  },
  {
    icon: <FaShippingFast size={40} />,
    title: "Fast and Secure Delivery",
    description:
      "Receive your equipment and products safely, wherever you are.",
    iconColor: "text-red-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-primary min-h-screen h-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row gap-16 mx-auto text-center h-full justify-center max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:w-1/3 text-white text-center lg:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
            Store: Your Partner in Laboratory Equipment and Supplies
          </h2>
          <p className="text-base">
            Welcome to A&apos;Space, your online store specializing in laboratory products and equipment. We offer reliable, high-quality solutions for professionals and science enthusiasts.
          </p>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <CardServices
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              iconColor={service.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
