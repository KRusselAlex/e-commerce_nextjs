"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import "./style.css";
import SearchBar from "../search/searchBar";
import Logo from "../logo/logo";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Boutique", href: "/shop" },
  { name: "À propos de nous", href: "/about" },
  { name: "Contactez-nous", href: "/contact" },
  { name: "Connexion", href: "/auth/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`fixed z-40 w-full py-4 border-b border-gray-200 px-4 md:px-16 ${
          isScrolled
            ? "navbarScroll shadow-md bg-white"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Left: Logo + Menu */}
          <div className="flex items-center">
            <button
              className="lg:hidden mr-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-8 h-8" />
            </button>
           <Logo />
          </div>

          {/* Center: Navigation (desktop only) */}
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex text-lg space-x-6 font-medium">
              {navItems
                .filter((item) => item.name !== "Connexion")
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className={`transition-colors ${
                        pathname === item.href
                          ? "text-secondary"
                          : "hover:text-secondary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Right: Connexion + Search + Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden md:block hover:text-primary text-lg font-medium"
              prefetch={true}
            >
              Connexion
            </Link>
            <SearchBar />
            <button className="relative p-2">
              <ShoppingCart className="w-6 h-6 transition-transform duration-300 hover:scale-125" />
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Mobile drawer menu */}
        <div
          className={`fixed top-0 right-0 h-full z-50 w-full bg-fourthly shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="p-4 text-textColor"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <ul className="px-3 flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-textColor hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
