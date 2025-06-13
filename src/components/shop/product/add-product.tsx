import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { Stepper, Step, StepLabel } from "@mui/material";

export default function CreateProductForm() {
  const [step, setStep] = useState(0);
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

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedFiles = [...images, ...files].slice(0, 4);
      const previews = updatedFiles.map((file) => URL.createObjectURL(file));
      setImages(updatedFiles);
      setImagePreviews(previews);
    }
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
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
      }),
    });

    const data = await res.json();
    if (res.ok && data._id) {
      setProductId(data._id);
      setStep(1);
    }
  };

  const uploadImages = async () => {
    if (!productId) return;
    setUploading(true);
    const form = new FormData();
    images.forEach((img) => form.append("images", img));

    const res = await fetch(`/api/products/${productId}/images`, {
      method: "POST",
      body: form,
    });

    setUploading(false);
    if (res.ok) router.push("/products");
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-6 shadow-xl rounded-2xl">
      <CardContent>
        <Stepper activeStep={step} alternativeLabel>
          <Step>
            <StepLabel>Créer le produit</StepLabel>
          </Step>
          <Step>
            <StepLabel>Ajouter des images</StepLabel>
          </Step>
        </Stepper>

        {step === 0 && (
          <form className="space-y-4 mt-2">
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
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
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
            >
              Suivant
            </Button>
          </form>
        )}

        {step === 1 && (
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="images">Ajouter des images (max 4)</Label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formats acceptés : JPG, PNG. Jusqu&apos;à 4 fichiers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square group"
                >
                  <Image
                    src={src}
                    alt={`preview-${index}`}
                    fill
                    className="rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              className="w-full mt-4"
              onClick={uploadImages}
              disabled={images.length !== 4 || uploading}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Envoi en cours...
                </span>
              ) : (
                "Terminer"
              )}
            </Button>
            {images.length !== 4 && !uploading && (
              <p className="text-sm text-destructive text-center">
                Veuillez ajouter minimimum 1 images pour continuer.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
