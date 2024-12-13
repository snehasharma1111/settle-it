import { IUser } from "@/types";
import { getEnumeration } from "@/utils";

export type DistributionMethod = "equal" | "percentage" | "fraction" | "custom";
export type ExpenseUser = IUser & {
	selected: boolean;
	amount: number;
	value: number | string;
};

export const distributionMethods = getEnumeration<DistributionMethod>([
	"equal",
	"percentage",
	"fraction",
	"custom",
]);
