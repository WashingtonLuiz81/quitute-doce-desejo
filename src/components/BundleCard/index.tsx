"use client";

import React from "react";
import { useCartStore } from "@/store/useCartStore";
import type { Bundle } from "@/lib/types";

type Props = { bundle: Bundle };

const BundleCard: React.FC<Props> = ({ bundle }) => {
  const { items, addItem } = useCartStore();
  const inCart = items.some((i) => i.id === bundle.id); // ✅ usa id

  return (
    <div className="relative flex flex-col rounded-2xl border p-4 shadow-md hover:shadow-lg transition">
      {inCart && (
        <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
          Combo no carrinho
        </span>
      )}

      {/* imagem */}
      <img
        src={bundle.image}
        alt={bundle.name}
        className="mb-3 h-40 w-full rounded-lg object-cover"
      />

      {/* título */}
      <h3 className="text-lg font-semibold text-gray-800">{bundle.name}</h3>

      {/* composição (ids) */}
      <ul className="mt-2 text-sm text-gray-600">
        {bundle.items.map((it, idx) => (
          <li key={idx}>• {it.qty}x – {it.productId}</li>
        ))}
      </ul>

      {/* preço */}
      <div className="mt-2 text-base font-semibold text-gray-900">
        {bundle.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}{" "}
        <span className="text-xs text-gray-500">/ combo</span>
      </div>

      {/* botão */}
      <button
        className="mt-3 rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-700 transition"
        onClick={(e) => {
          e.stopPropagation();
          // ✅ usa addItem do seu store simples
          addItem({ id: bundle.id, name: bundle.name, price: bundle.price }, 1);
        }}
      >
        Adicionar Combo
      </button>
    </div>
  );
};

export default BundleCard;
