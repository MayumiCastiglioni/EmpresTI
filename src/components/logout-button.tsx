"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/src/lib/trpc";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  return <div>
    <button className="subtle-button" disabled={pending} onClick={async () => {
      setPending(true);
      setFailed(false);
      try {
        await trpc.auth.logout.mutate();
        router.replace("/login");
        router.refresh();
      } catch {
        setFailed(true);
      } finally {
        setPending(false);
      }
    }}>{pending ? "Saindo…" : "Sair"}</button>
    {failed && <p role="alert">Não foi possível sair. Tente novamente.</p>}
  </div>;
}
