"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Headphones,
  Laptop,
  LayoutDashboard,
  Monitor,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  UsersRound,
  X,
  Camera,
  Tablet,
  type LucideIcon,
} from "lucide-react";

type Section = "overview" | "requests" | "loans" | "equipment" | "people";
type LoanStatus = "Pendente" | "Em uso" | "Atrasado" | "Devolvido";

type Loan = {
  id: string;
  person: string;
  team: string;
  item: string;
  code: string;
  due: string;
  status: LoanStatus;
  icon: LucideIcon;
  tone: string;
};

type Equipment = {
  name: string;
  code: string;
  category: string;
  status: "Disponível" | "Emprestado" | "Manutenção";
  icon: LucideIcon;
  tone: string;
};

const navigation: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "requests", label: "Solicitações", icon: Clock3 },
  { id: "loans", label: "Empréstimos", icon: ArrowUpRight },
  { id: "equipment", label: "Equipamentos", icon: Package },
  { id: "people", label: "Pessoas", icon: UsersRound },
];

const initialEquipment: Equipment[] = [
  { name: "MacBook Pro 14”", code: "EQ-014", category: "Computadores", status: "Emprestado", icon: Laptop, tone: "mint" },
  { name: "Câmera Sony A7 IV", code: "EQ-022", category: "Audiovisual", status: "Emprestado", icon: Camera, tone: "peach" },
  { name: "Monitor Dell 27”", code: "EQ-008", category: "Monitores", status: "Emprestado", icon: Monitor, tone: "blue" },
  { name: "iPad Air 11”", code: "EQ-031", category: "Tablets", status: "Emprestado", icon: Tablet, tone: "lilac" },
  { name: "Fone Sony WH-1000XM5", code: "EQ-019", category: "Acessórios", status: "Disponível", icon: Headphones, tone: "yellow" },
  { name: "Logitech MX Master 3S", code: "EQ-027", category: "Acessórios", status: "Disponível", icon: Package, tone: "mint" },
  { name: "MacBook Air 13”", code: "EQ-006", category: "Computadores", status: "Disponível", icon: Laptop, tone: "blue" },
  { name: "Monitor LG UltraFine", code: "EQ-011", category: "Monitores", status: "Manutenção", icon: Monitor, tone: "peach" },
];

const initialLoans: Loan[] = [
  { id: "EM-1042", person: "Joana Martins", team: "Design de Produto", item: "MacBook Pro 14”", code: "EQ-014", due: "29 set, 2026", status: "Em uso", icon: Laptop, tone: "mint" },
  { id: "EM-1041", person: "Rafael Costa", team: "Audiovisual", item: "Câmera Sony A7 IV", code: "EQ-022", due: "27 set, 2026", status: "Atrasado", icon: Camera, tone: "peach" },
  { id: "EM-1039", person: "Miguel Alves", team: "Operações", item: "Monitor Dell 27”", code: "EQ-008", due: "28 set, 2026", status: "Em uso", icon: Monitor, tone: "blue" },
  { id: "EM-1038", person: "Bruna Reis", team: "Pesquisa", item: "iPad Air 11”", code: "EQ-031", due: "30 set, 2026", status: "Em uso", icon: Tablet, tone: "lilac" },
  { id: "EM-1035", person: "Ana Lima", team: "Design de Produto", item: "Fone Sony WH-1000XM5", code: "EQ-019", due: "30 set, 2026", status: "Pendente", icon: Headphones, tone: "yellow" },
  { id: "EM-1034", person: "Pedro Nunes", team: "Tecnologia", item: "Logitech MX Master 3S", code: "EQ-027", due: "02 out, 2026", status: "Pendente", icon: Package, tone: "mint" },
  { id: "EM-1028", person: "Carla Souza", team: "Marketing", item: "MacBook Air 13”", code: "EQ-006", due: "22 set, 2026", status: "Devolvido", icon: Laptop, tone: "blue" },
];

const people = [
  { name: "Joana Martins", team: "Design de Produto", email: "joana.martins@empresa.com", initials: "JM", color: "avatar-coral", loans: 2 },
  { name: "Rafael Costa", team: "Audiovisual", email: "rafael.costa@empresa.com", initials: "RC", color: "avatar-blue", loans: 1 },
  { name: "Miguel Alves", team: "Operações", email: "miguel.alves@empresa.com", initials: "MA", color: "avatar-green", loans: 1 },
  { name: "Bruna Reis", team: "Pesquisa", email: "bruna.reis@empresa.com", initials: "BR", color: "avatar-purple", loans: 1 },
  { name: "Ana Lima", team: "Design de Produto", email: "ana.lima@empresa.com", initials: "AL", color: "avatar-yellow", loans: 1 },
];

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
  overview: { title: "Visão geral", subtitle: "Acompanhe o movimento dos equipamentos da equipe." },
  requests: { title: "Solicitações", subtitle: "Revise os pedidos que aguardam uma decisão." },
  loans: { title: "Empréstimos", subtitle: "Consulte retiradas, prazos e devoluções." },
  equipment: { title: "Equipamentos", subtitle: "Inventário e disponibilidade dos itens." },
  people: { title: "Pessoas", subtitle: "Colaboradores com acesso ao inventário." },
};

