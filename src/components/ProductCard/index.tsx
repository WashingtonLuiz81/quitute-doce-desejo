"use client";

import React from "react";
import { ShoppingCart, Star } from "lucide-react";

type Product = {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  badge?: string;
  category?: string;   // usado para #hashtag
  unit?: string;
};

type Props = {
  product: Product;
  onAddToCart?: () => void;
  canFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string | number, next: boolean) => void;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  canFavorite,
  isFavorite,
  onToggleFavorite,
}) => {
  const { id, name, price, description, imageUrl, badge, category } = product;

  return (
    <div
      className="
        relative rounded-2xl border border-slate-200 bg-white
        shadow-sm hover:shadow-md transition
        flex h-full flex-col
        overflow-hidden
      "
    >
      {/* Badge topo-esquerda */}
      {badge && (
        <span className="absolute left-3 top-3 z-[1] rounded-full bg-[rgb(248,113,113)] text-white text-xs font-semibold px-2 py-1 shadow-sm">
          {badge}
        </span>
      )}

      {/* Favorito topo-direita */}
      {canFavorite && (
        <button
          onClick={() => onToggleFavorite?.(id, !isFavorite)}
          className="absolute right-3 top-3 z-[1] grid place-items-center size-8 rounded-full bg-white/90 border border-slate-200 backdrop-blur"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star
            className={`h-4 w-4 ${isFavorite ? "fill-[rgb(248,113,113)] text-[rgb(248,113,113)]" : "text-slate-500"}`}
          />
        </button>
      )}

      {/* Topo: imagem + preço */}
      <div className="p-4 pb-0">
        <div className="relative h-36 w-full rounded-xl bg-gradient-to-br from-[rgb(248,113,113)]/10 to-white border border-[rgb(248,113,113)]/20 overflow-hidden">
          {/* imagem mock / bg */}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {/* Preço em “pill” */}
          <div className="absolute right-3 bottom-3 rounded-full bg-white text-[rgb(15,23,42)] text-sm font-semibold px-3 py-1 shadow-sm border border-slate-100">
            {formatBRL(price)}
          </div>
        </div>
      </div>

      {/* Conteúdo (nome/descrição) */}
      <div className="px-4 pt-4">
        <h3 className="text-[rgb(15,23,42)] font-semibold">{name}</h3>
        {description && (
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{description}</p>
        )}
      </div>

      {/* Rodapé fixo: botão + hashtag */}
      <div className="mt-auto px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onAddToCart}
            className="
              inline-flex items-center gap-2 rounded-full
              bg-[rgb(248,113,113)] text-white
              px-4 py-2 text-sm font-medium
              hover:bg-[rgb(248,113,113)]/90 transition
              shadow-sm
            "
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>

          {category && (
            <span className="text-xs text-slate-500">#{category}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
