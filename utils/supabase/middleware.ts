import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  if (request.nextUrl.pathname === "/health" || request.nextUrl.pathname === "/diagnostico") {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    },
  );

  let authenticated = false;
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    authenticated = Boolean(user) && !error;
  } catch {
    // A provider/network failure must never grant access to protected pages.
    authenticated = false;
  }
  const pathname = request.nextUrl.pathname;
  const loginPage = pathname === "/login" || pathname === "/cadastro";
  const authApi = pathname.startsWith("/api/trpc/");
  const destination = !authenticated ? (loginPage || authApi ? null : "/login") :
    (loginPage || pathname === "/" ? "/catalogo" : null);

  if (destination) {
    const redirected = NextResponse.redirect(new URL(destination, request.url));
    response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));
    redirected.headers.set("Cache-Control", "private, no-store");
    return redirected;
  }
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
