"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  Pie,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import Dashboard from "@/components/admin/dashboard";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    orders: {
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      pending: number;
      completed: number;
      refunded: number;
    };
    products: {
      bestSelling: { id: number; name: string; sales: number }[];
    };
    users: {
      newUsers: number;
      activeUsers: number;
    };
  }>({
    orders: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      pending: 0,
      completed: 0,
      refunded: 0,
    },
    products: {
      bestSelling: [],
    },
    users: {
      newUsers: 0,
      activeUsers: 0,
    },
  });

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData({
        orders: {
          totalRevenue: 15000,
          totalOrders: 120,
          averageOrderValue: 125,
          pending: 10,
          completed: 100,
          refunded: 10,
        },
        products: {
          bestSelling: [
            { id: 1, name: "A'Space Black Tee", sales: 50 },
            { id: 2, name: "A'Space White Hoodie", sales: 30 },
          ],
        },
        users: {
          newUsers: 25,
          activeUsers: 80,
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  const userPieData = [
    { name: "New Users", value: data.users.newUsers, color: "#4F46E5" },
    { name: "Active Users", value: data.users.activeUsers, color: "#22C55E" },
  ];

  return (
    <Dashboard>
      <div className="mx-auto max-w-[110em]">
        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 overflow-x-auto">
          {/* Sales Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${data.orders.totalRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.orders.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${data.orders.averageOrderValue}
              </p>
            </CardContent>
          </Card>

          {/* Product Performance Chart */}
        </div>
        <div className="flex flex-col gap-6 p-2 md:p-6 w-full overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.products.bestSelling}>
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

            {/* User Analytics Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {userPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Order Statistics Bar Chart */}
          <Card className="">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(data.orders).map(([key, value]) => ({
                    name: key,
                    value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
}
