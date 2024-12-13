import { roundOff, simplifyFraction } from "@/utils";
import { DistributionMethod, distributionMethods } from "./assets";

export const getAmount = (
	value: string | number,
	method: DistributionMethod,
	membersCount: number,
	totalAmount: number
): number => {
	if (method === distributionMethods.equal) {
		return totalAmount / membersCount;
	} else if (method === distributionMethods.percentage) {
		const numValue = value.toString().replace("%", "");
		return (totalAmount * +numValue) / 100;
	} else if (method === distributionMethods.fraction) {
		const [numerator, denominator] = value.toString().split("/");
		return (totalAmount * +numerator) / +denominator;
	} else {
		return +value;
	}
};

export const getFormattedValue = (
	amount: number,
	method: DistributionMethod,
	membersCount: number,
	totalAmount: number
): string | number => {
	if (method === distributionMethods.equal) {
		if (amount === 0) return 0;
		return roundOff(totalAmount / membersCount, 2);
	} else if (method === distributionMethods.percentage) {
		return `${roundOff((amount * 100) / totalAmount, 2)}%`;
	} else if (method === distributionMethods.fraction) {
		return simplifyFraction(`${amount}/${totalAmount}`);
	} else {
		return amount;
	}
};
