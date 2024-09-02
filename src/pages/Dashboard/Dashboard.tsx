import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import {
  Card,
  Flex,
  Radio,
  Select,
  Tag,
  Col,
  Row,
  Statistic,
  Tree,
  Empty,
} from "antd";
import { useMemo, useState } from "preact/hooks";
import { StyledFlex } from "@/theme/styled";
import ImageGallery from "@/components/ImageGallery";
import { useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import { FolderOutlined, YoutubeOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { mapSearchResultsToTree } from "./Dashboard.utils";

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

  const onSelect = (selectedKeys: preact.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };

  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };

  const handleChangeSelectTop = (value: number) => {
    setSelectTop(value);
  };

  const treeData: TreeDataNode[] = useMemo(
    () => mapSearchResultsToTree(searchResult),
    [searchResult]
  );

  const noResult = searchResult && searchResult?.data.length === 0;

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
      <Row gutter={16} style={{ marginBottom: "1.5rem" }}>
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
        <Col span={8}>
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
      <Row gutter={16}>
        <Col span={12}>
          {/* @ts-ignore */}
          <Card style={{ marginBottom: "2rem " }}>
            <p style={{ marginBottom: "0.8rem", fontWeight: "bold" }}>
              Group, Sort by
            </p>
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
        </Col>
        <Col span={12}>
          {/* @ts-ignore */}
          <Card style={{ marginBottom: "2rem " }}>
            <p style={{ marginBottom: "0.8rem", fontWeight: "bold" }}>
              Search Summary
            </p>
            <Flex gap="middle" horizontal justify={noResult && "center"}>
              {searchResult && searchResult?.data.length === 0 ? (
                <Empty />
              ) : (
                <Tree
                  multiple
                  showLine={true}
                  showIcon={true}
                  defaultExpandedKeys={[]}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              )}
            </Flex>
          </Card>
        </Col>
      </Row>

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
