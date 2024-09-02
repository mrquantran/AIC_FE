import { TModelSearch } from "@/types/apis/search";

type Video = {
  video_id: number;
  keyframes: number[];
};

type Group = {
  group_id: number;
  videos: Video[];
};

type GroupMap = {
  model: TModelSearch;
  value: any;
};

// Function to convert input array to desired format
export function convertToSearchBodyTemporal(inputArray: string[]): GroupMap {
  const groupMap: { [key: number]: Group } = {};

  inputArray.forEach((item) => {
    const [groupStr, videoStr, keyframeStr] = item.split("/");
    const group_id = parseInt(groupStr);
    const video_id = parseInt(videoStr);
    const keyframe_id = parseInt(keyframeStr);

    // Check if group exists in map
    if (!groupMap[group_id]) {
      groupMap[group_id] = {
        group_id,
        videos: [],
      };
    }

    // Find the video within the group
    let video = groupMap[group_id].videos.find((v) => v.video_id === video_id);
    if (!video) {
      video = {
        video_id,
        keyframes: [],
      };
      groupMap[group_id].videos.push(video);
    }

    // Add the keyframe to the video
    video.keyframes.push(keyframe_id);
  });

  return {
    model: "Temporal",
    value: Object.values(groupMap),
  };
}
