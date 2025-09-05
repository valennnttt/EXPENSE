import { JSONFilePreset } from "lowdb/node";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { DBData } from "./types";

const dataDir = path.join(process.cwd(), "data");
if (!existsSync(dataDir)) mkdirSync(dataDir);

let _db: Awaited<ReturnType<typeof JSONFilePreset<DBData>>> | null = null;

export async function getDB() {
  if (!_db) {
    _db = await JSONFilePreset<DBData>(path.join(dataDir, "db.json"), {
      users: [],
      expenses: [],
    });
  }
  return _db;
}
