"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getOrderByUserId, logout } from "@/lib/api";
import clsx from "clsx";

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
        : null;

    if (storedUser) {
      setUser(storedUser);
      fetchOrders(storedUser.id);
    }
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await getOrderByUserId(userId);
      const ordersData = res.data.data;
      console.log("Fetched orders:", ordersData);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    let filtered = orders.filter((order) => {
      console.log("Filtering order:", order.referenceId);
      const matchesSearch = order.referenceId
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || statusFilter === ""
          ? true
          : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    if (sortBy === "date") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "amount") {
      filtered = filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setFilteredOrders(filtered);
  }, [search, statusFilter, sortBy, orders]);

  const statusColor = (status: string) =>
    clsx(
      "text-xs font-semibold px-2 py-1 rounded-full capitalize",
      {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-orange-100 text-orange-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      }[status] || "bg-gray-100 text-gray-800"
    );

  if (!user) return <p className="p-6">Chargement du profil...</p>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Mon Espace</h1>
        </div>

        <div className="flex items-center gap-4">
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

      {/* Go to Shop */}
      <div>
        <Link href="/shop">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Aller à la boutique
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Rechercher par référence..."
          className="w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="shipped">Expédiée</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (récent)</SelectItem>
            <SelectItem value="amount">Montant (élevé)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes Commandes</h2>
        {filteredOrders.length === 0 ? (
          <p className="text-muted-foreground">Aucune commande trouvée.</p>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Commande {order.referenceId}
                  </CardTitle>
                  <span className={statusColor(order.status)}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Passée le {new Date(order.createdAt).toLocaleDateString()} |
                  Paiement:{" "}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.png"}
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
                <p className="mt-4 font-bold text-right text-primary">
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
