export const paginate = (
	array: any[],
	page_size: number,
	current_page: number
) => {
	return array.slice(
		(current_page - 1) * page_size,
		current_page * page_size
	);
};
