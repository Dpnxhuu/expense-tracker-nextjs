import Header from "@/components/Header";
import AddExpenseForm from "@/components/AddExpenseForm";
import Statistics from "@/components/Statistics";
import ExpensesList from "@/components/ExpensesList";
import { prisma } from "@/lib/prisma";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { getAuthUser } from "@/lib/getAuthUser";
import ErrorAlert from "@/components/ErrorAlert";



export default async function Home() {
  const userData = await getAuthUser();
  // console.log(userData)

  if (!userData) {
  return <ErrorAlert message="Session expired, please login again" redirectTo="/login" />;
}

  const allExpense = await prisma.expense.findMany({
  where: { userId: userData?.id },
  select: {
    id: true,
    amount: true,
    category: true,
    description: true,
    expenseDate: true,
  },
});
  const expenses = JSON.parse(JSON.stringify(allExpense));

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
