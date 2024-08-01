import { REST_API } from "@/config";
import { HttpService } from "./http-service";
import { TSearchKeyframePayload, TSearchParams } from "@/types/apis/search";
import qs from "query-string";

export const getRecordByIndex = async (): Promise<any> => {
    return await HttpService.fetch<any, any>({
        apiConfig: REST_API.GET_BY_INDEX,
        queryParams: {
            index: 1
        }
  });
};

export const searchKeyframes = async (
  payload: TSearchKeyframePayload[],
  queryParams?: TSearchParams
): Promise<any> => {
  const params = queryParams ? qs.stringify(queryParams) : "";
  const url = `${REST_API.SEARCH_KEYFRAMES.uri}${params ? `?${params}` : ""}`;

  return HttpService.post<TSearchKeyframePayload[], any>(url, payload);
};