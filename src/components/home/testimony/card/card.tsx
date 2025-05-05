import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface TestimonialCardProps {
  name: string;
  title: string;
  text: string;
  image: string;
  rating?: number; // Optional rating out of 5
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  title,
  text,
  image,
  rating = 5, // Default to 5 stars
}) => {
  return (
    <div className="p-8 bg-fourthly border text-textColor h-80 rounded-lg shadow-lg text-center">
      <Image
        src={image}
        alt={name}
        width={72}
        height={72}
        className="mx-auto rounded-full mb-4 object-cover"
      />
      <div className="flex justify-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            size={20}
            color={index < rating ? "#FBBF24" : "#D1D5DB"}
          />
        ))}
      </div>
      <p className="text-lg italic mb-4">{text}</p>
      <div className="font-semibold text-xl">{name}</div>
      <div className="text-gray-500">{title}</div>
    </div>
  );
};

export default TestimonialCard;
