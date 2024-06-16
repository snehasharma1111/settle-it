import groupReducer from "./group.slice";
import authReducer from "./user.slice";

const reducers = {
	user: authReducer,
	group: groupReducer,
};

export default reducers;

import { userSelector, userSlice } from "./user.slice";
import { groupSelector, groupSlice } from "./group.slice";
export { userSelector, userSlice, groupSelector, groupSlice };
