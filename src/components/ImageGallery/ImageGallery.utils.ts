import { appConfig } from "@/config/appConfig";
import { IImage } from "@/types";

export const handle_image_by_group = (images: IImage[]) => {
  const result: Array<{
    group_id: number;
    videos: Array<{
      video_id: number;
      keyframes: Array<IImage>;
    }>;
  }> = [];

  const groupMap = new Map<number, Map<number, Array<IImage>>>();

  images.forEach((image) => {
    if (!groupMap.has(image.group_id)) {
      groupMap.set(image.group_id, new Map());
    }

    const videoMap = groupMap.get(image.group_id)!;

    if (!videoMap.has(image.video_id)) {
      videoMap.set(image.video_id, []);
    }

    videoMap.get(image.video_id)!.push(image);
  });

  groupMap.forEach((videoMap, group_id) => {
    const videos: any = [];

    videoMap.forEach((keyframes, video_id) => {
      videos.push({
        video_id,
        keyframes: keyframes.map((image: IImage) => ({
          confidence: image.confidence,
          value: image.value,
          key: image.key,
        })),
      });
    });

    result.push({ group_id, videos });
  });

  return result;
};

export const handle_image_sorted = (
  images: IImage[],
  top: number,
  show_score: boolean
) => {
  if (show_score) {
    return images.slice(0, top);
  }

  return images;
};

export const formatImagePath = (image: string) => {
  const image_path = appConfig.VITE_IMAGE_URL;

  const imageSplitted = image.split("/");
  let group = imageSplitted[0];
  let video = imageSplitted[1];
  let frame = imageSplitted[2];

  group = group.toString().padStart(2, "0");
  video = video.toString().padStart(3, "0");
  frame = frame.toString().padStart(8, "0");

  return image_path + `L${group}/V${video}/${frame}.webp`;
};
