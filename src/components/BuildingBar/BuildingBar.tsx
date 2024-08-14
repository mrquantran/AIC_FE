import Preact, { JSX, ReactNode, useEffect } from "preact/compat";
import { Button, Card, Layout, Modal, Row, Space, Tabs, Tag } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileTextOutlined,
  AudioOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import TextQuery from "@/container/TextQuery/TextQuery";
import { useDispatch, useSelector } from "react-redux";
import { TAppRootReducer } from "@/store";
import Toast from "../Toast";
import { setObjectNames, setRemoveQuery, setRemoveQueryValue } from "@/store/actions";
import ObjectSelectQuery from "@/container/ObjectSelectQuery/ObjectSelectQuery";
import { useGetObjectNames } from "@/api/hooks/objects";

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
  width: 100%;
  height: 95%;
  overflow-y: auto;
`;

const RowHeaderStyled = styled(Row)`
  width: 95%;
  margin: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 1rem;

  .ant-card-body {
    padding: 18px;
  }
`;

const BuidlingBar: Preact.FunctionComponent = () => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: TAppRootReducer) => state.appState.settings
  );
  const search = useSelector(
    (state: TAppRootReducer) => state.searchState.search
  );

  const styleIcon = { marginRight: "0.5rem" };

  const previewModal = () => {
    Modal.info({
      title: "Preview Query",
      content: (
        <Space>
          {items.map((item) => (
            <div key={item.key}>
              <h3>Query {item.key}</h3>
              <ul>
                {item.tabs.map((tab) => (
                  <li key={tab.key}>content</li>
                ))}
              </ul>
            </div>
          ))}
        </Space>
      ),
      onOk() {},
    });
  };

  const { data, isSuccess } = useGetObjectNames();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setObjectNames(data.data));
    }
  }, [isSuccess]);

  const renderDefaultTab = (key: number): Tab[] => {
    return [
      {
        key: `tabText${key}`,
        tab: "Text",
        content: <TextQuery tabKey={key} />,
        icon: <FileTextOutlined style={styleIcon} />,
      },
      {
        key: `tabObject${key}`,
        tab: "Object",
        content: <ObjectSelectQuery tabKey={key} />,
        icon: <CodeSandboxOutlined style={styleIcon} />,
      },
      {
        key: `tabImage${key}`,
        tab: "Image",
        content: <p>Content for Tab 2</p>,
        icon: <FileImageOutlined style={styleIcon} />,
      },
      {
        key: `tabAudio${key}`,
        tab: "Audio",
        content: <p>Content for Tab 3</p>,
        icon: <AudioOutlined style={styleIcon} />,
      },
    ];
  };

  const defaultItems = [
    {
      key: 1,
      tabs: renderDefaultTab(1),
    },
  ];

  const [items, setItems] = Preact.useState<QueryState>(defaultItems);

  useEffect(() => {
    if (search.length === 1) {
      setItems(defaultItems);
    }
  }, [search.length]);

  const handleRemoveQuery = (queryKey: number) => {
    if (items.length === 1) {
      Toast("You must have at least one query", "error");
      return;
    }
    setItems((prevItems) => prevItems.filter((item) => item.key !== queryKey));
    dispatch(setRemoveQuery(queryKey));
  };

  const handleAddQuery = () => {
    if (items.length >= settings.maxQuery) {
      Toast(
        `You have reached the maximum ${settings.maxQuery} number of queries`,
        "error"
      );
      return;
    }

    const newKey = items.length + 1;
    const newItem: QueryItem = {
      key: newKey,
      tabs: renderDefaultTab(newKey),
    };

    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleChangeTab = (activeKey: string) => {
    const tabKey = activeKey[activeKey.length - 1];
    dispatch(setRemoveQueryValue(Number(tabKey)));
  };

  return (
    <Layout.Sider theme="light" width="25%">
      <RowHeaderStyled direction="horizontal">
        <Button onClick={previewModal}>Preview</Button>
        <Tag color="blue">{items.length}</Tag>
      </RowHeaderStyled>
      <StyledContent>
        <Row style={{ width: "100%" }}>
          {items.map((item) => (
            <StyledCard key={item.key}>
              <Tabs
                onChange={handleChangeTab}
                type="line"
                tabBarExtraContent={{
                  right: (
                    <DeleteOutlined
                      onClick={() => handleRemoveQuery(item.key)}
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                        color: "red",
                      }}
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
