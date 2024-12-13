import { GroupApi } from "@/connections";
import { CreateGroupData, UpdateGroupData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllGroups = createAsyncThunk(
	"groups/getAll",
	async (_, thunkApi) => {
		try {
			const res = await GroupApi.getAllGroups();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const getGroupDetails = createAsyncThunk(
	"groups/getDetails",
	async (id: string, thunkApi) => {
		try {
			const res = await GroupApi.getGroupDetails(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const createGroup = createAsyncThunk(
	"groups/create",
	async (data: CreateGroupData, thunkApi) => {
		try {
			const res = await GroupApi.createGroup(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const updateGroup = createAsyncThunk(
	"groups/update",
	async ({ id, data }: { id: string; data: UpdateGroupData }, thunkApi) => {
		try {
			const res = await GroupApi.updateGroup(id, data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const deleteGroup = createAsyncThunk(
	"groups/delete",
	async (id: string, thunkApi) => {
		try {
			const res = await GroupApi.deleteGroup(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);
