import { handle_image_by_group } from "@/components/ImageGallery/ImageGallery.utils";
import type { TreeDataNode } from "antd";
import {
  FolderOutlined,
  YoutubeOutlined,
  NumberOutlined,
} from "@ant-design/icons";

type TSearchResults = {
  data: TResultItem[];
  total: number;
};

type TResultItem = {
  value: string;
  confidence: number;
  video_id: number;
  group_id: number;
};

export const mapSearchResultsToTree = (
  searchResults: TSearchResults
): TreeDataNode[] => {
  const { data } = searchResults;

  // @ts-ignore
  const groupResults = handle_image_by_group(data);

  const treeData = groupResults.map((group, groupIndex) => {
    const groupKey = `Group ${group.group_id}-${groupIndex}`;
    return {
      key: groupKey,
      selectable: false,
      title: `Group ${group.group_id}`,
      icon: FolderOutlined,
      children: group.videos.map((video, videoIndex) => {
        const videoKey = `Group ${group.group_id} Video ${video.video_id}-${videoIndex}`;
        return {
          key: videoKey,
          title: `Video ${video.video_id}`,
          icon: YoutubeOutlined,
          selectable: false,
          children: video.keyframes.map((keyframe, keyframeIndex) => {
            const keyframeKey = `Keyframe ${keyframe.value}-${keyframeIndex}`;
            return {
              key: keyframeKey,
              icon: NumberOutlined,
              selectable: false,
              title: `${keyframe.value.split("/").pop()}`,
            };
          }),
        };
      }),
    };
  });

  return treeData;
};
