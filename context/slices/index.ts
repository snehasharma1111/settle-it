import expenseReducer from "./expenses.slice";
import groupReducer from "./group.slice";
import uiReducer from "./ui.slice";
import authReducer from "./user.slice";

export * from "./expenses.slice";
export * from "./group.slice";
export * from "./ui.slice";
export * from "./user.slice";

const reducers = {
	expense: expenseReducer,
	user: authReducer,
	groups: groupReducer,
	ui: uiReducer,
};

export default reducers;
