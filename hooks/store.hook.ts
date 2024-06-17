import * as allHelpers from "@/context/helpers";
import {
	expenseSelector,
	expenseSlice,
	groupSelector,
	groupSlice,
	userSelector,
	userSlice,
} from "@/context/slices";
import { useDispatch, useSelector } from "react-redux";

const useStore = () => {
	const dispatch = useDispatch<any>();

	const expenses = useSelector(expenseSelector);
	const user = useSelector(userSelector);
	const groups = useSelector(groupSelector);

	return {
		// dispatch takes an action object and sends it to the store
		dispatch,
		// user and skills: state values
		user,
		expenses,
		groups,
		// actions
		...expenseSlice.actions,
		...userSlice.actions,
		...groupSlice.actions,
		// helpers
		...allHelpers.authHelpers,
		...allHelpers.expenseHelpers,
		...allHelpers.groupHelpers,
		...allHelpers.userHelpers,
	};
};

export default useStore;
