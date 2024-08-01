import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import { Image, Row, Col, Card, Space, Radio, Button, Tag } from "antd";
import { useSearch } from "@/api/hooks/search";
import Loading from "@/components/Loading";
import { useState } from "preact/hooks";
import { StyledFlex } from "@/theme/styled";
import ImageGallery from "@/components/ImageGallery";
import { useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";

export const Dashboard: React.FC = (): JSX.Element => {
  const [mode, setMode] = useState<"image" | "table">("image");
  const [random, setRandom] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const queryPermission = useSearch();
  const searchResult = useSelector(
    (state: TAppRootReducer) => state.searchState.searchResult
  );

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
        <ImageGallery
          images={searchResult?.data}
          showConfidence={true}
          total={searchResult?.total}
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
              {16} images
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
