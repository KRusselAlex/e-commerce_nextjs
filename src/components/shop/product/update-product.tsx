"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

import {
  getCategories,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadImages,
  getImagesByProductId,
  deleteImage,
} from "@/lib/api";


interface Category {
  _id: string;
  parentId: string | null;
  name: string;
}

interface Props {
  id: string;
}

interface ProductImage {
  _id: string;
  url: string;
}




export default function ProductEditor({ id }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, productRes, imgRes] = await Promise.all([
          getCategories(),
          getProductById(id),
          getImagesByProductId(id),
        ]);
        console.log("nous somme ici");

        setCategories(catRes.data.data);
        console.log("produit arriver",productRes.data.data);
        // const p  = productRes.data.data;
        // console.log("produit arriver voila p", p);
        setFormData({
          name: productRes.data.data.name,
          description: productRes.data.data.description,
          price: productRes.data.data.price,
          category: productRes.data.data.category,
          stockQuantity: productRes.data.data.stockQuantity,
        });
        setExistingImages(imgRes.data.data);
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files].slice(0, 4));
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imgId: string) => {
    try {
      await deleteImage(imgId);
      setExistingImages((prev) => prev.filter((img) => img._id !== imgId));
      toast.success("Image supprimée.");
    } catch (e) {
        console.error(e);
      toast.error("Erreur lors de la suppression de l'image.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      toast.success("Produit mis à jour.");
    } catch (e) {
      console.error(e);
      toast.error("Échec de la mise à jour.");
    }
  };

  const handleImageUpload = async () => {
    if (images.length === 0) return;

    const form = new FormData();
    form.append("productId", id);
    images.forEach((img) => form.append("file", img));

    try {
      setUploading(true);

      // Upload the images
      const res = await uploadImages(form); // Make sure this returns the uploaded image data

      // Update existing images with the new ones returned from API
      setExistingImages((prev) => [...prev, ...res.data.data]); // Adjust according to your API response structure

      // Clear the new images preview
      setImages([]);

      toast.success("Images Updated.");
      router.push("/oniichan/shop/product");
    } catch (e) {
      console.error(e);
      toast.error("Échec de l'envoi des images.");
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteProduct = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      toast.success("Produit supprimé.");
      router.push("/oniichan/shop/product");
    } catch (e) {
      console.error(e);
      toast.error("Échec de la suppression.");
    }
  };

  return (
    <Card className="max-w-6xl mx-auto mt-8 p-6 shadow-xl rounded-2xl">
      <CardContent className="grid md:grid-cols-2 gap-6">
        <form className="space-y-4">
          <h2 className="text-xl font-semibold"> produit</h2>

          <Label htmlFor="name">Nom</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <Label htmlFor="price">Prix</Label>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />

          <Label htmlFor="category">Catégorie</Label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
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

          {/* Display selected category name */}
          {formData.category && (
            <div className="mt-2 text-sm text-gray-600">
              Catégorie sélectionnée :{" "}
              {categories.find((cat) => cat._id === formData.category)?.name ||
                "Non trouvée"}
            </div>
          )}

          <Label htmlFor="stockQuantity">Stock</Label>
          <Input
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleInputChange}
          />

          <Button
            type="button"
            onClick={handleUpdate}
            className="w-full text-white"
          >
            Mettre à jour
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteProduct}
            className="w-full text-white"
          >
            Supprimer le produit
          </Button>
        </form>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Images</h2>

          <div className="grid grid-cols-2 gap-4">
            {existingImages.map((img) => (
              <div
                key={img._id}
                className="relative aspect-video border rounded-xl overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt="product-image"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeExistingImage(img._id)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="grid grid-cols-2 gap-4">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative aspect-video border rounded-xl overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading || images.length === 0}
            className="w-full text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Envoi...
              </>
            ) : (
              "Ajouter des images"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
