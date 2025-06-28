"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getOrders, updateOrder } from "@/lib/api";

// Helpers
import { saveAs } from "file-saver";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderClient = {
  _id: string;
  name: string;
  email: string;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
};

type Order = {
  _id: string;
  referenceId?: string;
  userId: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  client?: OrderClient;
  shippingAddress?: ShippingAddress;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-200 text-yellow-800",
  processing: "bg-blue-200 text-blue-800",
  shipped: "bg-purple-200 text-purple-800",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

const PAYMENT_BADGE: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
};

const STATUSES = ["pending", "processing", "shipped", "completed", "cancelled"];
const PAYMENTS = ["paid", "unpaid"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error("Erreur de chargement des commandes", err);
      toast.error("Erreur de chargement des commandes");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, newStatus);
      const updated = orders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      );
      setOrders(updated);
      applyFilters(updated);
      toast.success("Statut mis à jour !");
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  const applyFilters = (list = orders) => {
    let temp = [...list];

    if (statusFilter) {
      temp = temp.filter((o) => o.status === statusFilter);
    }

    if (paymentFilter) {
      temp = temp.filter((o) => o.paymentStatus === paymentFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (o) =>
          o.client?.email?.toLowerCase().includes(q) ||
          o.referenceId?.toLowerCase().includes(q)
      );
    }

    setFiltered(temp);
    setPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleExportCSV = () => {
    const headers = [
      "Reference ID",
      "Client Name",
      "Email",
      "Total Amount",
      "Status",
      "Payment",
      "Date",
      "Shipping Address",
    ];

    const rows = filtered.map((order) => [
      order.referenceId ?? order._id,
      order.client?.name ?? "",
      order.client?.email ?? "",
      order.totalAmount,
      order.status,
      order.paymentStatus ?? "",
      new Date(order.createdAt).toLocaleString(),
      [
        order.shippingAddress?.fullName,
        order.shippingAddress?.phone,
        order.shippingAddress?.addressLine,
        order.shippingAddress?.city,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.country,
      ]
        .filter(Boolean)
        .join(", "),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders_export.csv");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Commandes Admin</h1>

        <div className="flex gap-4 flex-wrap">
          <Input
            type="text"
            placeholder="Recherche par email ou ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[220px]"
          />

          <Select onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setPaymentFilter(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Paiement" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENTS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleExportCSV} variant="outline">
            Exporter CSV
          </Button>
        </div>
      </div>

      {paginated.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        paginated.map((order) => (
          <Card key={order._id} className="mb-4">
            <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
              <div>
                <CardTitle>
                  Commande:{" "}
                  <span className="text-primary">
                    {order.referenceId ?? order._id}
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Client: <strong>{order.client?.name ?? "Inconnu"}</strong> (
                  {order.client?.email ?? "Email inconnu"})
                </p>
                <p className="text-sm">
                  Le {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <Badge className={STATUS_COLORS[order.status]}>
                  {order.status}
                </Badge>
                {order.paymentStatus && (
                  <Badge className={PAYMENT_BADGE[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <ul className="text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} —{" "}
                    {item.price.toLocaleString()} FCFA (Total:{" "}
                    {(item.quantity * item.price).toLocaleString()} FCFA)
                  </li>
                ))}
              </ul>

              <p className="text-sm text-muted-foreground">
                Total articles:{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>

              {/* Shipping address */}
              <div className="text-sm text-muted-foreground space-y-1 mt-4">
                <p className="font-semibold text-black">
                  Adresse de livraison :
                </p>
                <p>
                  <strong>Nom :</strong>{" "}
                  {order.shippingAddress?.fullName ?? "N/A"}
                </p>
                <p>
                  <strong>Téléphone :</strong>{" "}
                  {order.shippingAddress?.phone ?? "N/A"}
                </p>
                <p>
                  <strong>Adresse :</strong>{" "}
                  {[
                    order.shippingAddress?.addressLine,
                    order.shippingAddress?.city,
                    order.shippingAddress?.postalCode,
                    order.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Non spécifiée"}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <label className="text-sm font-medium">Changer statut :</label>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(order._id, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀
          </Button>
          <span className="text-sm mt-1">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ▶
          </Button>
        </div>
      )}
    </div>
  );
}
