export const routes = Object.freeze({
	ROOT: "/",
	HOME: "/home",
	LOGIN: "/login",
	EXPENSES: "/expenses",
	EXPENSE: "/expenses/:id",
	ONBOARDING: "/onboarding",
	GROUP: (id: string) => `/group/${id}`,
});
