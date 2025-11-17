// ex.: src/app/checkout/page.tsx
"use client";
import React from "react";
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Finalizar Pedido</h1>
      <p className="mt-1 text-slate-600">Informe seus dados e a forma de entrega/pagamento.</p>

      <div className="mt-6">
        <CheckoutForm />
      </div>
    </main>
  );
}
