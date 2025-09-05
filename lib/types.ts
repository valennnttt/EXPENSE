export type User = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  userId: string;
  amount: number; // positive number
  method: "cash" | "bank" | "ewallet";
  wallet?: "OVO" | "DANA" | "GoPay" | "ShopeePay" | "Other";
  note?: string;
  date: string; // ISO date
  kind: "expense" | "income"; // allow pemasukan/pengeluaran
};

export type DBData = { users: User[]; expenses: Expense[] };
