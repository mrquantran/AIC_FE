import { REST_API } from "@/config";
import { HttpService } from "./http-service";

export const getRecordByIndex = async (): Promise<any> => {
    return await HttpService.fetch<any, any>({
        apiConfig: REST_API.GET_BY_INDEX,
        queryParams: {
            index: 1
        }
  });
};
