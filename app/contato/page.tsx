"use client";

import React, { useState, useMemo } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useConfigStore } from "@/store/useConfigStore";

type ContactPayload = {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  source?: string;
};

/** Helper local: monta a URL do WhatsApp para contato (sem depender de "@/lib/whatsapp") */
function buildContactWhatsAppUrl(
  rawWhatsApp: string,
  lojaNome: string,
  data: ContactPayload
) {
  // Garante só dígitos no número
  const phoneDigits = (rawWhatsApp || "").replace(/\D/g, "");
  // Mensagem formatada
  const lines = [
    `Olá, *${lojaNome}*!`,
    `Meu nome é *${data.name}*.`,
    data.subject ? `Assunto: ${data.subject}` : undefined,
    data.phone ? `Telefone: ${data.phone}` : undefined,
    data.email ? `E-mail: ${data.email}` : undefined,
    data.source ? `Origem: ${data.source}` : undefined,
    "",
    data.message,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return phoneDigits ? `https://wa.me/${phoneDigits}?text=${text}` : "#";
}

export default function ContatoPage() {
  const { config } = useConfigStore();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  // 🔹 limite de caracteres
  const MESSAGE_LIMIT = 1000;

  // Link rápido do topo (usa greeting do config se existir)
  const quickWhatsHref = useMemo(() => {
    const digits = (config.whatsapp ?? "").replace(/\D/g, "");
    const greeting = config?.messages?.greeting ?? "Olá! Gostaria de falar com a loja 🙂";
    return digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`
      : "#";
  }, [config.whatsapp, config?.messages?.greeting]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "message" && value.length > MESSAGE_LIMIT) return;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      alert("Preencha pelo menos Nome e Mensagem 😊");
      return;
    }
    try {
      setLoading(true);
      const url = buildContactWhatsAppUrl(config.whatsapp, config.name, {
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
        source: "Página de Contato",
      });
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 py-10 md:py-14">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-[rgb(15,23,42)]">
          Fale com a gente
        </h1>
        <p className="mt-2 text-[rgb(100,116,139)]">
          Preencha o formulário ou, se preferir, chame direto no WhatsApp.
        </p>
      </header>

      {/* Ação rápida WhatsApp */}
      <div className="mb-6">
        <a
          href={quickWhatsHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[rgb(248,113,113)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition"
        >
          <MessageCircle className="h-4 w-4" />
          Abrir WhatsApp
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[rgb(248,113,113)]/20 bg-white p-5 md:p-7 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome*</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Telefone (WhatsApp)
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              placeholder="(31) 9 9999-9999"
              inputMode="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Assunto</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
              placeholder="Ex.: Encomenda, orçamento, dúvidas…"
            />
          </div>
        </div>

        <div className="mt-4 relative">
          <label className="block text-sm font-medium text-slate-700">Mensagem*</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={6}
            className="mt-1 w-full rounded-xl border border-[rgb(248,113,113)]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(248,113,113)]/40"
            placeholder="Conte pra gente como podemos ajudar :)"
          />
          <span
            className={`absolute bottom-2 right-3 text-xs ${
              form.message.length >= MESSAGE_LIMIT * 0.9
                ? "text-[rgb(248,113,113)]"
                : "text-slate-400"
            }`}
          >
            {form.message.length}/{MESSAGE_LIMIT}
          </span>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(248,113,113)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(248,113,113)]/90 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {loading ? "Abrindo WhatsApp..." : "Enviar pelo WhatsApp"}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Máximo de {MESSAGE_LIMIT} caracteres. Ao enviar, você autoriza o contato via
          WhatsApp. Seus dados não serão compartilhados com terceiros.
        </p>
      </form>
    </main>
  );
}
