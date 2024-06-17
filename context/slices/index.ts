import expenseReducer from "./expenses.slice";
import groupReducer from "./group.slice";
import authReducer from "./user.slice";

const reducers = {
	expense: expenseReducer,
	user: authReducer,
	group: groupReducer,
};

export default reducers;

import { expenseSelector, expenseSlice } from "./expenses.slice";
import { groupSelector, groupSlice } from "./group.slice";
import { userSelector, userSlice } from "./user.slice";
export {
	expenseSelector,
	expenseSlice,
	groupSelector,
	groupSlice,
	userSelector,
	userSlice,
};
