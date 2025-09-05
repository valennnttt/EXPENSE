export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sign, validateUser } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body || {};
  if (!username || !password)
    return NextResponse.json({ message: "Invalid" }, { status: 400 });
  const user = await validateUser(username, password);
  if (!user)
    return NextResponse.json(
      { message: "Username atau password salah" },
      { status: 401 }
    );
  const token = sign({ id: user.id, username: user.username });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
