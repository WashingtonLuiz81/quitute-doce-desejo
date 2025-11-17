// src/components/CheckoutButton.tsx
"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { useConfigStore } from "@/store/useConfigStore";
import { buildCheckoutWhatsAppUrl, type SimpleCartItem } from "@/lib/whatsapp";

export const CheckoutButton: React.FC = () => {
  const { items } = useCartStore();
  const { config } = useConfigStore();

  function handleCheckout() {
    if (!items.length) return;

    // Converte os itens do carrinho para SimpleCartItem
    const simpleItems: SimpleCartItem[] = items.map((i) => {
      const qty = Number(i.qty ?? 1);
      const price = Number(i.price);
      return {
        id: String(i.id),
        name: i.name,
        price,
        qty,
        subtotal: price * qty,
      };
    });

    // Para este botão genérico, usamos retirada + pix como defaults
    const url = buildCheckoutWhatsAppUrl(config.whatsapp, simpleItems, {
      lojaNome: config.name,
      customerName: "Cliente",
      fulfillment: "retirada",
      payment: { method: "pix" },
      note: "Entrega hoje após as 18h.",
    });

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={!items.length}
      className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
    >
      Finalizar pedido no WhatsApp
    </button>
  );
};

export default CheckoutButton;
