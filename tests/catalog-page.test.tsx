import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  inventory: {
    catalog: { list: { query: vi.fn() } },
    loans: { mine: { query: vi.fn() }, request: { mutate: vi.fn() } },
  },
}));

vi.mock("@/src/lib/trpc", () => ({ trpc: api }));
vi.mock("@/src/components/logout-button", () => ({
  LogoutButton: () => <button type="button">Sair</button>,
}));

import CatalogoPage from "@/app/catalogo/page";

const availableItem = {
  id: "11111111-1111-4111-8111-111111111111",
  assetTag: "TI-1001",
  name: "Notebook de teste",
  category: "notebook",
  status: "DISPONIVEL" as const,
  image: null,
};

describe("EMP-T07 — catálogo e empréstimos do colaborador", () => {
  it.each([false, true])("EMP-09/EMP-10 atualiza consultas após indisponibilidade, falha de atualização=%s", async (refreshFails) => {
    const message = "Este equipamento não está mais disponível. Atualize o catálogo.";
    api.inventory.loans.request.mutate.mockRejectedValueOnce(new Error(message));
    render(<CatalogoPage />);
    fireEvent.click(await screen.findByRole("button", { name: /Solicitar empréstimo de Notebook de teste/ }));
    if (refreshFails) api.inventory.catalog.list.query.mockRejectedValueOnce(new Error("private details"));
    else api.inventory.catalog.list.query.mockResolvedValueOnce([{ ...availableItem, status: "EMPRESTADO" }]);
    fireEvent.click(screen.getByRole("button", { name: "Confirmar solicitação" }));
    await waitFor(() => expect(api.inventory.catalog.list.query).toHaveBeenCalledTimes(2));
    expect(api.inventory.loans.mine.query).toHaveBeenCalledTimes(2);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByText(/Empréstimo iniciado/)).not.toBeInTheDocument();
    if (refreshFails) {
      expect(await screen.findByText(/Não foi possível atualizar as listas/)).toBeInTheDocument();
      expect(screen.queryByText("private details")).not.toBeInTheDocument();
    } else {
      expect(await screen.findByText("Emprestado")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Solicitar empréstimo de/ })).not.toBeInTheDocument();
    }
  });
  it("EMP-09 mostra carregamento, recupera falha e explica catálogo vazio", async () => {
    api.inventory.catalog.list.query.mockImplementationOnce(() => new Promise(() => {}));
    const first = render(<CatalogoPage />);
    expect(screen.getByText(/Carregando catálogo/)).toBeInTheDocument();
    first.unmount();
    api.inventory.catalog.list.query.mockRejectedValueOnce(new Error("private database details"));
    render(<CatalogoPage />);
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private database details");
    api.inventory.catalog.list.query.mockResolvedValue([]);
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Nenhum equipamento cadastrado.")).toBeInTheDocument();
    expect(screen.getByText("Você ainda não tem empréstimos.")).toBeInTheDocument();
  });

  it("EMP-09 impede reenvio durante a mutation e mantém o estado até confirmar", async () => {
    let complete!: (value: unknown) => void;
    api.inventory.loans.request.mutate.mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }));
    render(<CatalogoPage />);
    fireEvent.click(await screen.findByRole("button", { name: /Solicitar empréstimo de Notebook de teste/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar solicitação" }));
    expect(screen.getByRole("button", { name: /Registrando/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(api.inventory.catalog.list.query).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Empréstimo iniciado/)).not.toBeInTheDocument();
    complete({ dueAt: "2026-11-28T02:59:59.000Z" });
    expect(await screen.findByRole("status")).toHaveTextContent("Empréstimo iniciado");
    expect(api.inventory.loans.request.mutate).toHaveBeenCalledTimes(1);
  });
  beforeEach(() => {
    vi.clearAllMocks();
    api.inventory.catalog.list.query.mockResolvedValue([availableItem]);
    api.inventory.loans.mine.query.mockResolvedValue([]);
    api.inventory.loans.request.mutate.mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      status: "RETIRADO",
      requestedAt: "2026-11-10T12:00:00.000Z",
      checkedOutAt: "2026-11-10T12:00:00.000Z",
      dueAt: "2026-11-30T02:59:59.000Z",
    });
  });

  it("mostra equipamento real e pede confirmação antes da mutation imediata", async () => {
    render(<CatalogoPage />);

    expect(await screen.findByRole("heading", { name: "Notebook de teste" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Solicitar empréstimo de Notebook de teste/ }));
    expect(screen.getByRole("dialog", { name: "Confirmar empréstimo" })).toBeInTheDocument();
    expect(api.inventory.loans.request.mutate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar solicitação" }));
    await waitFor(() => expect(api.inventory.loans.request.mutate).toHaveBeenCalledWith({ equipmentId: availableItem.id }));
    expect(await screen.findByRole("status")).toHaveTextContent("Empréstimo iniciado");
    await waitFor(() => expect(api.inventory.loans.mine.query).toHaveBeenCalledTimes(2));
  });

  it("não mostra ação de solicitação para equipamento em manutenção", async () => {
    api.inventory.catalog.list.query.mockResolvedValue([{ ...availableItem, status: "MANUTENCAO" }]);
    render(<CatalogoPage />);

    expect(await screen.findByText("Em manutenção")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Solicitar empréstimo de/ })).not.toBeInTheDocument();
    expect(screen.getByText("Este item não pode ser solicitado agora.")).toBeInTheDocument();
  });

  it("mantém o item e explica a recusa quando o servidor rejeita", async () => {
    api.inventory.loans.request.mutate.mockRejectedValue(new Error("Você já tem cinco empréstimos ativos."));
    render(<CatalogoPage />);

    fireEvent.click(await screen.findByRole("button", { name: /Solicitar empréstimo de Notebook de teste/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar solicitação" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Você já tem cinco empréstimos ativos.");
    expect(screen.getByRole("heading", { name: "Notebook de teste" })).toBeInTheDocument();
    expect(api.inventory.catalog.list.query).toHaveBeenCalledTimes(1);
  });
});
