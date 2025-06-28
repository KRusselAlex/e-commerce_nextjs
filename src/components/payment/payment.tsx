"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import Image from "next/image";
import { ApiError } from "@/types/errorTypes";

type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
};

type BuyNowProduct = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

interface CheckoutFormProps {
  userId: string;
  product?: BuyNowProduct;
  quantity?: number;
}

export default function CheckoutForm({
  userId,
  product,
  quantity,
}: CheckoutFormProps) {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Utilisateur non connecté.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        shippingAddress,
        ...(product && quantity
          ? {
              productId: product._id,
              name: product.name,
              price: product.price,
              quantity,
              image: product.image || "",
            }
          : {}),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Échec de la commande");

      toast.success(
        `Commande créée. Payez avec ${paymentMethod.toUpperCase()}`
      );
      router.push("/shop");
    } catch (error: unknown) {
      const message =
        (error as ApiError)?.response?.data?.message ||
        "Login failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* LEFT SIDE - FORM */}
      <div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Finalise ta commande !
        </h1>
        <p className="text-gray-600 mb-6">
          Remplis tes informations de livraison pour recevoir ta commande
          rapidement.
        </p>

        <div className="space-y-4">
          {(
            [
              { label: "Nom complet", id: "fullName" },
              { label: "Téléphone", id: "phone" },
              { label: "Adresse", id: "addressLine" },
              { label: "Ville", id: "city" },
              { label: "Code postal", id: "postalCode" },
              { label: "Pays", id: "country" },
            ] as { label: string; id: keyof ShippingAddress }[]
          ).map(({ label, id }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                name={id}
                value={shippingAddress[id]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" /> Moyen de paiement
          </h2>
          <RadioGroup defaultValue="mtn" onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mtn" id="mtn" />
              <Label htmlFor="mtn">MTN Mobile Money</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="orange" id="orange" />
              <Label htmlFor="orange">Orange Money</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          className="mt-8 w-full text-lg text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Traitement..." : "📦 Commander maintenant"}
        </Button>
      </div>

      {/* RIGHT SIDE - MOTIVATION */}
      <div className="space-y-6">
        <Image
          src="/delivery.jpg"
          alt="Livraison rapide"
          width={500}
          height={300}
          className="rounded-lg shadow-md w-full object-cover"
        />

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow">
          <h3 className="text-xl font-bold mb-3 text-green-800">
            Pourquoi commander chez nous ?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Truck className="text-green-600 w-5 h-5" />
              Livraison rapide dans tout le pays
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="text-green-600 w-5 h-5" />
              Paiement 100% sécurisé
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="text-green-600 w-5 h-5" />
              Suivi de commande en temps réel
            </li>
          </ul>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          En commandant maintenant, vous soutenez une entreprise locale ❤️
        </div>
      </div>
    </div>
  );
}
