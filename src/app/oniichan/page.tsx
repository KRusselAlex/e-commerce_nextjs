"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/admin/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getOrders, getProducts, getUsers, updateOrder } from "@/lib/api";
import Link from "next/link";
import OrderTable, { Order } from "@/components/admin/order/OrderTable";
import { toast } from "sonner";

// Define types

interface Product {
  name: string;
  sales?: number;
}

interface User {
  id: string;
  name: string;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [salesData] = useState<{ name: string; sales: number }[]>([
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 7000 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 8000 },
  ]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, newStatus);
      const updated = orders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      );
      setOrders(updated);
      toast.success("Statut mis à jour !");
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          getOrders(),
          getProducts(),
          getUsers(),
        ]);
        console.log("orders", ordersRes.data.data);
        setOrders(ordersRes?.data.data);
        setProducts(productsRes.data.data.products);
        setUsers(usersRes.data.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  console.log("orders", orders);

  const bestSelling = products
    .map((p) => ({ name: p.name, sales: p.sales || 0 }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const orderStatusSummary = orders.reduce(
    (acc, order) => {
      acc.totalRevenue += order.totalAmount || 0;
      acc.totalOrders += 1;

      switch (order.status) {
        case "completed":
          acc.completed++;
          break;
        case "pending":
          acc.pending++;
          break;
        case "refunded":
          acc.refunded++;
          break;
      }

      return acc;
    },
    {
      totalRevenue: 0,
      totalOrders: 0,
      completed: 0,
      pending: 0,
      refunded: 0,
    }
  );

  return (
    <Dashboard>
      <div className="mx-auto max-w-[110em] overflow-x-auto">
        {/* Top KPIs */}
        <div className="grid  lg:grid-cols-3 gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {orderStatusSummary.totalRevenue.toLocaleString()} CFA
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {orderStatusSummary.totalOrders}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bestSelling}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Completed",
                          value: orderStatusSummary.completed,
                        },
                        {
                          name: "Pending",
                          value: orderStatusSummary.pending,
                        },
                        {
                          name: "Refunded",
                          value: orderStatusSummary.refunded,
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#22C55E" />
                      <Cell fill="#FBBF24" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex justify-between">
              <div className="flex justify-between w-full items-center">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/oniichan/order" passHref legacyBehavior>
                  <a className="underline text-sm text-muted-foreground hover:text-primary">
                    All orders
                  </a>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <OrderTable
                orders={orders.slice(0, 5)}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
}
