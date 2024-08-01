import Preact from "preact/compat";
import { Button, Col, Image, Row } from "antd";
import { appConfig } from "@/config/appConfig";

type IImageGalleryProps = {
  total: number;
  images: IImage[];
  showConfidence?: boolean;
};

type IImage = {
  value: string;
  confidence: number;
};

const ImageGallery: Preact.FunctionComponent<IImageGalleryProps> = ({
  images,
  total,
  showConfidence = false,
}) => {
  const image_path = appConfig.VITE_IMAGE_URL;

  const image_sorted = (images: IImage[]) => {
    if (showConfidence) {
      return images.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    }
      
    return images
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {image_sorted(images)?.map((image) => (
            <Col key={image.value} xs={24} sm={12} md={8} lg={6} xl={4}>
            {/* @ts-ignore */}
            <Image width={200} src={image_path + image.value} />
            {showConfidence && (
              <p>
                Confident: <strong>{image.confidence.toFixed(4)}</strong>
              </p>
            )}
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: 16 }}>
        <Button>Show More</Button>
      </Row>
    </>
  );
};

export default ImageGallery;
