import Preact, { JSX, ReactNode } from "preact/compat";
import { Button, Card, Layout, Row, Tabs } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileTextOutlined,
  CodepenOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

// Type definitions
interface Tab {
  key: string;
  tab: ReactNode;
  content: ReactNode;
  icon: JSX.Element;
}

interface QueryItem {
  key: number;
  tabs: Tab[];
}

type QueryState = QueryItem[];

// Styled components
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
  const [items, setItems] = Preact.useState<QueryState>([
    {
      key: 1,
      tabs: [
        {
          key: "tab1",
          tab: <>Tab 1</>,
          content: <p>Content for Tab 1</p>,
          icon: FileImageOutlined,
        },
        {
          key: "tab2",
          tab: <>Tab 2</>,
          content: <p>Content for Tab 2</p>,
          icon: FileTextOutlined,
        },
        {
          key: "tab3",
          tab: <>Tab 3</>,
          content: <p>Content for Tab 3</p>,
          icon: CodepenOutlined,
        },
      ],
    },
  ]);

  const handleRemoveQuery = (queryKey: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== queryKey));
  };

  const handleAddQuery = () => {
    if (items.length >= 5) {
      alert("You can't add more than 5 queries");
      return;
    }

    const newKey = items.length + 1;
    const newItem: QueryItem = {
      key: newKey,
      tabs: [
        {
          key: "tab1",
          tab: <>Tab 1</>,
          content: <p>{`Content for Tab 1 of Query ${newKey}`}</p>,
          icon: FileImageOutlined,
        },
        {
          key: "tab2",
          tab: <>Tab 2</>,
          content: <p>{`Content for Tab 2 of Query ${newKey}`}</p>,
          icon: FileTextOutlined,
        },
        {
          key: "tab3",
          tab: <>Tab 3</>,
          content: <p>{`Content for Tab 3 of Query ${newKey}`}</p>,
          icon: CodepenOutlined,
        },
      ],
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Layout.Sider theme="light" width="25%">
      <StyledContent>
        <Row style={{ width: "100%" }}>
          {items.map((item) => (
            <StyledCard key={item.key}>
              <Tabs
                tabBarExtraContent={{
                  right: (
                    <DeleteOutlined
                      onClick={() => handleRemoveQuery(item.key)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    />
                  ),
                }}
              >
                {item.tabs.map((tab) => (
                  <Tabs.TabPane
                    key={tab.key}
                    tab={
                      <>
                        {tab.icon}
                        {tab.tab}
                      </>
                    }
                  >
                    {tab.content}
                  </Tabs.TabPane>
                ))}
              </Tabs>
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
