"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ObjectId } from "bson";

export interface Category {
  _id?: ObjectId | string;
  parentId: ObjectId | null;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartCategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string | ObjectId) => void;
}

export default function CartCategoryItem({
  category,
  onEdit,
  onDelete,
}: CartCategoryItemProps) {
  return (
    <div
      key={category._id?.toString()}
      className="flex justify-between items-center border py-2 px-3 space-x-4 rounded-xl hover:bg-muted"
    >
      <span className="truncate max-w-[60%]">{category.name}</span>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => {
            toast.warning("Confirm deletion?", {
              action: {
                label: "Delete",
                onClick: () => onDelete(category._id!),
              },
            });
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
