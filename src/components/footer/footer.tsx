import SelectList from "@/components/footer/selectList/selectList";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
  });

  const customerServiceItems = [
    { label: "Returns", href: "/tutorials" },
    { label: "Shipping", href: "/tutorials" },
    { label: "FAQs", href: "/tutorials" },
  ];

  const supportItems = [
    { label: "Help Center", href: "/help-center" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/conditions" },
  ];

  const quickLinksItems = [
    { label: "+229 44 39 00 00", href: "/contact-us" },
    { label: "Calavi, Akassato", href: "/location" },
    { label: "contact@company.com", href: "mailto:contact@company.com" },
  ];
  return (
    <footer className=" bg-[#151515] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 pt-10 pb-5   md:px-16">
        <div className="px-4  sm:grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 mx-auto">
          <div className="p-4">
            <h3 className="text-3xl  Sprite_Graffiti ">A&apos;Space</h3>
          </div>
          <div className="p-3 md:p-4">
            <SelectList header="Custom Service" items={customerServiceItems} />
          </div>
          <div className="p-3 md:p-4">
            <SelectList header="Support" items={supportItems} />
          </div>
          <div className="p-3 md:p-4">
            <SelectList header="Quick Links" items={quickLinksItems} />
          </div>
        </div>

        <div
          className="grid grid-cols-1 gap-4 justify-center  pb-5 px-3 m-aut mt-5 pt-5 border-t border-textColor text-sm 
      items-center"
        >
          <div className="flex gap-4 mt-5 justify-center items-center">
            <Link
              href="https://www.facebook.com"
              aria-label="Facebook"
              className="transition-transform duration-300 hover:scale-125"
            >
              <FaFacebookF size={25} />
            </Link>
            <Link
              href="https://www.instagram.com"
              aria-label="Instagram"
              className="transition-transform duration-300 hover:scale-125"
            >
              <FaInstagram size={25} />
            </Link>
            <Link
              href="https://www.pinterest.com"
              aria-label="Pinterest"
              className="transition-transform duration-300 hover:scale-125"
            >
              <FaPinterestP size={25} />
            </Link>
            <Link
              href="https://www.twitter.com"
              aria-label="Twitter"
              className="transition-transform duration-300 hover:scale-125"
            >
              <FaTwitter size={25} />
            </Link>
            <Link
              href="https://www.tiktok.com"
              aria-label="TikTok"
              className="transition-transform duration-300 hover:scale-125"
            >
              <SiTiktok size={25} />
            </Link>
          </div>
          <div className="mt-5 text-center  text-sm ">
            © Copyright {currentDate}. All Rights Reserved K-RUSSEL.
          </div>
        </div>
      </div>
    </footer>
  );
}
