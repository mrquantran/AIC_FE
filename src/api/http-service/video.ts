import { REST_API } from "@/config";
import { HttpService } from "./http-service";

export const getVideoByGroupVideoId = async (
  videoId: string,
  groupId: string
): Promise<any> => {
  const url = REST_API.GET_VIDEO.uri
    .replace("{{group_id}}", groupId)
    .replace("{{video_id}}", videoId);

  return await HttpService.fetch<any, Blob>({
    apiConfig: {
      uri: url,
      method: "GET",
    },
    configs: {
      responseType: "blob",
    },
  });
};
