import { logsControllers } from "@/controllers";
import { ApiWrapper } from "@/helpers";

const api = new ApiWrapper({ POST: logsControllers.log });

const handler = api.getHandler();

export default handler;
