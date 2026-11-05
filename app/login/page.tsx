"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";
import { trpc } from "@/src/lib/trpc";

export default function LoginPage() {
  const router = useRouter();
  const registering = usePathname() === "/cadastro";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function enterCatalog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setNotice("");
    try {
      const input = { email: String(form.get("email")), password: String(form.get("password")) };
      if (registering) {
        const result = await trpc.auth.signup.mutate(input);
        if (result.requiresConfirmation) {
          setNotice("Confira seu e-mail para confirmar o cadastro e depois entre com sua senha.");
          return;
        }
      } else {
        await trpc.auth.login.mutate(input);
      }
      router.replace("/catalogo");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error && ["E-mail ou senha inválidos.", "Informe e-mail e senha válidos.", "Não foi possível entrar agora. Tente novamente em instantes.", "Use uma senha com pelo menos 6 caracteres.", "Não foi possível criar a conta. Confira os dados ou tente novamente mais tarde."].includes(cause.message)
        ? cause.message : "Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-screen" data-screen-label="01 Login">
      <section className="login-hero" aria-labelledby="login-hero-title">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">
            <Package size={18} strokeWidth={2.2} />
          </span>
          <span>EmpresTI</span>
        </div>

        <div className="login-hero-content">
          <span className="login-eyebrow">GESTÃO DE EQUIPAMENTOS</span>
          <h1 id="login-hero-title">Tudo que a equipe compartilha, sob controle.</h1>
          <p>Consulte equipamentos, acompanhe empréstimos e organize as devoluções em um só lugar.</p>

          <div className="login-rule" aria-hidden="true" />

          <dl className="login-facts">
            <div>
              <dt>3 itens</dt>
              <dd>por pessoa</dd>
            </div>
            <div>
              <dt>14 dias</dt>
              <dd>de prazo</dd>
            </div>
          </dl>
        </div>

        <p className="login-version">Operações · v1</p>
      </section>

      <section className="login-form-section" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <div className="login-form-heading">
            <span className="login-form-icon" aria-hidden="true">
              <ShieldCheck size={18} strokeWidth={1.8} />
            </span>
            <div>
              <h2 id="login-title">{registering ? "Criar conta" : "Entrar"}</h2>
              <p>{registering ? "Cadastre seu e-mail e uma senha." : "Use seu e-mail e senha para acessar."}</p>
            </div>
          </div>

          <form className="login-form" onSubmit={enterCatalog}>
            <label htmlFor="email">
              E-mail
              <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="nome@empresa.com" />
            </label>
            <label htmlFor="password">
              Senha
              <input id="password" name="password" type="password" required minLength={registering ? 6 : undefined} maxLength={1024} autoComplete={registering ? "new-password" : "current-password"} placeholder="Sua senha" />
            </label>
            {error && <p role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}
            <button className="login-submit" type="submit" disabled={pending} aria-busy={pending} aria-describedby="login-setup-note">
              {pending ? "Aguarde…" : registering ? "Criar conta" : "Entrar"}
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>
          <p><Link href={registering ? "/login" : "/cadastro"}>{registering ? "Já tenho conta. Entrar" : "Não tenho conta. Criar cadastro"}</Link></p>

          <div className="login-rule login-rule-form" aria-hidden="true" />
          <p className="login-setup-note" id="login-setup-note">
            Acesso exclusivo para contas cadastradas.
          </p>
        </div>
      </section>
    </main>
  );
}
