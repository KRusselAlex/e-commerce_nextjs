"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type OrderClient = {
  _id: string;
  name: string;
  email: string;
};

export type Order = {
  _id: string;
  referenceId?: string;
  userId: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  client?: OrderClient;
};

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const STATUSES = ["pending", "processing", "shipped", "completed", "cancelled"];

export default function OrderTable({
  orders,
  onStatusChange,
}: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commande</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              {order.referenceId ?? order._id.slice(0, 6) + "..."}
            </TableCell>
            <TableCell>{order.client?.name ?? "Inconnu"}</TableCell>
            <TableCell>{order.client?.email ?? "—"}</TableCell>
            <TableCell>{order.totalAmount.toLocaleString()} FCFA</TableCell>
            <TableCell>
              <Select
                value={order.status}
                onValueChange={(value) => onStatusChange(order._id, value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Changer le statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
