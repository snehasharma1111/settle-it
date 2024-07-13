import { api } from "@/connections";
import logger from "@/log";
import { IUser } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateUser = createAsyncThunk(
	"user/update",
	async (data: Partial<IUser>, thunkApi) => {
		try {
			const res = await api.user.updateUser(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);
