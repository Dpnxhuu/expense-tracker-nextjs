import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./feature/expense/expenseSlice";

export const store = configureStore({
  reducer: {
    expense: expenseReducer,
  },
});