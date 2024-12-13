import { AuthApi } from "@/connections";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAuthenticatedUser = createAsyncThunk(
	"auth/fetchAuthenticatedUser",
	async (_, thunkApi) => {
		try {
			const res = await AuthApi.verifyUserIfLoggedIn();
			return Promise.resolve(res.data);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
	try {
		await AuthApi.logout();
		return Promise.resolve();
	} catch (error: any) {
		return Promise.reject(error.message);
	}
});
