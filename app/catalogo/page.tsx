"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { AlertCircle, CalendarDays, Check, Clock3, Laptop, Package, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/src/components/logout-button";
import { trpc } from "@/src/lib/trpc";
import type { AppRouter } from "@/src/server/api/router";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type CatalogItem = RouterOutputs["inventory"]["catalog"]["list"][number];
type Loan = RouterOutputs["inventory"]["loans"]["mine"][number];

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});
const shortDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

function equipmentStatus(status: CatalogItem["status"]) {
  switch (status) {
    case "DISPONIVEL": return "Disponível";
    case "EMPRESTADO": return "Emprestado";
    case "MANUTENCAO": return "Em manutenção";
    case "RESERVADO": return "Reservado";
    case "FORA_DE_USO": return "Fora de uso";
  }
}

function loanStatus(loan: Loan) {
  if (loan.isOverdue) return "Em atraso";
  switch (loan.status) {
    case "SOLICITADO": return "Solicitado";
    case "RETIRADO": return "Em andamento";
    case "DEVOLVIDO": return "Devolvido";
    case "CANCELADO": return "Cancelado";
  }
}

function imageSourceLabel(sourceUrl: string) {
  try {
    const hostname = new URL(sourceUrl).hostname;
    if (["pixabay.com", "www.pixabay.com"].includes(hostname)) return "Pixabay";
    if (["pexels.com", "www.pexels.com"].includes(hostname)) return "Pexels";
  } catch {
    // The image link is validated in the initial-data pipeline; malformed legacy data gets a neutral label.
  }
  return "Origem";
}

function friendlyError(error: unknown) {
  if (error instanceof Error && [
    "Este equipamento não está mais disponível. Atualize o catálogo.",
    "Você já tem cinco empréstimos ativos.",
    "Há um empréstimo em atraso. Regularize-o antes de solicitar outro item.",
    "O calendário de devolução ainda não cobre esse prazo.",
    "Sua conta não tem acesso à organização EmpresTI.",
    "Entre na sua conta para continuar.",
  ].includes(error.message)) return error.message;
  return "Não foi possível concluir a solicitação. Atualize os dados e tente novamente.";
}

