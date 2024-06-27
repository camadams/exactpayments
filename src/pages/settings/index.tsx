// pages/products.tsx

import Link from "next/link";
import React from "react";
import CustomersPage from "~/components/Customers";
import ProductsPage from "~/components/Products";
import { api } from "~/utils/api";

// const products = [
//   { id: 0, name: "Alm Cros", unitPrice: 18 },
//   { id: 1, name: "Cin Twist", unitPrice: 16 },
//   { id: 2, name: "Choc Cros", unitPrice: 17 },
// ];

export default function App() {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-center w-full mb-2">
        <Link href="/dashboard" className="p-1 bg-yellow-200 rounded-md hover:bg-slate-400">
          Back
        </Link>
      </div>
      <ProductsPage />
      <div className="pt-4" />

      <CustomersPage />
    </div>
  );
}
