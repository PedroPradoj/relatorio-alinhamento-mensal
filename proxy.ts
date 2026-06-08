import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("auth-session");
  const isAuthenticated = session?.value === process.env.AUTH_SECRET;

  // Já logado tentando acessar /login → redireciona para home
  if (pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rotas públicas
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protege tudo o mais
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
