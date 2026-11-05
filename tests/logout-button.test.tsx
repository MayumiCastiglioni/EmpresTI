import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { LogoutButton } from "@/src/components/logout-button";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn(), logout: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }) }));
vi.mock("@/src/lib/trpc", () => ({ trpc: { auth: { logout: { mutate: mocks.logout } } } }));
beforeEach(() => vi.clearAllMocks());

it("LOGIN-04 volta ao login e atualiza a navegação depois da saída confirmada", async () => {
  mocks.logout.mockResolvedValue({ success: true });
  render(<LogoutButton />);
  fireEvent.click(screen.getByRole("button", { name: "Sair" }));
  await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login"));
  expect(mocks.refresh).toHaveBeenCalledOnce();
});

it("LOGIN-04 informa falha sem declarar sessão encerrada", async () => {
  mocks.logout.mockRejectedValue(new Error("network"));
  render(<LogoutButton />);
  fireEvent.click(screen.getByRole("button", { name: "Sair" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível sair.");
  expect(mocks.replace).not.toHaveBeenCalled();
});
