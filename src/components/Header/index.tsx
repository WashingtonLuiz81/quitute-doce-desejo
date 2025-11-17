"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User as UserIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Promoções", href: "/promocoes" },
  { label: "Contato", href: "/contato" },
];

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  user?: {
    name?: string;
    email?: string;
    image?: string | null;
  } | null;
}

const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  onCartClick,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop
  const [userMenuMobileOpen, setUserMenuMobileOpen] = useState(false); // mobile
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const isLoggedIn = Boolean(user);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-[rgb(243,244,246)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* ESQUERDA: LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full bg-[rgb(248,113,113)]/90 flex items-center justify-center text-white font-semibold tracking-tight group-hover:scale-105 transition">
            QD
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[rgb(15,23,42)]">
              Quitute Doce
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[rgb(148,163,184)] -mt-0.5">
              desejo
            </p>
          </div>
        </Link>

        {/* DIREITA: MENU + AÇÕES */}
        <div className="flex items-center gap-8">
          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition relative pb-1 ${
                  isActive(item.href)
                    ? "text-[rgb(248,113,113)]"
                    : "text-[rgb(15,23,42)]/70 hover:text-[rgb(15,23,42)]"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute left-0 -bottom-2 h-[3px] w-6 rounded-full bg-[rgb(248,113,113)] transition-all"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* AÇÕES (DESKTOP) */}
          <div className="hidden md:flex items-center gap-3 relative">
            {/* Carrinho */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-full bg-white border border-[rgb(248,113,113)]/30 px-2.5 py-2 shadow-sm hover:shadow-md transition"
              aria-label="Abrir carrinho"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5 text-[rgb(248,113,113)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-[rgb(248,113,113)] text-white text-[10px] font-semibold flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* USER BADGE DESKTOP */}
            <div className="relative">
              {/* <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-white border border-slate-100 px-2.5 py-1.5 hover:shadow-sm transition"
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                  {isLoggedIn && user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? "Usuário"}
                      className="h-full w-full object-cover"
                    />
                  ) : isLoggedIn && !user?.image ? (
                    <span className="text-xs font-semibold text-slate-700">
                      {getInitials(user?.name)}
                    </span>
                  ) : (
                    <UserIcon className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                {isLoggedIn && (
                  <span className="text-sm font-medium text-slate-700">
                    {user?.name?.split(" ")[0] ?? "Usuário"}
                  </span>
                )}
              </button> */}

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-100 bg-white shadow-lg py-1 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/minha-conta"
                        className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Minha conta
                      </Link>
                      <button
                        type="button"
                        className="block w-full text-left px-3 py-2 text-sm cursor-pointer text-slate-700 hover:bg-slate-50 last:rounded-b-lg transition-colors focus-visible:ring-0"
                        onClick={() => {
                          console.log("logout");
                          setUserMenuOpen(false);
                        }}
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/login?mode=register"
                        className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 last:rounded-b-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Criar conta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AÇÕES (MOBILE) */}
          <div className="flex items-center gap-2 md:hidden relative">
            {/* USER BADGE MOBILE */}
            <div className="relative">
              {/* <button
                type="button"
                onClick={() => setUserMenuMobileOpen((prev) => !prev)}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-white border border-slate-100 hover:shadow transition"
              >
                {isLoggedIn ? (
                  user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? "Usuário"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-700">
                      {getInitials(user?.name)}
                    </span>
                  )
                ) : (
                  <UserIcon className="h-4 w-4 text-slate-500" />
                )}
              </button> */}

              {userMenuMobileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-100 bg-white shadow-lg py-1 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/minha-conta"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuMobileOpen(false)}
                      >
                        Minha conta
                      </Link>
                      <button
                        type="button"
                        className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                          console.log("logout");
                          setUserMenuMobileOpen(false);
                        }}
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuMobileOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/login?mode=register"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuMobileOpen(false)}
                      >
                        Criar conta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Carrinho */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-full bg-white border border-[rgb(248,113,113)]/30 w-10 h-10 shadow-sm hover:shadow-md transition"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5 text-[rgb(248,113,113)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-[rgb(248,113,113)] text-white text-[9px] font-semibold flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Botão hamburguer */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[rgb(15,23,42)] hover:bg-[rgb(248,113,113)]/10 transition"
              onClick={() => {
                setOpen((prev) => !prev);
                setUserMenuMobileOpen(false);
              }}
              aria-label="Abrir menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER MOBILE (menu de navegação) */}
      {open && (
        <div className="md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1 px-4 pb-4 pt-2 bg-white/80 backdrop-blur-sm border-t border-[rgb(243,244,246)] shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-[rgb(248,113,113)]/10 text-[rgb(248,113,113)]"
                    : "text-[rgb(15,23,42)]/80 hover:bg-[rgb(248,113,113)]/5"
                }`}
              >
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <span className="h-2 w-2 rounded-full bg-[rgb(248,113,113)]" />
                )}
              </Link>
            ))}

            {/* se não estiver logado, mostra opções aqui também */}
            {!isLoggedIn && (
              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-[rgb(15,23,42)] text-center text-sm font-medium text-white py-2 hover:bg-[rgb(15,23,42)]/90"
                >
                  Entrar
                </Link>
                <Link
                  href="/login?mode=register"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-slate-100 text-center text-sm font-medium text-slate-700 py-2 hover:bg-slate-200"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
