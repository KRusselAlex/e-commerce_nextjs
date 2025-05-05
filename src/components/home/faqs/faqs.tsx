"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const categories = ["Général", "Compte", "Facturation"] as const;
type Category = (typeof categories)[number];

const faqs: Record<Category, { question: string; answer: string }[]> = {
  Général: [
    {
      question: "De quoi s'agit-il sur cette plateforme ?",
      answer: "Cette plateforme vous aide à gérer vos tâches efficacement.",
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez nous contacter via notre page de contact.",
    },
    {
      question: "De quoi s'agit-il sur cette plateforme ?",
      answer: "Cette plateforme vous aide à gérer vos tâches efficacement.",
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez nous contacter via notre page de contact.",
    },
    {
      question: "De quoi s'agit-il sur cette plateforme ?",
      answer: "Cette plateforme vous aide à gérer vos tâches efficacement.",
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez nous contacter via notre page de contact.",
    },
  ],
  Compte: [
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion.",
    },
    {
      question: "Puis-je changer mon e-mail ?",
      answer: "Oui, dans les paramètres du compte.",
    },
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion.",
    },
    {
      question: "Puis-je changer mon e-mail ?",
      answer: "Oui, dans les paramètres du compte.",
    },
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion.",
    },
    {
      question: "Puis-je changer mon e-mail ?",
      answer: "Oui, dans les paramètres du compte.",
    },
  ],
  Facturation: [
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes de crédit et PayPal.",
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer:
        "Les remboursements sont disponibles dans les 14 jours suivant l'achat.",
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes de crédit et PayPal.",
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer:
        "Les remboursements sont disponibles dans les 14 jours suivant l'achat.",
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes de crédit et PayPal.",
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer:
        "Les remboursements sont disponibles dans les 14 jours suivant l'achat.",
    },
  ],
};

export default function FAQsSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Général");

  return (
    <div>
      <div className="bg-primary text-white">
        <div className="flex flex-col h-full w-full justify-center px-2 py-16 items-center">
          <h1 className="text-xl md:text-4xl font-bold text-center mb-4">
            FAQs
          </h1>
          <p className="text-center">
            Trouvez ci-dessous les réponses aux questions fréquentes.
          </p>
        </div>
      </div>
      <div className="bg-fourthly w-full">
        <div className="max-w-4xl mx-auto p-6 py-16">
          <div className="flex gap-4 justify-center mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-fourthly"
                } font-medium hover:bg-thirdly hover:text-white ${
                  selectedCategory === category
                    ? "hover:bg-primary"
                    : "hover:bg-thirdly"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <Accordion type="single" collapsible>
            {faqs[selectedCategory].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="">{faq.question}</AccordionTrigger>
                <AccordionContent className="pl-3 text-gray-800">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
