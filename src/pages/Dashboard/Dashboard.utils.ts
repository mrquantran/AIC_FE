import { handle_image_by_group } from "@/components/ImageGallery/ImageGallery.utils";
import type { TreeDataNode } from "antd";
import {
  FolderOutlined,
  YoutubeOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { IImage } from "@/types";

export interface TSearchResults<T> {
  data: T[];
  total: number;
};

export type TTreeSearch = {
  value: string;
  title: string;
  children: TTreeSearch[];
};

// export const mapFilterListIndextoTreeSearch = (
//   indexes: number[],
//   searchResults: TSearchResults<IImage>
// ): TTreeSearch[] => {
//   const filteredData = searchResults.data.filter((item) =>
//     indexes.includes(item.key)
//   );

//   const groupMap = new Map<number, Map<number, IImage[]>>();

//   // Group the filtered data
//   filteredData.forEach((item) => {
//     if (!groupMap.has(item.group_id)) {
//       groupMap.set(item.group_id, new Map());
//     }
//     const videoMap = groupMap.get(item.group_id)!;
//     if (!videoMap.has(item.video_id)) {
//       videoMap.set(item.video_id, []);
//     }
//     videoMap.get(item.video_id)!.push(item);
//   });

//   // Convert the grouped data to TTreeSearch structure
//   const treeData: TTreeSearch[] = [];

//   groupMap.forEach((videoMap, groupId) => {
//     const groupNode: TTreeSearch = {
//       value: `group${groupId}`,
//       title: `Group ${groupId}`,
//       children: [],
//     };

//     videoMap.forEach((keyframes, videoId) => {
//       const videoNode: TTreeSearch = {
//         value: `group${groupId},video${videoId}`,
//         title: `Video ${videoId}`,
//         children: keyframes.map((keyframe) => ({
//           value: `group${groupId},video${videoId},keyframe${keyframe.value}`,
//           title: `${keyframe.value.split("/").pop()}`,
//           children: [],
//         })),
//       };

//       groupNode.children.push(videoNode);
//     });

//     treeData.push(groupNode);
//   });

//   return treeData;
// };

export const mapSearchResultstoTreeSearch = (
  searchResults: TSearchResults<IImage>,
): TTreeSearch[] => {
  const { data } = searchResults;

  // @ts-ignore
  const groupResults = handle_image_by_group(data);

  const treeData = groupResults.map((group) => {
    const groupKey = `group${group.group_id}`;
    return {
      value: groupKey,
      title: `Group ${group.group_id}`,
      children: group.videos.map((video) => {
        const videoKey = `group${group.group_id},video${video.video_id}`;
        return {
          value: videoKey,
          title: `Video ${video.video_id}`,
          children: video.keyframes.map((keyframe) => {
            const keyframeKey = `group${group.group_id},video${video.video_id},keyframe${keyframe.value}`;
            return {
              value: keyframeKey,
              title: `${keyframe.value.split("/").pop()}`,
            };
          }),
        };
      }),
    };
  });

  // @ts-ignore
  return treeData;
};

export const mapSearchResultsToTree = (
  searchResults: TSearchResults<IImage>
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
