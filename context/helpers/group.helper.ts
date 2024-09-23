import { api } from "@/connections";
import { CreateGroupData, UpdateGroupData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllGroups = createAsyncThunk(
	"groups/getAll",
	async (_, thunkApi) => {
		try {
			const res = await api.group.getAllGroups();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const getGroupDetails = createAsyncThunk(
	"groups/getDetails",
	async (id: string, thunkApi) => {
		try {
			const res = await api.group.getGroupDetails(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const createGroup = createAsyncThunk(
	"groups/create",
	async (data: CreateGroupData, thunkApi) => {
		try {
			const res = await api.group.createGroup(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const updateGroup = createAsyncThunk(
	"groups/update",
	async ({ id, data }: { id: string; data: UpdateGroupData }, thunkApi) => {
		try {
			const res = await api.group.updateGroup(id, data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const deleteGroup = createAsyncThunk(
	"groups/delete",
	async (id: string, thunkApi) => {
		try {
			const res = await api.group.deleteGroup(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.message);
		}
	}
);
