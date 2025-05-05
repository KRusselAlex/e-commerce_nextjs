"use client";

import { useState } from "react";
import {  Plus } from "lucide-react";
import Link from "next/link";

interface SelectListProps {
  header: string;
  items: { label: string; href: string }[];
}

export default function SelectList({ header, items }: SelectListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <div className="">
        <div
          className="flex items-center justify-between cursor-pointer p-2  rounded-lg"
          onClick={toggleList}
        >
          <h3 className="font-semibold ">{header}</h3>

          <Plus
            size={20}
            className={`block md:hidden transition-transform ${
              isOpen ? "rotate-45" : ""
            }`}
          />
        </div>

        <ul className="hidden md:block mt-2 space-y-2 p-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="block p-2 hover:text-primary ">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:hidden px-3">
        {isOpen && (
          <ul className=" mt-2 space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block p-2hover:text-thirdly rounded-lg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
