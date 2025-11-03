"use client";

import React from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const mockItems = [
  { id: 1, name: "Brigadeiro gourmet", qty: 2, price: 5.5 },
  { id: 2, name: "Bolo de pote", qty: 1, price: 12 },
];

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const total = mockItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-sm bg-white shadow-2xl border-l border-[rgb(243,244,246)] transition-transform duration-200
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[rgb(243,244,246)]">
          <div>
            <p className="text-sm font-semibold text-slate-900">Seu carrinho</p>
            <p className="text-xs text-slate-500">{mockItems.length} itens</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* lista de itens */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {mockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 border border-slate-100 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                    {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  {item.qty}x • R$ {item.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                R$ {(item.price * item.qty).toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}

          {mockItems.length === 0 && (
            <p className="text-center text-sm text-slate-400 mt-6">
              Seu carrinho está vazio.
            </p>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-slate-100 px-4 py-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Total</span>
            <span className="text-lg font-semibold text-slate-900">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* finalizar no WhatsApp */}
          <a
            href={`https://wa.me/5511999999999?text=${encodeURIComponent(
              "Olá! Quero fazer este pedido: " +
                mockItems.map((i) => `${i.qty}x ${i.name}`).join(", ") +
                ` • Total: R$ ${total.toFixed(2).replace(".", ",")}`
            )}`}
            target="_blank"
            className="block w-full text-center rounded-full bg-[rgb(248,113,113)] text-white py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
          >
            Finalizar pelo WhatsApp
          </a>

          {/* link opcional */}
          <Link
            href="/carrinho"
            className="block text-center text-xs text-slate-400 mt-3 hover:text-slate-500"
            onClick={onClose}
          >
            Ver carrinho completo
          </Link>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
