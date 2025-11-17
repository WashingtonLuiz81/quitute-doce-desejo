"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Candy,
  CakeSlice,
  IceCream,
  Cookie,
  Gift,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { listProducts, listBundles } from "@/lib/products";
import { useCartStore } from "@/store/useCartStore";
import { useConfigStore } from "@/store/useConfigStore";

const ProductCardAny = ProductCard as unknown as React.FC<any>;

const BASE_CATEGORIES = [
  { key: "todas", label: "Todas", icon: Sparkles },
  { key: "bolos", label: "Bolos", icon: CakeSlice },
  { key: "doces", label: "Doces", icon: Candy },
  { key: "cookies", label: "Cookies", icon: Cookie },
  { key: "gelados", label: "Gelados", icon: IceCream },
  { key: "tortas", label: "Tortas", icon: CakeSlice },
] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("todas");

  // Simula usuário logado -> favoritos
  const isLoggedIn = true;

  // Favoritos
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Carrinho
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  // WhatsApp via config
  const { config } = useConfigStore();
  const whatsappHref = useMemo(() => {
    const onlyDigits = (config.whatsapp ?? "").replace(/\D/g, "");
    return onlyDigits ? `https://wa.me/${onlyDigits}` : "#";
  }, [config.whatsapp]);

  // “Adicionado” (2s)
  const [justAdded, setJustAdded] = useState<Record<string, boolean>>({});

  // Loading + favoritos
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("qd:favorites")
          : null;
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setFavoriteIds(new Set(arr));
      }
    } catch {}
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      const arr = Array.from(favoriteIds);
      localStorage.setItem("qd:favorites", JSON.stringify(arr));
    } catch {}
  }, [favoriteIds]);

  // Dados
  const allProducts = useMemo(() => listProducts(), []);
  const bundles = useMemo(() => listBundles(), []);

  // Categorias dinâmicas (Combos se existir)
  const categories = useMemo(() => {
    const hasCombos = bundles.length > 0;
    return hasCombos
      ? [...BASE_CATEGORIES, { key: "combos", label: "Combos", icon: Gift }]
      : BASE_CATEGORIES;
  }, [bundles]);

  // Normaliza combos como Product
  const combinedProducts: Product[] = useMemo((): Product[] => {
    return [
      ...allProducts,
      ...bundles.map((b): Product => ({
        id: b.id,
        name: b.name,
        price: b.price,
        unit: "combo",
        category: "combos",
        imageUrl: b.image,
        description: b.items
          .map((it) => `${it.qty}x ${it.productId.replace(/-/g, " ")}`)
          .join(", "),
        badge: "Combo",
      })),
    ];
  }, [allProducts, bundles]);

  // Filtro por categoria
  const products = useMemo(() => {
    if (activeCategory === "todas") return combinedProducts;
    return combinedProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory, combinedProducts]);

  // Favoritar
  const toggleFavorite = (id: string | number, next: boolean) => {
    const key = String(id);
    setFavoriteIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(key);
      else copy.delete(key);
      return copy;
    });
  };

  // Está no carrinho?
  const isInCart = (productId: string) =>
    (items ?? []).some(
      (it: any) => String(it.id ?? it.sellableId) === String(productId)
    );

  // Adicionar ao carrinho
  const handleAddToCart = (prod: Product) => {
    addItem({ id: prod.id, name: prod.name, price: prod.price }, 1);
    setJustAdded((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setJustAdded((prev) => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  const favCount = favoriteIds.size;

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(248,113,113)]/10 text-[rgb(248,113,113)] px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Artesanal de verdade
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[rgb(15,23,42)]">
                Sabor que abraça, <br className="hidden md:block" />
                <span className="text-[rgb(248,113,113)]">carinho</span> em cada pedaço.
              </h1>
              <p className="mt-3 md:mt-4 text-[rgb(100,116,139)] md:text-lg">
                Bolos, doces e tortas feitos com ingredientes selecionados.
                Peça pelo WhatsApp e receba rapidinho.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/produtos"
                  className="inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
                >
                  Ver produtos
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[rgb(248,113,113)]/30 text-[rgb(15,23,42)] px-5 py-2.5 text-sm font-medium hover:shadow-sm transition"
                >
                  Pedir no WhatsApp
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-tr from-[rgb(248,113,113)]/20 via-white to-[rgb(248,113,113)]/30 border border-[rgb(248,113,113)]/20 shadow-[0_10px_30px_rgba(248,113,113,0.15)] overflow-hidden">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="size-40 md:size-56 rounded-full bg-white shadow-xl grid place-items-center border border-[rgb(248,113,113)]/20">
                    <CakeSlice className="h-12 w-12 md:h-16 md:w-16 text-[rgb(248,113,113)]" />
                  </div>
                </div>
                <div className="absolute -left-8 -bottom-8 size-28 rounded-full bg-[rgb(248,113,113)]/10" />
                <div className="absolute -right-10 -top-10 size-36 rounded-full bg-[rgb(15,23,42)]/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHIPS */}
      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2">
          {categories.map(({ key, label, icon: Icon }) => {
            const active = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={[
                  "inline-flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-sm transition border",
                  active
                    ? "bg-[rgb(248,113,113)] text-white border-[rgb(248,113,113)]"
                    : "bg-white text-[rgb(15,23,42)] border-[rgb(248,113,113)]/30 hover:bg-[rgb(248,113,113)]/10",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID (altura uniforme em todas as larguras) */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-end justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[rgb(15,23,42)]">
              {activeCategory === "todas"
                ? "Destaques da semana"
                : `Categoria: ${
                    categories.find((c) => c.key === activeCategory)?.label
                  }`}
            </h2>
            <p className="text-sm text-[rgb(100,116,139)]">
              Produtos artesanais feitos sob encomenda.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/produtos"
              className="text-sm font-medium text-[rgb(248,113,113)] hover:underline"
            >
              Ver todos →
            </Link>

            {isLoggedIn && (
              <Link
                href="/favoritos"
                className="inline-flex items-center gap-2 rounded-full border border-[rgb(248,113,113)]/30 px-3 py-1.5 text-sm text-[rgb(15,23,42)] hover:shadow-sm transition"
              >
                Favoritos ({favCount})
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 items-stretch justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full min-h-[360px] md:min-h-[420px] rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 items-stretch justify-items-center">
            {products.map((p) => {
              const inCart = isInCart(p.id);
              // “Adicionado” (2s) > “No carrinho” > badge original
              const dynamicBadge =
                justAdded[p.id] ? "Adicionado" : inCart ? "No carrinho" : p.badge;

              const uiProduct: Product = { ...p, badge: dynamicBadge };

              return (
                <div
                  key={p.id}
                  className="
                    w-full
                    min-h-[360px] md:min-h-[420px]
                    [&>*]:h-full
                  "
                >
                  <ProductCardAny
                    product={uiProduct}
                    onAddToCart={() => addItem({ id: p.id, name: p.name, price: p.price }, 1)}
                    canFavorite={isLoggedIn}
                    isFavorite={favoriteIds.has(String(p.id))}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAIXA WHATS (usa config.whatsapp) */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 pb-12 md:pb-16">
        <div className="rounded-2xl border border-[rgb(248,113,113)]/20 bg-[rgb(248,113,113)]/10 p-5 md:py-7 md:px-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-[rgb(15,23,42)] font-semibold text-lg">
              Tem dúvida ou quer personalizar o pedido?
            </h3>
            <p className="text-sm text-[rgb(100,116,139)]">
              Fale com a gente pelo WhatsApp e a gente te ajuda rapidinho.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
