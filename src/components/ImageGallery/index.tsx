import Preact from "preact/compat";
import { Button, Col, Empty, Image, Row } from "antd";
import { appConfig } from "@/config/appConfig";

type IImageGalleryProps = {
  total: number;
  images: IImage[];
  showConfidence?: boolean;
  showMore?: boolean;
  top?: number;
};

type IImage = {
  value: string;
  confidence: number;
};

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  total,
  top = 5,
  showConfidence = false,
  showMore = true,
}) => {
  const image_path = appConfig.VITE_IMAGE_URL;

  const image_sorted = (images: IImage[]) => {
    if (showConfidence) {
      return images.sort((a, b) => b.confidence - a.confidence).slice(0, top);
    }

    return images;
  };

  if (images.length === 0) {
    return <Empty />;
  }

  const formatImagePath = (image: string) => {
    const imageSplitted = image.split("/")
    let group = imageSplitted[0];
    let video = imageSplitted[1];
    let frame = imageSplitted[2];

    group = group.toString().padStart(2, '0');
    video = video.toString().padStart(3, '0');
    frame = frame.toString().padStart(8, '0');


    return image_path +`L${group}/V${video}/${frame}.webp`;
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {image_sorted(images)?.map((image) => (
          <Col key={image.value} xs={24} sm={12} md={8} lg={6} xl={4}>
            {/* @ts-ignore */}
            <Image width={200} src={formatImagePath(image.value)} />
            {showConfidence && (
              <p>
                Confident:{" "}
                <strong>
                  {image?.confidence ? image?.confidence.toFixed(4) : "None"}
                </strong>
              </p>
            )}
          </Col>
        ))}
      </Row>
      {showMore ? (
        <Row justify="center" style={{ marginTop: 16 }}>
          <Button>Show More</Button>
        </Row>
      ) : null}
    </>
  );
};

export default ImageGallery;
