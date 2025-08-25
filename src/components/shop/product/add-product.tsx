"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import {
  getCategories,
  createProduct,
  uploadImages as uploadProductImages,
} from "@/lib/api"; // Adjust path

interface Category {
  _id: string;
  parentId: string | null;
  name: string;
}

export default function CreateProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  });
  const [productId, setProductId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoriesFromApi = async () => {
      setLoading(true);
      try {
        const res = await getCategories();
        console.log(res.data);
        setCategories(res?.data?.data.reverse() || []);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
        toast.error("Impossible de charger les catégories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesFromApi();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productId) return alert("Veuillez créer le produit d'abord.");
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedFiles = [...images, ...files].slice(0, 4);
      const previews = updatedFiles.map((file) => URL.createObjectURL(file));
      setImages(updatedFiles);
      setImagePreviews(previews);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!productId) return alert("Veuillez créer le produit d'abord.");
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const accepted = files.filter((file) => file.type.startsWith("image/"));
    const updatedFiles = [...images, ...accepted].slice(0, 4);
    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setImages(updatedFiles);
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const submitProduct = async () => {
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
      };
      console.log("product send", data);
      const res = await createProduct(data);
      if (res.data && res.data.data._id) {
        toast.success("Produit créé avec succès !");
        console.log(res.data.data._id);
        setProductId(res.data.data._id);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error("Erreur lors de la création du produit", error);
      toast.error("Échec de la création du produit.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    if (!productId) return;
    setUploading(true);

    const form = new FormData();
    form.append("productId", productId); // ✅ This is critical
    images.forEach((img) => form.append("file", img)); // Your backend expects "file", not "images"

    try {
      await uploadProductImages(form); // Don't pass productId in the URL anymore
      toast.success("Images ajoutées avec succès !");
      router.push("/oniichan/shop/product");
    } catch (error) {
      console.error("Erreur lors de l'envoi des images", error);
      toast.error("Échec de l'envoi des images.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-6xl mx-auto mt-8 p-6 shadow-xl rounded-2xl">
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Form */}
          <form className="space-y-4">
            <h2 className="text-xl font-semibold">Créer un produit</h2>
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="h-32"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="" disabled>
                  Sélectionnez une catégorie
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="stockQuantity">Quantité en stock</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="button"
              className="w-full mt-4 text-white"
              onClick={submitProduct}
              disabled={loading}
            >
              Enregistrer
            </Button>
          </form>

          {/* Image Upload + Drop Zone */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ajouter des images</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                productId
                  ? "hover:bg-gray-100 border-gray-300"
                  : "bg-gray-50 opacity-60 cursor-not-allowed"
              }`}
            >
              <UploadCloud className="w-12 h-12 mb-2 text-gray-400" />
              <p className="text-sm text-muted-foreground">
                Glissez-déposez des images ici ou utilisez le bouton ci-dessous.
              </p>
            </div>

            <div>
              <Label htmlFor="images">Fichiers (max 4)</Label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={!productId}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formats acceptés : JPG, PNG.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-video group border border-gray-200 rounded-xl overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`preview-${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              className="w-full text-white"
              onClick={uploadImages}
              disabled={images.length === 0 || uploading}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Envoi en cours...
                </span>
              ) : (
                "Terminer"
              )}
            </Button>
            {images.length === 0 && !uploading && (
              <p className="text-sm text-destructive text-center">
                Veuillez ajouter au moins une image.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
