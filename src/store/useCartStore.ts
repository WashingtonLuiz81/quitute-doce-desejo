import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type DeliveryMode = "ENTREGA" | "RETIRADA";

type Address = {
  nome: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro?: string; // selecionado via combobox
  cidade?: string;
  uf?: string;
};

type Checkout = {
  pagamento: "PIX" | "DINHEIRO" | "CARTAO" | "OUTRO";
  observacoes?: string;
  deliveryMode: DeliveryMode;
  lojaEndereco?: string; // mostrado quando for retirada
};

type State = {
  items: CartItem[];
  deliveryFee: number; // calculado pelo bairro
  address: Address;
  checkout: Checkout;
  clearCartOnSend: boolean;

  // getters
  subtotal: () => number;
  total: () => number;

  // actions
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  setDeliveryFee: (fee: number) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  setAddressField: <K extends keyof Address>(key: K, value: Address[K]) => void;
  setCheckoutField: <K extends keyof Checkout>(key: K, value: Checkout[K]) => void;
  setClearCartOnSend: (v: boolean) => void;
};

export const useCartStore = create<State>((set, get) => ({
  items: [],
  deliveryFee: 0,
  address: {
    nome: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: undefined,
    cidade: "Caratinga",
    uf: "MG",
  },
  checkout: {
    pagamento: "PIX",
    observacoes: "",
    deliveryMode: "ENTREGA",
    lojaEndereco: "Rua Doce Desejo, 1000 - Caratinga/MG",
  },
  clearCartOnSend: true,

  subtotal: () => get().items.reduce((acc, it) => acc + it.price * it.qty, 0),
  total: () => {
    const base = get().subtotal();
    const fee = get().checkout.deliveryMode === "ENTREGA" ? get().deliveryFee : 0;
    return base + fee;
  },

  addItem: (item, qty = 1) =>
    set((s) => {
      const found = s.items.find((i) => i.id === item.id);
      if (found) {
        return {
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return { items: [...s.items, { ...item, qty }] };
    }),

  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  setQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),

  clearCart: () =>
    set(() => ({
      items: [],
      deliveryFee: 0,
      address: {
        nome: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: undefined,
        cidade: "Caratinga",
        uf: "MG",
      },
      checkout: {
        pagamento: "PIX",
        observacoes: "",
        deliveryMode: "ENTREGA",
        lojaEndereco: "Rua Doce Desejo, 1000 - Caratinga/MG",
      },
    })),

  setDeliveryFee: (fee) => set(() => ({ deliveryFee: fee })),
  setDeliveryMode: (mode) =>
    set((s) => ({
      checkout: { ...s.checkout, deliveryMode: mode },
    })),
  setAddressField: (key, value) =>
    set((s) => ({ address: { ...s.address, [key]: value } })),
  setCheckoutField: (key, value) =>
    set((s) => ({ checkout: { ...s.checkout, [key]: value } })),
  setClearCartOnSend: (v) => set(() => ({ clearCartOnSend: v })),
}));
