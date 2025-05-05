import React from "react";
import {
  FaTshirt,
  FaStore,
  FaHeadphonesAlt,
  FaShippingFast,
} from "react-icons/fa";
import CardServices from "./card/card"; // Assurez-vous que le chemin est correct

const services = [
  {
    icon: <FaTshirt size={40} />,
    title: "Streetwear Anime",
    description:
      "Améliorez votre garde-robe avec une mode street audacieuse inspirée des animes, conçue pour les vrais fans.",
    iconColor: "text-green-500",
  },
  {
    icon: <FaStore size={40} />,
    title: "Accessoires Anime Exclusifs",
    description:
      "Des bandeaux aux sweats à capuche, exprimez votre passion avec des accessoires qui complètent votre style.",
    iconColor: "text-yellow-500",
  },
  {
    icon: <FaHeadphonesAlt size={40} />,
    title: "Nous sommes là pour vous",
    description:
      "Une question ? Notre équipe support est toujours prête à vous aider, jour et nuit !",
    iconColor: "text-blue-500",
  },
  {
    icon: <FaShippingFast size={40} />,
    title: "Livraison Ultra-Rapide",
    description:
      "Recevez vos articles anime rapidement et en toute sécurité, pour montrer votre style sans attendre.",
    iconColor: "text-red-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-primary ">
      <div className="flex flex-col lg:flex-row gap-16 mx-auto text-center mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:w-1/3 text-white text-center lg:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
            A&apos;Space : Élevez votre streetwear avec des vibes anime
          </h2>
          <p className="text-base">
            Entrez dans un monde où l&apos;anime rencontre la mode urbaine ! Chez
            A&apos;Space, nous créons des vêtements audacieux et de haute
            qualité qui vous permettent d&apos;afficher votre passion avec fierté.
            Des designs exclusifs inspirés des animes aux styles urbains qui se
            démarquent, notre collection est faite pour les vrais fans et les
            trendsetters.
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
