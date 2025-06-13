"use client";
import React, { useState, useMemo } from "react";
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

interface Category {
  _id?: string;
  parentId: string | null;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const mockCategories: Category[] = [
  { _id: "1", parentId: null, name: "Science" },
  { _id: "2", parentId: null, name: "Technology" },
  { _id: "3", parentId: null, name: "Health" },
  { _id: "4", parentId: null, name: "Business" },
  { _id: "5", parentId: null, name: "Education" },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories]);

  const handleAdd = () => {
    const newCat: Category = {
      _id: Math.random().toString(36).substring(2, 10),
      parentId,
      name,
    };
    setCategories((prev) => [...prev, newCat]);
    setName("");
    setParentId(null);
    setMode("view");
  };

  const handleUpdate = () => {
    if (selectedCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategory._id ? { ...cat, name, parentId } : cat
        )
      );
      setSelectedCategory(null);
      setName("");
      setParentId(null);
      setMode("view");
    }
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
    setSelectedCategory(null);
    setName("");
    setParentId(null);
    setMode("view");
  };

  const startEdit = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setParentId(category.parentId);
    setMode("edit");
  };

  const startAdd = () => {
    setSelectedCategory(null);
    setName("");
    setParentId(null);
    setMode("add");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Catégories</h2>
          {mode === "view" && (
            <Button onClick={startAdd} size="sm">
              <Plus className="mr-1 h-4 w-4" /> Ajouter
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
                      key={cat._id}
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
                          onClick={() => handleDelete(cat._id!)}
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
                onClick={() => {
                  setMode("view");
                  setSelectedCategory(null);
                  setName("");
                  setParentId(null);
                }}
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
                    <SelectItem key={cat._id} value={cat._id!}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={mode === "add" ? handleAdd : handleUpdate}>
                {mode === "add" ? "Ajouter" : "Modifier"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
