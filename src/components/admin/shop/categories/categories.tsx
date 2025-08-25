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
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CartCategoryItem from "./cartCategoryItem";

export interface Category {
  _id?: ObjectId | string;
  parentId: ObjectId | null;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {
        toast.error("Error loading categories");
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    filtered.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase())
        return sortOrder === "asc" ? -1 : 1;
      if (a.name.toLowerCase() > b.name.toLowerCase())
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [search, categories, sortOrder]);

  // Add Category
  const handleAdd = async () => {
    setLoading(true);
    const newCat: Category = {
      name: name.toLowerCase(),
      parentId: parentId ? new ObjectId(parentId) : null,
    };
    try {
      const res = await createCategory(newCat);
      setCategories((prev) => [...prev, res.data.data]);
      toast.success("Category added successfully");
      closeAddModal();
    } catch {
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  // Edit Category
  const handleUpdate = async () => {
    setLoading(true);
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
      toast.success("Category updated successfully");
      closeEditModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error updating category");
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Error updating category");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDelete = async (id: string | ObjectId) => {
    setLoading(true);
    try {
      await deleteCategory(id.toString());
      setCategories((prev) =>
        prev.filter((cat) => cat._id?.toString() !== id.toString())
      );
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  // Modal open/close helpers
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setParentId(category.parentId ? category.parentId.toString() : null);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    setName("");
    setParentId(null);
  };
  const openAddModal = () => {
    setName("");
    setParentId(null);
    setShowAddModal(true);
  };
  const closeAddModal = () => {
    setShowAddModal(false);
    setName("");
    setParentId(null);
  };

  return (
    <div className="mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex flex-col-reverse gap-3 md:flex-row w-full justify-between items-center">
            <Input
              placeholder="Search a category..."
              value={search}
              className="w-full lg:max-w-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="text-muted-foreground"
                title={`Sort ${sortOrder === "asc" ? "A-Z" : "Z-A"}`}
              >
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </Button>
              <Button onClick={openAddModal} size="sm" className="text-white">
                <Plus className="mr-1 h-4 w-4 text-white" /> Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ScrollArea className="h-[400px] rounded-lg">
              {loading ? (
                <div className="flex w-full justify-center p-2 items-center h-full">
                  <Loading />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredCategories.map((cat) => (
                    <CartCategoryItem
                      key={cat._id?.toString()}
                      category={cat}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              value={parentId || ""}
              onValueChange={(val) => setParentId(val === "none" ? null : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
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
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeAddModal} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="text-white"
              disabled={loading}
            >
              {loading ? "loading" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              value={parentId || ""}
              onValueChange={(val) => setParentId(val === "none" ? null : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
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
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeEditModal} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="text-white"
              disabled={loading}
            >
              {loading ? "loading" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
