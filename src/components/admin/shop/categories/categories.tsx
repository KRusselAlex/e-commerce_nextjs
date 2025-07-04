"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ObjectId } from "bson";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export interface Category {
  _id?: ObjectId | string;
  parentId: ObjectId | null;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Erreur lors du chargement des catégories"));
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories]);

  const handleAdd = async () => {
    const newCat: Category = {
      name,
      parentId: parentId ? new ObjectId(parentId) : null,
    };
    try {
      const res = await createCategory(newCat);
      setCategories((prev) => [...prev, res.data.data]);
      toast.success("Catégorie ajoutée avec succès");
      resetForm();
    } catch {
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;
    const updatedCat: Category = {
      ...selectedCategory,
      name,
      parentId: parentId ? new ObjectId(parentId) : null,
    };
    try {
      await updateCategory(selectedCategory._id!.toString(), updatedCat);
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id?.toString() === selectedCategory._id?.toString()
            ? updatedCat
            : cat
        )
      );
      toast.success("Catégorie modifiée avec succès");
      resetForm();
    } catch {
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
  };

  const handleDelete = async (id: string | ObjectId) => {
    try {
      await deleteCategory(id.toString());
      setCategories((prev) =>
        prev.filter((cat) => cat._id?.toString() !== id.toString())
      );
      toast.success("Catégorie supprimée avec succès");
      resetForm();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const startEdit = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setParentId(category.parentId ? category.parentId.toString() : null);
    setMode("edit");
  };

  const startAdd = () => {
    resetForm();
    setMode("add");
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setName("");
    setParentId(null);
    setMode("view");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Catégories</h2>
          {mode === "view" && (
            <Button onClick={startAdd} size="sm" className="text-white">
              <Plus className="mr-1 h-4 w-4 text-white" /> Ajouter
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {mode === "view" && (
            <div className="space-y-3">
              <Input
                placeholder="Rechercher une catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ScrollArea className="h-[400px] border rounded-lg p-2">
                <div className="grid gap-2">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat._id?.toString()}
                      className="flex justify-between items-center border p-2 rounded-md hover:bg-muted"
                    >
                      <span className="truncate max-w-[60%]">{cat.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(cat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            toast.warning("Confirmer la suppression ?", {
                              action: {
                                label: "Supprimer",
                                onClick: () => handleDelete(cat._id!),
                              },
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {(mode === "add" || mode === "edit") && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={resetForm}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" /> Retour
              </Button>
              <Input
                placeholder="Nom de la catégorie"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Select
                value={parentId || ""}
                onValueChange={(val) =>
                  setParentId(val === "none" ? null : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie parent (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat._id?.toString()}
                      value={cat._id!.toString()}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={mode === "add" ? handleAdd : handleUpdate}
                className="text-white"
              >
                {mode === "add" ? "Ajouter" : "Modifier"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
