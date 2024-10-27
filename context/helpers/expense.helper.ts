import { api } from "@/connections";
import { CreateExpenseData, UpdateExpenseData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllExpensesForUser = createAsyncThunk(
	"expense/getAll",
	async (body: { groupId: string }, thunkApi) => {
		try {
			const res = await api.expense.getAllExpensesForUser(body);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
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
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const updateExpense = createAsyncThunk(
	"expense/update",
	async (
		body: { groupId: string; expenseId: string; data: UpdateExpenseData },
		thunkApi
	) => {
		try {
			const res = await api.expense.updateExpense(body);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const removeExpense = createAsyncThunk(
	"expense/remove",
	async (body: { groupId: string; expenseId: string }, thunkApi) => {
		try {
			const res = await api.expense.deleteExpense(body);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);
