import { api } from "@/connections";
import { CreateExpenseData, UpdateExpenseData } from "@/types/expense";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllExpensesForUser = createAsyncThunk(
	"expense/getAll",
	async (_, thunkApi) => {
		try {
			const res = await api.expense.getAllExpensesForUser();
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.message);
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
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const updateExpense = createAsyncThunk(
	"expense/update",
	async ({ id, data }: { id: string; data: UpdateExpenseData }, thunkApi) => {
		try {
			const res = await api.expense.updateExpense(id, data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const removeExpense = createAsyncThunk(
	"expense/remove",
	async (id: string, thunkApi) => {
		try {
			const res = await api.expense.deleteExpense(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);
