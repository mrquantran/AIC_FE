import { useEffect, useRef, useState } from "preact/hooks";
import {
  Modal,
  Spin,
  Flex,
  Space,
  Input,
  Button,
  Tooltip,
  InputNumber,
  Row,
  Col,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  ForwardOutlined,
  BackwardOutlined,
  CameraOutlined,
  CaretLeftOutlined,
  SaveOutlined,
  CaretRightOutlined,
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
  handleSaveHistory: ([start, end]: [number, number], answer?: string) => void;
}

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
  handleSaveHistory,
}: IVideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentKeyframe, setCurrentKeyframe] = useState(keyframeIndex);
  const [currentSecond, setCurrentSecond] = useState(0); // Track current time in seconds
  const [duration, setDuration] = useState(0); // Track video duration
  const [getnFrames, setGetnFrames] = useState(100);
  const [answer, setAnswer] = useState("");
  const [range, setRange] = useState<[number, number]>([
    keyframeIndex / 25,
    keyframeIndex / 25,
  ]);

  useEffect(() => {
    if (keyframeIndex !== 0) {
      setRange([keyframeIndex / 25, keyframeIndex / 25]);
    }
  }, [keyframeIndex]);

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
          const videoDuration = videoRef.current.duration;
          setDuration(videoDuration); // Set the duration when metadata is loaded
          const startTime = keyframeIndex / 25;
          videoRef.current.currentTime = startTime;
        }
      };

      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          setCurrentKeyframe(Math.floor(currentTime * 25)); // Convert time to keyframe
          setCurrentSecond(currentTime); // Update current second
        }
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
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
    const newKeyframe = parseInt(e.currentTarget.value, 10);
    if (!isNaN(newKeyframe) && newKeyframe >= 0 && videoRef.current) {
      const newTime = newKeyframe / 25;
      videoRef.current.currentTime = newTime;
      setCurrentKeyframe(newKeyframe);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSaveRange = () => {
    handleSaveHistory([currentKeyframe, currentKeyframe + getnFrames], answer);
  };

  return (
    <Modal
      open={isModalVisible}
      footer={null}
      width="150vh"
      title={videoTitle}
      onCancel={handleVideoClose}
      style={{ top: "5vh", left: "auto", right: "auto", margin: "0 auto" }}
    >
      <Flex vertical justify="center" align="center">
        {/* @ts-ignore */}
        <Flex width="100%" justify="center" align="center">
          <video
            ref={videoRef}
            controls
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
            }}
          >
            <track kind="captions" />
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
        <Row
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
          gutter={8}
        >
          <Col span={12}>
            <Space.Compact block>
              <Button
                onClick={() => handlePreviousKeyframe(2)}
                icon={<BackwardOutlined />}
              />
              <Button
                onClick={() => handlePreviousKeyframe(1)}
                icon={<CaretLeftOutlined />}
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
                  style={{ width: "7rem" }}
                  prefix={<ClockCircleOutlined />}
                  value={formatTime(currentSecond)}
                  readOnly
                />
              </Tooltip>
            </Space.Compact>
          </Col>
          {/* @ts-ignore */}
          <Col span={12} align="end">
            <Space.Compact>
              {/* start range */}
              {/* <Button onClick={handeGet100Frames}>Get 100 Frames</Button> */}
              <Select
                defaultValue={100}
                style={{ width: "8vh" }}
                onChange={(value: number) => setGetnFrames(value)}
              >
                
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={5}>5</Select.Option>
                <Select.Option value={10}>10</Select.Option>
                <Select.Option value={25}>25</Select.Option>
                <Select.Option value={50}>50</Select.Option>
                <Select.Option value={100}>100</Select.Option>
              </Select>
              <Tooltip title={range[0] * 25} placement="bottomLeft">
                <InputNumber
                  style={{ width: "8vh" }}
                  value={currentKeyframe}
                  defaultValue={0}
                  readOnly
                />
              </Tooltip>
              {/* end range */}
              <Tooltip title={range[1] * 25} placement="bottomLeft">
                <InputNumber
                  style={{ width: "8vh" }}
                  value={currentKeyframe + getnFrames}
                  defaultValue={0}
                  readOnly
                />
              </Tooltip>
              <Input
                style={{ width: "8vh" }}
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.currentTarget.value)}
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveRange}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  handleCaptureKeyframe({
                    keyframe: range[0] * 25,
                    image: videoRef.current
                      ? captureImageFromVideo(videoRef.current)
                      : null,
                    videoId: video_id,
                    groupId: group_id,
                  });
                }}
                icon={<CameraOutlined />}
              >
                Capture
              </Button>
            </Space.Compact>
          </Col>
        </Row>
      </Flex>
    </Modal>
  );
};

export default VideoModal;
