"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Row = {
  id: string;
  amount: number;
  method: "cash" | "bank" | "ewallet";
  wallet?: string;
  note?: string;
  date: string;
  kind: "expense" | "income";
};

export default function ExpenseTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");

  async function load() {
    const res = await fetch("/api/expenses", { cache: "no-store" });
    const json = await res.json();
    setRows(json.items);
  }
  useEffect(() => {
    load();
    const on = () => load();
    document.addEventListener("expenses:changed", on);
    return () => document.removeEventListener("expenses:changed", on);
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (!query) return true;
        return (
          (r.note || "").toLowerCase().includes(query.toLowerCase()) ||
          r.method.includes(query)
        );
      }),
    [rows, query]
  );

  async function remove(id: string) {
    if (!confirm("Hapus entri ini?")) return;
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((v) => v.filter((r) => r.id !== id));
      document.dispatchEvent(new CustomEvent("expenses:changed"));
    }
  }

  return (
    <div className="card overflow-x-auto">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Histori</h2>
        <input
          className="input w-full sm:max-w-[240px]"
          placeholder="Cari catatan/metode"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="max-h-[420px] overflow-auto rounded-lg border">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-left">
            <tr>
              <th className="px-2 py-2 sm:px-3">Tanggal</th>
              <th className="px-2 py-2 sm:px-3">Jenis</th>
              <th className="px-2 py-2 sm:px-3">Nominal</th>
              <th className="px-2 py-2 sm:px-3">Metode</th>
              <th className="px-2 py-2 sm:px-3 hidden sm:table-cell">
                Catatan
              </th>
              <th className="px-2 py-2 sm:px-3"></th>
            </tr>
          </thead>

          <motion.tbody layout>
            <AnimatePresence initial={false}>
              {filtered.map((r) => (
                <motion.tr
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="px-2 py-2 sm:px-3 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 sm:px-3">
                    {r.kind === "expense" ? "Pengeluaran" : "Pemasukan"}
                  </td>
                  <td className="px-2 py-2 sm:px-3 font-medium">
                    Rp {r.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-2 py-2 sm:px-3">
                    {r.method}
                    {r.wallet ? ` • ${r.wallet}` : ""}
                  </td>
                  {/* Catatan: disembunyikan di mobile */}
                  <td className="px-2 py-2 sm:px-3 hidden sm:table-cell max-w-[320px] truncate">
                    {r.note}
                  </td>
                  <td className="px-2 py-2 sm:px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => remove(r.id)}
                      className="text-red-600 hover:underline"
                      aria-label="Hapus entri"
                    >
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))}

              {!filtered.length && (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Belum ada data
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
