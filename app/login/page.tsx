"use client";

import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function enterCatalog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/catalogo");
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
              <h2 id="login-title">Entrar</h2>
              <p>Use o e-mail institucional para acessar.</p>
            </div>
          </div>

          <form className="login-form" onSubmit={enterCatalog}>
            <label htmlFor="email">
              E-mail
              <input id="email" name="email" type="text" autoComplete="email" placeholder="nome@empresa.com" />
            </label>
            <label htmlFor="password">
              Senha
              <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Sua senha" />
            </label>
            <button className="login-submit" type="submit" aria-describedby="login-setup-note">
              Entrar
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>

          <div className="login-rule login-rule-form" aria-hidden="true" />
          <p className="login-setup-note" id="login-setup-note">
            A autenticação ainda não está finalizada.
          </p>
        </div>
      </section>
    </main>
  );
}
