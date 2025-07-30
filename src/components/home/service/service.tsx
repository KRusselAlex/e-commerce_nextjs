import React from "react";
import {
  FaMicroscope,
  FaFlask,
  FaHeadphonesAlt,
  FaShippingFast,
} from "react-icons/fa";
import CardServices from "./card/card"; // Assurez-vous que le chemin est correct

const services = [
  {
    icon: <FaMicroscope size={40} />,
    title: "Équipements de laboratoire",
    description:
      "Découvrez des microscopes, centrifugeuses et autres appareils de pointe pour vos besoins scientifiques.",
    iconColor: "text-green-500",
  },
  {
    icon: <FaFlask size={40} />,
    title: "Produits chimiques et consommables",
    description:
      "Un large choix de réactifs, verrerie et matériel pour la chimie, la biologie et la physique.",
    iconColor: "text-yellow-500",
  },
  {
    icon: <FaHeadphonesAlt size={40} />,
    title: "Service client dédié",
    description:
      "Une question ? Notre équipe support est toujours prête à vous aider, avec des conseils experts.",
    iconColor: "text-blue-500",
  },
  {
    icon: <FaShippingFast size={40} />,
    title: "Livraison rapide et sécurisée",
    description:
      "Recevez vos équipements et produits en toute sécurité, où que vous soyez.",
    iconColor: "text-red-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-primary min-h-screen h-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row gap-16 mx-auto text-center h-full justify-center max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:w-1/3 text-white text-center lg:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
            Store : Votre partenaire en matériel et fournitures de laboratoire
          </h2>
          <p className="text-base">
            Bienvenue chez A&apos;Space, votre boutique en ligne spécialisée
            dans les produits et équipements de laboratoire. Nous proposons des
            solutions fiables et de qualité pour les professionnels et
            passionnés des sciences.
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
