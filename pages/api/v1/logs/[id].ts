import { logsControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper({ GET: logsControllers.getLogFile });

const handler = api.getHandler();

export default handler;
