import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginPage from "@/app/login/page";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn(), login: vi.fn(), signup: vi.fn(), pathname: "/login" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }), usePathname: () => mocks.pathname }));
vi.mock("@/src/lib/trpc", () => ({ trpc: { auth: { login: { mutate: mocks.login }, signup: { mutate: mocks.signup } } } }));

beforeEach(() => { vi.clearAllMocks(); mocks.pathname = "/login"; });

function submit() {
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
  fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "test-password" } });
  fireEvent.submit(screen.getByRole("button", { name: "Entrar" }).closest("form")!);
}

describe("T-09 — integração de React e Testing Library", () => {
  it("LOGIN-05 renderiza campos de acesso obrigatórios com rótulos", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    expect(screen.getByLabelText("E-mail")).toBeRequired();
    expect(screen.getByLabelText("Senha")).toBeRequired();
  });

  it("LOGIN-02 navega somente depois que o servidor aceita as credenciais", async () => {
    mocks.login.mockResolvedValue({ success: true });
    render(<LoginPage />);
    submit();
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/catalogo"));
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it("LOGIN-01 mantém login e explica credenciais inválidas", async () => {
    mocks.login.mockRejectedValue(new Error("E-mail ou senha inválidos."));
    render(<LoginPage />);
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos.");
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("LOGIN-05 impede envio repetido enquanto aguarda o servidor", () => {
    mocks.login.mockReturnValue(new Promise(() => {}));
    render(<LoginPage />);
    submit();
    fireEvent.submit(screen.getByRole("button", { name: "Aguarde…" }).closest("form")!);
    expect(mocks.login).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Aguarde…" })).toBeDisabled();
  });

  it("LOGIN-07 informa confirmação de e-mail sem navegar ao catálogo", async () => {
    mocks.pathname = "/cadastro";
    mocks.signup.mockResolvedValue({ requiresConfirmation: true });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "test-password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Criar conta" }).closest("form")!);
    expect(await screen.findByRole("status")).toHaveTextContent("Confira seu e-mail");
    expect(mocks.replace).not.toHaveBeenCalled();
  });
  it("LOGIN-07 segue ao catálogo quando cadastro já retorna sessão", async () => {
    mocks.pathname = "/cadastro";
    mocks.signup.mockResolvedValue({ requiresConfirmation: false });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "test-password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Criar conta" }).closest("form")!);
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/catalogo"));
    expect(mocks.login).not.toHaveBeenCalled();
  });
});
