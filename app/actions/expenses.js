"use server"
import db from '@/lib/db'
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

    const [result] = await db.query(
        "INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?,?,?,?,?)",
        [decoded.userId, description, amount, category, date]
    )

    if(result.affectedRows === 0) throw new Error("Expense not added, db error!")

    return {message: "Expense added"};

  }catch(error){
    throw new Error(error.message)
  }
}

export async function deleteExpense(id) {
  
 try{
   await db.query(
    "DELETE FROM expenses where id = ?",[id]
  )
  return {message: "Expense deleted!"}
 }catch(error){
  throw new Error(error.message)
 }

}

export async function updateExpense({id, amount, category, description, date}) {
  
  try{
    await db.query(
      "UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?",
      [amount, category, description, date, id]
    )

    return {message: "Edited"}
  }catch(error){
    throw new Error(error.message)
  }
}