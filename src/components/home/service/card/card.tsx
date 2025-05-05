import React from "react";
import "./style.css";

interface CardServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string; 
}

const CardServices: React.FC<CardServiceProps> = ({
  icon,
  title,
  description,
  iconColor = "text-green-500",
}) => {
  return (
    <div className="cardSection h-64 bg-fourthly flex flex-col text-textColor justify-center  gap-2 p-6 rounded-xl shadow-lg transform transition-all md:hover:scale-105 hover:shadow-2xl">
      <div
        className={`${iconColor} mb-4 w-full flex justify-center md:justify-start`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-center md:text-start  mb-2">
        {title}
      </h3>
      <p className="text-center md:text-start">{description}</p>
    </div>
  );
};

export default CardServices;
