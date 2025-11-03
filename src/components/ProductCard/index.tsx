"use client";

import React from "react";
import { ShoppingCart, Star } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  badge?: string;
  description?: string;
  category?: string;
};

type Props = {
  product: Product;
  onAddToCart?: (p: Product) => void;

  /** Favoritos */
  canFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, next: boolean) => void;
};

const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  canFavorite = false,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const handleAdd = () => onAddToCart?.(product);

  const handleToggleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canFavorite) return;
    onToggleFavorite?.(product.id, !isFavorite);
  };

  return (
    <article
      className="group relative rounded-2xl border border-[rgb(248,113,113)]/20 bg-white overflow-hidden
                 shadow-[0_6px_14px_rgba(2,6,23,0.04)] hover:shadow-[0_12px_28px_rgba(2,6,23,0.08)]
                 transition-shadow"
    >
      {/* imagem / placeholder */}
      <div className="relative">
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-[rgb(248,113,113)]/15 via-white to-[rgb(248,113,113)]/25" />

        {/* badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-[rgb(248,113,113)] text-white px-2.5 py-1 text-[11px] font-semibold shadow-sm">
            {product.badge}
          </span>
        )}

        {/* FAVORITO (única animação + cursor “mãozinha”) */}
        {canFavorite && (
          <button
            type="button"
            onClick={handleToggleFav}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="absolute right-3 top-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full border
                       backdrop-blur bg-white/80 border-[rgb(248,113,113)]/20 shadow-sm
                       hover:shadow-md transition-transform duration-200 hover:scale-110
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(248,113,113)]/40
                       cursor-pointer"
          >
            <Star
              className={`h-4 w-4 transition-all duration-200 ${
                isFavorite
                  ? "fill-[rgb(248,113,113)] text-[rgb(248,113,113)] scale-110 animate-pulse"
                  : "text-[rgb(248,113,113)]"
              }`}
            />
          </button>
        )}

        {/* preço flutuante */}
        <div className="absolute right-3 bottom-3">
          <div className="rounded-xl bg-white/90 backdrop-blur px-2.5 py-1.5 border border-[rgb(248,113,113)]/20 text-[rgb(15,23,42)] text-sm font-semibold shadow-sm">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </div>
        </div>
      </div>

      {/* conteúdo */}
      <div className="p-3 md:p-4">
        <h3 className="text-[15px] md:text-base font-semibold text-[rgb(15,23,42)] line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 text-xs md:text-sm text-[rgb(100,116,139)] line-clamp-2">
            {product.description}
          </p>
        )}

        {/* ações */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(248,113,113)] text-white px-3.5 py-2 text-xs md:text-sm font-medium
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(248,113,113)]/40"
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>

          <span className="text-xs text-[rgb(148,163,184)]">
            {product.category ? `#${product.category}` : ""}
          </span>
        </div>
      </div>

      {/* efeito hover sutil na borda (sem scale no card) */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[rgb(248,113,113)]/25 transition" />
    </article>
  );
};

export default ProductCard;
