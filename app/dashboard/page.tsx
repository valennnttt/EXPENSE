import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExpenseForm from "@/app/components/ExpenseForm";
import ExpenseTable from "@/app/components/ExpenseTable";
import Stats from "@/app/components/Stats";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ringkasan Keuangan</h1>
        <form action="/api/auth/logout" method="post">
          <button className="btn" formMethod="post">
            Keluar
          </button>
        </form>
      </div>

      <Stats />

      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseForm />
        <ExpenseTable />
      </div>
    </div>
  );
}
