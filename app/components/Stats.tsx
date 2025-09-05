"use client";
import { useEffect, useMemo, useState } from "react";
import MotionCard from "./MotionCard";

export default function Stats() {
  const [rows, setRows] = useState<any[] | null>(null);

  async function load() {
    const res = await fetch("/api/expenses", { cache: "no-store" });
    const json = await res.json();
    setRows(json.items || []);
  }
  useEffect(() => {
    load();
    const on = () => load();
    document.addEventListener("expenses:changed", on);
    return () => document.removeEventListener("expenses:changed", on);
  }, []);

  const { todayNet, monthNet, yearNet } = useMemo(() => {
    if (!rows) return { todayNet: 0, monthNet: 0, yearNet: 0 };
    const todayStr = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const m = now.getMonth(),
      y = now.getFullYear();
    let t = 0,
      mm = 0,
      yy = 0;
    for (const r of rows) {
      const d = new Date(r.date);
      const net = r.kind === "expense" ? -r.amount : r.amount;
      if (r.date.startsWith(todayStr)) t += net;
      if (d.getMonth() === m && d.getFullYear() === y) mm += net;
      if (d.getFullYear() === y) yy += net;
    }
    return { todayNet: t, monthNet: mm, yearNet: yy };
  }, [rows]);

  const fmt = (n: number) =>
    (n < 0 ? "-" : "") + "Rp " + Math.abs(n).toLocaleString("id-ID");

  if (rows === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5">
          <div className="skel h-4 w-24 mb-3"></div>
          <div className="skel h-8 w-40"></div>
        </div>
        <div className="card p-5">
          <div className="skel h-4 w-24 mb-3"></div>
          <div className="skel h-8 w-40"></div>
        </div>
        <div className="card p-5">
          <div className="skel h-4 w-24 mb-3"></div>
          <div className="skel h-8 w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MotionCard className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
        <div className="text-sm/none opacity-90">Hari ini</div>
        <div className="text-2xl font-semibold">{fmt(todayNet)}</div>
      </MotionCard>

      <MotionCard className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
        <div className="text-sm/none opacity-90">Bulan ini</div>
        <div className="text-2xl font-semibold">{fmt(monthNet)}</div>
      </MotionCard>

      <MotionCard className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white">
        <div className="text-sm/none opacity-90">Tahun ini</div>
        <div className="text-2xl font-semibold">{fmt(yearNet)}</div>
      </MotionCard>
    </div>
  );
}
