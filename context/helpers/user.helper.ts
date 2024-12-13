import { UserApi } from "@/connections";
import { IUser } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateUser = createAsyncThunk(
	"user/update",
	async (data: Partial<IUser>, thunkApi) => {
		try {
			const res = await UserApi.updateUser(data);
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);
