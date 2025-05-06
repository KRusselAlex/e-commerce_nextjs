import type { Metadata } from "next";
import ScrollUpButton from "@/components/scrollUp/scrollUp";

import "./globals.css";
import WhatsappWidget from "@/components/whatsapp/whatsappWidjet";

export const metadata: Metadata = {
  title: "Store - Produits et Équipements de Laboratoire",
  description:
    "Découvrez une large gamme de produits et d'équipements de laboratoire pour la chimie, la physique, la biologie et plus encore. Qualité professionnelle garantie pour vos besoins scientifiques.",
  icons: "/LOGO2.jpg",
  keywords: [
    "produits laboratoire",
    "équipements chimie",
    "matériel physique",
    "fournitures biologie",
    "consommables laboratoire",
    "vente instruments scientifiques",
    "Store",
  ],
  openGraph: {
    title: "A-Space - Vente de Produits et Équipements de Laboratoire",
    description:
      "Boutique e-commerce spécialisée dans les produits de laboratoire. Commandez vos équipements de chimie, physique, biologie et bien plus en ligne.",
    url: "https://e-commerce-nextjs-lemon.vercel.app",
    siteName: "store",
    images: [
      {
        url: "https://e-commerce-nextjs-lemon.vercel.app/meta.jpeg",
        width: 1200,
        height: 630,
        alt: "Store - Produits et Équipements de Laboratoire",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store - Vente de Produits et Équipements de Laboratoire",
    description:
      "Commandez vos fournitures et équipements scientifiques en ligne avec A-Space. Qualité et fiabilité au service des laboratoires.",
    images: ["https://e-commerce-nextjs-lemon.vercel.app/meta.jpg"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>{children}
          <WhatsappWidget />
          <ScrollUpButton />
        </div>
      </body>
    </html>
  );
}
