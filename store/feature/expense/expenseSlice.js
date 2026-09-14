import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    editData: null,
  },
  reducers: {
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
  },
});

export const { setEditData } = expenseSlice.actions;
export default expenseSlice.reducer;