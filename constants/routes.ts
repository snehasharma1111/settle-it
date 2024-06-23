export const routes = Object.freeze({
	ROOT: "/",
	HOME: "/home",
	LOGIN: "/login",
	EXPENSES: "/expenses",
	EXPENSE: "/expenses/:id",
	ONBOARDING: "/login?frame=onboarding",
	ERROR: "/500",
	GROUP: (id: string) => `/group/${id}`,
	GROUP_SUMMARY: (id: string) => `/group/${id}/summary`,
	GROUP_TRANSACTIONS: (id: string) => `/group/${id}/transactions`,
});
