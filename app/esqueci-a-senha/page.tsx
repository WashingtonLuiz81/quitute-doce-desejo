// src/app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { useConfigStore } from "@/store/useConfigStore";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

type ForgotValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { config } = useConfigStore();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotValues) => {
    // aqui você chama sua API: POST /auth/forgot-password
    console.log("Esqueci minha senha:", data);
    await new Promise((res) => setTimeout(res, 800));
    setSent(true);
  };

  // Texto padrão para abrir o WhatsApp a partir do config
  const supportText =
    // se você tiver uma mensagem específica no config, usa ela
    (config as any)?.messages?.support ??
    config.messages?.greeting ??
    "Olá! Preciso de ajuda para recuperar meu acesso.";

  const whatsappHref = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
    supportText
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="h-12 w-12 rounded-full bg-[rgb(248,113,113)]/90 flex items-center justify-center text-white font-semibold tracking-tight">
            QD
          </div>
          <div className="leading-tight text-center">
            <p className="text-sm font-semibold text-[rgb(15,23,42)]">
              Quitute Doce Desejo
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[rgb(148,163,184)] -mt-0.5">
              recuperar acesso
            </p>
          </div>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6">
            <h1 className="text/base font-semibold text-[rgb(15,23,42)] mb-1">
              Esqueci minha senha
            </h1>
            <p className="text-sm text-slate-500 mb-5">
              Informe o e-mail cadastrado que vamos te enviar um link para criar
              uma nova senha.
            </p>

            {sent ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-3">
                <p className="text-sm font-medium text-emerald-700">
                  E-mail enviado!
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Se esse e-mail estiver cadastrado, você receberá as instruções
                  em alguns instantes.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        errors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="seuemail@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </button>
              </form>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link
                href="/login"
                className="text-xs text-[rgb(248,113,113)] hover:underline"
              >
                ← Voltar para o login
              </Link>
              {!sent && (
                <Link
                  href="/login?mode=register"
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Criar conta
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Precisa de ajuda?{" "}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="text-[rgb(248,113,113)] hover:underline"
          >
            Fale no WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
