import { api } from "@/connections";
import { CreateExpenseData } from "@/types/expense";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllExpensesForUser = createAsyncThunk(
	"expense/getAll",
	async (_, thunkApi) => {
		try {
			const res = await api.expense.getAllExpensesForUser();
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const createExpense = createAsyncThunk(
	"expense/create",
	async (data: CreateExpenseData, thunkApi) => {
		try {
			const res = await api.expense.createExpense(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);