function StatusPill({ status }: { status: string }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill status-${className}`}><span />{status}</span>;
}

function AppLogo() {
  return <div className="brand-mark" aria-hidden="true"><Command size={21} strokeWidth={2.5} /></div>;
}

const categoryPresentation: Record<string, { icon: LucideIcon; tone: string }> = {
  Computadores: { icon: Laptop, tone: "mint" },
  Audiovisual: { icon: Camera, tone: "peach" },
  Monitores: { icon: Monitor, tone: "blue" },
  Tablets: { icon: Tablet, tone: "lilac" },
  Acessórios: { icon: Headphones, tone: "yellow" },
};

function formatToday() {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
    .format(new Date())
    .toLocaleUpperCase("pt-BR");
}

export default function Home() {
  const [section, setSection] = useState<Section>("overview");
  const [loans, setLoans] = useState(initialLoans);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement>(null);

  const activeTitle = sectionTitles[section];
  const available = equipment.filter((item) => item.status === "Disponível").length;
  const inUse = equipment.filter((item) => item.status === "Emprestado").length;
  const pending = loans.filter((loan) => loan.status === "Pendente").length;
  const overdue = loans.filter((loan) => loan.status === "Atrasado").length;
  const reservedCodes = new Set(loans.filter((loan) => loan.status !== "Devolvido").map((loan) => loan.code));
  const requestableEquipment = equipment.filter((item) => item.status === "Disponível" && !reservedCodes.has(item.code));
  const categories = Array.from(new Set(equipment.map((item) => item.category))).map((name) => {
    const items = equipment.filter((item) => item.category === name);
    return { name, total: items.length, available: items.filter((item) => item.status === "Disponível").length, ...categoryPresentation[name] };
  });

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    closeModalButtonRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [modalOpen]);

  const filteredLoans = loans.filter((loan) => {
    const matchesQuery = `${loan.person} ${loan.item} ${loan.code} ${loan.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Todos" || loan.status === filter;
    const matchesSection = section === "requests" ? loan.status === "Pendente" : section === "loans" || section === "overview";
    return matchesQuery && matchesFilter && matchesSection;
  });

  const filteredEquipment = equipment.filter((item) => `${item.name} ${item.code} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const filteredPeople = people.filter((person) => `${person.name} ${person.team} ${person.email}`.toLowerCase().includes(query.toLowerCase()));

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function updateLoan(loan: Loan, status: LoanStatus) {
    setLoans((current) => current.map((item) => item.id === loan.id ? { ...item, status } : item));
    if (status === "Devolvido") {
      setEquipment((current) => current.map((item) => item.code === loan.code ? { ...item, status: "Disponível" } : item));
      showToast("Devolução registrada.");
    } else {
      setEquipment((current) => current.map((item) => item.code === loan.code ? { ...item, status: "Emprestado" } : item));
      showToast("Solicitação aprovada.");
    }
  }

  function addRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const person = String(form.get("person"));
    const code = String(form.get("equipment"));
    const dueParts = String(form.get("due")).split("-");
    const dueMonth = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const selected = equipment.find((item) => item.code === code);
    const personInfo = people.find((item) => item.name === person);
    if (!selected || !personInfo || dueParts.length !== 3 || reservedCodes.has(code)) {
      showToast("Este equipamento não está mais disponível.");
      return;
    }
    setLoans((current) => [{
      id: `EM-${1050 + current.length}`,
      person,
      team: personInfo.team,
      item: selected.name,
      code: selected.code,
      due: `${dueParts[2]} ${dueMonth[Number(dueParts[1]) - 1]}, ${dueParts[0]}`,
      status: "Pendente",
      icon: selected.icon,
      tone: selected.tone,
    }, ...current]);
    setSection("requests");
    setFilter("Todos");
    setQuery("");
    setModalOpen(false);
    showToast("Solicitação criada.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><AppLogo /><span>emprest<span className="brand-period">.</span></span></div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">G</div>
          <div className="workspace-copy"><strong>Germinare</strong><span>Espaço de trabalho</span></div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-caption">ESPAÇO DE TRABALHO</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-link ${section === id ? "active" : ""}`} onClick={() => { setSection(id); setFilter("Todos"); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {id === "requests" && pending > 0 && <span className="nav-count">{pending.toString().padStart(2, "0")}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <div className="note-icon"><CircleHelp size={17} /></div>
          <div><strong>Precisa de ajuda?</strong><span>Fale com Operações</span></div>
          <ArrowUpRight size={14} />
        </div>
        <button className="profile-button" onClick={() => showToast("Perfil de demonstração") }>
          <div className="profile-avatar">MC</div>
          <div className="profile-copy"><strong>Marina Castiglioni</strong><span>Administradora</span></div>
          <MoreHorizontal size={18} />
        </button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeTitle.title}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={16} />
              <input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar equipamento ou pessoa" aria-label="Buscar equipamento ou pessoa" />
              <kbd>Ctrl/⌘ K</kbd>
            </label>
            <div className="notification-wrap">
              <button className={`icon-button ${notificationsOpen ? "selected" : ""}`} aria-label="Notificações" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} /><i /></button>
              {notificationsOpen && <div className="notification-popover"><strong>Notificações</strong><p>{pending ? `${pending} solicitações aguardam revisão.` : "Tudo em dia por aqui."}</p><span>Atualizado agora</span></div>}
            </div>
            <div className="topbar-avatar">MC</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="date-label"><CalendarDays size={14} /> {formatToday()}</div>
              <h1>{activeTitle.title}<span className="heading-dot">.</span></h1>
              <p>{activeTitle.subtitle}</p>
            </div>
            <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={17} /> Nova solicitação</button>
          </div>

          {(section === "overview" || section === "loans") && <section className="metrics-grid" aria-label="Resumo do inventário">
            <article className="metric-card"><div className="metric-top"><span>Disponíveis</span><div className="metric-icon green"><Package size={17} /></div></div><div className="metric-value">{available.toString().padStart(2, "0")}<span className="metric-unit">itens</span></div><div className="metric-foot"><span className="trend-positive"><ArrowUpRight size={13} /> 8,2%</span><span>vs. mês passado</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Em uso</span><div className="metric-icon blue"><ArrowUpRight size={17} /></div></div><div className="metric-value">{inUse.toString().padStart(2, "0")}<span className="metric-unit">itens</span></div><div className="metric-foot"><span className="trend-neutral">+ 3</span><span>nesta semana</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Aguardando revisão</span><div className="metric-icon yellow"><Clock3 size={17} /></div></div><div className="metric-value">{pending.toString().padStart(2, "0")}<span className="metric-unit">pedidos</span></div><div className="metric-foot"><span className="trend-neutral">Requer atenção</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Em atraso</span><div className="metric-icon coral"><CalendarDays size={17} /></div></div><div className="metric-value">{overdue.toString().padStart(2, "0")}<span className="metric-unit">itens</span></div><div className="metric-foot"><span className={overdue ? "trend-alert" : "trend-positive"}>{overdue ? "Verificar devolução" : "Tudo em dia"}</span></div></article>
          </section>}

          {section === "overview" && <div className="dashboard-grid">
            <section className="content-panel loan-panel">
              <div className="panel-heading"><div><h2>Movimentações recentes</h2><p>Solicitações e empréstimos da equipe</p></div><button className="subtle-button" onClick={() => setSection("loans")}>Ver todos <ArrowUpRight size={14} /></button></div>
              <div className="table-wrap"><table className="data-table"><thead><tr><th>ITEM</th><th>RESPONSÁVEL</th><th>DEVOLUÇÃO</th><th>STATUS</th><th /></tr></thead><tbody>{filteredLoans.slice(0, 5).map((loan) => <LoanRow key={loan.id} loan={loan} onAction={updateLoan} />)}</tbody></table></div>
              {filteredLoans.length === 0 && <EmptyState query={query} />}
              <div className="panel-footer"><span>Exibindo {Math.min(filteredLoans.length, 5)} de {filteredLoans.length} registros</span><button onClick={() => setSection("loans")}>Abrir empréstimos <ArrowUpRight size={14} /></button></div>
            </section>
            <section className="content-panel attention-panel">
              <div className="panel-heading"><div><h2>Precisam de atenção</h2><p>Itens para acompanhar hoje</p></div><span className="attention-total">{pending + overdue}</span></div>
              <div className="attention-list">
                {loans.filter((loan) => loan.status === "Atrasado" || loan.status === "Pendente").slice(0, 4).map((loan) => {
                  const Icon = loan.icon;
                  return <div className="attention-item" key={loan.id}><div className={`item-icon ${loan.tone}`}><Icon size={18} /></div><div className="attention-copy"><strong>{loan.item}</strong><span>{loan.person} · {loan.code}</span></div><StatusPill status={loan.status} /></div>;
                })}
                {pending + overdue === 0 && <div className="all-clear"><Check size={18} /> Tudo em dia. Nenhum item exige atenção.</div>}
              </div>
              <button className="attention-link" onClick={() => { setSection("requests"); setFilter("Todos"); }}>Revisar solicitações <ArrowUpRight size={14} /></button>
            </section>
            <section className="content-panel category-panel">
              <div className="panel-heading"><div><h2>Inventário por categoria</h2><p>Distribuição dos itens cadastrados</p></div><button className="icon-plain" aria-label="Filtrar categorias"><SlidersHorizontal size={17} /></button></div>
              <div className="category-list">
                {categories.map(({ name, available: count, total, icon: Icon, tone }) => <div className="category-row" key={name}><div className={`category-icon ${tone}`}><Icon size={17} /></div><div className="category-name">{name}<span>{count} disponíveis</span></div><div className="category-meter"><i style={{ width: `${(count / total) * 100}%` }} /></div><strong>{total.toString().padStart(2, "0")}</strong></div>)}
              </div>
              <button className="attention-link" onClick={() => setSection("equipment")}>Ver inventário completo <ArrowUpRight size={14} /></button>
            </section>
            <section className="content-panel week-panel">
              <div className="panel-heading"><div><h2>Resumo da semana</h2><p>Atividade de 22 a 28 de setembro</p></div><span className="week-chip">Esta semana <ChevronDown size={13} /></span></div>
              <div className="week-summary"><div><span className="week-number">12</span><span className="week-label">movimentações</span></div><div className="week-change"><span><ArrowDownLeft size={15} /> 4 devoluções</span><span><ArrowUpRight size={15} /> 8 retiradas</span></div></div>
              <div className="week-chart" aria-label="Gráfico de movimentações por dia"><span style={{ height: "44%" }} /><span style={{ height: "69%" }} /><span style={{ height: "52%" }} /><span style={{ height: "86%" }} /><span style={{ height: "62%" }} /><span style={{ height: "100%" }} /><span style={{ height: "37%" }} /></div>
              <div className="chart-days"><span>seg</span><span>ter</span><span>qua</span><span>qui</span><span>sex</span><span>sáb</span><span>dom</span></div>
            </section>
          </div>}

          {section === "loans" && <LoanListing loans={filteredLoans} filter={filter} setFilter={setFilter} onAction={updateLoan} />}
          {section === "requests" && <LoanListing loans={filteredLoans} filter={filter} setFilter={setFilter} onAction={updateLoan} requestsOnly />}
          {section === "equipment" && <EquipmentListing items={filteredEquipment} />}
          {section === "people" && <PeopleListing items={filteredPeople} />}
        </div>
        <footer className="app-footer"><span>Emprest <b>·</b> Inventário e empréstimos</span><span>Feito para cuidar do que é compartilhado.</span></footer>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-kicker">NOVO PEDIDO</span><h2 id="modal-title">Solicitar equipamento</h2><p>Escolha quem precisa e qual item será solicitado.</p></div><button ref={closeModalButtonRef} className="icon-button" onClick={() => setModalOpen(false)} aria-label="Fechar"><X size={18} /></button></div><form onSubmit={addRequest}><label>Pessoa<select name="person" required defaultValue=""><option value="" disabled>Selecione uma pessoa</option>{people.map((person) => <option key={person.name}>{person.name}</option>)}</select></label><label>Equipamento<select name="equipment" required defaultValue=""><option value="" disabled>Selecione um item disponível</option>{requestableEquipment.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.code}</option>)}</select></label><label>Data prevista para devolução<input name="due" type="date" defaultValue="2026-10-05" required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button"><Plus size={16} /> Criar solicitação</button></div></form></section></div>}
      {toast && <div className="toast"><span className="toast-check"><Check size={15} /></span>{toast}</div>}
    </div>
  );
}

