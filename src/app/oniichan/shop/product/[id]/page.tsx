"use client";
import Dashboard from "@/components/admin/dashboard";
import ProductEditor from "@/components/shop/product/update-product";
import { useRouter, useParams } from "next/navigation";


export default function ViewProduct() {
  const router = useRouter(); // Using the router hook
  const { id } = useParams();
  if (!id || (Array.isArray(id) && id.length === 0)) {
    router.push('/notfound')
  }

  return (
    <Dashboard>
      <div className="w-full mx-auto max-w-[110em]">
        <h1>Product</h1>
        <ProductEditor id={Array.isArray(id) ? id[0] : id ?? ""} />
      </div>
    </Dashboard>
  );
}
