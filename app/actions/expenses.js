"use server"
import { prisma } from '@/lib/prisma';
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers'

export async function addExpense({amount, category, description, date}) {
  try{
      
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token){
        throw new Error("Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const [result] = await db.query(
    //     "INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?,?,?,?,?)",
    //     [decoded.userId, description, amount, category, date]
    // )

    const newExpense = await prisma.expense.create({
      data: {userId: decoded.userId, amount, category, description, expenseDate: new Date(date)}
    })

    if(!newExpense) throw new Error("Expense not added, db error!")

      console.log("Expense date:", newExpense.expenseDate)

    return {message: "Expense added"};

  }catch(error){
    throw new Error(error.message)
  }
}

export async function deleteExpense(id) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if(!token){
        throw new Error("Unauthorized")
    }

 try{
  jwt.verify(token, process.env.JWT_SECRET);
  //  await db.query(
  //   "DELETE FROM expenses where id = ?",[id]
  // )

  await prisma.expense.delete({
    where: {id}
  })
  return {message: "Expense deleted!"}
 }catch(error){
  throw new Error(error.message)
 }

}

export async function updateExpense({id, amount, category, description, date}) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if(!token){
        throw new Error("Unauthorized")
    }

  try{
    jwt.verify(token, process.env.JWT_SECRET);
    // await db.query(
    //   "UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?",
    //   [amount, category, description, date, id]
    // )

    await prisma.expense.update({
      where: {id},
      data: {amount, category, description, expenseDate: new Date(date)}
    })

    return {message: "Edited"}
  }catch(error){
    throw new Error(error.message)
  }
}