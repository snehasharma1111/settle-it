import { api } from "@/connections";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAuthenticatedUser = createAsyncThunk(
	"auth/fetchAuthenticatedUser",
	async (_, thunkApi) => {
		try {
			const res = await api.auth.verifyUserIfLoggedIn();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
	try {
		await api.auth.logout();
		return Promise.resolve();
	} catch (error: any) {
		return Promise.reject(error.message);
	}
});
