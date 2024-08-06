import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import { Card, Radio, Select, Tag } from "antd";
import { useState } from "preact/hooks";
import { StyledFlex } from "@/theme/styled";
import ImageGallery from "@/components/ImageGallery";
import { useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";

export const Dashboard: React.FC = (): JSX.Element => {
  const [mode, setMode] = useState<"image" | "table">("image");
  const [selectTop, setSelectTop] = useState<number>(5);
  const searchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.searchResult
  );

  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };

  const handleChangeSelectTop = (value: {
    value: number;
    label: React.ReactNode;
  }) => {
    setSelectTop(value);
  };

  return (
    <>
      {/* @ts-ignore */}
      <Card
        style={{ marginBottom: "2rem " }}
        title={`Top ${selectTop.toString()} confident image`}
        extra={
          <Select
            value={selectTop}
            size="middle"
            onChange={handleChangeSelectTop}
            options={[
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 15, label: "15" },
            ]}
          />
        }
      >
        <ImageGallery
          top={selectTop}
          images={searchResult?.data}
          showConfidence={true}
          total={searchResult?.total}
          showMore={false}
        />
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
          <ImageGallery
            images={searchResult?.data}
            total={searchResult?.total}
          />
        ) : (
          <Table data={searchResult?.data} />
        )}
      </Card>
    </>
  );
};
