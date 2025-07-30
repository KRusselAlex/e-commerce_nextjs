import SelectList from "@/components/footer/selectList/selectList";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import Logo from "../logo/logo";

export default function Footer() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
  });

  const customerServiceItems = [
    { label: "Retours", href: "/tutorials" },
    { label: "Livraison", href: "/tutorials" },
    { label: "FAQs", href: "/tutorials" },
  ];

  const supportItems = [
    { label: "Centre d'aide", href: "/help-center" },
    { label: "Politique de confidentialité", href: "/privacy-policy" },
    { label: "Conditions générales", href: "/conditions" },
  ];

  const quickLinksItems = [
    { label: "+229 44 39 00 00", href: "/contact-us" },
    { label: "Calavi, Akassato", href: "/location" },
    { label: "contact@company.com", href: "mailto:contact@company.com" },
  ];

  return (
    <footer className="bg-[#151515] text-white">
      <div className="mx-auto max-w-7xl  py-16 lg:py-20 pt-10 pb-5 ">
        <div className="px-2 sm:grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 mx-auto gap-4">
          <div className="px-2 md:px-0 py-3">
            <Logo />
          </div>
          <div className="py-3">
            <SelectList header="Service Client" items={customerServiceItems} />
          </div>
          <div className="py-3">
            <SelectList header="Support" items={supportItems} />
          </div>
          <div className="py-3">
            <SelectList header="Liens rapides" items={quickLinksItems} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 justify-center pb-5 px-3 m-aut mt-5 pt-5 border-t border-textColor text-sm items-center">
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
          <div className="mt-5 text-center text-sm">
            © Copyright {currentDate}. Tous droits réservés K-RUSSEL.
          </div>
        </div>
      </div>
    </footer>
  );
}
