"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getOrderByUserId, logout } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
};

type Order = {
  _id: string;
  userId: string;
  referenceId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
        : null;
    if (storedUser) {
      try {
        const parsedUser = storedUser;
        setUser(parsedUser);
        fetchOrders(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await getOrderByUserId(userId);
      console.log("Fetched orders:", res.data);
      setOrders(res.data.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!user) return <p className="p-6">Chargement du profil...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Mon Espace</h1>
        </div>

        {/* Right: Profile Card */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {user.avatar ? (
                <AvatarImage src={user.avatar} />
              ) : (
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-1" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Go to Shop Button */}
      <div className="mb-6">
        <Link href="/shop">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Aller à la boutique
          </Button>
        </Link>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes Commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardHeader>
                <CardTitle>Commande {order.referenceId}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Passée le {new Date(order.createdAt).toLocaleDateString()} |
                  Statut: {order.status}
                </p>
                <p className="text-sm text-muted-foreground">
                  Paiement: {order.paymentStatus}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-md border"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.price} FCFA
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-bold text-right">
                  Total: {order.totalAmount} FCFA
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
