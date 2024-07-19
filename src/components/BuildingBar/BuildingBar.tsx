import Preact from "preact/compat";
import { Button, Card, Layout, Row } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 1rem;
`;

const BuidlingBar: Preact.FunctionComponent = () => {
  const [items, setItems] = Preact.useState<
    Array<{ key: number; title: string; content: string }>
  >([]);

  const handleRemoveQuery = (key: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const handleAddQuery = () => {
    if (items.length >= 5) {
      alert("You can't add more than 5 queries");
      return;
    }

    const newKey = (items.length ?? 0) + 1;
    const newItem = {
      key: newKey,
      title: `Query ${newKey}`,
      content: `Content ${newKey}`,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Layout.Sider theme="light" width="35%">
      <StyledContent>
        <Row style={{ width: "100%" }}>
          {items.map((item) => (
            <StyledCard
              key={item.key}
              title={item.title}
              extra={
                <DeleteOutlined onClick={() => handleRemoveQuery(item.key)} />
              }
            >
              {item.content}
            </StyledCard>
          ))}
        </Row>
        <Button
          type="primary"
          style={{ width: "100%" }}
          icon={<PlusOutlined />}
          onClick={handleAddQuery}
        >
          More Query
        </Button>
      </StyledContent>
    </Layout.Sider>
  );
};

export default BuidlingBar;
