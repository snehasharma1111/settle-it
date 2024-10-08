import { logsControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute({ GET: logsControllers.getLogFile });

const handler = api.getHandler();

export default handler;
