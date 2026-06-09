"use client"
import { useContext, createContext, useState } from "react";

const ExpenseContext = createContext();

export function ExpenseProvider({children}){

    const [editData, setEditData] = useState(null)

    return (
        <ExpenseContext.Provider value={{editData, setEditData}}>
            {children}
        </ExpenseContext.Provider>
    )
}

export function useExpense(){
    return useContext(ExpenseContext);
}