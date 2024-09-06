import { useEffect, useMemo, useRef, useState } from "preact/hooks";
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
} from "antd";
import {
  ClockCircleOutlined,
  ForwardOutlined,
  BackwardOutlined,
  CameraOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Slider } from "antd";

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
  handleSaveHistory: ([start, end]: [number, number]) => void;
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
  const [range, setRange] = useState<[number, number]>([
    keyframeIndex / 25,
    keyframeIndex / 25,
  ]);
  const marks = useMemo(() => {
    return {
      0: "0s",
      [duration]: `${duration.toFixed(0)}s`,
      [keyframeIndex / 25]: {
        style: {
          color: "#52C41A",
        },
        label: `${(keyframeIndex / 25).toFixed(0)}s`,
      },
    };
  }, [duration]);
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
    // fix Property 'value' does not exist on type 'EventTarget'.
    // const newKeyframe = parseInt(e.target.value, 10);
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

  const onRangeChange = (value: [number, number]) => {
    if (videoRef.current) {
      if (value[0] !== range[0]) {
        videoRef.current.currentTime = value[0];
        setCurrentKeyframe(Math.floor(value[0] * 25));
      }

      if (value[1] !== range[1]) {
        videoRef.current.currentTime = value[1];
        setCurrentKeyframe(Math.floor(value[1] * 25));
      }

      setRange(value);
    }
  };

  const handleChangeInput = (index: number, value: number) => {
    if (videoRef.current) {
      const newRange: [number, number] = [...range];
      newRange[index] = value;
      setRange(newRange);

      if (index === 0) {
        videoRef.current.currentTime = value;
        setCurrentKeyframe(Math.floor(value * 25));
      }

      if (index === 1) {
        videoRef.current.currentTime = value;
        setCurrentKeyframe(Math.floor(value * 25));
      }
    }
  };

  const handleSaveRange = () => {
    if (range[0] && range[1]) {
      handleSaveHistory([range[0] * 25, range[1] * 25]);
    }
  };

  const handeGet100Frames = () => {
    console.log("Get 100 frames");
    setRange([range[0], range[0] + 4]);
  };

  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      width="145vh"
      title={videoTitle}
      onCancel={handleVideoClose}
      style={{ top: "1vh", left: "auto", right: "auto", margin: "0 auto" }}
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

        <Slider
          style={{ width: "95%" }}
          range={true}
          marks={marks}
          max={duration}
          value={range}
          tooltip={{
            formatter: (value: number) => `${value * 25}`,
          }}
          onChange={onRangeChange}
          draggableTrack
        />
        <Row
          style={{
            width: "100%",
          }}
          gutter={8}
        >
          <Col span={12}>
            <Space.Compact block>
              {/* <Button
                onClick={() => handlePreviousKeyframe(1)}
                icon={<CaretLeftOutlined />}
              /> */}
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
              {/* <Button
                onClick={() => handleNextKeyframe(1)}
                icon={<CaretRightOutlined />}
              /> */}
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
          <Col span={12} align="end">
            <Space.Compact>
              {/* start range */}
              <Button onClick={handeGet100Frames}>Get 100 Frames</Button>
              <Tooltip title={range[0] * 25} placement="bottomLeft">
                <InputNumber
                  style={{ width: "8vh" }}
                  value={range[0]}
                  defaultValue={0}
                  onChange={(value: number) => handleChangeInput(0, value)}
                  formatter={(value: number) => `${value * 25 || 0}`}
                />
              </Tooltip>
              {/* end range */}
              <Tooltip title={range[1] * 25} placement="bottomLeft">
                <InputNumber
                  style={{ width: "8vh" }}
                  value={range[1]}
                  defaultValue={0}
                  onChange={(value: number) => handleChangeInput(1, value)}
                  formatter={(value: number) => `${value * 25 || 0}`}
                />
              </Tooltip>
              <Input style={{ width: "8vh" }} placeholder="Answer" />
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
                    keyframe: range[0],
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