function LoanRow({ loan, onAction }: { loan: Loan; onAction: (loan: Loan, status: LoanStatus) => void }) {
  const Icon = loan.icon;
  return <tr><td><div className="table-item"><div className={`item-icon ${loan.tone}`}><Icon size={17} /></div><div><strong>{loan.item}</strong><span>{loan.code} <i>·</i> {loan.id}</span></div></div></td><td><div className="person-cell"><div className={`tiny-avatar ${personColor(loan.person)}`}>{initials(loan.person)}</div><div><strong>{loan.person}</strong><span>{loan.team}</span></div></div></td><td className={loan.status === "Atrasado" ? "overdue-date" : "due-date"}>{loan.due}</td><td><StatusPill status={loan.status} /></td><td className="action-cell">{loan.status === "Pendente" ? <button className="row-action" onClick={() => onAction(loan, "Em uso")}>Aprovar</button> : loan.status === "Em uso" || loan.status === "Atrasado" ? <button className="row-action" onClick={() => onAction(loan, "Devolvido")}>Devolver</button> : <span className="completed-mark"><Check size={15} /></span>}</td></tr>;
}

function LoanListing({ loans, filter, setFilter, onAction, requestsOnly = false }: { loans: Loan[]; filter: string; setFilter: (filter: string) => void; onAction: (loan: Loan, status: LoanStatus) => void; requestsOnly?: boolean }) {
  const filters = requestsOnly ? ["Todos", "Pendente"] : ["Todos", "Em uso", "Atrasado", "Pendente", "Devolvido"];
  return <section className="content-panel listing-panel"><div className="listing-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filtrar por status">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? "current" : ""} onClick={() => setFilter(item)}>{item}{item === "Pendente" && <span>{loans.filter((loan) => loan.status === "Pendente").length}</span>}</button>)}</div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button></div><div className="table-wrap"><table className="data-table listing-table"><thead><tr><th>ITEM</th><th>RESPONSÁVEL</th><th>DEVOLUÇÃO</th><th>STATUS</th><th /></tr></thead><tbody>{loans.map((loan) => <LoanRow key={loan.id} loan={loan} onAction={onAction} />)}</tbody></table></div>{loans.length === 0 && <EmptyState query="" />}</section>;
}

