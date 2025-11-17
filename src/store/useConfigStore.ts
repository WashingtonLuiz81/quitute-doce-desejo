// src/store/useConfigStore.ts
"use client";

import { create } from "zustand";

export type DeliveryZone = {
  id: string | number;
  name: string;
  fee: number; // em BRL
};

export type SiteConfig = {
  name: string;
  slogan: string;
  whatsapp: string; // 55DDDNNNNNNNN sem '+'
  email: string;
  phoneDisplay: string; // formato legível
  instagram: string;
  facebook: string;
  address: {
    street: string;
    district: string;
    city: string;
    state: string;
    zip: string;
    mapUrl: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  messages: {
    greeting: string;
  };
  /** 🔹 Novo: zonas/bairros de entrega com taxa */
  deliveryZones: DeliveryZone[];
};

type ConfigStore = {
  config: SiteConfig;
  setConfig: (partial: Partial<SiteConfig>) => void;
};

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    name: "Quitute Doce Desejo",
    slogan: "Doce emoção em cada receita",
    whatsapp: "553399960552", // ajuste aqui
    email: "contato@quitutedocedesejo.com.br",
    phoneDisplay: "(21) 97017-6922",
    instagram: "https://instagram.com/quitutedocedesejo",
    facebook: "https://facebook.com/quitutedocedesejo",
    address: {
      street: "Rua jornalista Leonel Fontoura, 577 - Fundos",
      reference: "Em frente ao lava jato limoeiro",
      district: "Centro",
      city: "Caratinga",
      state: "MG",
      zip: "35300-120",
      mapUrl: "https://maps.app.goo.gl/7yxJ7dj9MkU7G86v8",
    },
    colors: {
      primary: "rgb(248,113,113)",
      secondary: "rgb(15,23,42)",
    },
    messages: {
      greeting: "Olá! Vim pelo site e gostaria de tirar uma dúvida 😊",
    },
    // 🔹 Zonas de entrega que você me passou
    deliveryZones: [
      { id: "monte-verde", name: "Monte Verde", fee: 10 },
      { id: "floresta", name: "Floresta", fee: 8 },
      { id: "limoeiro", name: "Limoeiro", fee: 8 },
      { id: "polivante", name: "Polivante", fee: 8 },
      { id: "morro-caratinga", name: "Morro Caratinga", fee: 8 },
      { id: "santo-antonio", name: "Santo Antônio", fee: 8 },
      { id: "esperanca", name: "Esperança", fee: 8 },
      { id: "santa-cruz", name: "Santa Cruz", fee: 8 },
      { id: "conjunto-habitacional", name: "Conjunto Habitacional", fee: 8 },
      { id: "taozinho-vilela", name: "Taozinho Vilela", fee: 10 },
      { id: "dr-eduardo", name: "Dr. Eduardo", fee: 8 },
      { id: "anapolis", name: "Anápolis", fee: 8 },
      { id: "salatiel", name: "Salatiel", fee: 8 },
      { id: "dario-grossi", name: "Dário Grossi (até no posto do irmão)", fee: 8 },
      { id: "esplanada", name: "Esplanada", fee: 8 },
      { id: "santa-zita", name: "Santa Zita", fee: 8 },
      { id: "zacarias", name: "Zacarias", fee: 10 },
      { id: "seminario", name: "Seminário", fee: 12 },
      { id: "morada-lago", name: "Morada Lago", fee: 12 },
      { id: "bairro-das-gracas", name: "Bairro das Graças", fee: 15 },
    ],
  },
  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),
}));
