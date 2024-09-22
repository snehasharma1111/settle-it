import { api } from "@/connections";
import { logger } from "@/messages";
import { CreateGroupData, UpdateGroupData } from "@/types/group";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllGroups = createAsyncThunk(
	"group/getAll",
	async (_, thunkApi) => {
		try {
			const res = await api.group.getAllGroups();
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const getGroupDetails = createAsyncThunk(
	"group/getDetails",
	async (id: string, thunkApi) => {
		try {
			const res = await api.group.getGroupDetails(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const createGroup = createAsyncThunk(
	"group/create",
	async (data: CreateGroupData, thunkApi) => {
		try {
			const res = await api.group.createGroup(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const updateGroup = createAsyncThunk(
	"group/update",
	async ({ id, data }: { id: string; data: UpdateGroupData }, thunkApi) => {
		try {
			const res = await api.group.updateGroup(id, data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const deleteGroup = createAsyncThunk(
	"group/delete",
	async (id: string, thunkApi) => {
		try {
			const res = await api.group.deleteGroup(id);
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);
