import { JSX } from "preact/jsx-runtime";
import {
  Card,
  Flex,
  Radio,
  Select,
  Col,
  Row,
  Statistic,
  Tree,
  Empty,
  Button,
  Space,
  TreeSelect,
  Modal,
} from "antd";
import { useMemo, useState } from "preact/hooks";
import ImageGallery from "@/components/ImageGallery";
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import {
  FolderOutlined,
  YoutubeOutlined,
  FileImageOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { TreeDataNode, TreeSelectProps } from "antd";
import {
  mapSearchResultsToTree,
  mapSearchResultstoTreeSearch,
  TTreeSearch,
} from "./Dashboard.utils";
import {
  clearFilterIndexes,
  setClearTemporalSearch,
  setFilterIndexes,
  setModeTab,
  setSelectedTemporalQuery,
} from "@/store/actions";
import { IImage } from "@/types";
import Toast from "@/components/Toast";

export const Dashboard: React.FC = (): JSX.Element => {
  const modeTab = useSelector(
    (state: TAppRootReducer) => state.appState.modeTab
  );
  const [selectTop, setSelectTop] = useState<number>(50);
  const [groupFromat, setGroupFormat] = useState<"all" | "video">("video");
  const filterIndexes = useSelector(
    (state: TAppRootReducer) => state.searchState.filterIndexes
  );
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

  // const treeSearchData: TTreeSearch[] = useMemo(
  //   () => mapSearchResultstoTreeSearch(searchResult),
  //   [searchResult]
  // );

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

  const handleSelectFilterIndexes = (indexes: number[]) => {
    // if indexes is have in filterIndexes, remove it
    // check all indexes in filterIndexes
    dispatch(setFilterIndexes(indexes));
  };

  const handleTreeSelectChange: TreeSelectProps["onChange"] = (
    selectedKeys
  ) => {
    const indexes: number[] = [];

    const processSelectedKeys = (
      selectedKeys: string[],
      searchResults: IImage[]
    ) => {
      selectedKeys.forEach((key) => {
        const [groupPart, videoPart, framePart] = key.split(",");

        if (framePart) {
          // Trường hợp chọn frame cụ thể
          const frameKey = parseInt(framePart.replace("keyframe", ""));
          if (!isNaN(frameKey)) indexes.push(frameKey);
        } else if (videoPart) {
          // Trường hợp chọn video
          const groupId = parseInt(groupPart.replace("group", ""));
          const videoId = parseInt(videoPart.replace("video", ""));
          if (!isNaN(groupId) && !isNaN(videoId)) {
            const videoKeys = searchResults
              .filter(
                (item) => item.group_id === groupId && item.video_id === videoId
              )
              .map((item) => item.key);
            indexes.push(...videoKeys);
          }
        } else {
          // Trường hợp chọn group
          const groupId = parseInt(groupPart.replace("group", ""));
          if (!isNaN(groupId)) {
            const groupKeys = searchResults
              .filter((item) => item.group_id === groupId)
              .map((item) => item.key);
            indexes.push(...groupKeys);
          }
        }
      });
    };

    // Giả sử searchResults là một state hoặc prop có sẵn trong component
    processSelectedKeys(selectedKeys as string[], searchResult.data);
    // Loại bỏ các giá trị trùng lặp và sắp xếp
    const uniqueSortedIndexes = [...new Set(indexes)].sort((a, b) => a - b);

    dispatch(setFilterIndexes([...filterIndexes, ...uniqueSortedIndexes]));
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
                <Flex align="center" gap={10}>
                  <Button
                    onClick={() =>
                      handleSelectFilterIndexes([
                        ...filterIndexes,
                        ...searchResult?.data.map((item: IImage) => item.key),
                      ])
                    }
                  >
                    Ignore all
                  </Button>
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
                </Flex>
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
            {/* @ts-ignore */}
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
          <Flex align="center" gap={15}>
            <Space.Compact>
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  Modal.info({
                    title: "Filter Indexes",
                    content: filterIndexes.join(", "),
                  })
                }
              />
              <Button
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  dispatch(clearFilterIndexes());
                  Toast("Clear filter indexes", "success");
                }}
              />
              {/* <TreeSelect
                treeData={treeSearchData}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                placeholder="Please select"
                style={{ width: "20vh" }}
                maxTagCount={"responsive"}
                onChange={handleTreeSelectChange}
                treeIcon={true}
              /> */}
            </Space.Compact>

            <Radio.Group onChange={handleModeChange} value={modeTab}>
              <Radio.Button value="image">Image</Radio.Button>
              {/* <Radio.Button value="table">Table</Radio.Button> */}
              <Radio.Button value="temporal">Temporal</Radio.Button>
            </Radio.Group>
          </Flex>
        }
      >
        {modeTab === "image" && (
          <ImageGallery
            handleImageClick={handleImageClick}
            group={groupFromat}
            images={searchResult?.data}
          />
        )}
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
