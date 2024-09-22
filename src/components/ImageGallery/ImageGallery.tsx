import Preact, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "preact/compat";
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
  Typography,
} from "antd";
import "./ImageGallery.scss"; // Import the CSS file
import {
  PlayCircleOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useVideoStream } from "@/api/hooks/video";
import VideoModal from "../VideoModal";
import {
  formatImagePath,
  handle_image_by_group,
  handle_image_sorted,
} from "./ImageGallery.utils";
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import { addHistory, setFilterIndexes } from "@/store/actions";
import { useSearchNearestIndexFromKeyframe } from "@/api/hooks/search";
import Toast from "../Toast";
import { IImage, THistory } from "@/types";

const { Text } = Typography;

export interface IImageGalleryProps {
  images: IImage[];
  showConfidence?: boolean;
  top?: number;
  group: "all" | "video";
  handleImageClick?: (
    index: string,
    value: string,
    mode: "temporal" | "image" | "table"
  ) => void;
}

const renderRank = (rank: number) => {
  return <strong>{rank ? rank.toFixed(0) : "None"}</strong>;
};

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  top = 5,
  showConfidence = false,
  group = "video",
  handleImageClick,
}) => {
  const dispatch = useDispatch();

  const [groupId, setGroupId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [keyframeIndex, setKeyframeIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const filterIndexes = useSelector(
    (state: TAppRootReducer) => state.searchState.filterIndexes
  );
  const mode = useSelector((state: TAppRootReducer) => state.appState.modeTab);
  const temporalSearchEnabled = useSelector(
    (state: TAppRootReducer) => state.appState.temporalSearchEnabled
  );
  const temporalSearch = useSelector(
    (state: TAppRootReducer) => state.searchState.temporalSearch
  );
  const currentSelectedQuestion = useSelector(
    (state: TAppRootReducer) => state.appState.history.selectedQuestion
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

  const {
    data: dataNearestIndex,
    mutate: mutateNearestIndex,
    isSuccess: isGetNearestIndexSuccess,
  } = useSearchNearestIndexFromKeyframe();

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

  useEffect(() => {
    if (isGetNearestIndexSuccess && dataNearestIndex?.data) {
      const { video_id, group_id, frame_id, index, value } =
        dataNearestIndex.data;

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
    const keyframeIndex = parseInt(keyframeClicked.split("/").pop() ?? "0", 10);

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

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveHistory = (range: [number, number], answer?: string) => {
    const history: THistory = {
      range: range, // range of keyframes
      videoId: Number(videoId) || 0,
      groupId: Number(groupId) || 0,
      answer: answer, // Add answer field to state
    };

    if (currentSelectedQuestion) {
      // If validation passes, dispatch the action to add history
      dispatch(addHistory(history, currentSelectedQuestion));
      Toast("Save History", "success");
      return;
    }

    Toast("Please select a question first", "error");
  };

  const isPreviewEnabled = !(temporalSearchEnabled && mode !== "temporal");

  const handleClickFilterIndexesButton = (indexes: number[]) => {
    const newIndex = [...filterIndexes, ...indexes];
    dispatch(setFilterIndexes(newIndex));
    Toast("Added to filter lists oke. Try again", "success");
  };

  const handleClickPlusIndexes = (indexes: number[]) => {
    const newIndex = filterIndexes.filter((item) => !indexes.includes(item));
    dispatch(setFilterIndexes(newIndex));
    Toast("Removed from filter lists oke. Try again", "success");
  };

  const isMarked = useCallback(
    (frames: number[]) => frames.some((frame) => filterIndexes.includes(frame)),
    [filterIndexes]
  );

  const isKeyframeMarked = useMemo(
    () => (keyframe: number) => filterIndexes.includes(keyframe),
    [filterIndexes]
  );

  return (
    <>
      
        <VideoModal
          videoTitle={`Group ${groupId} - Video ${videoId}`}
          isModalVisible={isModalVisible}
          handleModalClose={handleModalClose}
          videoSrc={videoSrc}
          isFetching={isFetching}
          keyframeIndex={keyframeIndex}
          video_id={videoId ?? ""}
          group_id={groupId ?? ""}
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
              key={`collapse video ${group.group_id} ${groupIndex}`}
              style={{ width: "100%" }}
              size="small"
              activeKey={defaultActiveGroupKey}
            >
              <Collapse.Panel
                header={
                  <>
                    <Text>Group {group.group_id}</Text>
                    <Button
                      onClick={() =>
                        handleClickFilterIndexesButton(
                          group.videos
                            .map((video) =>
                              video.keyframes.map((keyframe) => keyframe.key)
                            )
                            .flat()
                        )
                      }
                      type="text"
                      icon={
                        <MinusSquareOutlined
                          style={{
                            cursor: "pointer",
                            color: "red",
                          }}
                        />
                      }
                    />
                  </>
                }
                key={`${group.group_id}-${groupIndex}`}
              >
                {group.videos.map((video, videoIndex) => {
                  const indexes = video?.keyframes.map(
                    (keyframe) => keyframe.key
                  );
                  return (
                    <>
                      <Divider orientation="left">
                        <Text>Video {video.video_id}</Text>
                        {isMarked(indexes) ? (
                          <Button
                            onClick={() => handleClickPlusIndexes(indexes)}
                            type="text"
                            icon={
                              <PlusSquareOutlined
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            }
                          />
                        ) : (
                          <Button
                            onClick={() =>
                              handleClickFilterIndexesButton(indexes)
                            }
                            type="text"
                            icon={
                              <MinusSquareOutlined
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                }}
                              />
                            }
                          />
                        )}
                      </Divider>
                      <Row
                        gutter={[16, 16]}
                        key={`row video ${video.video_id} ${videoIndex} ${group.group_id}`}
                      >
                        {video.keyframes.map((keyframe, _) => (
                          <Col
                            key={`col video ${video.video_id} ${group.group_id} ${keyframe.key}`}
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
                                    keyframe.key.toString()
                                  )
                                )}
                                  ? "selected"
                                  : ""
                              }`}
                                onClick={() =>
                                  handleImageClick &&
                                  handleImageClick(
                                    keyframe.key.toString(),
                                    keyframe.value,
                                    mode
                                  )
                                }
                              >
                                {/* @ts-ignore */}
                                <Image
                                  preview={isPreviewEnabled}
                                  src={formatImagePath(keyframe.value)}
                                />
                              </div>
                            </Tooltip>
                            <Flex justify="center" align="center">
                              <Text strong>{keyframe.confidence}</Text>
                              <Divider type="vertical"></Divider>
                              <p
                                style={
                                  isKeyframeMarked(keyframe.key)
                                    ? {
                                        color: "red",
                                        textDecoration: "line-through",
                                      }
                                    : {}
                                }
                              >
                                {keyframe.value.split("/").pop()}
                              </p>
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
                                    handleImageClick &&
                                    handleImageClick(
                                      keyframe?.index?.toString() ?? "",
                                      `${keyframe.groupId}/${keyframe.videoId}/${keyframe.keyframe}`,
                                      mode
                                    )
                                  }
                                >
                                  {/* @ts-ignore */}
                                  <Image
                                    preview={isPreviewEnabled}
                                    src={formatImagePath(keyframe.image ?? "")}
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
                  );
                })}
              </Collapse.Panel>
            </Collapse>
          ))}
      </Row>
    </>
  );
};

export default ImageGallery;
