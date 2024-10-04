import { logsControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler({ GET: logsControllers.getAllLogs });

const handler = api.getHandler();

export default handler;
