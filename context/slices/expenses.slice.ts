import { expenseHelpers } from "@/context/helpers";
import { ExpenseSlice, IExpense } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ExpenseSlice = [];

export const expenseSlice = createSlice({
	name: "expense",
	initialState,
	reducers: {
		setExpenses: (
			state,
			action: { payload: Array<IExpense>; type: string }
		) => {
			state = action.payload;
			return state;
		},
	},
	extraReducers(builder) {
		builder.addCase(
			expenseHelpers.getAllExpenses.fulfilled,
			(state: ExpenseSlice, action) => {
				state = action.payload;
				return state;
			}
		);
		builder.addCase(
			expenseHelpers.getAllExpensesForGroup.fulfilled,
			(state: ExpenseSlice, action) => {
				state = [...state, ...action.payload];
				return state;
			}
		);
		builder.addCase(
			expenseHelpers.createExpense.fulfilled,
			(state: ExpenseSlice, action) => {
				state = [...state, action.payload];
				return state;
			}
		);
		builder.addCase(
			expenseHelpers.updateExpense.fulfilled,
			(state: ExpenseSlice, action) => {
				state = state.map((expense) => {
					if (expense.id === action.payload.id) {
						return action.payload;
					}
					return expense;
				});
				return state;
			}
		);
		builder.addCase(
			expenseHelpers.removeExpense.fulfilled,
			(state: ExpenseSlice, action) => {
				state = state.filter(
					(expense) => expense.id !== action.payload.id
				);
				return state;
			}
		);
	},
});
export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
export const expenseSelector = (state: { expense: Array<IExpense> }) =>
	state.expense;
