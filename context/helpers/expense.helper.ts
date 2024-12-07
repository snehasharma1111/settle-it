import { ExpenseApi } from "@/connections";
import { CreateExpenseData, UpdateExpenseData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllExpenses = createAsyncThunk(
	"expense/get",
	async (_, thunkApi) => {
		try {
			const res = await ExpenseApi.getAllUserExpense();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const getAllExpensesForGroup = createAsyncThunk(
	"expense/getAll",
	async (body: { groupId: string }, thunkApi) => {
		try {
			const res = await ExpenseApi.getAllExpensesForGroup(body);
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
			const res = await ExpenseApi.createExpense(data);
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
			const res = await ExpenseApi.updateExpense(body);
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
			const res = await ExpenseApi.deleteExpense(body);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);
