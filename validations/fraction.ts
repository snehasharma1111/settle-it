export const isValidFraction = (value: string) => {
	if (!value.includes("/")) throw new Error("Fraction must contain a /");
	const f = value.split("/");
	if (!(f.length === 2))
		throw new Error("Fraction must contain both numerator and denominator");
	if (isNaN(+f[0])) throw new Error("Numerator must be a number");
	if (isNaN(+f[1])) throw new Error("Denominator must be a number");
	return true;
};
