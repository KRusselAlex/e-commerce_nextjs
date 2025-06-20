"use client";
import Dashboard from "@/components/admin/dashboard";
import AdminOrdersPage from "@/components/admin/order/orderList";



export default function AddProduct() {
  return (
    <Dashboard>
      <div className="w-full mx-auto max-w-[110em]">
        <AdminOrdersPage/>
      </div>
    </Dashboard>
  );
}
