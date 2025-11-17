"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/utils/whatsapp";
import { money } from "@/utils/formatCurrency";

/** Tabela de bairros => taxa */
const BAIRROS: { label: string; fee: number }[] = [
  { label: "Morro Caratinga", fee: 8 },
  { label: "Centro", fee: 6 },
  { label: "Esplanada", fee: 7 },
  { label: "Santa Cruz", fee: 8 },
];

const LOJA_NOME = "Quitute Doce Desejo";
const WHATSAPP_E164 = "5533999999999"; // ajuste para o seu número

export default function CheckoutForm() {
  const {
    items,
    address,
    checkout,
    deliveryFee,
    setDeliveryMode,
    setAddressField,
    setCheckoutField,
    setDeliveryFee,
    subtotal,
    total,
    clearCart,
    clearCartOnSend,
  } = useCartStore();

  const isEntrega = checkout.deliveryMode === "ENTREGA";
  const temItens = items.length > 0;

  const resumo = useMemo(
    () => ({
      subtotal: subtotal(),
      entrega: isEntrega ? deliveryFee : 0,
      total: total(),
    }),
    [subtotal, deliveryFee, isEntrega, total]
  );

  function handleBairroChange(val: string) {
    const found = BAIRROS.find((b) => b.label === val);
    setAddressField("bairro", val || undefined);
    setDeliveryFee(found ? found.fee : 0);
  }

  function handleSend() {
    if (!temItens) return;

    const msg = buildWhatsappMessage({
      lojaNome: LOJA_NOME,
      items,
      address,
      pagamento: checkout.pagamento,
      observacoes: checkout.observacoes,
      deliveryMode: checkout.deliveryMode,
      lojaEndereco: checkout.lojaEndereco,
      deliveryFee,
    });

    const url = buildWhatsappUrl(WHATSAPP_E164, msg);
    window.open(url, "_blank");

    if (clearCartOnSend) {
      clearCart();
    }
  }

  return (
    <section className="w-full max-w-xl p-4 space-y-4">
      <div className="flex gap-2">
        <button
          className={`px-3 py-2 rounded-xl border ${
            isEntrega ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
          }`}
          onClick={() => setDeliveryMode("ENTREGA")}
        >
          Entrega
        </button>
        <button
          className={`px-3 py-2 rounded-xl border ${
            !isEntrega ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
          }`}
          onClick={() => {
            setDeliveryMode("RETIRADA");
            setDeliveryFee(0);
          }}
        >
          Retirada na loja
        </button>
      </div>

      {/* Dados do cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-sm">Nome</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={address.nome}
            onChange={(e) => setAddressField("nome", e.target.value)}
            placeholder="Seu nome completo"
          />
        </div>

        {isEntrega ? (
          <>
            <div className="sm:col-span-2">
              <label className="text-sm">Endereço</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={address.endereco}
                onChange={(e) => setAddressField("endereco", e.target.value)}
                placeholder="Rua / Avenida"
              />
            </div>
            <div>
              <label className="text-sm">Número</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={address.numero}
                onChange={(e) => setAddressField("numero", e.target.value)}
                placeholder="nº"
              />
            </div>
            <div>
              <label className="text-sm">Complemento</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={address.complemento ?? ""}
                onChange={(e) => setAddressField("complemento", e.target.value)}
                placeholder="Apto, bloco, ref."
              />
            </div>

            <div>
              <label className="text-sm">Bairro</label>
              <select
                className="w-full border rounded-xl px-3 py-2 bg-white"
                value={address.bairro ?? ""}
                onChange={(e) => handleBairroChange(e.target.value)}
              >
                <option value="">Selecione...</option>
                {BAIRROS.map((b) => (
                  <option key={b.label} value={b.label}>
                    {b.label} — {money(b.fee)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm">Cidade</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={address.cidade ?? ""}
                onChange={(e) => setAddressField("cidade", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">UF</label>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={address.uf ?? ""}
                onChange={(e) => setAddressField("uf", e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="col-span-2 text-sm text-zinc-600 rounded-xl border p-3">
            <p className="font-medium">Retirada na Loja</p>
            <p>{checkout.lojaEndereco}</p>
          </div>
        )}

        <div className="col-span-2">
          <label className="text-sm">Pagamento</label>
          <select
            className="w-full border rounded-xl px-3 py-2 bg-white"
            value={checkout.pagamento}
            onChange={(e) =>
              setCheckoutField("pagamento", e.target.value as any)
            }
          >
            <option value="PIX">PIX</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CARTAO">Cartão</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="text-sm">Observações</label>
          <textarea
            className="w-full border rounded-xl px-3 py-2"
            rows={3}
            value={checkout.observacoes ?? ""}
            onChange={(e) => setCheckoutField("observacoes", e.target.value)}
            placeholder="Alguma instrução para o pedido?"
          />
        </div>
      </div>

      {/* Resumo compacto (útil no mobile) */}
      <div className="rounded-xl border p-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(resumo.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Entrega</span>
          <span>{money(resumo.entrega)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total</span>
          <span>{money(resumo.total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCartStore.getState().clearCartOnSend}
            onChange={(e) =>
              useCartStore.getState().setClearCartOnSend(e.target.checked)
            }
          />
        <span>Limpar carrinho após enviar</span>
        </label>

        <button
          className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={!temItens}
          onClick={handleSend}
          title={!temItens ? "Adicione itens para enviar" : "Enviar no WhatsApp"}
        >
          Enviar pedido no WhatsApp
        </button>
      </div>
    </section>
  );
}
