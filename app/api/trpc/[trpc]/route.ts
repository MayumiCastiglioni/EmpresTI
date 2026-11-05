import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { appRouter } from "@/src/server/api/router";
import { createClient } from "@/utils/supabase/server";

async function handler(request: Request) {
  const expectedOrigin = `${new URL(request.url).protocol}//${request.headers.get("host") ?? new URL(request.url).host}`;
  if (request.method === "POST" && request.headers.get("origin") !== expectedOrigin) {
    return new Response("Origem não permitida.", { status: 403 });
  }
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => ({ supabase: createClient(await cookies()) }),
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export { handler as GET, handler as POST };
