"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

type Kind = "expense" | "income";
type FormState = {
  amount: string;
  method: "cash" | "bank" | "ewallet";
  wallet?: "OVO" | "DANA" | "GoPay" | "ShopeePay" | "Other";
  note?: string;
  date: string;
  kind: Kind;
};
const today = new Date().toISOString().slice(0, 10);

export default function ExpenseForm() {
  const [s, setS] = useState<FormState>({
    amount: "",
    method: "cash",
    date: today,
    kind: "expense",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const amountNum = Number(s.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setMsg("Nominal tidak valid");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, amount: amountNum }),
    });
    if (!res.ok) {
      setMsg("Gagal menyimpan");
      setLoading(false);
      return;
    }
    setMsg("Tersimpan ✓");
    setS({ amount: "", method: "cash", date: today, kind: s.kind });
    setLoading(false);
    document.dispatchEvent(new CustomEvent("expenses:changed"));
  }

  return (
    <motion.form
      onSubmit={submit}
      className="card space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold">Input Transaksi</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Jenis */}
        <div className="col-span-2 space-y-1">
          <Label className="text-sm">Jenis</Label>
          <div className="flex gap-2">
            {(["expense", "income"] as Kind[]).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setS((v) => ({ ...v, kind: k }))}
                className={[
                  "px-4 py-2 rounded-xl font-medium transition shadow",
                  s.kind === k
                    ? k === "expense"
                      ? "text-white bg-gradient-to-r from-rose-500 to-red-600"
                      : "text-white bg-gradient-to-r from-emerald-400 to-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                ].join(" ")}
              >
                {k === "expense" ? "Pengeluaran" : "Pemasukan"}
              </button>
            ))}
          </div>
        </div>

        {/* Nominal */}
        <div className="space-y-1">
          <Label className="text-sm">Nominal</Label>
          <input
            className="input"
            placeholder="e.g. 25000"
            value={s.amount}
            onChange={(e) => setS((v) => ({ ...v, amount: e.target.value }))}
            required
          />
        </div>

        {/* Tanggal */}
        <div className="space-y-1">
          <Label className="text-sm">Tanggal</Label>
          <input
            type="date"
            className="input"
            value={s.date}
            onChange={(e) => setS((v) => ({ ...v, date: e.target.value }))}
            required
          />
        </div>

        {/* Metode - Select shadcn */}
        <div className="space-y-1">
          <Label className="text-sm">Metode</Label>
          <Select
            value={s.method}
            onValueChange={(val: "cash" | "bank" | "ewallet") =>
              setS((v) => ({ ...v, method: val, wallet: undefined }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih metode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dompet (muncul kalau ewallet) */}
        {s.method === "ewallet" && (
          <div className="space-y-1">
            <Label className="text-sm">Dompet</Label>
            <Select
              value={s.wallet}
              onValueChange={(val: any) => setS((v) => ({ ...v, wallet: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih dompet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OVO">OVO</SelectItem>
                <SelectItem value="DANA">DANA</SelectItem>
                <SelectItem value="GoPay">GoPay</SelectItem>
                <SelectItem value="ShopeePay">ShopeePay</SelectItem>
                <SelectItem value="Other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Catatan */}
        <div className="col-span-2 space-y-1">
          <Label className="text-sm">Catatan (opsional)</Label>
          <input
            className="input"
            placeholder="contoh: makan siang"
            value={s.note || ""}
            onChange={(e) => setS((v) => ({ ...v, note: e.target.value }))}
          />
        </div>
      </div>

      {msg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600"
        >
          {msg}
        </motion.p>
      )}

      <button className="btn w-full" disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity=".25"
                strokeWidth="4"
              />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            Menyimpan…
          </span>
        ) : (
          "Simpan"
        )}
      </button>
    </motion.form>
  );
}
