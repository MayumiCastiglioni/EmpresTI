export type SessionState = "anonymous" | "authenticated";

export function getEntryRoute(sessionState: SessionState) {
  return sessionState === "authenticated" ? "/catalogo" : "/login";
}
