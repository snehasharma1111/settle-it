export const safeValidation = <U extends Array<any> = []>(
	validate: (..._: U) => boolean,
	...args: U
) => {
	try {
		validate(...args);
		return true;
	} catch {
		return false;
	}
};
