export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = await getDB();
  const items = db.data.expenses
    .filter((e) => e.userId === user.id)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { amount, method, wallet, note, date, kind } = await req.json();
  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0)
    return NextResponse.json(
      { message: "Nominal tidak valid" },
      { status: 400 }
    );
  if (!["cash", "bank", "ewallet"].includes(method))
    return NextResponse.json(
      { message: "Metode tidak valid" },
      { status: 400 }
    );
  if (!["expense", "income"].includes(kind))
    return NextResponse.json({ message: "Jenis tidak valid" }, { status: 400 });
  const db = await getDB();
  const item = {
    id: nanoid(),
    userId: user.id,
    amount: num,
    method,
    wallet,
    note,
    date: date || new Date().toISOString(),
    kind,
  };
  db.data.expenses.push(item);
  await db.write();
  return NextResponse.json({ ok: true, item });
}
