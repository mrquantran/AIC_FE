import Preact, { useMemo, useState } from "preact/compat";
import {
  Col,
  Collapse,
  Divider,
  Empty,
  Row,
  Image,
} from "antd";
import { appConfig } from "@/config/appConfig";
import "./ImageGallery.scss"; // Import the CSS file

type IImageGalleryProps = {
  images: IImage[];
  showConfidence?: boolean;
  top?: number;
  group: "all" | "video";
};

type IImage = {
  value: string;
  confidence: number;
  video_id: number;
  group_id: number;
};

const handle_image_by_group = (images: IImage[]) => {
  const result: Array<{
    group_id: number;
    videos: Array<{
      video_id: number;
      keyframes: Array<{
        confidence: number;
        value: string;
      }>;
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
        keyframes: keyframes.map((image) => ({
          confidence: image.confidence,
          value: image.value,
        })),
      });
    });

    result.push({ group_id, videos });
  });

  return result;
};

const handle_image_sorted = (
  images: IImage[],
  top: number,
  show_score: boolean
) => {
  if (show_score) {
    return images.slice(0, top);
  }

  return images;
};

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  top = 5,
  showConfidence = false,
  group = "video",
}) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set()); // State to manage selected images
  const image_path = appConfig.VITE_IMAGE_URL;

  if (images.length === 0) {
    return <Empty />;
  }

  const formatImagePath = (image: string) => {
    const imageSplitted = image.split("/");
    let group = imageSplitted[0];
    let video = imageSplitted[1];
    let frame = imageSplitted[2];

    group = group.toString().padStart(2, "0");
    video = video.toString().padStart(3, "0");
    frame = frame.toString().padStart(8, "0");

    return image_path + `L${group}/V${video}/${frame}.webp`;
  };

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

  const handleImageClick = (value: string) => {
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

  const renderRank = (rank: number) => {
    return (
      <p>
        Rank: <strong>{rank ? rank.toFixed(0) : "None"}</strong>
      </p>
    );
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {group === "all" &&
          image_sorted?.map((image) => (
            <Col key={image.value} xs={24} sm={12} md={8} lg={6} xl={4}>
              <div
                className={`image-wrapper ${
                  selectedImages.has(image.value) ? "selected" : ""
                }`}
                onClick={() => handleImageClick(image.value)}
              >
                {/* @ts-ignore */}
                <Image width={200} src={formatImagePath(image.value)} />
                {showConfidence && renderRank(image.confidence)}
              </div>
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
                              // width={200}
                              preview={false}
                              src={formatImagePath(keyframe.value)}
                            />
                          </div>
                          {renderRank(keyframe.confidence)}
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
