import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emprest | Gestão de equipamentos",
  description: "Painel de empréstimos de equipamentos da equipe.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}