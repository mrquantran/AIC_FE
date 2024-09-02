import Preact, { useEffect, useMemo, useState } from "preact/compat";
import { Col, Collapse, Divider, Empty, Row, Image, Button, Flex } from "antd";
import { appConfig } from "@/config/appConfig";
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
import { useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  top = 5,
  showConfidence = false,
  group = "video",
}) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set()); // State to manage selected images
  const [groupId, setGroupId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [keyframeIndex, setKeyframeIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const settings = useSelector(
    (state: TAppRootReducer) => state.appState.settings
  );
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

  const image_group = useMemo(
    () => (group === "video" ? handle_image_by_group(images) : []),
    [images, group]
  );

  const image_sorted = useMemo(
    () =>
      group === "all" ? handle_image_sorted(images, top, showConfidence) : [],
    [images, group, top, showConfidence]
  );

  useEffect(() => {
    if (groupId && videoId && !isFetching) {
      refetch();
    }
  }, [groupId, videoId]);

  const handleImageClick = (value: string) => {
    if (!settings.temporalSearch) {
      return;
    }

    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = new Set(prevSelectedImages);
      if (newSelectedImages.has(value)) {
        newSelectedImages.delete(value); // Deselect if already selected
      } else {
        newSelectedImages.add(value); // Add to selected images
      }
      return newSelectedImages;
    });
  };

  const { data, refetch, isFetching } = useVideoStream(groupId, videoId);

  const handlePlayVideo = (
    videoId: string,
    groupId: string,
    keyframe: string
  ) => {
    const keyframeIndex = parseInt(keyframe.split("/").pop() || "0", 10);

    setGroupId(groupId);
    setVideoId(videoId);
    setKeyframeIndex(keyframeIndex);
    setIsModalVisible(true);
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

  const handleModalClose = () => {
    setIsModalVisible(false);
    setVideoSrc(null);
    setGroupId(null);
    setVideoId(null);
    setKeyframeIndex(0);
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
      />
      <Row gutter={[16, 16]}>
        {group === "all" &&
          image_sorted?.map((image) => (
            <Col key={image.value} xs={24} sm={12} md={8} lg={6} xl={4}>
              {/* @ts-ignore */}
              <Image width={200} src={formatImagePath(image.value)} />
              {showConfidence && renderRank(image.confidence)}
            </Col>
          ))}
        {group === "video" &&
          image_group?.map((group, groupIndex) => (
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
                          <div
                            className={`image-wrapper ${
                              selectedImages.has(keyframe.value)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleImageClick(keyframe.value)}
                          >
                            {/* @ts-ignore */}
                            <Image
                              preview={false}
                              src={formatImagePath(keyframe.value)}
                            />
                          </div>
                          <Flex justify="center" align="center">
                            {renderRank(keyframe.confidence)}
                            <Divider type="vertical"></Divider>
                            {keyframe.value.split("/").pop()}
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
