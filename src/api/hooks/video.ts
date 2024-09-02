import { useQuery } from "@tanstack/react-query";
import { getVideoByGroupVideoId } from "../http-service/video";

export function useVideoStream(groupId: string | null, videoId: string | null) {
  return useQuery({
    queryKey: ["video", groupId, videoId],
    queryFn: () => getVideoByGroupVideoId(videoId!, groupId!),
    enabled: !!groupId && !!videoId,
  });
}
