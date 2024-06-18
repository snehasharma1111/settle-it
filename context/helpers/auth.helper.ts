import { api } from "@/connections";
import apiUtils from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAuthenticatedUser = createAsyncThunk(
	"auth/fetchAuthenticatedUser",
	async (_, thunkApi) => {
		try {
			const res = await apiUtils.auth.verifyUserIfLoggedIn();
			return Promise.resolve(res.data);
		} catch (error: any) {
			console.error(error);
			return thunkApi.rejectWithValue(error.response.data);
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
	try {
		console.log("helper for logout");
		await api.auth.logout();
		return Promise.resolve();
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
});
