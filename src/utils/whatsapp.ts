import { money } from "./formatCurrency";
import type { CartItem } from "@/store/useCartStore";

type BuildMsgParams = {
  lojaNome: string;
  items: CartItem[];
  address: {
    nome: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  pagamento: string;
  observacoes?: string;
  deliveryMode: "ENTREGA" | "RETIRADA";
  lojaEndereco?: string;
  deliveryFee: number;
};

export function buildWhatsappMessage({
  lojaNome,
  items,
  address,
  pagamento,
  observacoes,
  deliveryMode,
  lojaEndereco,
  deliveryFee,
}: BuildMsgParams) {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const entrega = deliveryMode === "ENTREGA" ? deliveryFee : 0;
  const total = subtotal + entrega;

  const hdr = `*${lojaNome}* — Novo pedido`;
  const dadosCliente =
    deliveryMode === "ENTREGA"
      ? [
          `*Nome:* ${address.nome}`,
          `*Endereço:* ${address.endereco}, ${address.numero}`,
          address.complemento ? `*Complemento:* ${address.complemento}` : null,
          address.bairro ? `*Bairro:* ${address.bairro}` : null,
          `*Cidade/UF:* ${address.cidade}/${address.uf}`,
          `*Pagamento:* ${pagamento}`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          `*Nome:* ${address.nome}`,
          `*Tipo:* Retirada na Loja`,
          lojaEndereco ? `*Endereço da Loja:* ${lojaEndereco}` : null,
          `*Pagamento:* ${pagamento}`,
        ]
          .filter(Boolean)
          .join("\n");

  const obs = observacoes?.trim()
    ? `\n\n*Observações:* ${observacoes.trim()}`
    : "";

  const linhasItens = items
    .map(
      (it) =>
        `${it.name} - ${it.qty}x - ${money(it.price)}`
    )
    .join("\n");

  const rodape = [
    "-------------------------------",
    `*Subtotal:* ${money(subtotal)}`,
    `*Entrega:* ${money(entrega)}`,
    `*Total:* ${money(total)}`,
  ].join("\n");

  return [
    hdr,
    "",
    dadosCliente,
    obs,
    "\n*Pedido*",
    linhasItens,
    rodape,
    "",
    "Pode confirmar o prazo?",
  ].join("\n");
}

export function buildWhatsappUrl(phoneE164: string, message: string) {
  // phoneE164 ex.: "5533999999999"
  const base = `https://wa.me/${phoneE164}?text=`;
  return `${base}${encodeURIComponent(message)}`;
}
