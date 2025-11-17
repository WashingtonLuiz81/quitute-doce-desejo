// app/carrinho/page.tsx (ou o caminho da sua página de carrinho)
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import CartCheckout from "@/components/CartCheckout";
import { Trash2 } from "lucide-react";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CarrinhoPage() {
  const { items, removeItem, setQty } = useCartStore();

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.price) * Number(i.qty ?? 1), 0),
    [items]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[rgb(15,23,42)]">
            Seu carrinho
          </h1>
          <p className="text-sm text-[rgb(100,116,139)]">
            Revise os itens e finalize pelo WhatsApp.
          </p>
        </div>
        <Link
          href="/produtos"
          className="text-sm font-medium text-[rgb(248,113,113)] hover:underline"
        >
          Continuar comprando →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Seu carrinho está vazio.</p>
          <Link
            href="/produtos"
            className="mt-4 inline-flex rounded-full bg-[rgb(248,113,113)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[rgb(248,113,113)]/90 transition"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Lista de itens */}
          <section className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <ul className="divide-y divide-slate-100">
              {items.map((i) => {
                // unit opcional (alguns itens podem não ter)
                const unit = (i as { unit?: string }).unit ?? "un";

                return (
                  <li key={i.id} className="py-4 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-slate-100 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-[rgb(15,23,42)]">{i.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatBRL(Number(i.price))} • {unit}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="text-xs text-slate-600">Qtd</label>
                        <input
                          type="number"
                          min={1}
                          value={Number(i.qty ?? 1)}
                          onChange={(e) => {
                            const q = Math.max(1, Number(e.target.value || 1));
                            setQty(String(i.id), q);
                          }}
                          className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[rgb(15,23,42)]">
                        {formatBRL(Number(i.price) * Number(i.qty ?? 1))}
                      </p>
                      <button
                        onClick={() => removeItem(String(i.id))}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 border-t pt-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-base font-semibold text-[rgb(15,23,42)]">
                {formatBRL(subtotal)}
              </span>
            </div>
          </section>

          {/* Checkout (WhatsApp + endereço/entrega/pagamento) */}
          <aside className="md:col-span-2">
            <CartCheckout />
          </aside>
        </div>
      )}
    </main>
  );
}
