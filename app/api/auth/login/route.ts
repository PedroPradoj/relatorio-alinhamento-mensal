import { NextResponse } from "next/server";

interface AuthUser {
  name: string;
  login: string;
  password: string;
}

export async function POST(request: Request) {
  const { login, password } = await request.json();

  let users: AuthUser[] = [];
  try {
    users = JSON.parse(process.env.AUTH_USERS ?? "[]");
  } catch {
    return NextResponse.json({ error: "Erro de configuração do servidor" }, { status: 500 });
  }

  const user = users.find((u) => u.login === login && u.password === password);
  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, name: user.name });
  response.cookies.set("auth-session", process.env.AUTH_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  return response;
}
