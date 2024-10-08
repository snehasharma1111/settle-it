import { logsControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute({ GET: logsControllers.getAllLogs });

const handler = api.getHandler();

export default handler;
