import Preact, { useEffect, useMemo, useState } from "preact/compat";
import {
  Col,
  Collapse,
  Divider,
  Empty,
  Row,
  Image,
  Button,
  Flex,
  Tooltip,
} from "antd";
import "./ImageGallery.scss"; // Import the CSS file
import { PlayCircleOutlined } from "@ant-design/icons";
import { useVideoStream } from "@/api/hooks/video";
import VideoModal from "../VideoModal";
import { IImageGalleryProps } from "./ImageGallery.d";
import {
  formatImagePath,
  handle_image_by_group,
  handle_image_sorted,
} from "./ImageGallery.utils";
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import { addHistory, setSelectedTemporalQuery } from "@/store/actions";
import { useSearchNearestIndexFromKeyframe } from "@/api/hooks/search";
import Toast from "../Toast";
import { THistory } from "@/store/reducers/app.reducers";

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  top = 5,
  showConfidence = false,
  group = "video",
}) => {
  const dispatch = useDispatch();
  const mode = useSelector((state: TAppRootReducer) => state.appState.modeTab);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const [keyframeIndex, setKeyframeIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const temporalSearchEnabled = useSelector(
    (state: TAppRootReducer) => state.appState.temporalSearchEnabled
  );
  const temporalSearch = useSelector(
    (state: TAppRootReducer) => state.searchState.temporalSearch
  );
  const historyState = useSelector(
    (state: TAppRootReducer) => state.appState.history
  );
  const [captureKeyframe, setCaptureKeyframe] = useState<
    {
      keyframe: number;
      image: string | null;
      videoId: string;
      groupId: string;
      index?: number; // Add key field to state
    }[]
  >([]);
  const { data, refetch, isFetching, isSuccess } = useVideoStream(
    groupId,
    videoId
  );

  const isIncludeTemporalSearch = (value: string) => {
    return mode !== "temporal" && temporalSearch.includes(value)
      ? "selected"
      : "";
  };

  if (images.length === 0) {
    return <Empty />;
  }

  const defaultActiveGroupKey = useMemo(
    () =>
      handle_image_by_group(images).map(
        (group, groupIndex) => `${group.group_id}-${groupIndex}`
      ),
    [images]
  );

  const imageGroup = useMemo(
    () => (group === "video" ? handle_image_by_group(images) : []),
    [images, group]
  );

  const image_sorted = useMemo(
    () =>
      group === "all" ? handle_image_sorted(images, top, showConfidence) : [],
    [images, group, top, showConfidence]
  );

  useEffect(() => {
    if (isSuccess) {
      Toast(
        `Load Video ${videoId} Group ${groupId}`,
        "success",
        "bottom-right"
      );
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (groupId && videoId) {
      refetch(); // Only fetch if either videoId or groupId is different
    }
  }, [groupId, videoId]);

  const formatTemporalSearch = (keyframe: string, index: string) => {
    const imageSplitted = keyframe?.split("/");
    let group = imageSplitted[0];
    let video = imageSplitted[1];
    return `${group}/${video}/${index}`;
  };

  const renderRank = (rank: number) => {
    return <strong>{rank ? rank.toFixed(0) : "None"}</strong>;
  };

  useEffect(() => {
    if (data) {
      const videoURL = URL.createObjectURL(data);
      setVideoSrc(videoURL);
    }

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [data]);

  const {
    data: dataNearestIndex,
    mutate: mutateNearestIndex,
    isSuccess: isGetNearestIndexSuccess,
  } = useSearchNearestIndexFromKeyframe();

  useEffect(() => {
    if (isGetNearestIndexSuccess && dataNearestIndex?.data) {
      const { video_id, group_id, frame_id, index, value } =
        dataNearestIndex?.data;

      setCaptureKeyframe((prev) => [
        ...prev,
        {
          keyframe: frame_id,
          image: value,
          videoId: video_id.toString(),
          groupId: group_id.toString(),
          index: index,
        },
      ]);

      // Optionally close modal or any other side effect
      Toast("Get Nearest Index Success", "success");
    }
  }, [isGetNearestIndexSuccess, dataNearestIndex]);

  const handleCaptureKeyframe = ({
    keyframe,
    videoId,
    groupId,
  }: {
    keyframe: number;
    image: string | null;
    groupId: string;
    videoId: string;
  }) => {
    // Trigger mutation to fetch nearest index
    mutateNearestIndex({
      video_id: parseInt(videoId),
      group_id: parseInt(groupId),
      keyframe_id: keyframe,
    });
  };

  const handlePlayVideo = (
    videoIdClicked: string,
    groupIdClicked: string,
    keyframeClicked: string
  ) => {
    const keyframeIndex = parseInt(keyframeClicked.split("/").pop() || "0", 10);

    if (videoId === videoIdClicked && groupId === groupIdClicked) {
      // Only update the keyframeIndex and open the modal
      setKeyframeIndex(keyframeIndex);
      setIsModalVisible(true);
    } else {
      // Fetch the new video stream only when videoId or groupId changes
      setGroupId(groupIdClicked);
      setVideoId(videoIdClicked);
      setKeyframeIndex(keyframeIndex);
      setIsModalVisible(true);
      refetch(); // Trigger the video stream refetch
    }
  };

  const handleImageClick = (index: string, value: string) => {
    const imageSplitted = value.split("/");
    let group = imageSplitted[0];
    let video = imageSplitted[1];

    const temporalQuery = `${group}/${video}/${index}`;

    if (!temporalSearchEnabled || mode === "temporal") {
      return;
    }
    dispatch(setSelectedTemporalQuery(temporalQuery));
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveHistory = (range: [number, number]) => {
    const history: THistory = {
      range: range, // range of keyframes
      videoId: Number(videoId) || 0,
      groupId: Number(groupId) || 0,
    };

    // // Validation: Check total columns and no duplicates
    // const totalFrames = historyState.reduce((sum, item) => {
    //   return sum + (item.range[1] - item.range[0] + 1); // Calculate total frames from each range
    // }, 0);

    // // Add the new history range frames to the total
    // const newRangeFrames = range[1] - range[0] + 1;
    // if (totalFrames + newRangeFrames > 100) {
    //   Toast("Total frame count exceeds 100, unable to save.", "error");
    //   return; // Exit if the total exceeds 100
    // }

    // // Check for duplicates
    // const isDuplicate = historyState.some(
    //   (item) =>
    //     (item.videoId === history.videoId &&
    //       item.groupId === history.groupId &&
    //       //  check range is item not overlap with any range in history
    //       history.range[0] >= item.range[0] &&
    //       history.range[0] <= item.range[1]) ||
    //     (history.range[1] >= item.range[0] &&
    //       history.range[1] <= item.range[1]) ||
    //     (item.range[0] >= history.range[0] &&
    //       item.range[0] <= history.range[1]) ||
    //     (item.range[1] >= history.range[0] && item.range[1] <= history.range[1])
    // );

    // if (isDuplicate) {
    //   Toast("Duplicate entry detected, unable to save.", "error");
    //   return; // Exit if a duplicate is found
    // }

    // If validation passes, dispatch the action to add history
    dispatch(addHistory(history));
    Toast("Save History", "success");
  };

  return (
    <>
      <VideoModal
        videoTitle={`Group ${groupId} - Video ${videoId}`}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        videoSrc={videoSrc}
        isFetching={isFetching}
        keyframeIndex={keyframeIndex}
        video_id={videoId || ""}
        group_id={groupId || ""}
        handleCaptureKeyframe={handleCaptureKeyframe}
        handleSaveHistory={handleSaveHistory}
      />
      <Row gutter={[16, 16]}>
        {group === "all" &&
          image_sorted?.map((image) => (
            <Col key={image.value} xs={24} sm={12} md={8} lg={6} xl={4}>
              {/* @ts-ignore */}
              <Image src={formatImagePath(image.value)} />
              <Flex justify="center" align="center">
                {showConfidence && renderRank(image.confidence)}
                <Divider type="vertical"></Divider>
                {`L${image.group_id}`}
                <Divider type="vertical"></Divider>
                {`V${image.video_id}`}
              </Flex>
            </Col>
          ))}
        {group === "video" &&
          imageGroup?.map((group, groupIndex) => (
            <Collapse
              key={groupIndex}
              style={{ width: "100%" }}
              size="small"
              activeKey={defaultActiveGroupKey}
            >
              <Collapse.Panel
                header={`Group ${group.group_id}`}
                key={`${group.group_id}-${groupIndex}`}
              >
                {group.videos.map((video, videoIndex) => (
                  <>
                    <Divider orientation="left">{`Video ${video.video_id}`}</Divider>
                    <Row gutter={[16, 16]} key={videoIndex}>
                      {video.keyframes.map((keyframe, keyframeIndex) => (
                        <Col
                          key={keyframeIndex}
                          xs={24}
                          sm={12}
                          md={8}
                          lg={6}
                          xl={4}
                        >
                          <Tooltip
                            title={`${keyframe.key}`}
                            placement="topLeft"
                          >
                            <div
                              className={`image-wrapper ${isIncludeTemporalSearch(
                                formatTemporalSearch(
                                  keyframe.value,
                                  keyframe.key
                                )
                              )}
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                handleImageClick(keyframe.key, keyframe.value)
                              }
                            >
                              {/* @ts-ignore */}
                              <Image
                                preview={
                                  temporalSearchEnabled && mode !== "temporal"
                                    ? false
                                    : true
                                }
                                src={formatImagePath(keyframe.value)}
                              />
                            </div>
                          </Tooltip>
                          <Flex justify="center" align="center">
                            {renderRank(keyframe.confidence)}
                            <Divider type="vertical"></Divider>
                            {keyframe.value.split("/").pop()}
                            {/* <Divider type="vertical"></Divider>
                            {keyframe.key} */}
                            <Divider type="vertical"></Divider>
                            <Button
                              type="primary"
                              size="small"
                              // shape="circle"
                              onClick={() =>
                                handlePlayVideo(
                                  video.video_id.toString(),
                                  group.group_id.toString(),
                                  keyframe.value
                                )
                              }
                              icon={<PlayCircleOutlined />}
                            />
                          </Flex>
                        </Col>
                      ))}

                      {captureKeyframe.map((keyframe, keyframeIndex) => {
                        if (
                          keyframe.groupId === group.group_id.toString() &&
                          keyframe.videoId === video.video_id.toString()
                        ) {
                          return (
                            <Col
                              key={keyframeIndex}
                              xs={24}
                              sm={12}
                              md={8}
                              lg={6}
                              xl={4}
                            >
                              <div
                                className={`image-wrapper ${isIncludeTemporalSearch(
                                  `${keyframe.groupId}/${keyframe.videoId}/${keyframe?.index}`
                                )}`}
                                onClick={() =>
                                  handleImageClick(
                                    keyframe?.index?.toString() || "",
                                    `${keyframe.groupId}/${keyframe.videoId}/${keyframe.keyframe}`
                                  )
                                }
                              >
                                {/* @ts-ignore */}
                                <Image
                                  preview={
                                    temporalSearchEnabled && mode !== "temporal"
                                      ? false
                                      : true
                                  }
                                  src={formatImagePath(keyframe.image || "")}
                                />
                              </div>
                              <Flex justify="center" align="center">
                                {renderRank(0)}
                                <Divider type="vertical"></Divider>
                                {keyframe.keyframe}
                                <Divider type="vertical"></Divider>
                                <Button
                                  type="primary"
                                  size="small"
                                  // shape="circle"
                                  onClick={() =>
                                    handlePlayVideo(
                                      video.video_id.toString(),
                                      group.group_id.toString(),
                                      keyframe.keyframe.toString()
                                    )
                                  }
                                  icon={<PlayCircleOutlined />}
                                />
                              </Flex>
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  </>
                ))}
              </Collapse.Panel>
            </Collapse>
          ))}
      </Row>
    </>
  );
};

export default ImageGallery;
