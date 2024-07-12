import { IUser } from "./user";

type ServerSideProps<T = any> = {
	props: T;
};

type ServerSideRedirect = {
	redirect: {
		destination: string;
		permanent: boolean;
	};
};

export type ServerSideResult<T = any> =
	| ServerSideProps<T | { error: string }>
	| ServerSideRedirect;

export type ServerSideAuthMiddleware = <
	T extends ServerSideResult,
	U extends ServerSideResult,
	V extends ServerSideResult,
>(
	_: any,
	__: {
		onLoggedInAndOnboarded: (_: IUser, __?: any) => T | Promise<T>;
		onLoggedInAndNotOnboarded: (_: IUser, __?: any) => U | Promise<U>;
		onLoggedOut: () => V;
	}
) => Promise<T | U | V>;

export type ServerSideAdminMiddleware = <
	T extends ServerSideResult,
	U extends ServerSideResult,
	V extends ServerSideResult,
>(
	_: any,
	__: {
		onAdmin: (_: IUser, __?: any) => T | Promise<T>;
		onNonAdmin: (_: IUser, __?: any) => U | Promise<U>;
		onLoggedOut: () => V;
	}
) => Promise<T | U | V>;
