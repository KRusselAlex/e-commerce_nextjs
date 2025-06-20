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
import { toast } from "sonner";
import { getOrders, updateOrder } from "@/lib/api";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};


type Order = {
  _id: string;
  referenceId: string;
  userId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
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
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(filtered.length / perPage);

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

  const handleStatusChange = async (orderId: string, newStatus:string ) => {


    try {
      
      await updateOrder(orderId,newStatus );
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

  const applyFilters = (ordersList = orders) => {
    let temp = [...ordersList];
    if (statusFilter) temp = temp.filter((o) => o.status === statusFilter);
    if (paymentFilter)
      temp = temp.filter((o) => o.paymentStatus === paymentFilter);
    setFiltered(temp);
    setPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter, paymentFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commandes Admin</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select onValueChange={(v) => setStatusFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par paiement" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENTS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders */}
      {paginated.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        paginated.map((order) => (
          <Card key={order._id} className="mb-4">
            <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
              <div>
                <CardTitle>Commande {order.referenceId}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Client ID: {order.userId}
                </p>
                <p className="text-sm">
                  Le {new Date(order.createdAt).toLocaleDateString()} | Total:{" "}
                  {order.totalAmount} FCFA
                </p>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <Badge className={STATUS_COLORS[order.status]}>
                  {order.status}
                </Badge>
                <Badge className={PAYMENT_BADGE[order.paymentStatus]}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} — {item.price} FCFA
                  </li>
                ))}
              </ul>

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

      {/* Pagination */}
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
