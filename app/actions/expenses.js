"use server";
import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function addExpense({ amount, category, description, date }) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId: session.user.id,
        amount,
        category,
        description,
        expenseDate: new Date(date),
      },
    });

    if (!newExpense) throw new Error("Expense not added, db error!");

    revalidatePath("/home");

    return { message: "Expense added" };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteExpense(id) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const expense = await prisma.expense.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!expense) throw new Error("Expense not found or not yours!");

    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath("/home");

    return { message: "Expense deleted!" };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateExpense({ id, amount, category, description, date }) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const expense = await prisma.expense.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!expense) throw new Error("Expense not found or not yours!");

    await prisma.expense.update({
      where: { id },
      data: { amount, category, description, expenseDate: new Date(date) },
    });

    revalidatePath("/home");

    return { message: "Edited" };
  } catch (error) {
    throw new Error(error.message);
  }
}