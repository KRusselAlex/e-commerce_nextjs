"use client";

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { ApiError } from "@/types/errorTypes";

interface CartItemCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  id,
  name,
  price,
  image,
  quantity,
}) => {
  const { removeFromCart, fetchCart } = useCartStore();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;

  const handleRemoveCart = async () => {
    try {
      await removeFromCart(user.id, id);
      await fetchCart(user.id);
      toast.success("cart removed");
    } catch (error: unknown) {
      const message =
        (error as ApiError)?.response?.data?.message ||
        "Removed failed. Try again.";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white shadow rounded-lg p-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 relative rounded overflow-hidden">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <div className="flex flex-col text-black">
          <span className="font-semibold">{name}</span>
          <span className="text-sm text-gray-600">{price} F CFA</span>
          <span className="text-xs text-gray-500">Quantité: {quantity}</span>
        </div>
      </div>

      <button
        onClick={handleRemoveCart}
        className="text-red-500 hover:text-red-700"
        title="Supprimer du panier"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItemCard;
