// src/lib/whatsapp.ts
export type SimpleCartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
};

type Fulfillment = "entrega" | "retirada";
type Payment = "pix" | "credito" | "debito" | "dinheiro" | string;

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type BuildOptions = {
  lojaNome: string;
  customerName: string;
  fulfillment: Fulfillment;

  // endereço do cliente (usado quando for entrega)
  address?: {
    street: string;
    number?: string;
    complement?: string;
    district?: string;
    city: string;
    state: string;
  };

  // endereço da loja (usado quando for retirada)
  pickup?: {
    street: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    reference?: string; // <<-- novo
    mapUrl?: string;
  };

  // pagamento
  payment: {
    method: Payment;
    changeFor?: number;
  };

  // taxa de entrega calculada no front
  deliveryFee?: number;

  // observações livres
  note?: string;
};

export function buildCheckoutWhatsAppUrl(
  phoneE164: string,
  items: SimpleCartItem[],
  opts: BuildOptions
) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const entrega = opts.fulfillment === "entrega" ? Number(opts.deliveryFee ?? 0) : 0;
  const total = subtotal + entrega;

  const header = `*${opts.lojaNome}* — Novo pedido`;

  // bloco de dados do cliente / retirada
  let dados = `*Nome:* ${opts.customerName}\n`;

  if (opts.fulfillment === "entrega" && opts.address) {
    dados += `*Endereço:* ${opts.address.street}${opts.address.number ? `, ${opts.address.number}` : ""}\n`;
    if (opts.address.complement) dados += `*Complemento:* ${opts.address.complement}\n`;
    if (opts.address.district) dados += `*Bairro:* ${opts.address.district}\n`;
    dados += `*Cidade/UF:* ${opts.address.city}/${opts.address.state}\n`;
  } else if (opts.fulfillment === "retirada" && opts.pickup) {
    dados += `*Tipo:* Retirada na loja\n`;
    dados += `*Endereço da Loja:* ${opts.pickup.street}${opts.pickup.district ? ` – ${opts.pickup.district}` : ""}\n`;
    dados += `*Cidade/UF:* ${opts.pickup.city}/${opts.pickup.state}`;
    if (opts.pickup.zip) dados += ` • CEP ${opts.pickup.zip}`;
    dados += `\n`;
    if (opts.pickup.reference) {
      dados += `*Referência:* ${opts.pickup.reference}\n`; // <<-- exibindo a referência
    }
    if (opts.pickup.mapUrl) {
      dados += `*Mapa:* ${opts.pickup.mapUrl}\n`;
    }
  }

  // pagamento
  const methodMap: Record<string, string> = {
    pix: "PIX",
    credito: "Crédito",
    debito: "Débito",
    dinheiro: "Dinheiro",
  };
  const metodo = methodMap[opts.payment.method] ?? String(opts.payment.method).toUpperCase();
  dados += `*Pagamento:* ${metodo}`;
  if (opts.payment.method === "dinheiro" && typeof opts.payment.changeFor === "number") {
    dados += ` (troco para ${formatBRL(opts.payment.changeFor)})`;
  }

  // observações
  const observacoes = opts.note?.trim()
    ? `\n\n*Observações:* ${opts.note.trim()}`
    : "";

  // itens
  const itens = items
    .map((i) => `${i.name} - ${i.qty}x - ${formatBRL(i.price)}`)
    .join("\n");

  // rodapé financeiro
  const financeiro = [
    "-------------------------------",
    `*Subtotal:* ${formatBRL(subtotal)}`,
    `*Entrega:* ${formatBRL(entrega)}`,
    `*Total:* ${formatBRL(total)}`,
  ].join("\n");

  const body = [
    header,
    "",
    dados,
    observacoes,
    "\n*Pedido*",
    itens,
    financeiro,
    "",
    "Pode confirmar o prazo?",
  ].join("\n");

  const base = `https://wa.me/${phoneE164}?text=`;
  return `${base}${encodeURIComponent(body)}`;
}
