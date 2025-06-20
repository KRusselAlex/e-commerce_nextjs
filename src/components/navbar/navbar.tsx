"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import "./style.css";
import SearchBar from "../search/searchBar";
import Logo from "../logo/logo";
import CartModal from "../cart/cartModal";
import { isTokenAvailable } from "@/lib/tokenExist";
import { Button } from "../ui/button";
import { logout } from "@/lib/api";
import { toast } from "sonner";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Boutique", href: "/shop" },
  { name: "À propos de nous", href: "/about" },
  { name: "Contactez-nous", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(isTokenAvailable());
  }, []);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  const handleLogout = async () => {
    try {
      logout(); // clear localStorage
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

          {/* Center: Navigation */}
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex text-lg space-x-6 font-medium">
              {navItems.map((item) => (
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
              {isAuthenticated &&
                (user.role === "admin" ? (
                  <li>
                    <Link
                      href="/oniichan"
                      prefetch={true}
                      className={`transition-colors ${
                        pathname === "/oniichan"
                          ? "text-secondary"
                          : "hover:text-secondary"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/order"
                      prefetch={true}
                      className={`transition-colors ${
                        pathname === "/orders"
                          ? "text-secondary"
                          : "hover:text-secondary"
                      }`}
                    >
                      Mes Commandes
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                href="/auth/login"
                className="hidden md:block hover:text-secondary text-lg font-medium"
                prefetch={true}
              >
                Connexion
              </Link>
            ) : (
              <Button
                className="bg-red-500 text-white hover:bg-red-600 hidden md:block"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            )}
            <SearchBar />
            <CartModal />
          </div>
        </div>

        {/* Mobile Drawer Menu */}
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
                  onClick={() => setIsOpen(false)}
                  prefetch={true}
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
            {isAuthenticated && (
              <li>
                <Link
                  href="/order"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 transition-colors ${
                    pathname === "/orders"
                      ? "text-primary"
                      : "text-textColor hover:text-primary"
                  }`}
                >
                  Mes Commandes
                </Link>
              </li>
            )}
            {!isAuthenticated ? (
              <li>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-textColor hover:text-primary"
                >
                  Connexion
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
