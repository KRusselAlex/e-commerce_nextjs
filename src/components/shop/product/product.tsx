"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure you have this

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    images?: string[];
  };
}

export default function ProductDetail({ product }: ProductCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const { addToCart, fetchCart } = useCartStore();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.error("Veuillez vous connecter d'abord.");
      router.push("/auth/login");
      return;
    }

    if (quantity < 1) {
      toast.error("La quantité doit être d'au moins 1.");
      return;
    }

    await addToCart(product._id, user.id, quantity);
    await fetchCart(user.id);
    toast.success(`${quantity} ajouté(s) au panier`);
  };

  const handleBuyNow = async () => {
    console.log("Acheter maintenant", product, quantity, user);
    if (!user?.id) {
      toast.error("Veuillez vous connecter d'abord.");
      router.push("/auth/login");
      return;
    }

    if (quantity < 1) {
      toast.error("La quantité doit être d'au moins 1.");
      return;
    }

    try {
      await createOrder({
        userId: user._id,
        productId: product._id,
        name: product.name,
        quantity,
        price: product.price,
        image: product.images?.[0] || "",
      });
      toast.success("Commande effectuée !");
    } catch (error) {
      console.error("Erreur commande:", error);
      toast.error("Erreur lors de la commande");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image gallery */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow">
          <Image
            src={product.images?.[selectedImageIndex] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex gap-3 mt-2">
          {product.images?.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg border-2 cursor-pointer transition-all ${
                index === selectedImageIndex
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-lg text-gray-600 whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-2xl font-semibold text-green-700">
            {product.price}€
          </span>

          {/* Quantity input */}
          <div>
            <label htmlFor="qty" className="text-sm font-medium text-gray-700">
              Quantité
            </label>
            <Input
              type="number"
              min={1}
              id="qty"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="mt-1 w-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 flex items-center gap-2 text-md"
            >
              <ShoppingCart size={20} /> Ajouter au panier
            </Button>

            <Button
              onClick={handleBuyNow}
              className="flex-1 flex items-center gap-2 text-md text-white"
            >
              <CreditCard size={20} /> Acheter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
