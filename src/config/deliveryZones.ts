// Config das zonas/bairros de entrega e suas taxas (em BRL)
export type DeliveryZone = {
  id: string;
  name: string;
  fee: number; // em reais
};

export const DELIVERY_ZONES: DeliveryZone[] = [
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
  { id: "dario-grossi", name: "Dário Grossi (até o posto do irmão)", fee: 8 },
  { id: "esplanada", name: "Esplanada", fee: 8 },
  { id: "santa-zita", name: "Santa Zita", fee: 8 },
  { id: "zacarias", name: "Zacarias", fee: 10 },
  { id: "seminario", name: "Seminário", fee: 12 },
  { id: "morada-lago", name: "Morada Lago", fee: 12 },
  { id: "bairro-das-gracas", name: "Bairro das Graças", fee: 15 },
];

// Helper para achar por id
export function getZoneById(id?: string | null) {
  if (!id) return undefined;
  return DELIVERY_ZONES.find((z) => z.id === id);
}
