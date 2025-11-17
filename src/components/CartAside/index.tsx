"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { money } from "@/utils/formatCurrency";
import { Trash2 } from "lucide-react";

export default function CartAside() {
  const {
    items,
    removeItem,
    setQty,
    subtotal,
    total,
    checkout,
    deliveryFee,
  } = useCartStore();

  const entregaAplicada =
    checkout.deliveryMode === "ENTREGA" ? deliveryFee : 0;

  const hasItems = items.length > 0;

  const resumo = useMemo(
    () => ({
      subtotal: subtotal(),
      entrega: entregaAplicada,
      total: total(),
    }),
    [subtotal, entregaAplicada, total]
  );

  return (
    <aside className="w-full lg:w-96 p-4 border-l border-zinc-200">
      <h3 className="text-lg font-semibold mb-3">Meu Carrinho</h3>

      {!hasItems && (
        <p className="text-sm text-zinc-500">Seu carrinho está vazio.</p>
      )}

      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between rounded-xl border p-3"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{it.name}</p>
              <p className="text-xs text-zinc-500">{money(it.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={it.qty}
                className="w-16 border rounded-lg px-2 py-1 text-sm"
                onChange={(e) => setQty(it.id, Math.max(1, Number(e.target.value)))}
              />
              <button
                className="p-2 rounded-lg hover:bg-zinc-100"
                onClick={() => removeItem(it.id)}
                aria-label="Remover"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(resumo.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Entrega</span>
          <span>{money(resumo.entrega)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t pt-2">
          <span>Total</span>
          <span>{money(resumo.total)}</span>
        </div>
      </div>
    </aside>
  );
}