function EquipmentListing({ items }: { items: Equipment[] }) {
  return <section className="content-panel listing-panel"><div className="listing-toolbar"><div className="listing-summary"><strong>{items.length} equipamentos</strong><span>Inventário atualizado</span></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button></div><div className="table-wrap"><table className="data-table listing-table"><thead><tr><th>EQUIPAMENTO</th><th>CATEGORIA</th><th>CÓDIGO</th><th>STATUS</th><th /></tr></thead><tbody>{items.map((item) => { const Icon = item.icon; return <tr key={item.code}><td><div className="table-item"><div className={`item-icon ${item.tone}`}><Icon size={17} /></div><div><strong>{item.name}</strong><span>Patrimônio compartilhado</span></div></div></td><td>{item.category}</td><td className="code-cell">{item.code}</td><td><StatusPill status={item.status} /></td><td className="action-cell"><button className="icon-plain" aria-label={`Mais opções para ${item.name}`}><MoreHorizontal size={18} /></button></td></tr>; })}</tbody></table></div>{items.length === 0 && <EmptyState query="" />}</section>;
}

function PeopleListing({ items }: { items: typeof people }) {
  return <section className="content-panel listing-panel"><div className="listing-toolbar"><div className="listing-summary"><strong>{items.length} pessoas</strong><span>Equipe com acesso ao Emprest</span></div><button className="filter-button"><SlidersHorizontal size={15} /> Filtros</button></div><div className="table-wrap"><table className="data-table listing-table"><thead><tr><th>PESSOA</th><th>EQUIPE</th><th>E-MAIL</th><th>EMPRÉSTIMOS ATIVOS</th><th /></tr></thead><tbody>{items.map((person) => <tr key={person.email}><td><div className="person-cell"><div className={`tiny-avatar ${person.color}`}>{person.initials}</div><div><strong>{person.name}</strong><span>Colaborador</span></div></div></td><td>{person.team}</td><td className="email-cell">{person.email}</td><td><span className="loan-count">{person.loans.toString().padStart(2, "0")}</span></td><td className="action-cell"><button className="icon-plain" aria-label={`Mais opções para ${person.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div>{items.length === 0 && <EmptyState query="" />}</section>;
}

function EmptyState({ query }: { query: string }) {
  return <div className="empty-state"><Search size={20} /><strong>Nenhum resultado encontrado</strong><span>{query ? "Tente buscar por outro termo." : "Ainda não há registros nesta lista."}</span></div>;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("");
}

function personColor(name: string) {
  const colors = ["avatar-coral", "avatar-blue", "avatar-green", "avatar-purple", "avatar-yellow"];
  return colors[name.charCodeAt(0) % colors.length];
}
