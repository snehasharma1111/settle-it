import { logsControllers } from "@/controllers";
import { ApiRouteHandler } from "@/helpers";

const api = new ApiRouteHandler({ POST: logsControllers.log });

const handler = api.getHandler();

export default handler;
