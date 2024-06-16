export const routes = Object.freeze({
	ROOT: "/",
	HOME: "/home",
	LOGIN: "/login",
	EXPENSES: "/expenses",
	EXPENSE: "/expenses/:id",
	ONBOARDING: "/onboarding",
	ERROR: "/500",
	GROUP: (id: string) => `/group/${id}`,
});
