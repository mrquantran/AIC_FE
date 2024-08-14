import { REST_API } from "@/config";
import { HttpService } from "./http-service";

export const getObjectNames = async (): Promise<any> => {
  return await HttpService.fetch<null, string[]>({
    apiConfig: REST_API.GET_OBJECTS_NAME,
  });
};