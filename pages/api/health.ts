import { apiMethods, dbUri, HTTP } from "@/constants";
import { DatabaseManager } from "@/db";
import { ServerController } from "@/controllers";
import { ApiFailure } from "@/server";
import { ApiRequest, ApiResponse } from "@/types";

const handler = async (req: ApiRequest, res: ApiResponse) => {
	const dbContainer = DatabaseManager.createContainer(dbUri);
	await dbContainer.db.connect().catch(() => {});
	if (req.method === apiMethods.GET) {
		return ServerController.health(dbContainer.db)(req, res);
	} else {
		return new ApiFailure(res)
			.status(HTTP.status.METHOD_NOT_ALLOWED)
			.headers("Allow", [apiMethods.GET])
			.message(`Method ${req.method} Not Allowed`)
			.send();
	}
};

export default handler;
