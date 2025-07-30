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
        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Experts techniques", value: "15+" },
            { label: "Équipements vendus", value: "10K+" },
            { label: "Fournisseurs agréés", value: "30+" },
            { label: "Laboratoires équipés", value: "50K+" },
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

        {/* Section À Propos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Colonne de gauche */}
          <div className="text-center md:text-left">
            <Image
              src="/gojod.jpeg"
              alt="Matériel de laboratoire professionnel"
              width={500}
              height={300}
              className="rounded-lg w-full shadow-lg mb-6 h-96 object-cover"
            />
            <p className="text-lg text-gray-700 mb-6">
              LabTech Solutions fournit des équipements de laboratoire certifiés
              pour la recherche, l&apos;analyse clinique et le contrôle qualité.
              Nous proposons des instruments de précision répondant aux normes
              internationales ISO et CE.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Notre Vision
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Développer une gamme complète de solutions techniques, élargir
              notre réseau de partenaires fabricants et implanter des centres de
              démonstration dans les pôles scientifiques majeurs.
            </p>
          </div>

          {/* Colonne de droite */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-semibold text-primary mb-4">
              Notre Engagement
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Nous garantissons des équipements avec certifications complètes,
              des procédures de validation claires et un support technique
              spécialisé. Notre service SAV intervient sous 24h sur tout le
              territoire.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Notre Expertise
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Notre équipe regroupe des ingénieurs en instrumentation, des
              techniciens qualifiés et des spécialistes en assurance qualité
              pour vous guider dans le choix de votre matériel.
            </p>
          </div>
        </div>

        {/* Partenaires techniques */}
        <div className="mt-12">
          <h3 className="text-3xl font-semibold text-primary mb-6">
            Nos Fabricants Partenaires
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
                      alt="Logo fabricant"
                      width={200}
                      height={100}
                      className="rounded-lg shadow-lg object-contain"
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
              Solutions Clés en Main pour Laboratoires
            </h4>
            <p className="text-lg text-white mb-6">
              Bénéficiez de notre expertise pour l&apos;équipement complet de
              votre laboratoire avec des solutions personnalisées et des
              financements adaptés.
            </p>
            <Link
              href="/catalogue"
              className="bg-white text-primary py-3 px-8 rounded-full font-semibold hover:bg-thirdly hover:text-white transition-all duration-300"
            >
              Voir le Catalogue Complet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
