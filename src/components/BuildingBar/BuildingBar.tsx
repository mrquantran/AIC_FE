import Preact, { JSX, ReactNode } from "preact/compat";
import { Button, Card, Layout, Row, Tabs } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileTextOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import TextQuery from "@/container/TextQuery/TextQuery";

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

  .ant-card-body{
    padding: 18px;
  }
`;

const BuidlingBar: Preact.FunctionComponent = () => {
  const defaultTab: Tab[] = [
    {
      key: "tab1",
      tab: <>Text</>,
      content: <TextQuery />,
      icon: <FileTextOutlined />,
    },
    {
      key: "tab2",
      tab: <>Image</>,
      content: <p>Content for Tab 2</p>,
      icon: <FileImageOutlined />,
    },
    {
      key: "tab3",
      tab: <>Audio</>,
      content: <p>Content for Tab 3</p>,
      icon: <AudioOutlined />,
    },
  ];

  const [items, setItems] = Preact.useState<QueryState>([{
    key: 1,
    tabs: defaultTab,
  }]);

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
      tabs: defaultTab
    }
    
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
                      style={{ marginLeft: "10px", cursor: "pointer", color:"red" }}
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
          type="dashed"
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