export default function CatalogoPage() {
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null);
  const [loans, setLoans] = useState<Loan[] | null>(null);
  const [search, setSearch] = useState("");
  const [loadingError, setLoadingError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [pendingId, setPendingId] = useState("");
  const confirmButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const triggerButton = useRef<HTMLButtonElement | null>(null);

  const refresh = useCallback(async () => {
    const [nextCatalog, nextLoans] = await Promise.all([
      trpc.inventory.catalog.list.query(),
      trpc.inventory.loans.mine.query(),
    ]);
    setCatalog(nextCatalog);
    setLoans(nextLoans);
    setLoadingError("");
  }, []);

  useEffect(() => {
    let mounted = true;
    void Promise.all([
      trpc.inventory.catalog.list.query(),
      trpc.inventory.loans.mine.query(),
    ]).then(([nextCatalog, nextLoans]) => {
      if (!mounted) return;
      setCatalog(nextCatalog);
      setLoans(nextLoans);
    }).catch((error: unknown) => {
      if (mounted) setLoadingError(friendlyError(error));
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    confirmButton.current?.focus();
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !pendingId) {
        setSelectedItem(null);
        return;
      }
      if (event.key !== "Tab") return;
      const first = cancelButton.current;
      const last = confirmButton.current;
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerButton.current?.focus();
    };
  }, [selectedItem, pendingId]);

  const availableCount = catalog?.filter((item) => item.status === "DISPONIVEL").length ?? 0;
  const visibleCatalog = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!catalog) return [];
    if (!query) return catalog;
    return catalog.filter((item) =>
      `${item.name} ${item.assetTag} ${item.category}`.toLocaleLowerCase("pt-BR").includes(query),
    );
  }, [catalog, search]);

  function openRequest(item: CatalogItem, event: MouseEvent<HTMLButtonElement>) {
    triggerButton.current = event.currentTarget;
    setActionError("");
    setNotice("");
    setSelectedItem(item);
  }

  function closeDialog() {
    if (!pendingId) setSelectedItem(null);
  }

  async function retryLoading() {
    setLoadingError("");
    try {
      await refresh();
    } catch (error) {
      setLoadingError(friendlyError(error));
    }
  }

  async function confirmRequest() {
    if (!selectedItem || pendingId) return;
    const item = selectedItem;
    setPendingId(item.id);
    setActionError("");
    setNotice("");
    try {
      const created = await trpc.inventory.loans.request.mutate({ equipmentId: item.id });
      setSelectedItem(null);
      setNotice(`Empréstimo iniciado. Devolução prevista para ${dateTime.format(new Date(created.dueAt))}.`);
      try {
        await refresh();
      } catch {
        setLoadingError("Empréstimo registrado. Não foi possível atualizar as listas; tente atualizar a página.");
      }
    } catch (error) {
      setActionError(friendlyError(error));
      if (error instanceof Error && error.message === "Este equipamento não está mais disponível. Atualize o catálogo.") {
        try {
          await refresh();
        } catch {
          setLoadingError("Não foi possível atualizar as listas; tente atualizar os dados novamente.");
        }
      }
    } finally {
      setPendingId("");
    }
  }

  return (
    <main className="borrower-app">
      <header className="borrower-header">
        <Link className="borrower-brand" href="/catalogo" aria-label="EmpresTI, início">
          <span className="borrower-brand-mark"><Package size={18} aria-hidden="true" /></span>
          <span>EmpresTI</span>
        </Link>
        <div className="borrower-header-actions">
          <span className="borrower-user-label"><ShieldCheck size={15} aria-hidden="true" /> Área do colaborador</span>
          <LogoutButton />
        </div>
      </header>

      <div className="borrower-main">
        <section className="borrower-intro" aria-labelledby="catalog-title">
          <div>
            <span className="borrower-eyebrow">INVENTÁRIO COMPARTILHADO</span>
            <h1 id="catalog-title">Catálogo de equipamentos<span>.</span></h1>
            <p>Consulte a disponibilidade e acompanhe seus empréstimos.</p>
          </div>
          <div className="borrower-summary" aria-live="polite">
            <span className="borrower-summary-icon"><Package size={18} aria-hidden="true" /></span>
            <span><strong>{catalog ? availableCount : "—"}</strong><small>disponíveis agora</small></span>
          </div>
        </section>

        {loadingError && <div className="borrower-alert" role="alert"><AlertCircle size={18} /><span>{loadingError}</span><button type="button" onClick={() => void retryLoading()}>Tentar novamente</button></div>}
        {notice && <div className="borrower-success" role="status"><Check size={18} />{notice}</div>}

        <section className="borrower-section" aria-labelledby="inventory-heading">
          <div className="borrower-section-heading">
            <div><h2 id="inventory-heading">Equipamentos</h2><p>O empréstimo começa assim que você confirma a solicitação.</p></div>
            <label className="borrower-search">
              <Search size={17} aria-hidden="true" />
              <span className="visually-hidden">Buscar equipamento</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou patrimônio" />
            </label>
          </div>

          {catalog === null && !loadingError ? (
            <div className="borrower-placeholder" role="status"><span className="borrower-spinner" />Carregando catálogo…</div>
          ) : catalog === null ? (
            <div className="borrower-placeholder">O catálogo não está disponível no momento.</div>
          ) : catalog?.length === 0 ? (
            <div className="borrower-placeholder">Nenhum equipamento cadastrado.</div>
          ) : visibleCatalog.length === 0 ? (
            <div className="borrower-placeholder">Nenhum equipamento corresponde à busca.</div>
          ) : (
            <div className="equipment-grid">
              {visibleCatalog.map((item) => (
                <article className="equipment-card" key={item.id}>
                  <div className="equipment-image-wrap">
                    {item.image ? <Image className="equipment-image" src={item.image.url} alt={`Imagem de ${item.name}`} width={800} height={600} unoptimized loader={({ src }) => src} /> : <div className="equipment-image-fallback" aria-hidden="true"><Laptop size={35} /></div>}
                    <span className={`equipment-status ${item.status === "DISPONIVEL" ? "is-available" : ""}`}>
                      <i aria-hidden="true" />{equipmentStatus(item.status)}
                    </span>
                  </div>
                  <div className="equipment-card-body">
                    <div className="equipment-category">{item.category}</div>
                    <h3>{item.name}</h3>
                    <p className="equipment-tag">Patrimônio <strong>{item.assetTag}</strong></p>
                    {item.image && <p className="equipment-credit">Foto: <a href={item.image.photographerUrl} target="_blank" rel="noreferrer">{item.image.photographer}</a> · <a href={item.image.sourceUrl} target="_blank" rel="noreferrer">{imageSourceLabel(item.image.sourceUrl)}</a></p>}
                    {item.status === "DISPONIVEL" ? (
                      <button className="borrower-request-button" type="button" onClick={(event) => openRequest(item, event)} aria-label={`Solicitar empréstimo de ${item.name}, patrimônio ${item.assetTag}`}>
                        Solicitar empréstimo
                      </button>
                    ) : (
                      <p className="equipment-unavailable-note">Este item não pode ser solicitado agora.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="borrower-section loans-section" aria-labelledby="my-loans-heading">
          <div className="borrower-section-heading loans-heading">
            <div><h2 id="my-loans-heading">Meus empréstimos</h2><p>Somente os empréstimos vinculados à sua conta.</p></div>
            <span className="loans-heading-icon"><CalendarDays size={18} aria-hidden="true" /></span>
          </div>
          {loans === null && !loadingError ? (
            <div className="borrower-placeholder" role="status"><span className="borrower-spinner" />Carregando seus empréstimos…</div>
          ) : loans === null ? (
            <div className="borrower-placeholder">Seus empréstimos não estão disponíveis no momento.</div>
          ) : loans?.length === 0 ? (
            <div className="borrower-placeholder loans-empty"><Clock3 size={20} />Você ainda não tem empréstimos.</div>
          ) : (
            <div className="loans-list">
              {loans?.map((loan) => (
                <article className="loan-card" key={loan.id}>
                  <span className={`loan-card-icon ${loan.isOverdue ? "is-overdue" : ""}`}><Package size={18} aria-hidden="true" /></span>
                  <div className="loan-card-main">
                    <h3>{loan.equipment.name}</h3>
                    <p>{loan.equipment.assetTag} <span aria-hidden="true">·</span> {loan.equipment.category}</p>
                  </div>
                  <div className="loan-card-date"><span>Devolução prevista</span><strong>{shortDate.format(new Date(loan.dueAt))}</strong></div>
                  <span className={`loan-status ${loan.isOverdue ? "is-overdue" : ""}`}>{loan.isOverdue && <AlertCircle size={13} aria-hidden="true" />}{loanStatus(loan)}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="borrower-footer">EmpresTI <span aria-hidden="true">·</span> Inventário e empréstimos</footer>
      </div>

      {selectedItem && <div className="borrower-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <section className="borrower-dialog" role="dialog" aria-modal="true" aria-labelledby="request-dialog-title" aria-describedby="request-dialog-copy">
          <span className="borrower-dialog-icon"><Package size={20} aria-hidden="true" /></span>
          <h2 id="request-dialog-title">Confirmar empréstimo</h2>
          <p id="request-dialog-copy">Você vai iniciar agora o empréstimo de <strong>{selectedItem.name}</strong> ({selectedItem.assetTag}). O sistema calculará 14 dias úteis e mostrará a data exata de devolução após a confirmação.</p>
          {actionError && <p className="borrower-dialog-error" role="alert">{actionError}</p>}
          <div className="borrower-dialog-actions">
            <button ref={cancelButton} type="button" className="borrower-cancel-button" onClick={() => closeDialog()} disabled={Boolean(pendingId)}>Cancelar</button>
            <button ref={confirmButton} type="button" className="borrower-confirm-button" onClick={() => void confirmRequest()} disabled={Boolean(pendingId)} aria-busy={Boolean(pendingId)}>
              {pendingId ? "Registrando…" : "Confirmar solicitação"}
            </button>
          </div>
        </section>
      </div>}
    </main>
  );
}
