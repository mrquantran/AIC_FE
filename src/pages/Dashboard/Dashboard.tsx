import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import { Image, Row, Col, Card, Space, Radio, Button, Tag } from "antd";
import { useSearch } from "@/api/hooks/search";
import Loading from "@/components/Loading";
import { useState } from "preact/hooks";
import { StyledFlex } from "@/theme/styled";

export const Dashboard: React.FC = (): JSX.Element => {
  const [mode, setMode] = useState<"image" | "table">("image");
  const [random, setRandom] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const queryPermission = useSearch();

  if (queryPermission.isLoading) {
    return <Loading message="Loading permission..." />;
  }

  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };

  return (
    <>
      {/* @ts-ignore */}
      <Card style={{ marginBottom: "2rem " }} title="Top 5 confident image">
        <Row gutter={20}>
          {[1, 2, 3, 4, 5].map((index) => (
            <Col key={index}>
              <Space direction="vertical">
                {/* @ts-ignore */}
                <Image
                  width={200}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <p>
                  Confident: <strong>{random}%</strong>
                </p>
              </Space>
            </Col>
          ))}
        </Row>
      </Card>
      {/* @ts-ignore */}
      <Card
        title="Key Frame Searching"
        extra={
          <StyledFlex>
            <Radio.Group onChange={handleModeChange} value={mode}>
              <Radio.Button value="image">Image</Radio.Button>
              <Radio.Button value="table">Table</Radio.Button>
            </Radio.Group>
            <Tag color="magenta" style={{ marginLeft: "1rem" }}>
              {16} images
            </Tag>
          </StyledFlex>
        }
      >
        {mode === "image" ? (
          <div>
            <Row gutter={[16, 16]}>
              {new Array(12).fill(null).map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                  {/* @ts-ignore */}
                  <Image
                    width={200}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                </Col>
              ))}
            </Row>
            <Row justify="center" style={{ marginTop: 16 }}>
              <Button>Show More</Button>
            </Row>
          </div>
        ) : (
          <Table />
        )}
      </Card>
    </>
  );
};
