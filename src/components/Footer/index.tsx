"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[rgb(15,23,42)] text-[rgb(148,163,184)] mt-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* bloco 1 - brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-full bg-[rgb(248,113,113)]/90 flex items-center justify-center text-white font-semibold tracking-tight">
                QD
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">
                  Quitute Doce
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[rgb(148,163,184)] -mt-0.5">
                  desejo
                </p>
              </div>
            </div>
            <p className="text-sm max-w-md">
              Doces, bolos e quitutes feitos com carinho para entregar o melhor
              da confeitaria artesanal. Peça pelo WhatsApp e receba rapidinho.
            </p>

            <div className="flex gap-3 mt-5">
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[rgb(248,113,113)]/90 hover:text-white transition"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[rgb(248,113,113)]/90 hover:text-white transition"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[rgb(248,113,113)]/90 hover:text-white transition"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* bloco 2 - links */}
          <div>
            <p className="text-sm font-semibold text-white mb-3">
              Navegação
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-[rgb(248,113,113)] transition"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos"
                  className="hover:text-[rgb(248,113,113)] transition"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/promocoes"
                  className="hover:text-[rgb(248,113,113)] transition"
                >
                  Promoções
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-[rgb(248,113,113)] transition"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* bloco 3 - contato */}
          <div>
            <p className="text-sm font-semibold text-white mb-3">
              Contato
            </p>
            <p className="text-sm">Atendimento via WhatsApp:</p>
            <p className="text-sm text-white font-semibold">
              (11) 99999-9999
            </p>
            <p className="text-sm mt-3">
              E-mail:{" "}
              <a
                href="mailto:contato@quitutedocedesejo.com.br"
                className="hover:text-[rgb(248,113,113)] transition"
              >
                contato@quitutedocedesejo.com.br
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* barra inferior */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
          <p className="text-xs text-[rgb(148,163,184)]">
            © {new Date().getFullYear()} Quitute Doce Desejo. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-[rgb(148,163,184)]">
            Feito com 🍰 e Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
