import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import { Card, Flex, Radio, Select, Tag, Col, Row, Statistic } from "antd";
import { useState } from "preact/hooks";
import { StyledFlex } from "@/theme/styled";
import ImageGallery from "@/components/ImageGallery";
import { useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import { FolderOutlined, YoutubeOutlined } from "@ant-design/icons";

const groupFormatOptions = [
  {
    value: "all",
    label: "Group All",
  },
  {
    value: "video",
    label: "Group by Video",
  },
];

const groupSortOptions = [
  {
    value: "keyframe",
    label: "Sort by Keyframe Index",
  },
  {
    value: "score",
    label: "Sort by Score",
  },
];

export const Dashboard: React.FC = (): JSX.Element => {
  const [mode, setMode] = useState<"image" | "table">("image");
  const [selectTop, setSelectTop] = useState<number>(5);
  const [groupFromat, setGroupFormat] = useState<"all" | "video">("video");
  const [groupSort, setGroupSort] = useState<"keyframe" | "score">("score");
  const searchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.searchResult
  );

  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };

  const handleChangeSelectTop = (value: number) => {
    setSelectTop(value);
  };

  const style: React.CSSProperties = {
    padding: "0 1rem",
  };

  return (
    <>
      {/* @ts-ignore */}
      <Card
        style={{ marginBottom: "2rem " }}
        title={`Top ${selectTop.toString()} rank image`}
        extra={
          <Select
            value={selectTop}
            size="middle"
            onChange={handleChangeSelectTop}
            options={[
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 15, label: "15" },
              { value: 30, label: "30" },
              { value: 50, label: "50" },
            ]}
          />
        }
      >
        <ImageGallery
          top={selectTop}
          images={searchResult?.data}
          showConfidence={true}
          group={"all"}
        />
      </Card>
      {/* @ts-ignore */}
      <Row  style={{ marginBottom: "1.5rem" }}>
        <Col span={8}>
          {/* @ts-ignore */}
          <Card bordered={false}>
            <Statistic
              title="Total Group"
              value={112}
              precision={0}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col span={8} style={style}>
          {/* @ts-ignore */}
          <Card bordered={false}>
            <Statistic
              title="Total Video"
              value={5}
              precision={0}
              prefix={<YoutubeOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          {/* @ts-ignore */}
          <Card bordered={false}>
            <Statistic
              title="Respone time"
              value={0.5}
              precision={2}
              suffix="s"
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginBottom: "2rem " }}>
        <Flex gap="middle" horizontal>
          <Select
            defaultValue="video"
            style={{ width: 200 }}
            onChange={(value: string) =>
              setGroupFormat(value as "all" | "video")
            }
            options={groupFormatOptions}
            value={groupFromat}
          />
          <Select
            defaultValue="score"
            style={{ width: 200 }}
            options={groupSortOptions}
            onChange={(value: string) =>
              setGroupSort(value as "keyframe" | "score")
            }
            value={groupSort}
          />
        </Flex>
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
              {searchResult.total} images
            </Tag>
          </StyledFlex>
        }
      >
        {mode === "image" ? (
          <ImageGallery group={groupFromat} images={searchResult?.data} />
        ) : (
          <Table data={searchResult?.data} />
        )}
      </Card>
    </>
  );
};
