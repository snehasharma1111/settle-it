import expenseReducer from "./expenses.slice";
import groupReducer from "./group.slice";
import authReducer from "./user.slice";

export * from "./expenses.slice";
export * from "./group.slice";
export * from "./user.slice";

const reducers = {
	expense: expenseReducer,
	user: authReducer,
	groups: groupReducer,
};

export default reducers;
