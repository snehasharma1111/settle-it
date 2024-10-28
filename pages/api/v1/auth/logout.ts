import { HTTP } from "@/constants";
import { ApiRequest, ApiResponse } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req: ApiRequest, res: ApiResponse) => {
	res.setHeader(
		"Set-Cookie",
		"token=; HttpOnly; Path=/; Max-Age=-1; SameSite=None; Secure=true; Partitioned=true"
	);
	return res
		.status(HTTP.status.SUCCESS)
		.json({ message: HTTP.message.SUCCESS });
};

export default handler;
