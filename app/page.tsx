"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Candy, CakeSlice, IceCream, Cookie } from "lucide-react";
import ProductCard, { type Product } from "@/components/ProductCard";

const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Bolo Red Velvet", price: 79.9, badge: "Mais pedido", category: "bolos", imageUrl: "", description: "Massa aveludada com cream cheese." },
  { id: "2", name: "Brigadeiro Gourmet", price: 6.5, category: "doces", imageUrl: "", description: "Belga, cremoso e com finalização perfeita." },
  { id: "3", name: "Cookies de Chocolate", price: 8.9, category: "cookies", imageUrl: "", description: "Casquinha crocante e miolo macio." },
  { id: "4", name: "Torta de Limão", price: 59.9, category: "tortas", imageUrl: "", description: "Cítrica, cremosa e equilibrada." },
  { id: "5", name: "Cupcake Baunilha", price: 9.5, category: "doces", imageUrl: "", description: "Cobertura buttercream com confeitos." },
  { id: "6", name: "Bolo de Cenoura", price: 49.9, badge: "Promo", category: "bolos", imageUrl: "", description: "Cobertura generosa de chocolate." },
  { id: "7", name: "Palha Italiana", price: 7.9, category: "doces", imageUrl: "", description: "Doce clássico com toque artesanal." },
  { id: "8", name: "Picolé Artesanal", price: 12.9, category: "gelados", imageUrl: "", description: "Frutas de verdade, sem mistério." },
];

const CATEGORIES = [
  { key: "todas", label: "Todas", icon: Sparkles },
  { key: "bolos", label: "Bolos", icon: CakeSlice },
  { key: "doces", label: "Doces", icon: Candy },
  { key: "cookies", label: "Cookies", icon: Cookie },
  { key: "gelados", label: "Gelados", icon: IceCream },
  { key: "tortas", label: "Tortas", icon: CakeSlice },
] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]["key"]>("todas");

  // Simula usuário logado -> mostra estrela
  const isLoggedIn = true;

  // Favoritos persistidos
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // carregar do localStorage (somente no client)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("qd:favorites") : null;
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setFavoriteIds(new Set(arr));
      }
    } catch {}
    return () => clearTimeout(t);
  }, []);

  // salvar no localStorage quando mudar
  useEffect(() => {
    try {
      const arr = Array.from(favoriteIds);
      localStorage.setItem("qd:favorites", JSON.stringify(arr));
    } catch {}
  }, [favoriteIds]);

  const products = useMemo(() => {
    if (activeCategory === "todas") return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const toggleFavorite = (id: string, next: boolean) => {
    setFavoriteIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  };

  const favCount = favoriteIds.size;

  return (
    <main>
      {/* HERO (igual) */}
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
                  href="https://wa.me/5500000000000"
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
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
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

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-end justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[rgb(15,23,42)]">
              {activeCategory === "todas"
                ? "Destaques da semana"
                : `Categoria: ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
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

            {/* Link de favoritos */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[240px] rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() => console.log("add to cart:", p.id)}
                canFavorite={isLoggedIn}
                isFavorite={favoriteIds.has(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* CTA mobile */}
        <div className="mt-6 md:hidden grid grid-cols-2 gap-2">
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center rounded-full border border-[rgb(248,113,113)]/30 text-[rgb(15,23,42)] px-5 py-2.5 text-sm font-medium hover:shadow-sm transition"
          >
            Ver todos
          </Link>

          {isLoggedIn && (
            <Link
              href="/favoritos"
              className="inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
            >
              Favoritos ({favCount})
            </Link>
          )}
        </div>
      </section>

      {/* FAIXA WHATS (igual) */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 pb-12 md:pb-16">
        <div className="rounded-2xl border border-[rgb(248,113,113)]/20 bg-[rgb(248,113,113)]/10 p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-[rgb(15,23,42)] font-semibold text-lg">
              Tem dúvida ou quer personalizar o pedido?
            </h3>
            <p className="text-sm text-[rgb(100,116,139)]">
              Fale com a gente pelo WhatsApp e a gente te ajuda rapidinho.
            </p>
          </div>
          <a
            href="https://wa.me/5500000000000"
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
