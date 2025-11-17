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
  Search,
  ArrowUpDown,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { listProducts, listBundles } from "@/lib/products";
import { useCartStore } from "@/store/useCartStore";

/** categorias base (sem combos; combos entram dinamicamente se existirem) */
const BASE_CATEGORIES = [
  { key: "todas", label: "Todas", icon: Sparkles },
  { key: "bolos", label: "Bolos", icon: CakeSlice },
  { key: "doces", label: "Doces", icon: Candy },
  { key: "cookies", label: "Cookies", icon: Cookie },
  { key: "gelados", label: "Gelados", icon: IceCream },
  { key: "tortas", label: "Tortas", icon: CakeSlice },
] as const;

type SortKey = "relevancia" | "nome-asc" | "nome-desc" | "preco-asc" | "preco-desc";

export default function ProductsPage() {
  // UI state
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("relevancia");

  // favoritos
  const isLoggedIn = true;
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // carrinho
  const addItem = useCartStore((s) => s.addItem);

  // skeleton + carregar favoritos
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("qd:favorites") : null;
      if (raw) setFavoriteIds(new Set(JSON.parse(raw)));
    } catch {}
    return () => clearTimeout(t);
  }, []);

  // persist favorites
  useEffect(() => {
    try {
      localStorage.setItem("qd:favorites", JSON.stringify(Array.from(favoriteIds)));
    } catch {}
  }, [favoriteIds]);

  // dados
  const productsOnly = useMemo(() => listProducts(), []);
  const bundles = useMemo(() => listBundles(), []);

  // categorias dinâmicas (adiciona Combos quando houver)
  const categories = useMemo(() => {
    return bundles.length
      ? [...BASE_CATEGORIES, { key: "combos", label: "Combos", icon: Gift }]
      : BASE_CATEGORIES;
  }, [bundles]);

  // normaliza combos como Product
  const combinedProducts: Product[] = useMemo(() => {
    return [
      ...productsOnly,
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
  }, [productsOnly, bundles]);

  // busca + categoria
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list =
      activeCategory === "todas"
        ? combinedProducts
        : combinedProducts.filter((p) => p.category === activeCategory);

    if (term) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description ?? "").toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }
    return list;
  }, [combinedProducts, activeCategory, q]);

  // ordenação
  const products = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "nome-asc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nome-desc":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "preco-asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "preco-desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "relevancia":
      default:
        // mantém ordem natural (vinda do JSON), útil pra curadoria manual
        break;
    }
    return arr;
  }, [filtered, sort]);

  // favoritos
  const toggleFavorite = (id: string | number, next: boolean) => {
    const key = String(id);
    setFavoriteIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(key);
      else copy.delete(key);
      return copy;
    });
  };

  return (
    <main>
      {/* HERO compacto */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(248,113,113)]/10 text-[rgb(248,113,113)] px-3 py-1 text-xs font-semibold w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Nosso cardápio
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight text-[rgb(15,23,42)]">
              Produtos & Combos
            </h1>
            <p className="text-sm md:text-base text-[rgb(100,116,139)]">
              Feitos sob encomenda, com carinho e ingredientes selecionados.
            </p>
          </div>
        </div>
      </section>

      {/* CONTROLES: chips + busca + sort */}
      <section className="mx-auto max-w-6xl px-4 md:px-6">
        {/* chips */}
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

        {/* busca + sort */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, descrição, categoria..."
              className="w-full rounded-full border border-[rgb(248,113,113)]/30 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/30"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-[rgb(248,113,113)]/30 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/30"
            >
              <option value="relevancia">Ordenar: Relevância</option>
              <option value="nome-asc">Nome (A-Z)</option>
              <option value="nome-desc">Nome (Z-A)</option>
              <option value="preco-asc">Preço (menor → maior)</option>
              <option value="preco-desc">Preço (maior → menor)</option>
            </select>
          </div>
        </div>
      </section>

      {/* LISTAGEM */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
        {/* header resultado */}
        <div className="mb-4 md:mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[rgb(15,23,42)]">
              {activeCategory === "todas"
                ? "Todos os itens"
                : `Categoria: ${categories.find((c) => c.key === activeCategory)?.label}`}
            </h2>
            <p className="text-sm text-[rgb(100,116,139)]">
              {products.length} {products.length === 1 ? "resultado" : "resultados"}
              {q ? ` para “${q}”` : ""}
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              href="/"
              className="text-sm font-medium text-[rgb(248,113,113)] hover:underline"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* skeleton ou grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[260px] rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() =>
                  addItem({ id: p.id, name: p.name, price: p.price }, 1)
                } // ✅ sem parâmetro (compatível com Props)
                canFavorite={isLoggedIn}
                isFavorite={favoriteIds.has(String(p.id))}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[rgb(248,113,113)]/30 p-8 text-center">
            <p className="text-[rgb(15,23,42)] font-medium">
              Nenhum item encontrado.
            </p>
            <p className="text-sm text-[rgb(100,116,139)] mt-1">
              Tente limpar a busca ou escolher outra categoria.
            </p>
            <button
              onClick={() => {
                setQ("");
                setActiveCategory("todas");
                setSort("relevancia");
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
