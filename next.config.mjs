import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
		dangerouslyAllowSVG: true,
	},
	sassOptions: {
		includePaths: [path.join(process.cwd(), "styles")],
	},
};

export default nextConfig;
