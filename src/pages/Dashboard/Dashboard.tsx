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
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import {
  FolderOutlined,
  YoutubeOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { mapSearchResultsToTree } from "./Dashboard.utils";
import {
  setClearTemporalSearch,
  setModeTab,
  setSelectedTemporalQuery,
} from "@/store/actions";

export const Dashboard: React.FC = (): JSX.Element => {
  const modeTab = useSelector(
    (state: TAppRootReducer) => state.appState.modeTab
  );
  const [selectTop, setSelectTop] = useState<number>(24);
  const [groupFromat, setGroupFormat] = useState<"all" | "video">("video");

  const searchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.searchResult
  );
  const temporalSearchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.temporalSearchResult
  );
  const temporalSearchEnabled = useSelector(
    (state: TAppRootReducer) => state.appState.temporalSearchEnabled
  );
  const dispatch = useDispatch();

  const handleModeChange = (e: any) => {
    dispatch(setModeTab(e.target.value));
    if (modeTab === "temporal" && e.target.value === "image") {
      dispatch(setClearTemporalSearch());
    }
  };

  const handleChangeSelectTop = (value: number) => {
    setSelectTop(value);
  };

  const treeData: TreeDataNode[] = useMemo(
    () => mapSearchResultsToTree(searchResult),
    [searchResult]
  );

  const noResult = searchResult && searchResult?.data.length === 0;

  const getTotalGroupFromResult = (data: any) => {
    const groupIds = data.map((item: any) => item.group_id);
    return new Set(groupIds).size;
  };

  const getTotalVideoFromResult = (data: any) => {
    const groupIds = data.map((item: any) => item.video_id);
    return new Set(groupIds).size;
  };

  // output: return video_id with most keyframe, and return total keyframe of that video
  const getVideoHaveMostKeyframe = (data: any) => {
    // if data is empty, return none, 0
    if (!data || data.length === 0) {
      return {
        videoId: 0,
        maxKeyframe: 0,
      };
    }

    const videoIds = data.map((item: any) => item.video_id);
    const videoIdWithMostKeyframe = videoIds.reduce((acc: any, curr: any) => {
      if (!acc[curr]) {
        acc[curr] = 1;
      } else {
        acc[curr]++;
      }
      return acc;
    }, {});

    // fix: Argument of type 'unknown' is not assignable to parameter of type 'number'.
    const maxKeyframe = Math.max(
      ...(Object.values(videoIdWithMostKeyframe) as number[])
    );
    const videoId = Object.keys(videoIdWithMostKeyframe).find(
      (key) => videoIdWithMostKeyframe[key] === maxKeyframe
    );

    return {
      videoId,
      maxKeyframe,
    };
  };

  const handleImageClick = (
    index: string,
    value: string,
    mode: "temporal" | "image" | "table"
  ) => {
    const imageSplitted = value.split("/");
    let group = imageSplitted[0];
    let video = imageSplitted[1];
    const temporalQuery = `${group}/${video}/${index}`;
    if (!temporalSearchEnabled || mode === "temporal") {
      return;
    }
    dispatch(setSelectedTemporalQuery(temporalQuery));
  };

  return (
    <>
      {/* @ts-ignore */}
      <Row gutter={16} style={{ marginBottom: "2rem" }}>
        <Col span={18}>
          <Row
            style={{ width: "100%", height: "100%", marginBottom: "1.5rem" }}
          >
            {/* @ts-ignore */}
            <Card
              style={{ width: "100%" }}
              title={`Top ${selectTop.toString()} rank image`}
              extra={
                <Select
                  value={selectTop}
                  size="middle"
                  onChange={handleChangeSelectTop}
                  options={[
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                    { value: 24, label: "24" },
                    { value: 15, label: "15" },
                    { value: 30, label: "30" },
                    { value: 50, label: "50" },
                  ]}
                />
              }
            >
              <ImageGallery
                top={selectTop}
                images={
                  temporalSearchEnabled
                    ? temporalSearchResult?.data
                    : searchResult?.data
                }
                showConfidence={true}
                group={"all"}
              />
            </Card>
          </Row>
        </Col>
        <Col span={6}>
          {/* @ts-ignore */}
          <Card style={{ marginBottom: "1.5rem" }}>
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
                  // onSelect={onSelect}
                  treeData={treeData}
                />
              )}
            </Flex>
          </Card>

          {/* @ts-ignore */}
          {/* row with two card */}
          <Row gutter={16} style={{ marginBottom: "1.5rem" }}>
            <Col span={12}>
              {/* @ts-ignore */}
              <Card bordered={false}>
                <Statistic
                  title="Total Group"
                  value={getTotalGroupFromResult(searchResult?.data) || 0}
                  precision={0}
                  prefix={<FolderOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              {/* @ts-ignore */}
              <Card bordered={false}>
                <Statistic
                  title="Total Video"
                  value={getTotalVideoFromResult(searchResult?.data) || 0}
                  // suffix={`(${
                  //   getMostKeyframeShown(searchResult?.data).length
                  // } videos)`}
                  precision={0}
                  prefix={<YoutubeOutlined />}
                />
              </Card>
            </Col>
          </Row>
          {/* @ts-ignore */}
          <Card bordered={false}>
            <Statistic
              title="Video have most keyframe"
              value={getVideoHaveMostKeyframe(searchResult?.data).videoId ?? 0}
              suffix={`(${
                getVideoHaveMostKeyframe(searchResult?.data).maxKeyframe
              } keyframes)`}
              precision={0}
              prefix={<FileImageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* @ts-ignore */}
      <Card
        title="Key Frame Searching"
        extra={
          <StyledFlex>
            <Radio.Group onChange={handleModeChange} value={modeTab}>
              <Radio.Button value="image">Image</Radio.Button>
              {/* <Radio.Button value="table">Table</Radio.Button> */}
              <Radio.Button value="temporal">Temporal</Radio.Button>
            </Radio.Group>
            <Tag color="magenta" style={{ marginLeft: "1rem" }}>
              {searchResult.total} images
            </Tag>
          </StyledFlex>
        }
      >
        {modeTab === "image" && (
          <ImageGallery
            handleImageClick={handleImageClick}
            group={groupFromat}
            images={searchResult?.data}
          />
        )}
        {/* {modeTab === "table" && <Table data={searchResult?.data} />} */}
        {modeTab === "temporal" && (
          <ImageGallery
            handleImageClick={handleImageClick}
            group={groupFromat}
            images={temporalSearchResult?.data}
          />
        )}
      </Card>
    </>
  );
};
