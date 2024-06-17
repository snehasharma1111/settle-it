import { useDispatch, useSelector } from "react-redux";
import {
	userSelector,
	userSlice,
	groupSelector,
	groupSlice,
} from "@/context/slices";
import * as allHelpers from "@/context/helpers";

const useStore = () => {
	const dispatch = useDispatch<any>();

	const user = useSelector(userSelector);
	const groups = useSelector(groupSelector);

	return {
		// dispatch takes an action object and sends it to the store
		dispatch,
		// user and skills: state values
		user,
		groups,
		// actions
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
