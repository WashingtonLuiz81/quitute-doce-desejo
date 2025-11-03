"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";

// ====== schemas ======
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  // começa na aba de login
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👇 isso aqui substitui o useSearchParams
  // e NÃO roda no build, só no browser
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "register") {
      setActiveTab("register");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitLogin = async (data: LoginValues) => {
    setIsSubmitting(true);
    console.log("Login:", data);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  };

  const onSubmitRegister = async (data: RegisterValues) => {
    setIsSubmitting(true);
    console.log("Register:", data);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  };

  const passwordValue = watch("password");

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
              acesso
            </p>
          </div>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* tabs */}
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === "login"
                  ? "bg-white text-[rgb(15,23,42)]"
                  : "bg-slate-50 text-slate-400 hover:text-slate-600"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === "register"
                  ? "bg-white text-[rgb(15,23,42)]"
                  : "bg-slate-50 text-slate-400 hover:text-slate-600"
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* content */}
          <div className="p-6">
            {activeTab === "login" ? (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmitLogin)}>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      {...register("password")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[rgb(248,113,113)] focus:ring-0"
                    />
                    Lembrar-me
                  </label>
                  <Link
                    href="/esqueci-a-senha"
                    className="text-xs text-[rgb(248,113,113)] hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[rgb(248,113,113)] text-white py-2.5 text-sm font-medium hover:bg-[rgb(248,113,113)]/90 transition disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">
                      ou continue com
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full border border-slate-200 rounded-full py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Entrar com Google
                </button>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={handleRegisterSubmit(onSubmitRegister)}
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nome completo
                  </label>
                  <div className="relative">
                    <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...registerRegister("name")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        registerErrors.name
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="Seu nome"
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...registerRegister("email")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        registerErrors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="seuemail@gmail.com"
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...registerRegister("password")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        registerErrors.password
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.password.message}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${
                        passwordValue && passwordValue.length >= 6
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      6+ caracteres
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-400">
                      letra e número (opcional)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...registerRegister("confirmPassword")}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        registerErrors.confirmPassword
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-[rgb(248,113,113)]"
                      } outline-none text-sm transition bg-white`}
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.confirmPassword.message}
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
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* link voltar */}
        <p className="text-center text-xs text-slate-400 mt-4">
          <Link
            href="/"
            className="text-[rgb(248,113,113)] hover:underline"
          >
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
