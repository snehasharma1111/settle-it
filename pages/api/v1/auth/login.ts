import { http } from "@/connections";
import { ApiRequest, ApiResponse } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const response = await http.post("/auth/login", req.body, {
			headers: req.headers,
		});
		const token = response.headers["x-auth-token"];
		res.setHeader(
			"Set-Cookie",
			`token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60 * 1000}; SameSite=None; Secure=true; Partitioned=true`
		);
		return res.status(response.status).json(response.data);
	} catch (error: any) {
		return res.status(error.response.status).json(error.response.data);
	}
};

export default handler;
