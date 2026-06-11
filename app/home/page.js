import Header from "@/components/Header";
import AddExpenseForm from "@/components/AddExpenseForm";
import Statistics from "@/components/Statistics";
import ExpensesList from "@/components/ExpensesList";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ExpenseProvider} from "@/context/ExpenseContext";

export default async function Home() {
  let userData;
  let expenses; 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) redirect("/login");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    userData = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };

    const [rows] = await db.query("SELECT * FROM expenses WHERE user_id = ?", [
      decoded.userId,
    ]);
    expenses = JSON.parse(JSON.stringify(rows));
  } catch (error) {
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/login");
  }
  throw error;
  return <div>{error.message}</div>
  }

  return (
    <ExpenseProvider>
      <div className="dark-page app-gradient relative min-h-full flex-1 mb-5 overflow-hidden">
        <div className="glow-orb glow-orb-accent -left-32 top-0 h-80 w-80 opacity-60" />
        <div className="glow-orb glow-orb-purple -right-32 top-1/2 h-72 w-72 opacity-50" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Header userData={userData} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <AddExpenseForm />
            </div>
            <div className="lg:col-span-3">
              <Statistics expenses={expenses} />
            </div>
          </div>

          <ExpensesList expenses={expenses} />
        </div>
      </div>
    </ExpenseProvider>
  );
}
