import { logsControllers } from "@/controllers";
import { ApiRoute } from "@/server";

const api = new ApiRoute({ POST: logsControllers.log });

const handler = api.getHandler();

export default handler;
