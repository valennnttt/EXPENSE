export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = await getDB();
  const idx = db.data.expenses.findIndex(
    (e) => e.id === params.id && e.userId === user.id
  );
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  db.data.expenses.splice(idx, 1);
  await db.write();
  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const patch = await req.json();
  const db = await getDB();
  const item = db.data.expenses.find(
    (e) => e.id === params.id && e.userId === user.id
  );
  if (!item)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  Object.assign(item, patch);
  await db.write();
  return NextResponse.json({ ok: true, item });
}
