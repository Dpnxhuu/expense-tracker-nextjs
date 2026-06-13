"use client"
import { useContext, createContext, useState } from "react";

const ExpenseContext = createContext();

export function ExpenseProvider({children}){

    const [editData, setEditData] = useState(null)
    const [loading, setLoading] = useState(false);

    return (
        <ExpenseContext.Provider value={{editData, setEditData , loading, setLoading}}>
            {children}
        </ExpenseContext.Provider>
    )
}

export function useExpense(){
    return useContext(ExpenseContext);
}
