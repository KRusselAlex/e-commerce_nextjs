"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const categories = ["General", "Account", "Billing"] as const;
type Category = (typeof categories)[number];

const faqs: Record<Category, { question: string; answer: string }[]> = {
  General: [
    {
      question: "What is this platform about?",
      answer: "This platform helps you manage your tasks efficiently.",
    },
    {
      question: "How can I contact support?",
      answer: "You can contact us via our contact page.",
    },
    {
      question: "What is this platform about?",
      answer: "This platform helps you manage your tasks efficiently.",
    },
    {
      question: "How can I contact support?",
      answer: "You can contact us via our contact page.",
    },
    {
      question: "What is this platform about?",
      answer: "This platform helps you manage your tasks efficiently.",
    },
    {
      question: "How can I contact support?",
      answer: "You can contact us via our contact page.",
    },
  ],
  Account: [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot password' on the login page.",
    },
    {
      question: "Can I change my email?",
      answer: "Yes, in the account settings.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot password' on the login page.",
    },
    {
      question: "Can I change my email?",
      answer: "Yes, in the account settings.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot password' on the login page.",
    },
    {
      question: "Can I change my email?",
      answer: "Yes, in the account settings.",
    },
  ],
  Billing: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards and PayPal.",
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are available within 14 days of purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards and PayPal.",
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are available within 14 days of purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards and PayPal.",
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are available within 14 days of purchase.",
    },
  ],
};

export default function FAQsSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("General");

  return (
    <div className="min-h-screen flex flex-col items-col justify-center">
      <div className="">
        <div className="flex flex-col h-full w-full justify-center px-2  items-center">
          <h1 className="text-xl md:text-4xl font-bold text-center my-4">
            FAQs
          </h1>
        </div>
      </div>
      <div className="bg-white  w-full">
        <div className="max-w-4xl mx-auto p-6   h-full">
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
