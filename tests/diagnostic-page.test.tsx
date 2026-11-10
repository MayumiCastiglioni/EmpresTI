import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DiagnosticPage from "@/app/diagnostico/page";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("MIN-03 — página de diagnóstico", () => {
  it("AZ-05 mostra carregamento antes de receber o resultado e consulta a rota real", () => {
    const fetcher = vi.fn().mockReturnValue(new Promise(() => {}));
    vi.stubGlobal("fetch", fetcher);
    render(<DiagnosticPage />);
    expect(screen.getByRole("status")).toHaveTextContent("Verificando conexão");
    expect(screen.getByRole("button", { name: "Verificar novamente" })).toBeDisabled();
    expect(fetcher).toHaveBeenCalledWith("/health", expect.objectContaining({ cache: "no-store", signal: expect.any(AbortSignal) }));
  });

  it("AZ-05 informa conexão disponível somente com HTTP e corpo de sucesso", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok", database: "up" }))));
    render(<DiagnosticPage />);
    expect(await screen.findByText("Conexão disponível.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao login" })).toHaveAttribute("href", "/login");
  });

  it.each([
    () => Promise.resolve(new Response(JSON.stringify({ status: "error", database: "down" }), { status: 503 })),
    () => Promise.resolve(new Response(JSON.stringify({ status: "ok", database: "up" }), { status: 503 })),
    () => Promise.resolve(new Response(JSON.stringify({ status: "ok", database: "down" }))),
    () => Promise.resolve(new Response("not json")),
    () => Promise.reject(new Error("private server detail")),
  ])("AZ-05 apresenta falha segura em resposta indisponível, inválida ou erro de rede (%#)", async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(response));
    render(<DiagnosticPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível confirmar a conexão.");
    expect(screen.queryByText("private server detail")).not.toBeInTheDocument();
  });

  it("AZ-05 permite verificar novamente e recuperar de uma falha", async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "ok", database: "up" })));
    vi.stubGlobal("fetch", fetcher);
    render(<DiagnosticPage />);
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Verificar novamente" }));
    expect(await screen.findByText("Conexão disponível.")).toBeInTheDocument();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("AZ-05 cancela a consulta ao sair da página", () => {
    const fetcher = vi.fn().mockReturnValue(new Promise(() => {}));
    vi.stubGlobal("fetch", fetcher);
    const { unmount } = render(<DiagnosticPage />);
    const signal: AbortSignal = fetcher.mock.calls[0][1].signal;
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it("AZ-05 informa falha quando a consulta excede o tempo limite", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockImplementation((_url, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    })));
    render(<DiagnosticPage />);
    await act(async () => { await vi.advanceTimersByTimeAsync(8000); });
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível confirmar a conexão.");
    expect(screen.getByRole("button", { name: "Verificar novamente" })).toBeEnabled();
  });
});
