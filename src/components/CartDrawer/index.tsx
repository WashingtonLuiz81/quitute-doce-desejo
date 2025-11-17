"use client";

import React, { useMemo, useState, useEffect } from "react";
import { X, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartCheckout from "@/components/CartCheckout";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, removeItem, setQty } = useCartStore();
  const [step, setStep] = useState<1 | 2>(1);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.price) * Number(i.qty ?? 1), 0),
    [items]
  );

  // sempre que abrir, volta para o passo 1
  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity z-[1000]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        className={[
          "fixed right-0 top-0 h-full w-[380px] max-w-[92vw] bg-white shadow-2xl",
          "transition-transform duration-300 ease-out z-[1001]",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">Seu carrinho</h3>
            <span className="text-xs text-slate-500">
              {step === 1 ? "Passo 1/2" : "Passo 2/2"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 ? (
            items.length === 0 ? (
              <p className="text-sm text-slate-500">Seu carrinho está vazio.</p>
            ) : (
              <ul className="space-y-4">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{i.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatBRL(Number(i.price))} • {(i as any).unit ?? "un"}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <label className="text-xs text-slate-600">Qtd</label>
                        <input
                          type="number"
                          min={1}
                          value={Number(i.qty ?? 1)}
                          onChange={(e) =>
                            setQty(String(i.id), Math.max(1, Number(e.target.value || 1)))
                          }
                          className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
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
                ))}
              </ul>
            )
          ) : (
            <CartCheckout onBack={() => setStep(1)} />
          )}
        </div>

        {/* Rodapé / ações */}
        {step === 1 ? (
          <div className="border-t p-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatBRL(subtotal)}</span>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={items.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(248,113,113)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(248,113,113)]/90 disabled:opacity-60"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-t p-4">
            <button
              onClick={() => setStep(1)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
