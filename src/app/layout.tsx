import type { Metadata } from "next";
import ScrollUpButton from "@/components/scrollUp/scrollUp";
import { Toaster } from "sonner";

import "./globals.css";
import WhatsappWidget from "@/components/whatsapp/whatsappWidjet";

export const metadata: Metadata = {
  title: "Store - Laboratory Products and Equipment",
  description:
    "Discover a wide range of laboratory products and equipment for chemistry, physics, biology, and more. Professional quality guaranteed for your scientific needs.",
  icons: "/logo2.png",

  keywords: [
    "laboratory products",
    "chemistry equipment",
    "physics materials",
    "biology supplies",
    "laboratory consumables",
    "scientific instruments sales",
    "Store",
  ],
  openGraph: {
    title: "A-Space - Laboratory Products and Equipment Sales",
    description:
      "E-commerce store specializing in laboratory products. Order your chemistry, physics, biology equipment, and more online.",
    url: "https://e-commerce-nextjs-lemon.vercel.app",
    siteName: "store",
    images: [
      {
        url: "/meta.jpeg",
        width: 1200,
        height: 630,
        alt: "Store - Laboratory Products and Equipment",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store - Laboratory Products and Equipment Sales",
    description:
      "Order your scientific supplies and equipment online with A-Space. Quality and reliability for laboratories.",
    images: ["/meta.jpg"],
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
        <main>
          {children}
          <WhatsappWidget />
          <ScrollUpButton />
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
