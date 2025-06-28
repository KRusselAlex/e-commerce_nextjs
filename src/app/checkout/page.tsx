import { Suspense } from "react";
import CheckoutPageClient from "./CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Chargement...</p>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
