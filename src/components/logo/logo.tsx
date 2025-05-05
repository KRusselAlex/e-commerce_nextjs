import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative w-10 h-10 rounded">
        <Image
          src="/LOGO2.jpg" // Place your logo image in /public/logo.png
          alt="Logo"
          layout="fill"
          objectFit="contain"
          className="rounded-full"
        />
      </div>
    </Link>
  );
};

export default Logo;
