"use client";
import Dashboard from "@/components/admin/dashboard";
import CreateProductForm from "@/components/shop/product/add-product";


export default function AddProduct() {
  return (
    <Dashboard>
      <div className="w-full mx-auto max-w-[110em]">
        <h1>Add Product</h1>
        <CreateProductForm />
      </div>
    </Dashboard>
  );
}
