import { useEffect, useRef, useState } from "preact/hooks";
import { Modal, Spin, Flex, Space, Input, Button, Tooltip } from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface IVideoModalProps {
  isModalVisible: boolean;
  handleModalClose: () => void;
  videoSrc: string | null;
  isFetching: boolean;
  keyframeIndex: number;
  videoTitle: string;
  video_id: string;
  group_id: string;
  handleCaptureKeyframe: (data: {
    keyframe: number;
    image: string | null;
    videoId: string;
    groupId: string;
  }) => void;
}

const VideoModal = ({
  isModalVisible,
  handleModalClose,
  videoSrc,
  isFetching,
  videoTitle,
  handleCaptureKeyframe,
  video_id,
  group_id,
  keyframeIndex = 0,
}: IVideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [playStatus, setPlayStatus] = useState("paused");
  const [currentKeyframe, setCurrentKeyframe] = useState(keyframeIndex);
  const [currentSecond, setCurrentSecond] = useState(0); // Track current time in seconds

  const captureImageFromVideo = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    return canvas.toDataURL("image/png");
  };

  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
        setIsVideoReady(true);
        if (videoRef.current) {
          const startTime = keyframeIndex / 25; // Convert keyframe to seconds
          videoRef.current.currentTime = startTime;
        }
      };

      const handlePlay = () => setPlayStatus("play");
      const handlePause = () => setPlayStatus("pause");

      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          setCurrentKeyframe(Math.floor(currentTime * 25)); // Convert time to keyframe
          setCurrentSecond(currentTime); // Update current second
        }
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.current.addEventListener("play", handlePlay);
      videoRef.current.addEventListener("pause", handlePause);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          videoRef.current.removeEventListener("play", handlePlay);
          videoRef.current.removeEventListener("pause", handlePause);
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [videoSrc, keyframeIndex]);

  useEffect(() => {
    // Reset video state when videoSrc changes
    setIsVideoReady(false);
    if (videoRef.current) {
      videoRef.current.load(); // Force reload of video
    }
  }, [videoSrc]);

  const handleVideoClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoReady(false);
    handleModalClose();
  };

  // const handleBackToKeyframe = () => {
  //   if (videoRef.current) {
  //     const startTime = keyframeIndex / 25; // Convert keyframe to seconds
  //     videoRef.current.currentTime = startTime;
  //   }
  // };

  const handlePreviousKeyframe = () => {
    if (videoRef.current) {
      const previousKeyframe = Math.max(currentKeyframe - 1, 0);
      const newTime = previousKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(previousKeyframe);
    }
  };

  const handleNextKeyframe = () => {
    if (videoRef.current) {
      const nextKeyframe = currentKeyframe + 1;
      const newTime = nextKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(nextKeyframe);
    }
  };

  const handleKeyframeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const newKeyframe = parseInt(e.target.value, 10);
    if (!isNaN(newKeyframe) && newKeyframe >= 0 && videoRef.current) {
      const newTime = newKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(newKeyframe);
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      width="65%"
      title={videoTitle}
      onCancel={handleVideoClose}
    >
      <Flex vertical justify="center" align="center">
        <Flex width="100%" justify="center" align="center">
          <video
            ref={videoRef}
            controls
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
            }}
            poster="/api/placeholder/640/360"
          >
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
          </video>
          {(isFetching || !isVideoReady) && (
            <Flex
              justify="center"
              align="center"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Spin size="large" />
            </Flex>
          )}
        </Flex>
        <Flex
          align="center"
          justify="space-between"
          style={{
            marginTop: "1rem",
            width: "100%",
          }}
        >
          <Space.Compact block>
            <Tooltip title="Play Status" placement="bottom">
              <Input style={{ width: "15%" }} value={playStatus} readOnly />
            </Tooltip>
            <Button
              onClick={handlePreviousKeyframe}
              icon={<CaretLeftOutlined />}
            />
            <Tooltip title="Keyframe Index" placement="bottom">
              <Input
                style={{ width: "12%" }}
                value={currentKeyframe}
                onChange={handleKeyframeChange}
              />
            </Tooltip>
            <Button
              onClick={handleNextKeyframe}
              icon={<CaretRightOutlined />}
            />

            <Tooltip title="Current Time (s)" placement="bottom">
              <Input
                style={{ width: "16%" }}
                prefix={<ClockCircleOutlined />}
                // Display time in format mintues:seconds, formatted to 2 decimal places
                value={currentSecond.toFixed(1)}
                readOnly
              />
            </Tooltip>
          </Space.Compact>
          <Flex gap={8} align="center">
            {/* <Button type="dashed" onClick={handleBackToKeyframe}>
              Back to Start
            </Button> */}
            <Button
              onClick={() =>
                handleCaptureKeyframe({
                  keyframe: currentKeyframe,
                  image: videoRef.current
                    ? captureImageFromVideo(videoRef.current)
                    : null,
                  videoId: video_id,
                  groupId: group_id,
                })
              }
            >
              Capture Keyframe
            </Button>
            <Button type="primary">Save History</Button>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default VideoModal;
