// src/components/CartCheckout.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useConfigStore } from "@/store/useConfigStore";
import { buildCheckoutWhatsAppUrl, type SimpleCartItem } from "@/lib/whatsapp";
import { MessageCircle, Loader2, MapPin } from "lucide-react";

type Props = { onBack?: () => void };
type Fulfillment = "entrega" | "retirada";
type Payment = "pix" | "credito" | "debito" | "dinheiro";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const Pill: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "rounded-full px-4 py-2 text-sm border transition",
      active
        ? "bg-[rgb(248,113,113)] text-white border-[rgb(248,113,113)]"
        : "bg-white text-[rgb(15,23,42)] border-[rgb(248,113,113)]/30 hover:bg-[rgb(248,113,113)]/10",
    ].join(" ")}
  >
    {children}
  </button>
);

const CartCheckout: React.FC<Props> = ({ onBack }) => {
  const { items } = useCartStore();
  const { config } = useConfigStore();

  // ===== Tipagem local para permitir address.reference sem quebrar =====
  type AddressWithReference = typeof config.address & { reference?: string };
  const storeAddress = config.address as AddressWithReference;

  // === Estado do form ===
  const [customerName, setCustomerName] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("entrega");
  const [zoneId, setZoneId] = useState<string>("");
  const [street, setStreet] = useState(""); // Endereço (rua/av.)
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [payment, setPayment] = useState<Payment>("pix");
  const [changeFor, setChangeFor] = useState<string>("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.price) * Number(i.qty ?? 1), 0),
    [items]
  );

  const zone = useMemo(
    () => config.deliveryZones?.find((z) => z.id === zoneId),
    [config.deliveryZones, zoneId]
  );

  const deliveryFee = fulfillment === "entrega" && zone ? Number(zone.fee) : 0;
  const totalWithDelivery = subtotal + deliveryFee;

  function handleFulfillmentChange(next: Fulfillment) {
    setFulfillment(next);
    if (next === "retirada") {
      // em retirada, não usamos bairro/endereço
      setZoneId("");
    }
  }

  async function handleSend() {
    if (!items.length) return;

    if (!customerName.trim()) {
      alert("Informe seu nome para continuar 😊");
      return;
    }

    if (fulfillment === "entrega") {
      if (!zone) {
        alert("Selecione o bairro/região para calcular a entrega.");
        return;
      }
      if (!street.trim()) {
        alert("Informe o endereço (rua/avenida) para a entrega.");
        return;
      }
    }

    const simple: SimpleCartItem[] = items.map((i) => {
      const qty = Number(i.qty ?? 1);
      const price = Number(i.price);
      return {
        id: String(i.id),
        name: i.name,
        price,
        qty,
        subtotal: qty * price,
      };
    });

    const extraNoteLines: string[] = [];
    if (note.trim()) extraNoteLines.push(note.trim());
    if (deliveryFee > 0) {
      extraNoteLines.push(`Taxa de entrega (${zone?.name}): ${formatBRL(deliveryFee)}`);
      extraNoteLines.push(`Total com entrega: ${formatBRL(totalWithDelivery)}`);
    }

    setSending(true);
    try {
      const url = buildCheckoutWhatsAppUrl(config.whatsapp, simple, {
        lojaNome: config.name,
        customerName: customerName.trim(),
        fulfillment,
        address:
          fulfillment === "entrega"
            ? {
                street: street.trim(),
                number: number.trim(),
                complement: complement.trim() || undefined,
                district: zone?.name ?? undefined,
                city: config.address.city,
                state: config.address.state,
              }
            : undefined,
        // 👇 Envia dados da loja quando for retirada (inclui reference)
        pickup:
          fulfillment === "retirada"
            ? {
                street: storeAddress.street,
                district: storeAddress.district,
                city: storeAddress.city,
                state: storeAddress.state,
                zip: storeAddress.zip,
                reference: storeAddress.reference, // <- referência da loja
                mapUrl: storeAddress.mapUrl,
              }
            : undefined,
        payment: {
          method: payment,
          changeFor:
            payment === "dinheiro" && changeFor
              ? Number(changeFor.replace(",", "."))
              : undefined,
        },
        deliveryFee, // garante rodapé consistente
        note: extraNoteLines.length ? extraNoteLines.join("\n") : undefined,
      });

      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[rgb(248,113,113)]/20 bg-white p-4">
      {/* Nome */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-slate-700">Nome*</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Seu nome"
          className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
        />
      </div>

      {/* Como prefere receber */}
      <div className="mt-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Como prefere receber?
        </label>
        <div className="flex flex-wrap gap-2">
          <Pill active={fulfillment === "entrega"} onClick={() => handleFulfillmentChange("entrega")}>
            Entrega
          </Pill>
          <Pill active={fulfillment === "retirada"} onClick={() => handleFulfillmentChange("retirada")}>
            Retirada na Loja
          </Pill>
        </div>
      </div>

      {/* Campos de endereço – apenas quando ENTREGA */}
      {fulfillment === "entrega" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Bairro/Região*
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40 bg-white"
            >
              <option value="">Selecione o bairro/região</option>
              {(config.deliveryZones ?? []).map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {formatBRL(Number(z.fee))}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Endereço (Rua/Avenida)*
            </label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Ex.: Rua das Laranjeiras"
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Número</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ex.: 123"
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Complemento</label>
            <input
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Casa, Apto, Bloco..."
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
            />
          </div>
        </div>
      ) : (
        // Bloco com endereço da loja quando RETIRADA
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[rgb(248,113,113)] mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Retirada na loja
              </p>
              <p className="text-sm text-slate-600">
                {storeAddress.street} – {storeAddress.district}
              </p>
              <p className="text-xs text-slate-500">
                {storeAddress.city}/{storeAddress.state} • CEP {storeAddress.zip}
              </p>
              {/* Referência vinda do config.address.reference */}
              {storeAddress.reference && (
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-medium">Referência:</span> {storeAddress.reference}
                </p>
              )}
              {storeAddress.mapUrl && (
                <a
                  href={storeAddress.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs text-[rgb(248,113,113)] hover:underline"
                >
                  Ver mapa
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagamento */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Forma de pagamento*
        </label>
        <div className="flex flex-wrap gap-2">
          <Pill active={payment === "pix"} onClick={() => setPayment("pix")}>PIX</Pill>
          <Pill active={payment === "credito"} onClick={() => setPayment("credito")}>Crédito</Pill>
          <Pill active={payment === "debito"} onClick={() => setPayment("debito")}>Débito</Pill>
          <Pill active={payment === "dinheiro"} onClick={() => setPayment("dinheiro")}>Dinheiro</Pill>
        </div>

        {payment === "dinheiro" && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700">Troco para</label>
            <input
              value={changeFor}
              onChange={(e) => setChangeFor(e.target.value)}
              placeholder="Ex.: 50,00"
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              inputMode="decimal"
            />
          </div>
        )}
      </div>

      {/* Observações */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700">Observações (opcional)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex.: Sem lactose, deixar na portaria, etc."
          className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
        />
      </div>

      {/* Resumo e ação */}
      <div className="mt-5 border-t pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-900">{formatBRL(subtotal)}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Entrega {zone ? `(${zone.name})` : ""}</span>
            <span className="font-semibold text-slate-900">{formatBRL(deliveryFee)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total</span>
          <span className="font-semibold text-slate-900">
            {formatBRL(totalWithDelivery)}
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !items.length}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(248,113,113)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(248,113,113)]/90 disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando mensagem…
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Enviar pedido pelo WhatsApp
            </>
          )}
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Voltar ao carrinho
          </button>
        )}
      </div>
    </div>
  );
};

export default CartCheckout;
