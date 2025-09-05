import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { getDB } from "./db";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function sign(user: Pick<User, "id" | "username">) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = await getDB();
  const user = db.data.users.find((u) => u.id === payload.id);
  return user ?? null;
}

export async function createUser(username: string, password: string) {
  const db = await getDB();
  if (db.data.users.some((u) => u.username === username))
    throw new Error("Username already exists");
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: nanoid(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(user);
  await db.write();
  return user;
}

export async function validateUser(username: string, password: string) {
  const db = await getDB();
  const user = db.data.users.find((u) => u.username === username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
