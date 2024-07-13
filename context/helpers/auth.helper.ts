import { api } from "@/connections";
import logger from "@/log";
import apiUtils from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAuthenticatedUser = createAsyncThunk(
	"auth/fetchAuthenticatedUser",
	async (_, thunkApi) => {
		try {
			const res = await apiUtils.auth.verifyUserIfLoggedIn();
			return Promise.resolve(res.data);
		} catch (error: any) {
			logger.error(error);
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
	try {
		await api.auth.logout();
		return Promise.resolve();
	} catch (error: any) {
		logger.error(error);
		return Promise.reject(error.message);
	}
});
