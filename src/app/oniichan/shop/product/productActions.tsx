"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteProduct } from "@/lib/api"; // ← make sure you have this

interface Props {
  productId: string;
}

export default function ProductActions({ productId }: Props) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/oniichan/shop/product/${productId}`);
  };

  const handleEdit = () => {
    router.push(`/oniichan/shop/product/${productId}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      toast.success("Produit supprimé avec succès");
      // Optional: trigger re-fetch or state update from parent
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>More</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
