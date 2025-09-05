export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createUser, sign } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body || {};
  if (!username || !password)
    return NextResponse.json({ message: "Invalid" }, { status: 400 });
  if (String(username).length < 3 || String(password).length < 6)
    return NextResponse.json(
      { message: "Username/Password terlalu pendek" },
      { status: 400 }
    );
  try {
    const user = await createUser(username, password);
    const token = sign({ id: user.id, username: user.username });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error" },
      { status: 400 }
    );
  }
}
