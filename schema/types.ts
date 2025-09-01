import { Model, T_USER_STATUS } from "@/types";

/**
 * AuthMapping model
 * @param {string} identifier - Identifier of the user
 * @param {string} providerId - Provider id of auth service
 * @param {string} providerName - Provider name of auth service
 * @param {Object} misc - Misc data of the user (optional)
 * @param {string} user - User id (References User model) (optional - for non-onboarded users)
 */
export type AuthMapping = Model<{
	identifier: string;
	providerId: string;
	providerName: string;
	misc?: any;
	user: string | null;
}>;

/**
 * User model
 * @param {string} name - Name of the user (optional - defaults to email prefix)
 * @param {string} email - Email of the user
 * @param {string} role - Role of the user - ADMIN | MEMBER | GUEST
 * @param {string} phone - Phone number of the user (optional)
 * @param {string} avatar - Avatar of the user (optional)
 * @param {string} status - Status of the user (Joined, Invited)
 * @param {string} invitedBy - Id of the user who invited the user (References User model) (optional - for invited users)
 */
export type User = Model<{
	name?: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: T_USER_STATUS;
	invitedBy?: string;
}>;
