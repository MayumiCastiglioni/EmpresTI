"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type ConnectionState = "loading" | "up" | "error";

export default function DiagnosticPage() {
  const [state, setState] = useState<ConnectionState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    async function check() {
      try {
        const response = await fetch("/health", { cache: "no-store", signal: controller.signal });
        const result: unknown = await response.json();
        const connected = response.status === 200 && typeof result === "object" && result !== null &&
          "status" in result && result.status === "ok" && "database" in result && result.database === "up";
        if (active) setState(connected ? "up" : "error");
      } catch {
        if (active) setState("error");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void check();
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="diagnostic-title">
        <span className={styles.eyebrow}>EmpresTI</span>
        <h1 id="diagnostic-title">Diagnóstico da conexão</h1>
        <p className={styles.description}>Verifique se a aplicação consegue se conectar ao banco de dados.</p>
        <div className={styles.result} aria-busy={state === "loading"}>
          <span className={styles.label}>Conexão com o banco</span>
          <p role={state === "error" ? "alert" : "status"} className={state === "up" ? styles.success : state === "error" ? styles.error : styles.description}>
            {state === "loading" ? "Verificando conexão…" : state === "up" ? "Conexão disponível." : "Não foi possível confirmar a conexão. Tente novamente."}
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" disabled={state === "loading"} onClick={() => {
            setState("loading");
            setAttempt((current) => current + 1);
          }}>Verificar novamente</button>
          <Link href="/login">Voltar ao login</Link>
        </div>
      </section>
    </main>
  );
}
