import React from "react";
import Image from "next/image";
import Link from "next/link";

interface DressCardProps {
  imageUrl: string;
  title: string;
  price: string;
  id: string;
}

const DressCard: React.FC<DressCardProps> = ({
  imageUrl,
  title,
  price,
  id,
}) => {
  return (
    <div className="relative p-1 group">
      <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="relative w-full h-80">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-6 md:left-4 text-white">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-lg">{price}</p>
              <Link href={`/shop/${id}`} passHref legacyBehavior>
                <button className="mt-3 px-4 py-2 bg-primary rounded-md text-white hover:bg-secondary transition-colors">
                  Commander
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DressCard;
