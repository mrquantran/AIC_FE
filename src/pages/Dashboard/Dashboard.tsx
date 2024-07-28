import Table from "@/components/Table/Table";
import { JSX } from "preact/jsx-runtime";
import { Image, Row, Col, Card, Space } from "antd";
import { useSearch } from "@/api/hooks/search";
import Loading from "@/components/Loading";

export const Dashboard: React.FC = (): JSX.Element => {
  const queryPermission = useSearch();

  if (queryPermission.isLoading) {
    return <Loading message="Loading permission..." />;
  }

  console.log(queryPermission.data);

  return (
    <>
      <Table />
      <h1 style={{ margin: "2rem " }}>Top 5 confident image</h1>
      {/* @ts-ignore */}
      <Card>
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
                  Confident:{" "}
                  <strong>{Math.floor(Math.random() * 100) + 1}%</strong>
                </p>
              </Space>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  );
};
