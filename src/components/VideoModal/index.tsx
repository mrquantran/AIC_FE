import { useEffect, useRef, useState } from "preact/hooks";
import { Modal, Spin, Flex, Space, Input, Button, Tooltip } from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  ForwardOutlined,
  BackwardOutlined,
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

  // Handle keyframe changes to set the video currentTime properly
  useEffect(() => {
    if (videoRef.current && isModalVisible) {
      const startTime = keyframeIndex / 25; // Convert keyframe to seconds
      videoRef.current.currentTime = startTime;
    }
  }, [keyframeIndex, isModalVisible]);

  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
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
    if (videoRef.current) {
      videoRef.current.load(); // Force reload of video
    }
  }, [videoSrc]);

  const handleVideoClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    handleModalClose();
  };

  const handlePreviousKeyframe = (decrease: number = 1) => {
    if (videoRef.current) {
      const previousKeyframe = Math.max(currentKeyframe - decrease, 0);
      const newTime = previousKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(previousKeyframe);
    }
  };

  const handleNextKeyframe = (increase: number = 1) => {
    if (videoRef.current) {
      const nextKeyframe = currentKeyframe + increase;
      const newTime = nextKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(nextKeyframe);
    }
  };

  const handleKeyframeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyframe = parseInt(e.target.value, 10);
    if (!isNaN(newKeyframe) && newKeyframe >= 0 && videoRef.current) {
      const newTime = newKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(newKeyframe);
    }
  };

  // Add this function to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    console.log("Video source changed:", videoSrc);
  }, [videoSrc]);

  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      width="140vh" // Change width to 90% or a size that fits your needs
      title={videoTitle}
      onCancel={handleVideoClose}
      style={{ top: "5%", left: "auto", right: "auto", margin: "0 auto" }} // Ensure it's centered
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
          >
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
          </video>
          {isFetching && (
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
              <Input style={{ width: "6rem" }} value={playStatus} readOnly />
            </Tooltip>
            <Button
              onClick={() => handlePreviousKeyframe(1)}
              icon={<CaretLeftOutlined />}
            />
            <Button
              onClick={() => handlePreviousKeyframe(2)}
              icon={<BackwardOutlined />}
            />
            <Tooltip title="Keyframe Index" placement="bottom">
              <Input
                style={{ width: "6rem" }}
                value={currentKeyframe}
                onChange={handleKeyframeChange}
              />
            </Tooltip>
            <Button
              onClick={() => handleNextKeyframe(1)}
              icon={<CaretRightOutlined />}
            />
            <Button
              onClick={() => handleNextKeyframe(2)}
              icon={<ForwardOutlined />}
            />
            <Tooltip title="Current Time (MM:SS)" placement="bottom">
              <Input
                style={{ width: "8rem" }}
                prefix={<ClockCircleOutlined />}
                value={formatTime(currentSecond)}
                readOnly
              />
            </Tooltip>
          </Space.Compact>
          <Flex gap={8} align="center">
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
